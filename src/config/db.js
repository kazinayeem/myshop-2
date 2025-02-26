// connect DB();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const atlasUrl =
  "mongodb+srv://nayeemwhatsapp6:Gps8Hm3BpybdGmRs@ecommerce.ge3yd.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce";
const MONGO_URI = "mongodb://localhost:27017/ecommerce";
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

export default connectDB;
