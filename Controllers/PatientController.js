import {generatePatientID} from "../helpers/generatePatientID.js"
import sendFolderNum from "../helpers/sendFolderNum.js"
import pat from "../Models/Patient.js"
import nodemailler from "nodemailer"

const createPatientRecord = async (req, res) => {
   
    const patient = req.body
    const {
      first_name,
      last_name,
      email,
      date_of_birth,
      gender,
      age,
      insurance,
      address,
      phone 
    } = req.body

    const id = await generatePatientID();

    const newPatient = await new pat({ 
             patient_id : id,
             first_name,
             last_name,
             email,
              gender, 
              age,
              insurance,
             date_of_birth,
              phone
        
    }).save();

  try {

    await newPatient.save();
    res.status(200).json(newPatient)

    sendFolderNum(email, id)
  } catch (error) {
    console.log(error)
  }

}



export {createPatientRecord}