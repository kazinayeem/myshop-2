import moment from "moment";
import Visitor from "../model/Visitor";

const checkvisitor = async (req, res, next) => {
  try {
    // Get the visitor's IP address (you can customize this as needed)
    const ipAddress = req.ip;

    // Store visit in the database
    const newVisitor = new Visitor({
      ipAddress: ipAddress,
    });

    await newVisitor.save(); // Save to DB

    // Optional: Log the visit with timestamp using Moment.js
    console.log(
      `Visitor from IP: ${ipAddress} visited at ${moment().format(
        "YYYY-MM-DD HH:mm:ss"
      )}`
    );

    next(); // Proceed to the next middleware or route
  } catch (error) {
    console.error("Error tracking visitor:", error);
    next(error); // Move to the next middleware (error handler)
  }
};
export default checkvisitor;
