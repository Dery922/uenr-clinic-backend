import mongoose from "mongoose";
import Patient from "./Patient.js";
import User from "./User.js"


const AppointmentSchema = mongoose.Schema({

     appointment_id : {type :String},
   //   patient_id : {
   //      type : mongoose.Schema.Types.ObjectId,
   //      ref : Patient,
   //      required : true,
   //   },
   //   doctors_id : {
   //      type : mongoose.Schema.Types.ObjectId,
   //      ref : User,
   //      required : true,
   //   },
   patient_name : {
      type : String,
      required : true
   },
     doctor_name : {
        type : String,
        required : true,
     },

     appointment_type : {
      type : String
      },
     appointment_date : {
      type : String
     },
     appointment_time : {
      type : String
     },
     reason : {
      type : String
      },
     email : {
      type : String
     },
     phone : {
      type : String
      }

     

}, {
    timestamp : true
})
const Appointment = mongoose.model("Appointment", AppointmentSchema);
export default Appointment