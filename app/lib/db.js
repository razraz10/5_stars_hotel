import mongoose from "mongoose";

const MONGO_DB = process.env.MONGO_DB;

// let cached = global.mongoose || { conn: null, promise: null };

export async function dbConnect() {
  // אם כבר יש חיבור
  try {
    await mongoose.connect(MONGO_DB);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}
