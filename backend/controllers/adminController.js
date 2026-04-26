const { db } = require('../config/firebase');
const { collection, query, where, getDocs, getDoc, doc, updateDoc, addDoc, orderBy } = require('firebase/firestore');
const bcrypt = require('bcryptjs');

/**
 * @route   GET /api/admin/dashboard
 */
const getDashboard = async (req, res) => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const reportsSnapshot = await getDocs(collection(db, 'reports'));
    res.json({
      success: true,
      data: {
        totalPatients: usersSnapshot.docs.filter(d => d.data().role === 'patient').length,
        totalHospitals: usersSnapshot.docs.filter(d => d.data().role === 'hospital').length,
        totalReports: reportsSnapshot.size
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   POST /api/admin/hospitals/register
 */
const registerHospital = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = { name, email, password: hashedPassword, role: 'hospital', isActive: true, createdAt: new Date().toISOString() };
    const docRef = await addDoc(collection(db, 'users'), newUser);
    
    await setDoc(doc(db, 'hospitalProfiles', docRef.id), { userId: docRef.id, hospitalName: name, email, createdAt: new Date().toISOString() });
    
    res.status(201).json({ success: true, data: { _id: docRef.id, ...newUser } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/admin/hospitals
 */
const getAllHospitals = async (req, res) => {
  try {
    const q = query(collection(db, 'users'), where('role', '==', 'hospital'));
    const snapshot = await getDocs(q);
    res.json({ success: true, data: snapshot.docs.map(d => ({ _id: d.id, ...d.data() })) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/admin/patients
 */
const getAllPatients = async (req, res) => {
  try {
    const q = query(collection(db, 'users'), where('role', '==', 'patient'));
    const snapshot = await getDocs(q);
    res.json({ success: true, data: snapshot.docs.map(d => ({ _id: d.id, ...d.data() })) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/admin/patients/:patientId/details
 */
const getPatientDetails = async (req, res) => {
  try {
    const { patientId } = req.params;
    const [userDoc, profileDoc] = await Promise.all([
      getDoc(doc(db, 'users', patientId)),
      getDoc(doc(db, 'patientProfiles', patientId))
    ]);
    res.json({ success: true, data: { user: userDoc.data(), profile: profileDoc.data() } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   PATCH /api/admin/hospitals/:id/toggle
 */
const toggleHospitalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userRef = doc(db, 'users', id);
    const userDoc = await getDoc(userRef);
    const newStatus = !userDoc.data().isActive;
    await updateDoc(userRef, { isActive: newStatus });
    res.json({ success: true, message: `Status updated to ${newStatus}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  getDashboard, registerHospital, getAllHospitals, 
  getAllPatients, getPatientDetails, toggleHospitalStatus 
};
