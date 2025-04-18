import app from "./index.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import "./cronJobs/orderCleanup.js";
import { envData } from "./config/envdata.js";

const PORT = process.env.PORT || envData.PORT || 5000;

dotenv.config();
app.listen(PORT, () => {
  connectDB().then(() => {
    console.log(`Server is running on port ${PORT}`);
    //   url
    console.log(`http://localhost:${PORT}`);
  });
});
