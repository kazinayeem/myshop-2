import app from "./index.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();
import "./cronJobs/orderCleanup.js";
import { envData } from "./config/envdata.js";

const PORT = process.env.PORT || envData.PORT || 5000;


app.listen(PORT, () => {
  connectDB().then(() => {
    console.log(`Server is running on port ${PORT}`);
    //   url
    console.log(`http://localhost:${PORT}`);
  });
});
