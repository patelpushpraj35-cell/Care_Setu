const express = require('express');
const router = express.Router();
const {
  getProfile, getDashboard, getPatientByQR,
  uploadReport, addTreatment, updateMedicalHistory, getMyPatients,
} = require('../controllers/hospitalController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { treatmentRules, validate } = require('../utils/validators');

// Apply auth + hospital role to all routes
router.use(authMiddleware, roleMiddleware('hospital'));

router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);
router.get('/patients', getMyPatients);
router.get('/patient/:patientId', getPatientByQR);
router.post('/reports', upload.single('file'), uploadReport);
router.post('/treatments', treatmentRules, validate, addTreatment);
router.patch('/patient/:patientId/medical-history', updateMedicalHistory);

module.exports = router;
