import mongoose from "mongoose";

const VisitSchema = new mongoose.Schema({
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true,
      },
      
    patient_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Patient',
        required : true
    }, 
    visit_date : {
        type : Date,
        default : Date.now
    },
    reason : {
        type : String,
        required : [true, "Reason for the visit is required"]
    },
    diagnosis : {
        type : String,
        required : [true, "Diagnosis is required"]
    },
    treatment : {
        type : String,
        required : [true, "Treatment detials is required"]
    },
    notes : {
        type : String
    },
    doctor : {
        type : String,
        required : [true, "Doctors name is required"]
    }
}, {
    timestamps : true
});

const Visit = mongoose.model('Visit', VisitSchema);

export default Visit;