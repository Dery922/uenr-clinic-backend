import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import env from "dotenv/config";
import dashboard from "./Routes/index.js";




const app = express();
app.use(bodyParser.json({limit:"32mb", extended : true}));
app.use(bodyParser.urlencoded({limit: "32mb", extended : true}));
app.use(cors());
app.use('/', dashboard);


const PORTS = process.env.PORT;
const mongoURL = "mongodb://localhost:27017"




const connectDB = async () => {
   try {
     await mongoose.connect(mongoURL);
     app.listen( PORTS, () => {
      console.log(`Server started on ${PORTS}`)
     })
   } catch (error) {
     console.log(`Connection to mongodb failed ${error}`);
   }
}



connectDB();
mongoose.connection.on("open", () => {
   console.log("Connection to database has been established!");
});
mongoose.connection.on("error" , (error) => {
  console.log(error)
});