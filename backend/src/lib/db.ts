
import mongoose from 'mongoose';


import dotenv from 'dotenv';
dotenv.config();


const MONGODB_URI = process.env.MONGODB_URI;


if (!MONGODB_URI) {
  throw new Error('❌ MONGODB_URI is not defined in .env file');
}


export const connectDB = async () => {
  try {
    
    await mongoose.connect(MONGODB_URI, {
      dbName: 'baribazar', 
    });
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📦 Database Name: ${mongoose.connection.db.databaseName}`);
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    
    
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB Disconnected!');
});


process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 MongoDB connection closed due to app termination');
  process.exit(0);
});