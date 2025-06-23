import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    first_name :{
        type : String,
        required : [true, "First name is required"],
    },
    last_name : {
        type : String,
        required : [true, "Last name is required"],
    },
    username :{
        type : String, 
        required:[true, "Username is required"]
    },
    email : {
        type : String , 
        unique : true, 
        required:[true, "Email is required"],
    },
    password : {
       type : String,
       required : [true, "Password is required"],
    },
    phone : {
       type : String,
       required : [true, "Phone number is required"],
    },
    address :{
        type : String, 
    },
    role : {
        type : String,
        enum : ['Admin','Doctor', 'Nurse','Laboratorist', 'Pharmacist', 'Record', 'Accountants', 'Receptionist'],
        required : [true, "Role is required"],
    },
    search : [
      {
        user : {
            type : mongoose.Schema.ObjectId,
            ref : "User"
        }
      }
    ],
},
{
    timestamps : true,
});


export default mongoose.model('User', UserSchema);