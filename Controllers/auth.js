import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../Models/User.js";
import  {validateEmail, validateLength, validateUsername}  from "../helpers/validation.js";
import { generateToken } from "../helpers/tokens.js";


import multer from "multer";
import path from "path";
import sendUserDetails from "../helpers/sendUserDetails.js";

// Configure Multer to store files in "uploads/" directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g., "1234567890-123456789.jpg"
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, or GIF allowed!"), false);
    }
    cb(null, true);
  },
});
const getlogin = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({message : "User is not connected to an account"});
        }
        const check = await bcrypt.compare(password, user.password);
        if(!check){
            return res.status(400).json({
                message : "Invalid credentials, Please try again"
            })
        }
        const token = generateToken({id:user._id.toString()}, "7d");

        res.send(
          {
          id: user._id,
          username : user.username,
          first_name : user.first_name,
          last_name : user.last_name,
          email : user.email,
          phone : user.phone,
          address : user.address,
          profile_picture : user.profile_picture || "",
          role : user.role,
          token : token,
        }
      )

    } catch (error) {
        res.status(500).json({message : error.message });
    }
}; 

const createUser =  async  (req, res) => {

  try {
    const {
      first_name,
      last_name,
      username ,
      email,
      password,
      phone,
      department,
      specialization,
      license_number,
      joining_date,
      address,
      role,
      profile_picture,
      } = req.body;

      
      //validation logic start here
      if(!validateEmail(email)){
        return res.status(400).json({
            message : "Invalid email address"
        });
      };

      if(!validateLength(password, 8 ,40 )){
         return res.status(400).json({
            message : "Password length must be between 8 and 40 characters"
         })
      }
      const check = await User.findOne({email});
      if(check){
        return res.status(400).json({message : "The email already exist on the system"});
      }



      const createdPassword = await bcrypt.hash(password, 12);

      let tempname = username;
      const newUsername= await validateUsername(tempname);
   
      const user = await new User({
        first_name,
        last_name,
        username : newUsername,
        email,
        password : createdPassword, 
        phone,
        department,
        specialization,
        license_number,
        joining_date,
        address,
        role,
        profile_picture: req.file ? `/uploads/${req.file.filename}` : null, // Save file pat
      }).save();

       sendUserDetails(email, newUsername, password)

      res.send({
        id: user._id,
        usernmae : user.username,
        first_name : user.first_name,
        last_name : user.last_name,
        email : user.email,
        phone : user.phone,
        address : user.address,
        role : user.role,
        profile_picture : user.profile_picture,

      });
      res.status(200).json(user);

  } catch (error) {
     res.status(500).json({message : error.message})
  }
}
export {getlogin, createUser };