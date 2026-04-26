const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');
const { doc, getDoc } = require('firebase/firestore');

/**
 * Middleware: Verify JWT token and attach user to request (Firebase version)
 */
const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // Extract token from Authorization header (Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from Firestore
    const userDoc = await getDoc(doc(db, 'users', decoded.id));

    if (!userDoc.exists()) {
      return res.status(401).json({ success: false, message: 'Token is invalid. User not found.' });
    }

    const user = { _id: userDoc.id, ...userDoc.data() };
    delete user.password;

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account is deactivated.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token has expired. Please login again.' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
