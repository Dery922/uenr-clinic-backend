import mongoose from "mongoose";

const QuickTestSchema = mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PatientSession",
    required: true,
  },
  
      patient_id :{
        type : String,
        required : true,
    },
      date : {
        type : String,
        required : true,
    },
      malaria :{
        type : String, 
        required: true,
    },
    covid : {
        type : String , 
        required : true
    },

    pregnancy : {
       type : String,
       required : true
    },
    username : {
        type : String,
        required : true,
    },

    search : [
      {
        user : {
            type : mongoose.Schema.ObjectId,
            ref : "User"
        }
      }
    ],
},
{
    timestamps : true,
});


export default mongoose.model('QuickTest', QuickTestSchema);