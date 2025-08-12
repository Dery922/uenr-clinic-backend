import mongoose from "mongoose";

const DoctorScheduleSchema = mongoose.Schema({
    doctor_name : {
        type : String,
    },
    available_days :{
       type: String
    },

    start_time : {
        type : String,
    },
    end_time : {
        type : String,
    },
    message : {
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

export default mongoose.model('DoctorSchedule', DoctorScheduleSchema);