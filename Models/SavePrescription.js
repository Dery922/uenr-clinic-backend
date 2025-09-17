import mongoose from "mongoose";

const SavePrescriptionSchema = mongoose.Schema({
    patient :{
        type : String,
    
    },
    amount : {
        type : String,
     
    },
    registration_date :{
        type : String, 
        
    },
    dispense_by : {
        type : String , 

    },
    username: {
       type : String,
       required : [true, "Password is required"],
    },


},
{
    timestamps : true,
});


export default mongoose.model('SavePrescription', SavePrescriptionSchema);