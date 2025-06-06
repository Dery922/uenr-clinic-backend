import mongoose from "mongoose";
import department from "../Models/Department.js";
const getDepartment = async (req, res) => {
     try {
        const departments = await department.find();
        res.status(200).json(departments)
     } catch (error) {
        res.status(404).json({error : error});
     }
}

const createDepartment =  async (req, res) => {
   const body = req.body;

   const newDepartment = new department({
      ...body
   });

   try {
    
       await newDepartment.save();
       res.status(201).json(newDepartment);
      
   } catch (error) {
       res.status(409).json({message:error.message})
   }
}

export {getDepartment, createDepartment}