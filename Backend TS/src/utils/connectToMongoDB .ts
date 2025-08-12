// connect to MongoDB utility
// This file is responsible for connecting to MongoDB using Mongoose

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI


export const connectedToMongoDB = async (): Promise<void> => {
  try {
    // Check if MONGODB_URI is defined or not ...It's so important to have this variable set
    if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in environment variables");
  process.exit(1);
}
    await mongoose.connect(MONGODB_URI );

    console.log("✅ Connected to MongoDB");
  } catch (error: any) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
