import mongoose from "mongoose"

const WardSchema = mongoose.Schema({
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true,
      },
      
    patient_id : {
        type: String
     },

     registration_date : {
         type : Date,
         required : [true, "date of entry is needed "]
     },

     temperature :{
         type : Number,
         required : true
     },
     pulse :{
        type : Number,
        required : true
    },
    respiratory_rate :{
        type : Number,
        required : true
    },
    blood_pressure :{
        type : String,
        required : true
    },

    height :{
        type : Number,
        required : true
    },
    weight :{
        type : Number,
        required : true
    },
    note:{
        type:String,
    },
 
    username :{
        type : String,
        required : true,
    },
    status : {
       type : Number,
       default : 0,
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


export default mongoose.model("Ward",WardSchema )