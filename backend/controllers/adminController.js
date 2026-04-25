const User = require('../models/User');
const PatientProfile = require('../models/PatientProfile');
const HospitalProfile = require('../models/HospitalProfile');
const Report = require('../models/Report');
const Treatment = require('../models/Treatment');
const ActivityLog = require('../models/ActivityLog');
const { generateToken, logActivity } = require('../utils/helpers');

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get dashboard statistics
 * @access  Admin
 */
const getDashboard = async (req, res) => {
  try {
    const [totalPatients, totalHospitals, totalReports, totalTreatments, recentActivity] = await Promise.all([
      User.countDocuments({ role: 'patient' }),
      User.countDocuments({ role: 'hospital' }),
      Report.countDocuments(),
      Treatment.countDocuments(),
      ActivityLog.find().sort({ createdAt: -1 }).limit(10).populate('userId', 'name email role'),
    ]);

    res.json({
      success: true,
      data: {
        stats: { totalPatients, totalHospitals, totalReports, totalTreatments },
        recentActivity,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   POST /api/admin/hospitals/register
 * @desc    Register a new hospital (admin creates credentials)
 * @access  Admin
 */
const registerHospital = async (req, res) => {
  try {
    const { name, email, password, hospitalName, registrationNumber, address, phone, specializations, totalBeds } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    // Check duplicate registration number
    const existingHospital = await HospitalProfile.findOne({ registrationNumber });
    if (existingHospital) {
      return res.status(409).json({ success: false, message: 'Hospital registration number already exists.' });
    }

    // Create user account for hospital
    const user = await User.create({ name, email, password, role: 'hospital' });

    // Create hospital profile
    await HospitalProfile.create({
      userId: user._id,
      hospitalName: hospitalName || name,
      registrationNumber,
      address,
      phone,
      email,
      specializations: specializations || [],
      totalBeds: totalBeds || 0,
    });

    await logActivity(req.user._id, 'HOSPITAL_REGISTERED', `Hospital registered: ${hospitalName || name}`, 'admin');

    res.status(201).json({
      success: true,
      message: 'Hospital registered successfully.',
      data: { userId: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/admin/hospitals
 * @desc    Get all hospitals
 * @access  Admin
 */
const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await User.find({ role: 'hospital' }).select('-password').lean();

    const hospitalProfiles = await HospitalProfile.find({
      userId: { $in: hospitals.map((h) => h._id) },
    });

    const profileMap = {};
    hospitalProfiles.forEach((p) => { profileMap[p.userId.toString()] = p; });

    const result = hospitals.map((h) => ({
      ...h,
      profile: profileMap[h._id.toString()] || null,
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/admin/patients
 * @desc    Get all patients with profiles
 * @access  Admin
 */
const getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password').lean();

    const patientProfiles = await PatientProfile.find({
      userId: { $in: patients.map((p) => p._id) },
    });

    const profileMap = {};
    patientProfiles.forEach((p) => { profileMap[p.userId.toString()] = p; });

    const result = patients.map((p) => ({
      ...p,
      profile: profileMap[p._id.toString()] || null,
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/admin/patients/:patientId/details
 * @desc    Get detailed records for a specific patient
 * @access  Admin
 */
const getPatientDetails = async (req, res) => {
  try {
    const { patientId } = req.params;

    const [user, profile, reports, treatments] = await Promise.all([
      User.findById(patientId).select('-password'),
      PatientProfile.findOne({ userId: patientId }),
      Report.find({ patientId }).populate('hospitalId', 'name').sort({ createdAt: -1 }),
      Treatment.find({ patientId }).populate('hospitalId', 'name').sort({ createdAt: -1 }),
    ]);

    if (!user) return res.status(404).json({ success: false, message: 'Patient not found.' });

    res.json({ success: true, data: { user, profile, reports, treatments } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   PATCH /api/admin/hospitals/:id/toggle
 * @desc    Activate/Deactivate a hospital account
 * @access  Admin
 */
const toggleHospitalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user || user.role !== 'hospital') {
      return res.status(404).json({ success: false, message: 'Hospital not found.' });
    }
    user.isActive = !user.isActive;
    await user.save();
    await logActivity(req.user._id, 'HOSPITAL_STATUS_CHANGED', `Hospital ${user.name} status: ${user.isActive ? 'active' : 'inactive'}`, 'admin');
    res.json({ success: true, message: `Hospital ${user.isActive ? 'activated' : 'deactivated'}.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboard, registerHospital, getAllHospitals, getAllPatients, getPatientDetails, toggleHospitalStatus };
