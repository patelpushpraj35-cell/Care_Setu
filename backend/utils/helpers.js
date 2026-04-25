const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token for a user
 * @param {string} userId - MongoDB user ID
 * @param {string} role - User role
 * @returns {string} JWT token
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/**
 * Mask Aadhaar number for display (show only last 4 digits)
 * @param {string} aadhaar - 12-digit Aadhaar number
 * @returns {string} Masked Aadhaar "XXXX-XXXX-1234"
 */
const maskAadhaar = (aadhaar) => {
  if (!aadhaar || aadhaar.length < 4) return 'XXXX-XXXX-XXXX';
  const clean = aadhaar.replace(/\D/g, '');
  return `XXXX-XXXX-${clean.slice(-4)}`;
};

/**
 * Simple XOR-based obfuscation for Aadhaar (use proper encryption in production)
 * @param {string} text - Plain text
 * @returns {string} Base64 encoded obfuscated text
 */
const encryptAadhaar = (text) => {
  if (!text) return '';
  return Buffer.from(text).toString('base64');
};

/**
 * Decode obfuscated Aadhaar (for internal use only)
 * @param {string} encoded - Base64 encoded text
 * @returns {string} Plain text
 */
const decryptAadhaar = (encoded) => {
  if (!encoded) return '';
  return Buffer.from(encoded, 'base64').toString('utf-8');
};

/**
 * Create a standardized API response
 */
const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = { success, message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

/**
 * Log activity to database
 */
const logActivity = async (userId, action, description, role) => {
  try {
    const ActivityLog = require('../models/ActivityLog');
    await ActivityLog.create({ userId, action, description, role });
  } catch (err) {
    console.error('Failed to log activity:', err.message);
  }
};

module.exports = { generateToken, maskAadhaar, encryptAadhaar, decryptAadhaar, sendResponse, logActivity };
