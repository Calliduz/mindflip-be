// Theme definitions
const THEMES = [
  { id: 'classic', name: 'Classic', isPremium: false },
  { id: 'animals', name: 'Animals', isPremium: true },
  { id: 'food', name: 'Food', isPremium: true },
  { id: 'anime', name: 'Anime', isPremium: true },
  { id: 'logos', name: 'Logos', isPremium: true }
];

// @desc    Get list of all themes with lock status
// @route   GET /api/themes/list
// @access  Public (but checks user premium status if authenticated)
const listThemes = async (req, res) => {
  try {
    // Check if user is authenticated and premium
    const userIsPremium = req.user?.isPremium || false;
    
    // Map themes with lock status based on user's premium status
    const themes = THEMES.map(theme => ({
      id: theme.id,
      name: theme.name,
      isPremium: theme.isPremium,
      isLocked: theme.isPremium && !userIsPremium
    }));
    
    res.json({ themes });
  } catch (error) {
    console.error('List themes error:', error);
    res.status(500).json({ 
      message: 'Server error while fetching themes.' 
    });
  }
};

// @desc    Get premium themes (for premium users only)
// @route   GET /api/themes/premium
// @access  Private + Premium Required
const getPremiumThemes = async (req, res) => {
  try {
    // Filter only premium themes
    const premiumThemes = THEMES.filter(theme => theme.isPremium).map(theme => ({
      id: theme.id,
      name: theme.name,
      isPremium: theme.isPremium,
      isLocked: false // User is premium, so themes are unlocked
    }));
    
    res.json({ themes: premiumThemes });
  } catch (error) {
    console.error('Get premium themes error:', error);
    res.status(500).json({ 
      message: 'Server error while fetching premium themes.' 
    });
  }
};

module.exports = {
  listThemes,
  getPremiumThemes
};
