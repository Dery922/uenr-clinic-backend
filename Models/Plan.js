// models/Plan.js
import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PatientSession",
      required: true,
    },

    // store MRN (folder number) as string
    patient: { type: String, required: true },

    patient_name: { type: String, required: true },

    registration_date: {
      type: Date,
      required: [true, "Date of entry is needed"],
    },

    medications: [
      {
        medication_name: { type: String, required: true },
        dose: { type: String, required: true },
        frequency: { type: String, required: true },

        // NEW:
        covered_by_insurance: { type: Boolean, default: false },
        payment_status: {
          type: String,
          enum: ["not_required", "pending", "paid"],
          default: "not_required",
        },
        dispense_status: {
          type: String,
          enum: ["pending", "active", "completed", "dispatched"],
          default: "pending",
        },

        // optional price quote (if you want it)
        amount: { type: Number, default: 0 },
        // NEW FIELDS:
        inventory_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Inventory",
        },
        unit_price: { type: Number, default: 0 },
        quantity: { type: Number, default: 1 },
        total_amount: { type: Number, default: 0 },
        paid_amount: { type: Number, default: 0 },
        payment_date: { type: Date },
        payment_method: { type: String },
        transaction_id: { type: String },
      },
    ],

    tests: [
      {
        test_name: { type: String, required: true },
        reason: { type: String, required: true },
      },
    ],

    patient_education: { type: String, required: true },

    username: { type: String, required: true },
    admission : {type: String, required : true, default:"not-admitted"},

    status: {
      type: String,
      enum: ["pending", "dispatched"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Plan", PlanSchema);
