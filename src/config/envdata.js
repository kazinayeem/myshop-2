import dotenv from "dotenv";
dotenv.config();

export const envData = {
  user: process.env.USER_EMAIL || "kazinayeem55085@gmail.com",
  pass: process.env.USER_PASSWORD || "xurk uvvy mehd yexl",
  cloud_name: process.env.CLOUD_NAME || "daq7v0wmf",
  api_key: process.env.API_KEY || "286238383573198",
  api_secret: process.env.API_SECRET || "F25Rkv7b6fVQSgU0LXXzQe5KAe8",
  storeid: process.env.STORE_ID || "kazi67f0c67596ef9",
  storepassword: process.env.STORE_PASSWORD || "kazi67f0c67596ef9@ssl",
  islive: false || process.env.IS_LIVE,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  serverUrl: process.env.SERVER_URL || "http://localhost:4000",
  mongodbAtlasUrl: process.env.MONGODB_ATLAS_URL,
  PORT: process.env.PORT || 4000,
};
