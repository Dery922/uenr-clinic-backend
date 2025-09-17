// models/Medication.js - Updated
import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    uppercase: true // Better for searching
  },
  quantity: { 
    type: Number, 
    default: 0,
    min: 0
  },
  unit: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  isCoveredByInsurance: { 
    type: Boolean, 
    default: false 
  },
  supplier: {
    type: String,
    trim: true
  },
  expiryDate: {
    type: Date,
    validate: {
      validator: function(date) {
        return date > new Date();
      },
      message: 'Expiry date must be in the future'
    }
  },
  category: {  // 👈 NEW: Add category for better filtering
    type: String,
    enum: ['medication', 'supplies', 'equipment'],
    default: 'medication'
  },
  minStockLevel: {  // 👈 NEW: For low stock alerts
    type: Number,
    default: 5
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}); 

// Add index for better search performance
InventorySchema.index({ name: 1, category: 1 });

export default mongoose.model("Inventory", InventorySchema);