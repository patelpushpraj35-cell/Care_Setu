const { db } = require('../config/firebase');
const { collection, getDocs, doc, getDoc, updateDoc, setDoc, addDoc, query, where } = require('firebase/firestore');
const bcrypt = require('bcryptjs');

/**
 * @route   GET /api/admin/dashboard
 */
const getDashboard = async (req, res) => {
  try {
    const usersSnap = await getDocs(collection(db, 'users'));
    const reportsSnap = await getDocs(collection(db, 'reports'));
    res.json({
      success: true,
      data: {
        totalPatients: usersSnap.docs.filter(d => d.data().role === 'patient').length,
        totalHospitals: usersSnap.docs.filter(d => d.data().role === 'hospital').length,
        totalReports: reportsSnap.size
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
    
    res.status(201).json({ success: true, data: { _id: docRef.id, ...newUser, password: undefined } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/admin/hospitals
 */
const getAllHospitals = async (req, res) => {
  try {
    const snap = await getDocs(query(collection(db, 'users'), where('role', '==', 'hospital')));
    res.json({ success: true, data: snap.docs.map(d => ({ _id: d.id, ...d.data() })) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/admin/patients
 */
const getAllPatients = async (req, res) => {
  try {
    const snap = await getDocs(query(collection(db, 'users'), where('role', '==', 'patient')));
    res.json({ success: true, data: snap.docs.map(d => ({ _id: d.id, ...d.data() })) });
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
    const userSnap = await getDoc(userRef);
    const newStatus = !userSnap.data().isActive;
    await updateDoc(userRef, { isActive: newStatus });
    res.json({ success: true, message: `Status updated to ${newStatus}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboard, registerHospital, getAllHospitals, getAllPatients, getPatientDetails, toggleHospitalStatus };
