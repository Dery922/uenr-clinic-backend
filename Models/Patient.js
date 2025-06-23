import mongoose from "mongoose";

const PatientSchema = mongoose.Schema({
    patient_id :{
       type: String, unique : true,
    },
    first_name : {
        type : String,
        required : [true, "First name is required"]
    },
    last_name : {
        type : String,
        required : [true, "Last name is required"]
    },
    email : {
        type : String,
        unique : true,
      
    },
    gender : {
        type : String,
        required : [true, "gender name is required"]
    },
    age : {
        type : Number,
        required : [true, "Age is required"]
    },
    patient_type :{
        type : String,
        required : true,
    },
    insurance : {
        type : String,
        required : [true, " Insurance policie is required"],
    },
    date_of_birth : {
        type : Date,
        required : [true, "your date of birth is needed"]
    },
    phone : {
        type : String,
        unique : true,
        required : [true, "phone number name is required"]
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