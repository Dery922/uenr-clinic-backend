// models/PatientSession.js
import mongoose from "mongoose";

const patientSessionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,  
    ref: "Patient",
    required: true,
  },
  patient_id :{
    type : String,
    required : true,
  },
  patient_name : {
    type : String,
    default : null,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
 
  },
  reasonForVisit: { type: String },
  admitted: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ["open", "closed","admitted"], 
    default: "open" 
  },
  openedAt: { type: Date, default: Date.now },
  closedAt: { type: Date },
});

export default mongoose.model("PatientSession", patientSessionSchema);
