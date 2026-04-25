const express = require('express');
const router = express.Router();
const { registerPatient, login, getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { registerPatientRules, loginRules, validate } = require('../utils/validators');

// @route  POST /api/auth/register/patient
router.post('/register/patient', registerPatientRules, validate, registerPatient);

// @route  POST /api/auth/login
router.post('/login', loginRules, validate, login);

// @route  GET /api/auth/me
router.get('/me', authMiddleware, getMe);

module.exports = router;
