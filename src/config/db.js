import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const atlasUrl =
  "mongodb+srv://nayeemwhatsapp6:Gps8Hm3BpybdGmRs@ecommerce.ge3yd.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce";

const mongoURL = process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce";

console.log("MongoDB URL:", mongoURL);

const connectDB = async () => {
  try {
    await mongoose.connect(atlasUrl);
    console.log(`MongoDB Connected: ${atlasUrl}`);
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

export default connectDB;
