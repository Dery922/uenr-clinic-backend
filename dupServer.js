import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import env from "dotenv/config";
import dashboard from "./Routes/index.js";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import Message from "./Models/Message.js";

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json({ limit: "32mb", extended: true }));
app.use(express.urlencoded({ limit: "32mb", extended: true }));
app.use(cors());
app.use('/', dashboard);

const PORT = process.env.PORT || 8080; // Added default port
const mongoURL = process.env.MONGO_URL || "mongodb://localhost:27017"; // Added env variable

//socket io connection

const io = new SocketIOServer(server, {
  cors :{
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User is connected to socket successfully');
});

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log("MongoDB connected successfully");
    
    // Use server.listen() instead of app.listen()
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Socket.IO available at ws://localhost:${PORT}/socket.io/`);
    });
  } catch (error) {
    console.error(`Connection to MongoDB failed: ${error}`);
    process.exit(1); // Exit if DB connection fails
  }
};

connectDB();

mongoose.connection.on("open", () => {
  console.log("Connection to database has been established!");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});