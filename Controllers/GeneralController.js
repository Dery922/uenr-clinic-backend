import Appointment from "../Models/Appointment.js";
import Patient from "../Models/Patient.js";
import User from "../Models/User.js"

const getEmployees = async (req, res) => {
  
    try {
        const allEmp = await User.find();
        res.status(200).json(allEmp);
    } catch (error) {
        res.status(500).json({error});
    }
}

const getDoctors = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}
const getPatients = async (req, res) => {
    try {
        const patient = await Patient.find();
        res.json(patient)
    } catch (error) {
        res.status(500).json({message : error.message})
    }
}

const createAppointment = async (req, res) => {
     try {
       const  {
            patient_name,
            doctor_name,
            appointment_type,
            appointment_date,
            appointment_time,
            reason,
            email,
            phone
        } = req.body;

        const firstAppoint = await new Appointment({
            patient_name,
            doctor_name,
            appointment_type,
            appointment_date,
            appointment_time,
            reason,
            email,
            phone
        }).save();

        res.status(200).json(firstAppoint);

     } catch (error) {
        console.error("Appointment creation error:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
     }
}


export {getEmployees, getDoctors, createAppointment,getPatients}