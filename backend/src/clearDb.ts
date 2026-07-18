import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import CodeforcesCache from './models/CodeforcesCache';

dotenv.config();

const clearDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cp-tracker');
    console.log('Connected to database to clear old data...');
    
    const userCount = await User.countDocuments();
    const cacheCount = await CodeforcesCache.countDocuments();
    
    console.log(`Current users: ${userCount}, Current cache entries: ${cacheCount}`);
    
    await User.deleteMany({});
    await CodeforcesCache.deleteMany({});
    
    console.log('Successfully cleared all users and Codeforces caches!');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

clearDB();
