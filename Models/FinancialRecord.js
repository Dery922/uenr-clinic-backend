// models/FinancialRecord.js
import mongoose from "mongoose";

const FinancialRecordSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PatientSession",
      required: true,
    },
    patient_id: { type: String},
    patient_name: { type: String },
    plan_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    medication_index: { type: Number, required: true },
    medication_name: { type: String, required: true },
    amount: { type: Number, required: true },
    covered_by_insurance: { type: Boolean, default: false },
    payment_status: {
      type: String,
      enum: ["pending", "paid", "partial", "cancelled"],
      default: "pending",
    },
    paid_amount: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    payment_date: { type: Date },
    payment_method: { type: String },
    transaction_id: { type: String },
    created_by: { type: String }, // Cashier username
    notes: { type: String },

  },
  { timestamps: true }
);

export default mongoose.model("FinancialRecord", FinancialRecordSchema);
