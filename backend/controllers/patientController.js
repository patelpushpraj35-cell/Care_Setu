const { db } = require('../config/firebase');
const { collection, query, where, getDocs, getDoc, doc, updateDoc, setDoc, orderBy, limit } = require('firebase/firestore');
const { maskAadhaar, encryptAadhaar } = require('../utils/helpers');

/**
 * @route   GET /api/patient/profile
 * @desc    Get patient's own profile
 * @access  Patient
 */
const getProfile = async (req, res) => {
  try {
    const profileDoc = await getDoc(doc(db, 'patientProfiles', req.user._id));
    
    if (!profileDoc.exists()) {
      return res.status(404).json({ success: false, message: 'Profile not found. Please complete registration.' });
    }

    res.json({
      success: true,
      data: {
        user: { _id: req.user._id, name: req.user.name, email: req.user.email },
        profile: { _id: profileDoc.id, ...profileDoc.data() },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   PUT /api/patient/profile
 * @desc    Update patient's own profile
 * @access  Patient
 */
const updateProfile = async (req, res) => {
  try {
    const { name, mobileNumber, emergencyContact, bloodGroup, medicalHistory, aadhaarNumber, address, dateOfBirth, gender } = req.body;

    // Update User name if changed
    if (name) {
      await updateDoc(doc(db, 'users', req.user._id), { name });
    }

    // Build update object
    const updateData = { updatedAt: new Date().toISOString() };
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

    const profileRef = doc(db, 'patientProfiles', req.user._id);
    await setDoc(profileRef, { userId: req.user._id, ...updateData }, { merge: true });

    const updatedProfile = await getDoc(profileRef);

    res.json({ success: true, message: 'Profile updated successfully.', data: updatedProfile.data() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/patient/dashboard
 * @desc    Get patient dashboard data
 * @access  Patient
 */
const getDashboard = async (req, res) => {
  try {
    const profileDoc = await getDoc(doc(db, 'patientProfiles', req.user._id));
    
    // Recent Reports
    const reportsQuery = query(
      collection(db, 'reports'),
      where('patientId', '==', req.user._id),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    const reportsSnapshot = await getDocs(reportsQuery);
    const reports = reportsSnapshot.docs.map(d => ({ _id: d.id, ...d.data() }));

    // Recent Treatments
    const treatmentsQuery = query(
      collection(db, 'treatments'),
      where('patientId', '==', req.user._id),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    const treatmentsSnapshot = await getDocs(treatmentsQuery);
    const treatments = treatmentsSnapshot.docs.map(d => ({ _id: d.id, ...d.data() }));

    res.json({
      success: true,
      data: {
        user: { _id: req.user._id, name: req.user.name, email: req.user.email },
        profile: profileDoc.exists() ? profileDoc.data() : null,
        recentReports: reports,
        recentTreatments: treatments,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/patient/reports
 * @desc    Get all reports for the logged-in patient
 * @access  Patient
 */
const getReports = async (req, res) => {
  try {
    const q = query(collection(db, 'reports'), where('patientId', '==', req.user._id), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const reports = snapshot.docs.map(d => ({ _id: d.id, ...d.data() }));

    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/patient/treatments
 * @desc    Get all treatments for the logged-in patient
 * @access  Patient
 */
const getTreatments = async (req, res) => {
  try {
    const q = query(collection(db, 'treatments'), where('patientId', '==', req.user._id), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const treatments = snapshot.docs.map(d => ({ _id: d.id, ...d.data() }));

    res.json({ success: true, data: treatments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/patient/qr
 * @desc    Get QR code data
 * @access  Patient
 */
const getQRData = async (req, res) => {
  try {
    const profileDoc = await getDoc(doc(db, 'patientProfiles', req.user._id));
    const profile = profileDoc.exists() ? profileDoc.data() : null;

    const qrData = JSON.stringify({
      patientId: req.user._id,
      name: req.user.name,
      bloodGroup: profile?.bloodGroup || 'Unknown',
      emergency: profile?.emergencyContact?.phone || 'N/A',
    });

    res.json({
      success: true,
      data: {
        qrData,
        patientId: req.user._id,
        name: req.user.name,
        bloodGroup: profile?.bloodGroup,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, updateProfile, getDashboard, getReports, getTreatments, getQRData };
