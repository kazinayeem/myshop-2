import dotenv from "dotenv";
dotenv.config();

export const envData = {
  user: process.env.USER_EMAIL,
  pass: process.env.USER_PASSWORD,
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  storeid: process.env.STORE_ID,
  storepassword: process.env.STORE_PASSWORD,
  islive: false,
  frontendUrl: process.env.FRONTEND_URL,
  serverUrl: process.env.SERVER_URL,
  mongodbAtlasUrl: process.env.MONGODB_ATLAS_URL,
  PORT: process.env.PORT || 4000,
};
