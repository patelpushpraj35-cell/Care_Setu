const express = require('express');
const router = express.Router();
const {
  getDashboard, registerHospital, getAllHospitals,
  getAllPatients, getPatientDetails, toggleHospitalStatus,
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { registerHospitalRules, validate } = require('../utils/validators');

// Apply auth + admin role to all routes
router.use(authMiddleware, roleMiddleware('admin'));

// Dashboard
router.get('/dashboard', getDashboard);

// Hospital management
router.post('/hospitals/register', registerHospitalRules, validate, registerHospital);
router.get('/hospitals', getAllHospitals);
router.patch('/hospitals/:id/toggle', toggleHospitalStatus);

// Patient management
router.get('/patients', getAllPatients);
router.get('/patients/:patientId/details', getPatientDetails);

module.exports = router;
