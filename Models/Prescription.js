import mongoose from "mongoose";

// Subdocument schema for each prescribed drug
const DrugSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  }
}, { _id: false }); // prevent auto-creating _id for each subdocument

// Main prescription schema
const PrescriptionSchema = new mongoose.Schema({
  patient_id: {
    type: String,
    required: true,
  },
  patient_name: {
    type: String,
    required: true,
  },
  prescribed_by: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  drugs: {
    type: [DrugSchema],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "dispensed"],
    default: "pending",
  }
}, {
  timestamps: true
});

const Prescription = mongoose.model("Prescription", PrescriptionSchema);
export default Prescription;
