const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getDashboard, getReports, getTreatments, getQRData } = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Apply auth + patient role to all routes
router.use(authMiddleware, roleMiddleware('patient'));

router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/reports', getReports);
router.get('/treatments', getTreatments);
router.get('/qr', getQRData);

module.exports = router;
