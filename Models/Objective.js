import mongoose from "mongoose"

const ObjectiveSchema = mongoose.Schema({
    patient_id : {
        type: String
     },
     patient_name : {
        type : String,
     },
     registration_date : {
         type : Date,
         required : [true, "date of entry is needed "]
     },

     physical_examination :{
         type : String,
         required : true
     },
     cardiovascular :{
        type : String,
        required : true
    },
    heent :{
        type : String,
        required : true
    },

    respiratory :{
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


export default mongoose.model("Objective",ObjectiveSchema )