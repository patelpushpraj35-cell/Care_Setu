const { db } = require('../config/firebase');
const { collection, query, where, getDocs, getDoc, doc, updateDoc, deleteDoc, orderBy, limit } = require('firebase/firestore');

/**
 * @route   GET /api/admin/stats
 * @desc    Get system-wide statistics
 * @access  Admin
 */
const getStats = async (req, res) => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const reportsSnapshot = await getDocs(collection(db, 'reports'));
    const hospitalsSnapshot = await getDocs(query(collection(db, 'users'), where('role', '==', 'hospital')));

    const stats = {
      totalPatients: usersSnapshot.docs.filter(d => d.data().role === 'patient').length,
      totalHospitals: hospitalsSnapshot.size,
      totalReports: reportsSnapshot.size,
      activeUsers: usersSnapshot.docs.filter(d => d.data().isActive).length
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with filtering
 * @access  Admin
 */
const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    let q = collection(db, 'users');
    if (role) {
      q = query(q, where('role', '==', role));
    }

    const snapshot = await getDocs(q);
    const users = snapshot.docs.map(d => ({ _id: d.id, ...d.data() }));

    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   PATCH /api/admin/users/:id/status
 * @desc    Activate/Deactivate user account
 * @access  Admin
 */
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const userRef = doc(db, 'users', id);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    await updateDoc(userRef, { isActive });

    res.json({ success: true, message: `User account ${isActive ? 'activated' : 'deactivated'} successfully.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/admin/logs
 * @desc    Get system activity logs
 * @access  Admin
 */
const getActivityLogs = async (req, res) => {
  try {
    const q = query(collection(db, 'activityLogs'), orderBy('createdAt', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    const logs = snapshot.docs.map(d => ({ _id: d.id, ...d.data() }));

    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStats, getUsers, toggleUserStatus, getActivityLogs };
