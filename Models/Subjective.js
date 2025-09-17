import mongoose from "mongoose"

const SubjectiveSchema = mongoose.Schema({
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PatientSession",
        required: true,
      },
      
    patient : {
        type: String,
        required : true,
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

}, {
    timestamps : true
});


export default mongoose.model("Subjective",SubjectiveSchema )