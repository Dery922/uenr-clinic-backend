import mongoose from "mongoose";


const MessageSchema = mongoose.Schema({
   senderId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "User",
     required: true
   },
   receiverId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "User",
     required: true
   },
   content: {
     type: String,
     required: true,
     trim: true
   },
   status: {
     type: String,
     enum: ['sent', 'delivered', 'read'],
     default: 'sent'
   },
   timestamp: {
     type: Date,
     default: Date.now,
     index: true // Add index for better query performance
   }
 }, {
   timestamps: true // Adds createdAt and updatedAt fields
 });

export default mongoose.model('Message', MessageSchema);