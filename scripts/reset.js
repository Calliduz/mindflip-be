const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

const resetDatabase = async () => {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Get database name from connection
    const dbName = conn.connection.name;
    
    console.log(`\n⚠️  WARNING: This will delete ALL data in database "${dbName}"`);
    console.log('Proceeding in 3 seconds... Press Ctrl+C to cancel.\n');
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Drop all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    for (const collection of collections) {
      await mongoose.connection.db.dropCollection(collection.name);
      console.log(`Dropped collection: ${collection.name}`);
    }
    
    console.log('\n✅ Database reset complete!');
    console.log('Run "npm run seed" to re-populate with test data.');
    
    process.exit(0);
  } catch (error) {
    console.error('Reset error:', error);
    process.exit(1);
  }
};

resetDatabase();
