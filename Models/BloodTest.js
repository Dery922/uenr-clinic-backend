import mongoose from "mongoose";

const BloodTestSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PatientSession",
    required: true,
  },
  
   patient_id : {
     type : String,
   },
   date : {
    type : String
   },
   hemoglobin : {
    type : Number,
    required : true,
   },
   hemoglobin_flag : {
     type : String,
     required : true
   },
    hemoglobin_notes : {
      type : String,
    },

    wbc_count :{
      type : Number,
      required : true,
    },
    wbc_flag : {
      type : String,
      required : true
    },

    wbc_notes : {
      type : String
    },

    username : {
      type : String,
      required : true,
    }



});

export default mongoose.model('BloodTest', BloodTestSchema);