import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import dashboard from "./Routes/index.js";
import Message from "./Models/Message.js";
import messageHandler, { videoCallHandler } from "./socket/index.js";
import patientRoutes from "./Routes/patientRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const server = http.createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Setup Socket.IO with correct CORS
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ limit: "32mb", extended: true }));
app.use(cors());
app.use("/", dashboard);
app.use("/api/patients", patientRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

io.on("connection", (socket) => {
  messageHandler(socket, io); // this contains the join handler
  videoCallHandler(socket, io);

  // Doctor joins their "room" using their doctor_name
  socket.on("joinDoctor", (doctor_name) => {
    socket.join(doctor_name);
    console.log(`${doctor_name} joined their room`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// ✅ Connect to DB and start server
connectDB();

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
