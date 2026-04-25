const mongoose = require('mongoose');

/**
 * ActivityLog Schema - Tracks all admin-visible system activities
 */
const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    action: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'patient', 'hospital'],
    },
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
