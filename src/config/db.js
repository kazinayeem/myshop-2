import mongoose from "mongoose";
import { envData } from "./envdata.js";

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://nayeemwhatsapp6:Gps8Hm3BpybdGmRs@ecommerce.ge3yd.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce"
    );
    console.log(
      `MongoDB Connected: mongodb+srv://nayeemwhatsapp6:Gps8Hm3BpybdGmRs@ecommerce.ge3yd.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce`
    );
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

export default connectDB;
