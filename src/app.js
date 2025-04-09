import app from "./index.js";
import connectDB from "./config/db.js";
const PORT = process.env.PORT || 4000;
import dotenv from "dotenv";


dotenv.config();
app.listen(PORT, () => {
  connectDB().then(() => {
    console.log(`Server is running on port ${PORT}`);
    //   url
    console.log(`http://localhost:${PORT}`);
  });

});
