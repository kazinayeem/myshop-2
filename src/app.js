import app from "./index.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import "./cronJobs/orderCleanup.js";
import { envData } from "./config/envdata.js";

dotenv.config();
app.listen(envData.PORT, () => {
  connectDB().then(() => {
    console.log(`Server is running on port ${envData.PORT}`);
    //   url
    console.log(`http://localhost:${envData.PORT}`);
  });
});
