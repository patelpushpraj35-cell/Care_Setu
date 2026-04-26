const { db } = require('../config/firebase');
const { collection, query, where, getDocs, getDoc, doc, updateDoc, setDoc, addDoc, orderBy } = require('firebase/firestore');

/**
 * @route   GET /api/hospital/profile
 * @desc    Get hospital's own profile
 * @access  Hospital
 */
const getProfile = async (req, res) => {
  try {
    const profileDoc = await getDoc(doc(db, 'hospitalProfiles', req.user._id));
    
    if (!profileDoc.exists()) {
      return res.status(404).json({ success: false, message: 'Hospital profile not found.' });
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
 * @route   POST /api/hospital/reports
 * @desc    Upload/Create a new medical report for a patient
 * @access  Hospital
 */
const createReport = async (req, res) => {
  try {
    const { patientId, fileName, description, reportType } = req.body;

    // Check if patient exists
    const patientDoc = await getDoc(doc(db, 'users', patientId));
    if (!patientDoc.exists()) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    const newReport = {
      patientId,
      hospitalId: req.user._id,
      hospitalName: req.user.name,
      fileName,
      description,
      reportType,
      fileUrl: req.file ? `/uploads/reports/${req.file.filename}` : '/uploads/reports/default.pdf',
      fileType: req.file ? req.file.mimetype.split('/')[1] : 'pdf',
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'reports'), newReport);

    res.status(201).json({ success: true, message: 'Report created successfully.', data: { _id: docRef.id, ...newReport } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   POST /api/hospital/treatments
 * @desc    Add a new treatment/prescription for a patient
 * @access  Hospital
 */
const addTreatment = async (req, res) => {
  try {
    const { patientId, doctorName, diagnosis, treatmentDetails, medications, lifestyleAdvice, followUpDate } = req.body;

    const patientDoc = await getDoc(doc(db, 'users', patientId));
    if (!patientDoc.exists()) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    const newTreatment = {
      patientId,
      hospitalId: req.user._id,
      hospitalName: req.user.name,
      doctorName,
      diagnosis,
      treatmentDetails,
      medications,
      lifestyleAdvice,
      followUpDate,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'treatments'), newTreatment);

    res.status(201).json({ success: true, message: 'Treatment added successfully.', data: { _id: docRef.id, ...newTreatment } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/hospital/patients/:patientId
 * @desc    Search for a patient by ID and get their history
 * @access  Hospital
 */
const getPatientHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    const [userDoc, profileDoc] = await Promise.all([
      getDoc(doc(db, 'users', patientId)),
      getDoc(doc(db, 'patientProfiles', patientId))
    ]);

    if (!userDoc.exists()) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    const reportsQuery = query(collection(db, 'reports'), where('patientId', '==', patientId), orderBy('createdAt', 'desc'));
    const treatmentsQuery = query(collection(db, 'treatments'), where('patientId', '==', patientId), orderBy('createdAt', 'desc'));

    const [reportsSnapshot, treatmentsSnapshot] = await Promise.all([
      getDocs(reportsQuery),
      getDocs(treatmentsQuery)
    ]);

    const reports = reportsSnapshot.docs.map(d => ({ _id: d.id, ...d.data() }));
    const treatments = treatmentsSnapshot.docs.map(d => ({ _id: d.id, ...d.data() }));

    res.json({
      success: true,
      data: {
        user: { _id: userDoc.id, ...userDoc.data() },
        profile: profileDoc.exists() ? profileDoc.data() : null,
        reports,
        treatments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, createReport, addTreatment, getPatientHistory };
