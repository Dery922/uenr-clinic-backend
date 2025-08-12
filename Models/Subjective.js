import mongoose from "mongoose"

const SubjectiveSchema = mongoose.Schema({
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

     complaint :{
         type : String,
         required : true
     },
     illness :{
        type : String,
        required : true
    },  
    review :{
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


export default mongoose.model("Subjective",SubjectiveSchema )