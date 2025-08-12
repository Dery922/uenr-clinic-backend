import mongoose from "mongoose";

const PlanSchema = mongoose.Schema({
  patient_id: {
    type: String,
    required: true
  },
  patient_name: {
    type: String,
    required: true
  },
  registration_date: {
    type: Date,
    required: [true, "Date of entry is needed"]
  },

  // Multiple medications
  medications: [
    {
      medication_name: { type: String, required: true },
      dose: { type: String, required: true },
      frequency: { type: String, required: true }
    }
  ],

  // Multiple tests
  tests: [
    {
      test_name: { type: String, required: true },
      reason: { type: String, required: true }
    }
  ],

  // Patient education note
  patient_education: {
    type: String,
    required: true
  },

  // Doctor/Employee username
  username: {
    type: String,
    required: true
  },

  status : {
    type : String,
    default : "pending"
  },

  // Reference to patient (if needed)
  search: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: "Patient"
      }
    }
  ]
}, {
  timestamps: true
});

export default mongoose.model("Plan", PlanSchema);
