import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    doctor_name: {
      type : String,
      required: true,
    },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);
