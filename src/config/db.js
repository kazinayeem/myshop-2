import mongoose from "mongoose";
import { envData } from "./envdata.js";

const connectDB = async () => {
  try {
    await mongoose.connect(envData.mongodbAtlasUrl);
    console.log(`MongoDB Connected: ${envData.mongodbAtlasUrl}`);
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

export default connectDB;
