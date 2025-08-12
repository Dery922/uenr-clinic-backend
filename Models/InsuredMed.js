import mongoose from "mongoose";

const PatientSchema = mongoose.Schema({
    created_by : {
        type : String,
    },

    name : {
        type : String,
    },
    insured : {
        type : String
    },
},{
    timestamps : true,
});

export default mongoose.model('Patient', PatientSchema);