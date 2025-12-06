const requirePremium = (req, res, next) => {
  // This middleware should be used after authMiddleware
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Authentication required.' 
    });
  }
  
  if (!req.user.isPremium) {
    return res.status(403).json({ 
      message: 'Premium subscription required to access this resource.' 
    });
  }
  
  next();
};

module.exports = requirePremium;
