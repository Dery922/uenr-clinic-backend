import jwt from "jsonwebtoken";
import { onlineUsers } from "./onlineusers.js";
import Message from "../Models/Message.js";
import mongoose from "mongoose";







const activeCalls = new Map(); // Track ongoing calls

// Add to your messageHandler.js or create a new file videoHandler.js


export const videoCallHandler = (socket, io) => {
  // Handle call initiation
  socket.on('initiate_call', ({ callerId, recipientId }) => {
    const callId = `call_${Date.now()}`;
    activeCalls.set(callId, {
      callerId,
      recipientId,
      status: 'ringing'
    });

    // Notify recipient
    const recipientSocket = onlineUsers.get(recipientId);
    if (recipientSocket) {
      io.to(recipientSocket).emit('incoming_call', {
        callId,
        callerId
      });
    }

    // Confirm to caller
    socket.emit('call_initiated', { callId });
  });

  // Handle call acceptance
  socket.on('accept_call', ({ callId, recipientId }) => {
    const call = activeCalls.get(callId);
    if (call && call.recipientId === recipientId) {
      call.status = 'active';
      activeCalls.set(callId, call);

      // Notify both parties
      const callerSocket = onlineUsers.get(call.callerId);
      const recipientSocket = onlineUsers.get(recipientId);

      if (callerSocket) {
        io.to(callerSocket).emit('call_accepted', { callId });
      }
      if (recipientSocket) {
        io.to(recipientSocket).emit('call_accepted', { callId });
      }
    }
  });

  // Handle ICE candidates
  socket.on('ice_candidate', ({ callId, candidate }) => {
    const call = activeCalls.get(callId);
    if (call) {
      const targetSocketId = socket.userId === call.callerId 
        ? onlineUsers.get(call.recipientId)
        : onlineUsers.get(call.callerId);
      
      if (targetSocketId) {
        io.to(targetSocketId).emit('ice_candidate', { callId, candidate });
      }
    }
  });

  // Handle offer/answer exchange
  socket.on('sdp_offer', ({ callId, offer }) => {
    const call = activeCalls.get(callId);
    if (call) {
      const recipientSocket = onlineUsers.get(call.recipientId);
      if (recipientSocket) {
        io.to(recipientSocket).emit('sdp_offer', { callId, offer });
      }
    }
  });

  socket.on('sdp_answer', ({ callId, answer }) => {
    const call = activeCalls.get(callId);
    if (call) {
      const callerSocket = onlineUsers.get(call.callerId);
      if (callerSocket) {
        io.to(callerSocket).emit('sdp_answer', { callId, answer });
      }
    }
  });

  // Handle call termination
  socket.on('end_call', ({ callId }) => {
    const call = activeCalls.get(callId);
    if (call) {
      const callerSocket = onlineUsers.get(call.callerId);
      const recipientSocket = onlineUsers.get(call.recipientId);

      if (callerSocket) io.to(callerSocket).emit('call_ended', { callId });
      if (recipientSocket) io.to(recipientSocket).emit('call_ended', { callId });

      activeCalls.delete(callId);
    }
  });
};







const messageHandler = (socket, io) => {






  // Join logic (auth and user mapping)
  socket.on("join", ({ token }) => {
    try {
      const user = jwt.verify(token, process.env.TOKEN_SECRET);
      socket.userId = user.id;
      onlineUsers.set(user.id, socket.id);

      console.log(`✅ User ${user.id} joined`);
      io.emit("online_users", Array.from(onlineUsers.keys()));

      socket.on("disconnect", () => {
        onlineUsers.delete(user.id);
        io.emit("online_users", Array.from(onlineUsers.keys()));
        console.log(`❌ User ${user.id} disconnected`);
      });
    } catch (error) {
      console.log("❌ Invalid token:", error.message);
    }
  });

  socket.on("send_message", async (data) => {
    console.log("📥 Incoming message:", {
      sender: data.senderId,
      receiver: data.receiverId,
      content: data.content?.length,
    });

    // 1. VALIDATION
    if (!data.senderId || !data.receiverId || !data.content) {
      console.error("❌ Missing fields");
      return socket.emit("message_error", "Missing required fields");
    }

    // 2. ID CONVERSION (critical fix)
    let senderId, receiverId;
    try {
      senderId = new mongoose.Types.ObjectId(data.senderId);
      receiverId = new mongoose.Types.ObjectId(data.receiverId);
    } catch (err) {
      console.error("⛔ Invalid ID format:", err);
      return socket.emit("message_error", "Invalid user ID format");
    }

    // 3. DB SAVE
    try {
      const newMessage = new Message({
        senderId,
        receiverId,
        content: data.content.trim(),
        status: "sent",
      });

      const savedMessage = await newMessage.save();
      console.log("💾 Saved to DB:", savedMessage._id);

      // 4. FORMAT RESPONSE
      const messageData = {
        _id: savedMessage._id.toString(),
        senderId: savedMessage.senderId.toString(),
        receiverId: savedMessage.receiverId.toString(),
        content: savedMessage.content,
        timestamp: savedMessage.createdAt,
        status: savedMessage.status,
      };
      const receiverSocket = onlineUsers.get(data.receiverId);
      // 5. DELIVERY
      // 5a. Confirm to sender
      // socket.emit("message_saved", messageData);
      // ✅ Emit to both users (sender and receiver)
      socket.emit("receive_message", messageData); // 👈 Send to sender
      if (receiverSocket) {
        io.to(receiverSocket).emit("receive_message", messageData); // 👈 Send to receiver
      }

      // 5b. Send to receiver
   
      if (receiverSocket) {
        console.log("📤 Delivering to:", receiverSocket);
        io.to(receiverSocket).emit("receive_message", messageData);
      } else {
        console.log("⚠️ Receiver offline");
      }
    } catch (err) {
      console.error("💥 Save failed:", err);
      socket.emit("message_error", "Database save failed");
    }
  });
};

export default messageHandler;
