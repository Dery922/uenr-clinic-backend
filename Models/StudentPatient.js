import mongoose from "mongoose";

const StudentPatientSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Name is required"],
      },
    
      course : {
        type : String,
      },
    
      email: {
        type: String,
        unique: true,
        required: [true, "Email address is required"],
      },
      age : {
        type : Number,
      },
      gender : {
        type : String,
      },
      indexNumber : {
        type : String
      }
}, { timestamps : true});

export default mongoose.model("StudentPatient", StudentPatientSchema)