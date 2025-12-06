const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

// Theme definitions (same as in themeController)
const THEMES = [
  { id: 'classic', name: 'Classic', isPremium: false },
  { id: 'animals', name: 'Animals', isPremium: true },
  { id: 'food', name: 'Food', isPremium: true },
  { id: 'anime', name: 'Anime', isPremium: true },
  { id: 'logos', name: 'Logos', isPremium: true }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Clear existing users (optional - comment out if you want to keep existing data)
    // await User.deleteMany({});
    // console.log('Cleared existing users');
    
    // Create a test user (optional)
    const testUserExists = await User.findOne({ email: 'test@example.com' });
    
    if (!testUserExists) {
      const testUser = await User.create({
        email: 'test@example.com',
        password: 'password123',
        isPremium: false
      });
      console.log(`Created test user: ${testUser.email}`);
    } else {
      console.log('Test user already exists');
    }
    
    // Create a premium test user (optional)
    const premiumUserExists = await User.findOne({ email: 'premium@example.com' });
    
    if (!premiumUserExists) {
      const premiumUser = await User.create({
        email: 'premium@example.com',
        password: 'password123',
        isPremium: true
      });
      console.log(`Created premium test user: ${premiumUser.email}`);
    } else {
      console.log('Premium test user already exists');
    }
    
    console.log('\n--- Database Seeding Complete ---');
    console.log('\nAvailable Themes:');
    THEMES.forEach(theme => {
      console.log(`  - ${theme.name} (${theme.isPremium ? 'Premium' : 'Free'})`);
    });
    
    console.log('\nTest Accounts:');
    console.log('  - test@example.com / password123 (Free user)');
    console.log('  - premium@example.com / password123 (Premium user)');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
