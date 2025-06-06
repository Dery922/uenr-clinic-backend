import mongoose from "mongoose";

const DepartmentSchema = mongoose.Schema({
    name : {type : String, required : true},
    status : {type : String, required : true},
});

export default mongoose.model("Department", DepartmentSchema);