import mongoose from "mongoose";

const FinanceSchema = new mongoose.Schema({
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
    required: true
  },
  patient: {
    type: String,
    required: true
  },
  patient_name: {
    type: String,
    required: true
  },
  medications: [
    {
      medication_name: { type: String, required: true },
      amount: { type: Number, required: true },
      status: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending"
      }
    }
  ],
  total_amount: {
    type: Number,
    required: true
  },
  paid_by: {
    type: String // cashier username
  }
}, {
  timestamps: true
});

export default mongoose.model("Finance", FinanceSchema);
