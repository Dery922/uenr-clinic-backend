import env from "dotenv/config";
import mongoose from "mongoose";

const PORT = process.env.PORT || 8080; // Added default port

// const mongoURL = process.env.DATABASETECH || "mongodb://localhost:27017"; // Added env variable
console.log("🔍 Mongo URL being used:", process.env.DATABASETECH);


const mongoURL = process.env.DATABASETECH  // Added env variable



const connectDB = async () => {
    try {
      await mongoose.connect(mongoURL);
      console.log("MongoDB connected successfully");
      console.log("Mongoose Name", mongoose.connection.name);

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
      

    } catch (error) {
      console.error(`Connection to MongoDB failed: ${error}`);
      process.exit(1); // Exit if DB connection fails
    }
  };
  
  connectDB();
  


export default connectDB;
