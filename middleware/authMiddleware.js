// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @desc    Middleware to authenticate users
 * @access  Protected (Requires valid token)
 */
exports.authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log("Token:", token);

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    // Find user in the database using the `id` from the token (not `userId`)
    const user = await User.findById(decoded.id).select('-password'); // Use `decoded.id` instead of `decoded.userId`
    console.log("User:", user);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; // Attach the user object to the request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

/**
 * @desc    Middleware to check if user is authorized to modify an event
 * @access  Protected (Only event owner can modify)
 */
exports.authorizeEventOwner = async (req, res, next) => {
  const event = await Event.findById(req.params.eventId);

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  if (event.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to modify this event' });
  }

  next();
};

/**
 * @desc    Middleware for admin-only routes
 * @access  Protected (Only admin users)
 */
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
