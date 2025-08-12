import mongoose from "mongoose";

const PatientSchema = mongoose.Schema({
    created_by : {
        type : String,
    },
    patient_id :{
       type: String, unique : true,
    },

    name : {
        type : String,
    },
    category : {
        type : String
    },



    search : [
        {
            patient : {
                type : mongoose.Schema.ObjectId,
                ref : "Patient"
            }
        }
    ]
},{
    timestamps : true,
});

export default mongoose.model('Patient', PatientSchema);