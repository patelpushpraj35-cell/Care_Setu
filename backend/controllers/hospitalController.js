const { db } = require('../config/firebase');
const { doc, getDoc, getDocs, collection, query, where, addDoc, updateDoc } = require('firebase/firestore');

/**
 * @route   GET /api/hospital/profile
 */
const getProfile = async (req, res) => {
  try {
    const profileDoc = await getDoc(doc(db, 'hospitalProfiles', req.user._id));
    if (!profileDoc.exists()) return res.status(404).json({ success: false, message: 'Profile not found.' });
    res.json({ success: true, data: { user: req.user, profile: profileDoc.data() } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/hospital/dashboard
 */
const getDashboard = async (req, res) => {
  try {
    const snap = await getDocs(query(collection(db, 'reports'), where('hospitalId', '==', req.user._id)));
    res.json({ success: true, data: { totalReports: snap.size, recentReports: snap.docs.map(d => ({ _id: d.id, ...d.data() })) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/hospital/patient/:patientId
 */
const getPatientByQR = async (req, res) => {
  try {
    const { patientId } = req.params;
    let actualPatientId = patientId;
    let userDoc = await getDoc(doc(db, 'users', patientId));
    
    // Fallback: Search by Email or Mobile
    if (!userDoc.exists()) {
      const qEmail = query(collection(db, 'users'), where('email', '==', patientId), where('role', '==', 'patient'));
      const emailSnap = await getDocs(qEmail);
      if (!emailSnap.empty) {
        userDoc = emailSnap.docs[0];
        actualPatientId = userDoc.id;
      } else {
        const qMobile = query(collection(db, 'patientProfiles'), where('mobileNumber', '==', patientId));
        const mobileSnap = await getDocs(qMobile);
        if (!mobileSnap.empty) {
          actualPatientId = mobileSnap.docs[0].id;
          userDoc = await getDoc(doc(db, 'users', actualPatientId));
        } else {
          return res.status(404).json({ success: false, message: 'Patient not found by ID, Email, or Mobile.' });
        }
      }
    }

    if (userDoc.data()?.role !== 'patient') {
      return res.status(404).json({ success: false, message: 'User found is not a patient.' });
    }
    
    const [profileDoc, reportsSnap, treatmentsSnap] = await Promise.all([
      getDoc(doc(db, 'patientProfiles', actualPatientId)),
      getDocs(query(collection(db, 'reports'), where('patientId', '==', actualPatientId))),
      getDocs(query(collection(db, 'treatments'), where('patientId', '==', actualPatientId)))
    ]);

    res.json({
      success: true,
      data: {
        user: { _id: actualPatientId, ...userDoc.data() },
        profile: profileDoc.exists() ? profileDoc.data() : null,
        reports: reportsSnap.docs.map(d => ({ _id: d.id, ...d.data() })),
        treatments: treatmentsSnap.docs.map(d => ({ _id: d.id, ...d.data() }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   POST /api/hospital/reports
 */
const uploadReport = async (req, res) => {
  try {
    const { patientId, fileName, description, reportType } = req.body;
    const newReport = {
      patientId, hospitalId: req.user._id, hospitalName: req.user.name,
      fileName, description, reportType,
      fileUrl: req.file ? `/uploads/reports/${req.file.filename}` : '/uploads/reports/default.pdf',
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, 'reports'), newReport);
    res.status(201).json({ success: true, data: { _id: docRef.id, ...newReport } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   POST /api/hospital/treatments
 */
const addTreatment = async (req, res) => {
  try {
    const newTreatment = { ...req.body, hospitalId: req.user._id, hospitalName: req.user.name, createdAt: new Date().toISOString() };
    const docRef = await addDoc(collection(db, 'treatments'), newTreatment);
    res.status(201).json({ success: true, data: { _id: docRef.id, ...newTreatment } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   PATCH /api/hospital/patient/:patientId/medical-history
 */
const updateMedicalHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { medicalHistory } = req.body;
    await updateDoc(doc(db, 'patientProfiles', patientId), { medicalHistory });
    res.json({ success: true, message: 'History updated.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/hospital/patients
 */
const getMyPatients = async (req, res) => {
  try {
    const snap = await getDocs(query(collection(db, 'users'), where('role', '==', 'patient')));
    res.json({ success: true, data: snap.docs.map(d => ({ _id: d.id, ...d.data() })) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, getDashboard, getPatientByQR, uploadReport, addTreatment, updateMedicalHistory, getMyPatients };
