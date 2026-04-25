const mongoose = require('mongoose');

/**
 * Treatment Schema - Doctor-prescribed treatments stored by hospitals
 */
const treatmentSchema = new mongoose.Schema(
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
    doctorName: {
      type: String,
      required: [true, 'Doctor name is required'],
    },
    diagnosis: {
      type: String,
      required: [true, 'Diagnosis is required'],
    },
    treatmentDetails: {
      type: String,
      required: [true, 'Treatment details are required'],
    },
    medications: [
      {
        name: String,
        dosage: String,
        frequency: String,
        duration: String,
      },
    ],
    lifestyleAdvice: {
      type: String,
    },
    followUpDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'discontinued'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Index for fast patient lookups
treatmentSchema.index({ patientId: 1, createdAt: -1 });

module.exports = mongoose.model('Treatment', treatmentSchema);
