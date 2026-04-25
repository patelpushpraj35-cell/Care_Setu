const mongoose = require('mongoose');

/**
 * HospitalProfile Schema - Hospital information linked to user account
 */
const hospitalProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    hospitalName: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    specializations: [String],
    totalBeds: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: true, // Admin-registered hospitals are auto-verified
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HospitalProfile', hospitalProfileSchema);
