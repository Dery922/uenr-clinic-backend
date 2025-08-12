// models/Medication.js
import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 0 },   // Inventory stock
  unit: { type: String, required: true }, // e.g. "500mg"
  price : {type : Number, required : true},
  isCoveredByInsurance: { type: String, default: "No" },
  supplier : {type : String},
  expiryDate : {type : Date},
  createdAt: { type: Date, default: Date.now }
}); 

export default mongoose.model("Inventory", InventorySchema);
