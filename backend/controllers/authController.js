const User = require('../models/User');
const PatientProfile = require('../models/PatientProfile');
const { generateToken, maskAadhaar, encryptAadhaar, logActivity } = require('../utils/helpers');

/**
 * @route   POST /api/auth/register/patient
 * @desc    Register a new patient
 * @access  Public
 */
const registerPatient = async (req, res) => {
  try {
    const {
      name, email, password, mobileNumber, emergencyContact,
      bloodGroup, medicalHistory, aadhaarNumber, address,
      dateOfBirth, gender,
    } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    // Create user account
    const user = await User.create({ name, email, password, role: 'patient' });

    // Create patient profile
    const aadhaarMasked = aadhaarNumber ? maskAadhaar(aadhaarNumber) : undefined;
    const aadhaarEncrypted = aadhaarNumber ? encryptAadhaar(aadhaarNumber) : undefined;

    await PatientProfile.create({
      userId: user._id,
      mobileNumber,
      emergencyContact,
      bloodGroup,
      medicalHistory: medicalHistory || [],
      aadhaarMasked,
      aadhaarEncrypted,
      address,
      dateOfBirth,
      gender,
    });

    await logActivity(user._id, 'PATIENT_REGISTERED', `New patient registered: ${name}`, 'patient');

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully.',
      data: {
        token,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      },
    });
  } catch (error) {
    console.error('Register Patient Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login for any role (patient, hospital, admin)
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password included
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account is deactivated. Contact admin.' });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    await logActivity(user._id, 'USER_LOGIN', `User logged in: ${user.email}`, user.role);

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user info
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      success: true,
      data: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerPatient, login, getMe };
