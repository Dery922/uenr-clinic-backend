import mongoose from "mongoose";

const ImagingSchema = mongoose.Schema({
  patient_id: {
    type: String,
    required: true,
  },
  patient_name: {
    type: String,
    required: true,
  },
  registration_date: {
    type: String,
    required: true,
  },
  image_type: {
    type: String,
    required: true,
  },
  findings: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  username : {
    type : String,
    required : true,
  },
}, {
  timestamps: true
});

const Imaging = mongoose.model("Imaging", ImagingSchema);
export default Imaging;
