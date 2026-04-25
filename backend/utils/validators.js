const { body, validationResult } = require('express-validator');

/**
 * Middleware: Check validation result and return errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// Auth validators
const registerPatientRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('mobileNumber').matches(/^[6-9]\d{9}$/).withMessage('Valid Indian mobile number required'),
  body('bloodGroup').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Valid blood group required'),
];

const loginRules = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const registerHospitalRules = [
  body('name').trim().notEmpty().withMessage('Hospital name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('hospitalName').trim().notEmpty().withMessage('Hospital name is required'),
  body('registrationNumber').trim().notEmpty().withMessage('Registration number is required'),
];

const reportRules = [
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('patientId').notEmpty().withMessage('Patient ID is required'),
];

const treatmentRules = [
  body('patientId').notEmpty().withMessage('Patient ID is required'),
  body('doctorName').trim().notEmpty().withMessage('Doctor name is required'),
  body('diagnosis').trim().notEmpty().withMessage('Diagnosis is required'),
  body('treatmentDetails').trim().notEmpty().withMessage('Treatment details are required'),
];

module.exports = {
  validate,
  registerPatientRules,
  loginRules,
  registerHospitalRules,
  reportRules,
  treatmentRules,
};
