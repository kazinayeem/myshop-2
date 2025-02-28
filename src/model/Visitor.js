import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    ipAddress: { type: String, required: true }, // Store IP address
    visitTime: { type: Date, default: Date.now }, // Store visit timestamp
  },
  { timestamps: true } // Store createdAt and updatedAt
);

const Visitor = mongoose.model("Visitor", visitorSchema);

export default Visitor;
