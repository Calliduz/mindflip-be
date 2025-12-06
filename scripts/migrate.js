const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

const migrateToProduction = async () => {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    // Create indexes for optimal performance
    console.log('\n--- Creating Indexes ---');
    
    // Email index (unique, for fast lookups)
    await User.collection.createIndex({ email: 1 }, { unique: true });
    console.log('✅ Created unique index on User.email');
    
    // isPremium index (for filtering premium users)
    await User.collection.createIndex({ isPremium: 1 });
    console.log('✅ Created index on User.isPremium');
    
    // createdAt index (for sorting by registration date)
    await User.collection.createIndex({ createdAt: -1 });
    console.log('✅ Created index on User.createdAt');
    
    // Get collection stats
    console.log('\n--- Collection Statistics ---');
    const userCount = await User.countDocuments();
    const premiumCount = await User.countDocuments({ isPremium: true });
    
    console.log(`Total Users: ${userCount}`);
    console.log(`Premium Users: ${premiumCount}`);
    console.log(`Free Users: ${userCount - premiumCount}`);
    
    // List all indexes
    console.log('\n--- Current Indexes ---');
    const indexes = await User.collection.indexes();
    indexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    console.log('\n✅ Migration complete! Your database is ready for production.');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrateToProduction();
