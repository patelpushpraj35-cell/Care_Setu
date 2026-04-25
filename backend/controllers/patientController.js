const User = require('../models/User');
const PatientProfile = require('../models/PatientProfile');
const Report = require('../models/Report');
const Treatment = require('../models/Treatment');
const { maskAadhaar, encryptAadhaar } = require('../utils/helpers');

/**
 * @route   GET /api/patient/profile
 * @desc    Get patient's own profile
 * @access  Patient
 */
const getProfile = async (req, res) => {
  try {
    const profile = await PatientProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found. Please complete registration.' });
    }

    res.json({
      success: true,
      data: {
        user: { _id: req.user._id, name: req.user.name, email: req.user.email },
        profile,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   PUT /api/patient/profile
 * @desc    Update patient's own profile
 * @access  Patient
 */
const updateProfile = async (req, res) => {
  try {
    const { name, mobileNumber, emergencyContact, bloodGroup, medicalHistory, aadhaarNumber, address, dateOfBirth, gender } = req.body;

    // Update User name if changed
    if (name) {
      await User.findByIdAndUpdate(req.user._id, { name });
    }

    // Build update object
    const updateData = {};
    if (mobileNumber) updateData.mobileNumber = mobileNumber;
    if (emergencyContact) updateData.emergencyContact = emergencyContact;
    if (bloodGroup) updateData.bloodGroup = bloodGroup;
    if (medicalHistory) updateData.medicalHistory = medicalHistory;
    if (address) updateData.address = address;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (gender) updateData.gender = gender;
    if (aadhaarNumber) {
      updateData.aadhaarMasked = maskAadhaar(aadhaarNumber);
      updateData.aadhaarEncrypted = encryptAadhaar(aadhaarNumber);
    }

    const profile = await PatientProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.json({ success: true, message: 'Profile updated successfully.', data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/patient/dashboard
 * @desc    Get patient dashboard data (profile + recent reports + treatments)
 * @access  Patient
 */
const getDashboard = async (req, res) => {
  try {
    const [profile, reports, treatments] = await Promise.all([
      PatientProfile.findOne({ userId: req.user._id }),
      Report.find({ patientId: req.user._id })
        .populate('hospitalId', 'name')
        .sort({ createdAt: -1 })
        .limit(5),
      Treatment.find({ patientId: req.user._id })
        .populate('hospitalId', 'name')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.json({
      success: true,
      data: {
        user: { _id: req.user._id, name: req.user.name, email: req.user.email },
        profile,
        recentReports: reports,
        recentTreatments: treatments,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/patient/reports
 * @desc    Get all reports for the logged-in patient
 * @access  Patient
 */
const getReports = async (req, res) => {
  try {
    const reports = await Report.find({ patientId: req.user._id })
      .populate('hospitalId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/patient/treatments
 * @desc    Get all treatments for the logged-in patient
 * @access  Patient
 */
const getTreatments = async (req, res) => {
  try {
    const treatments = await Treatment.find({ patientId: req.user._id })
      .populate('hospitalId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: treatments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/patient/qr
 * @desc    Get QR code data (returns patientId for QR generation)
 * @access  Patient
 */
const getQRData = async (req, res) => {
  try {
    const profile = await PatientProfile.findOne({ userId: req.user._id });

    // QR encodes patientId + name + bloodGroup for emergency use
    const qrData = JSON.stringify({
      patientId: req.user._id,
      name: req.user.name,
      bloodGroup: profile?.bloodGroup || 'Unknown',
      emergency: profile?.emergencyContact?.phone || 'N/A',
    });

    res.json({
      success: true,
      data: {
        qrData,
        patientId: req.user._id,
        name: req.user.name,
        bloodGroup: profile?.bloodGroup,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, updateProfile, getDashboard, getReports, getTreatments, getQRData };
