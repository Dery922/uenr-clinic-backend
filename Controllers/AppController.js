import Student from "../Models/Student.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
dotenv.config(); 

const StudentLogin = async (req, res) => {


    const { email, password } = req.body;


    try {
      const user = await Student.findOne({ email: email.toLowerCase()  });
      if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
  
      const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: '1d'
      });
  
      res.json({ token, user: { id: user._id, password: user.password, email : user.email, username : user.name } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  console.log(req.body);

  try {
    const existing = await Student.findOne({ email: email.toLowerCase() });

    if (existing) {
      return res.status(400).json({ msg: "User already exists in the system" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const student = new Student({ name, email, password: hashed });
    await student.save();

    const token = jwt.sign({ id: student._id }, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });

 


    res.status(201).json({ token, student: { id: student._id, name, email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const RegisterStudent = async (req, res) => {

  try {
    const newStudentPatient = new StudentPatient(req.body);
    const saveStudentPatient = await newStudentPatient.save();
    res.status(201).json({message : "Student Patient save sucessfully", data : saveStudentPatient})
  } catch (error) {
    console.error("Error saving student patient:", error);
    res.status(500).json({ error: "Failed to save student patient" });
  }
 
}

export {RegisterStudent, StudentLogin, register };
