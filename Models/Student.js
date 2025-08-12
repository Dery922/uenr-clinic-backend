import mongoose from "mongoose";

const StudentSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },

  email: {
    type: String,
    unique: true,
    required: [true, "Email address is required"],
  },

  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

export default mongoose.model("Student", StudentSchema);

