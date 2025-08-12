import mongoose from "mongoose"

const AssessmentSchema = mongoose.Schema({
    patient_id : {
        type: String
     },
     patient_name : {
       type : String
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

         search : [
             {
                 patient : {
                     type : mongoose.Schema.ObjectId,
                     ref : "Patient"
                 }
             }
         ]
}, {
    timestamps : true
});


export default mongoose.model("Assessment",AssessmentSchema)