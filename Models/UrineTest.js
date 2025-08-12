import mongoose from "mongoose";

const UrineTestSchema = new mongoose.Schema({
   patient_id : {
     type : String,
   },
   date : {
    type : String
   },
   appearance : {
    type : String,
    required : true,
   },
    color : {
     type : String,
     required : true
   },
     protein : {
      type : String,
    },

      glucose :{
      type : String,
      required : true,
    },
      notes1 : {
      type : String,
       default : null,
    },

     notes2 : {
      type : String,
      default : null,
    },

    username : {
      type : String,
      required : true,
    }



});

export default mongoose.model('UrineTest', UrineTestSchema);