const { db } = require('../config/firebase');
const { collection, query, where, getDocs, getDoc, doc, updateDoc, setDoc, addDoc, orderBy, limit } = require('firebase/firestore');

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
    const reportsSnapshot = await getDocs(query(collection(db, 'reports'), where('hospitalId', '==', req.user._id), limit(10)));
    const stats = {
      totalReports: reportsSnapshot.size,
      recentReports: reportsSnapshot.docs.map(d => ({ _id: d.id, ...d.data() }))
    };
    res.json({ success: true, data: stats });
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
    const userDoc = await getDoc(doc(db, 'users', patientId));
    if (!userDoc.exists()) return res.status(404).json({ success: false, message: 'Patient not found.' });
    
    const [profileDoc, reportsSnap, treatmentsSnap] = await Promise.all([
      getDoc(doc(db, 'patientProfiles', patientId)),
      getDocs(query(collection(db, 'reports'), where('patientId', '==', patientId))),
      getDocs(query(collection(db, 'treatments'), where('patientId', '==', patientId)))
    ]);

    res.json({
      success: true,
      data: {
        user: { _id: userDoc.id, ...userDoc.data() },
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
      patientId,
      hospitalId: req.user._id,
      hospitalName: req.user.name,
      fileName,
      description,
      reportType,
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
    const snapshot = await getDocs(query(collection(db, 'users'), where('role', '==', 'patient')));
    res.json({ success: true, data: snapshot.docs.map(d => ({ _id: d.id, ...d.data() })) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  getProfile, getDashboard, getPatientByQR, 
  uploadReport, addTreatment, updateMedicalHistory, getMyPatients 
};
