import mongoose from "mongoose";
import Patient from "./Patient.js";
import User from "./User.js";

const StudentAppointmentSchema = mongoose.Schema(
  {
    hospital_id: {
      type: String,
      required: true,
    },

    email: {
      type: String,
    },
    patient_name: {
      type: String,
      required: true,
    },
  },
  {
    timestamp: true,
  }
);
const StudentAppointment = mongoose.model(
  "StudentAppointment",
  StudentAppointmentSchema
);
export default StudentAppointment;
