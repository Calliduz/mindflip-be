const express = require('express');
const router = express.Router();
const { listThemes, getPremiumThemes } = require('../controllers/themeController');
const authMiddleware = require('../middleware/authMiddleware');
const requirePremium = require('../middleware/requirePremium');

// Optional auth middleware - doesn't fail if no token, just checks premium status
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  
  try {
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (user) {
      req.user = user;
    }
  } catch (error) {
    // Token invalid, but that's okay for optional auth
    console.log('Optional auth - invalid token, continuing as guest');
  }
  
  next();
};

// @route   GET /api/themes/list
// @desc    Get all themes with lock status
// @access  Public (but checks user premium status if authenticated)
router.get('/list', optionalAuth, listThemes);

// @route   GET /api/themes/premium
// @desc    Get premium themes (for premium users only)
// @access  Private + Premium Required
router.get('/premium', authMiddleware, requirePremium, getPremiumThemes);

module.exports = router;
