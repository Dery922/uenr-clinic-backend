import mongoose from "mongoose"

const AssessmentSchema = mongoose.Schema({
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PatientSession",
        required: true,
      },
      
    patient_id : {
        type: String
     },

     registration_date : {
         type : Date,
         required : [true, "date of entry is needed "]
     },

     differential_diagnosis :{
         type : String,
         required : true
     },

     working_diagnosis :{
        type : String,
        required : true
    },


 
    username :{
        type : String,
        required : true,
    },
}, {
    timestamps : true
});


export default mongoose.model("Assessment",AssessmentSchema)