import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../Models/User.js";
import  {validateEmail, validateLength, validateUsername}  from "../helpers/validation.js";
import { generateToken } from "../helpers/tokens.js";

const getlogin = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        console.log(user);
        if(!user){
            return res.status(400).json({message : "email is not connected to an account"})
        }
        const check = await bcrypt.compare(password, user.password);
        if(!check){
            return res.status(400).json({
                message : "Invalid credentials, Please try again"
            })
        }

    } catch (error) {
        
    }
}; 

const createUser = async (req, res) => {
  try {
    const {
        first_name,
        last_name,
        username,
        email,
        password,
        role
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

   

      let tempname = first_name + last_name;
      const newUsername= await validateUsername(tempname);
   
      const user = await new User({
        first_name,
        last_name,
        username : newUsername,
        email,
        password : createdPassword, 
        role
      }).save();

      const emailVerificationToken = generateToken(
        {id : user._id.toString()},
        "30m"
    )

    console.log(emailVerificationToken)


  } catch (error) {
     res.status(500).json({message : error.message})
  }

}


export {getlogin, createUser};