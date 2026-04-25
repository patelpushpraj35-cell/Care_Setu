const User = require('../models/User');
const PatientProfile = require('../models/PatientProfile');
const Report = require('../models/Report');
const Treatment = require('../models/Treatment');
const HospitalProfile = require('../models/HospitalProfile');
const { logActivity } = require('../utils/helpers');
const path = require('path');

/**
 * @route   GET /api/hospital/profile
 * @desc    Get hospital's own profile
 * @access  Hospital
 */
const getProfile = async (req, res) => {
  try {
    const profile = await HospitalProfile.findOne({ userId: req.user._id });
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
 * @route   GET /api/hospital/dashboard
 * @desc    Get hospital dashboard stats
 * @access  Hospital
 */
const getDashboard = async (req, res) => {
  try {
    const [reportsCount, treatmentsCount, recentReports, recentTreatments] = await Promise.all([
      Report.countDocuments({ hospitalId: req.user._id }),
      Treatment.countDocuments({ hospitalId: req.user._id }),
      Report.find({ hospitalId: req.user._id })
        .populate('patientId', 'name email')
        .sort({ createdAt: -1 })
        .limit(5),
      Treatment.find({ hospitalId: req.user._id })
        .populate('patientId', 'name email')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.json({
      success: true,
      data: { reportsCount, treatmentsCount, recentReports, recentTreatments },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/hospital/patient/:patientId
 * @desc    Fetch full patient details by ID (after QR scan)
 * @access  Hospital
 */
const getPatientByQR = async (req, res) => {
  try {
    const { patientId } = req.params;

    const [user, profile, reports, treatments] = await Promise.all([
      User.findById(patientId).select('-password'),
      PatientProfile.findOne({ userId: patientId }),
      Report.find({ patientId }).populate('hospitalId', 'name').sort({ createdAt: -1 }),
      Treatment.find({ patientId }).populate('hospitalId', 'name').sort({ createdAt: -1 }),
    ]);

    if (!user || user.role !== 'patient') {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    await logActivity(req.user._id, 'PATIENT_QR_SCAN', `Hospital scanned QR for patient: ${user.name}`, 'hospital');

    res.json({
      success: true,
      data: {
        user: { _id: user._id, name: user.name, email: user.email },
        profile,
        reports,
        treatments,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   POST /api/hospital/reports
 * @desc    Upload a new report for a patient
 * @access  Hospital
 */
const uploadReport = async (req, res) => {
  try {
    const { patientId, description, reportType } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    // Verify patient exists
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    const fileType = ext === '.pdf' ? 'pdf' : 'image';

    const report = await Report.create({
      patientId,
      hospitalId: req.user._id,
      fileUrl: `/uploads/reports/${req.file.filename}`,
      fileName: req.file.originalname,
      fileType,
      description,
      reportType: reportType || 'other',
    });

    await logActivity(req.user._id, 'REPORT_UPLOADED', `Report uploaded for patient: ${patient.name}`, 'hospital');

    const populated = await report.populate('hospitalId', 'name');
    res.status(201).json({ success: true, message: 'Report uploaded successfully.', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   POST /api/hospital/treatments
 * @desc    Add a new treatment for a patient
 * @access  Hospital
 */
const addTreatment = async (req, res) => {
  try {
    const { patientId, doctorName, diagnosis, treatmentDetails, medications, lifestyleAdvice, followUpDate } = req.body;

    // Verify patient exists
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    const treatment = await Treatment.create({
      patientId,
      hospitalId: req.user._id,
      doctorName,
      diagnosis,
      treatmentDetails,
      medications: medications || [],
      lifestyleAdvice,
      followUpDate,
    });

    await logActivity(req.user._id, 'TREATMENT_ADDED', `Treatment added for patient: ${patient.name}`, 'hospital');

    const populated = await treatment.populate('hospitalId', 'name');
    res.status(201).json({ success: true, message: 'Treatment added successfully.', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   PATCH /api/hospital/patient/:patientId/medical-history
 * @desc    Update patient medical history
 * @access  Hospital
 */
const updateMedicalHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { medicalHistory } = req.body;

    const profile = await PatientProfile.findOneAndUpdate(
      { userId: patientId },
      { $set: { medicalHistory } },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Patient profile not found.' });
    }

    res.json({ success: true, message: 'Medical history updated.', data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/hospital/patients
 * @desc    Get list of all patients this hospital has interacted with
 * @access  Hospital
 */
const getMyPatients = async (req, res) => {
  try {
    // Get unique patient IDs from reports and treatments
    const reportPatientIds = await Report.distinct('patientId', { hospitalId: req.user._id });
    const treatmentPatientIds = await Treatment.distinct('patientId', { hospitalId: req.user._id });

    const allPatientIds = [...new Set([...reportPatientIds.map(String), ...treatmentPatientIds.map(String)])];

    const patients = await User.find({ _id: { $in: allPatientIds } }).select('-password');
    const profiles = await PatientProfile.find({ userId: { $in: allPatientIds } });

    const profileMap = {};
    profiles.forEach((p) => { profileMap[p.userId.toString()] = p; });

    const result = patients.map((p) => ({
      _id: p._id,
      name: p.name,
      email: p.email,
      profile: profileMap[p._id.toString()] || null,
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, getDashboard, getPatientByQR, uploadReport, addTreatment, updateMedicalHistory, getMyPatients };
