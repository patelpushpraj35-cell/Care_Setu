const mongoose = require('mongoose');

/**
 * Report Schema - Medical reports uploaded by hospitals for patients
 */
const reportSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    fileName: {
      type: String,
    },
    fileType: {
      type: String,
      enum: ['pdf', 'image', 'other'],
      default: 'other',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    reportType: {
      type: String,
      enum: ['blood_test', 'xray', 'mri', 'ct_scan', 'urine_test', 'ecg', 'other'],
      default: 'other',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for fast patient lookups
reportSchema.index({ patientId: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
