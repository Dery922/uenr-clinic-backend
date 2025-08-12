import mongoose from "mongoose";

const BloodTestResultSchema = new mongoose.Schema({
  parameter: { 
    type: String, 
    required: true,
    enum: ['hemoglobin', 'wbc', 'rbc', 'platelets', 'hct', 'mcv', 'glucose', 'creatinine'] 
  },
  result: { type: Number, required: true },
  unit: { 
    type: String, 
    required: true,
    enum: ['g/dL', '10^3/uL', '10^6/uL', '10^3/uL', '%', 'fL', 'mg/dL', 'umol/L'] 
  },
  normalRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    genderSpecific: {  // Optional gender-specific ranges
      male: { min: Number, max: Number },
      female: { min: Number, max: Number }
    }
  },
  flag: {
    type: String,
    enum: ['normal', 'low', 'high', 'critical'],
    default: 'normal'
  },
  notes: String,
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'LabTechnician' }
}, { _id: false });  // Embedded subdocument doesn't need its own ID

const BloodTestSchema = new mongoose.Schema({
  patient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient',
    required: true 
  },
  orderNumber: { type: String, unique: true },  
  collectionTime: { 
    type: Date,
    required: true 
  },
  collectionType: {
    type: String,
    enum: ['venous', 'capillary', 'arterial'],
    default: 'venous'
  },
  tubeType: {
    type: String,
    enum: ['EDTA', 'heparin', 'citrate', 'serum'],
    required: true
  },
  results: [BloodTestResultSchema],  // Array of test parameters
  status: {
    type: String,
    enum: ['collected', 'processing', 'completed', 'cancelled'],
    default: 'collected'
  },
  labNotes: String,
  createdAt: { type: Date, default: Date.now }
});

// Auto-generate order number
BloodTestSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const year = new Date().getFullYear();
    const random = Math.floor(100 + Math.random() * 900);
    this.orderNumber = `LAB-${year}-${random}`;
  }
  next();
});

module.exports = mongoose.model('BloodTest', BloodTestSchema);