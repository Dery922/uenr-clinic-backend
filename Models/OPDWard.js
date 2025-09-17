import mongoose from "mongoose";

const OPDSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PatientSession",
      required: true,
    },

    patient: {
        type: String,  
        required: true,
      },

    registration_date: {
      type: Date,
      required: [true, "Date of entry is needed"],
    },

    temperature: {
      type: Number,
      required: true,
    },
    pulse: {
      type: Number,
      required: true,
    },
    respiratory_rate: {
      type: Number,
      required: true,
    },
    blood_pressure: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },

    username: {
      type: String,
      required: true,
    },

    status: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("OPDWard", OPDSchema);
