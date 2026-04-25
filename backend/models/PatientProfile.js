const mongoose = require('mongoose');

/**
 * PatientProfile Schema - Extended patient information
 */
const patientProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number'],
    },
    emergencyContact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      relation: { type: String },
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: true,
    },
    medicalHistory: [
      {
        type: String,
        trim: true,
      },
    ],
    // Aadhaar is stored masked (last 4 digits only for display)
    aadhaarMasked: {
      type: String, // e.g., "XXXX-XXXX-1234"
    },
    // Encrypted Aadhaar (store full number securely; in prod use field-level encryption)
    aadhaarEncrypted: {
      type: String,
      select: false,
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    profilePhoto: {
      type: String, // URL/path
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PatientProfile', patientProfileSchema);
