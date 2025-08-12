import mongoose from "mongoose";

const RemoteAppointmentSchema = mongoose.Schema({
    name  : {
        type : String,
    },
    age  : {
        type : Number,
    },
    phone  : {
        type : Number,
    },
    gender  : {
        type : String,
    },
    symptons  : {
        type : String,
    },
    duration  : {
        type : String,
    },
    medication : {
        type : String
    },

    allergies : { 
        type : String,
        default : "No allergies"
    },
    location : {
        type : String,
    }
});

export default mongoose.model("RemoteAppointment", RemoteAppointmentSchema);