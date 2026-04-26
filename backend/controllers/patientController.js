const { db } = require('../config/firebase');
const { doc, getDoc, updateDoc, setDoc, query, collection, where, orderBy, limit, getDocs } = require('firebase/firestore');
const { maskAadhaar, encryptAadhaar } = require('../utils/helpers');

/**
 * @route   GET /api/patient/profile
 */
const getProfile = async (req, res) => {
  try {
    const profileDoc = await getDoc(doc(db, 'patientProfiles', req.user._id));
    if (!profileDoc.exists()) return res.status(404).json({ success: false, message: 'Profile not found.' });
    res.json({ success: true, data: { user: req.user, profile: profileDoc.data() } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   PUT /api/patient/profile
 */
const updateProfile = async (req, res) => {
  try {
    const { name, mobileNumber, emergencyContact, bloodGroup, medicalHistory, aadhaarNumber, address, dateOfBirth, gender } = req.body;

    if (name) await updateDoc(doc(db, 'users', req.user._id), { name });

    const updateData = { updatedAt: new Date().toISOString(), userId: req.user._id };
    if (mobileNumber) updateData.mobileNumber = mobileNumber;
    if (emergencyContact) updateData.emergencyContact = emergencyContact;
    if (bloodGroup) updateData.bloodGroup = bloodGroup;
    if (medicalHistory) updateData.medicalHistory = medicalHistory;
    if (address) updateData.address = address;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (gender) updateData.gender = gender;
    if (aadhaarNumber) {
      updateData.aadhaarMasked = maskAadhaar(aadhaarNumber);
      updateData.aadhaarEncrypted = encryptAadhaar(aadhaarNumber);
    }

    await setDoc(doc(db, 'patientProfiles', req.user._id), updateData, { merge: true });
    const snap = await getDoc(doc(db, 'patientProfiles', req.user._id));
    res.json({ success: true, data: snap.data() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/patient/dashboard
 */
const getDashboard = async (req, res) => {
  try {
    const profileDoc = await getDoc(doc(db, 'patientProfiles', req.user._id));
    const reportsSnap = await getDocs(query(collection(db, 'reports'), where('patientId', '==', req.user._id), orderBy('createdAt', 'desc'), limit(5)));
    const treatmentsSnap = await getDocs(query(collection(db, 'treatments'), where('patientId', '==', req.user._id), orderBy('createdAt', 'desc'), limit(5)));

    res.json({
      success: true,
      data: {
        user: req.user,
        profile: profileDoc.exists() ? profileDoc.data() : null,
        recentReports: reportsSnap.docs.map(d => ({ _id: d.id, ...d.data() })),
        recentTreatments: treatmentsSnap.docs.map(d => ({ _id: d.id, ...d.data() })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/patient/reports
 */
const getReports = async (req, res) => {
  try {
    const snap = await getDocs(query(collection(db, 'reports'), where('patientId', '==', req.user._id), orderBy('createdAt', 'desc')));
    res.json({ success: true, data: snap.docs.map(d => ({ _id: d.id, ...d.data() })) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/patient/treatments
 */
const getTreatments = async (req, res) => {
  try {
    const snap = await getDocs(query(collection(db, 'treatments'), where('patientId', '==', req.user._id), orderBy('createdAt', 'desc')));
    res.json({ success: true, data: snap.docs.map(d => ({ _id: d.id, ...d.data() })) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/patient/qr
 */
const getQRData = async (req, res) => {
  try {
    const profileDoc = await getDoc(doc(db, 'patientProfiles', req.user._id));
    const profile = profileDoc.exists() ? profileDoc.data() : null;
    res.json({ success: true, data: { qrData: JSON.stringify({ patientId: req.user._id, name: req.user.name }), patientId: req.user._id, name: req.user.name, bloodGroup: profile?.bloodGroup } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, updateProfile, getDashboard, getReports, getTreatments, getQRData };
