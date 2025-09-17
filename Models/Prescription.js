// models/Prescription.js
import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PatientSession",
    required: true,
  },
  
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  medications: [
    {
      name: { type: String, required: true }, // e.g., "Amoxicillin"
      dosage: { type: String, required: true }, // e.g., "500mg"
      frequency: { type: String, required: true }, // e.g., "3 times a day"
      duration: { type: String, required: true }, // e.g., "7 days"
    }
  ],
  diagnosis: { type: String, required: true },
  status: { type: String, enum: ["pending", "dispensed"], default: "pending" },
  dispensedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  notes: String
}, { timestamps: true });

export default mongoose.model("Prescription", prescriptionSchema);
