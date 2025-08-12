import { generatePatientID } from "../helpers/generatePatientID.js";
import sendFolderNum from "../helpers/sendFolderNum.js";
import pat from "../Models/Patient.js";
import nodemailler from "nodemailer";
import opdData from "../Models/OPDWard.js";
import Ward from "../Models/Ward.js"
import newLab from "../Models/BloodTest.js";
import newUrine from "../Models/UrineTest.js";
import newQuickTest from "../Models/QuickTest.js"

const createPatientRecord = async (req, res) => {
  const {
    created_by,
    first_name,
    last_name,
    email,
    date_of_birth,
    gender,
    age,
    insurance,
    insurance_number,
    patient_type,
    course_of_studies,
    address,
    phone,
  } = req.body;

  const id = await generatePatientID();

  const newPatient = await new pat({
    created_by,
    patient_id: id,
    first_name,
    last_name,
    email,
    date_of_birth,
    gender,
    age,
    insurance,
    insurance_number,
    patient_type,
    course_of_studies,
    address,
    phone,
  }).save();

  try {
    await newPatient.save();
    res.status(200).json(newPatient);

    sendFolderNum(email, id);
  } catch (error) {
    console.log(error);
    res.status(401).json({message : error.message})
  }
};

const createPatientOPDRecord = async (req, res) => {
  console.log(req.body);
  try {
    const {
      patient_id,
      registration_date,
      temperature,
      pulse,
      respiratory_rate,
      blood_pressure,
      height,
      weight,
      username,
      status,
    } = req.body;

    const newVitlas = new opdData({
      patient_id,
      registration_date,
      temperature,
      pulse,
      respiratory_rate,
      blood_pressure,
      height,
      weight,
      username,
      status,
    }).save();
    res.status(200).json(newVitlas);
  } catch (error) {}
};



const createPatientWardRecord = async (req, res) => {

  try {
    const {
      patient_id,
      registration_date,
      temperature,
      pulse,
      respiratory_rate,
      blood_pressure,
      height,
      weight,
      username,
      status,
    } = req.body;

    const newVitlas = new Ward({
      patient_id,
      registration_date,
      temperature,
      pulse,
      respiratory_rate,
      blood_pressure,
      height,
      weight,
      username,
      status,
    }).save();
    res.status(200).json(newVitlas);
  } catch (error) {}
};


const createPatientLabRecord = async (req, res) => {
  try {
    const {
      patient_id,
      date,
      hemoglobin,
      hemoglobin_flag,
      hemoglobin_notes,
      wbc_count,
      wbc_flag,
      wbc_notes,
      username,
    } = req.body;

    const data = new newLab({
      patient_id,
      date,
      hemoglobin,
      hemoglobin_flag,
      hemoglobin_notes,
      wbc_count,
      wbc_flag,
      wbc_notes,
      username,
    }).save();
    res.status(200).json(data);
  } catch (error) {}
};

const createPatientLabUrineRecord = async (req, res) => {
  try {
    const {
      patient_id,
      date,
      appearance,
      color,
      protein,
      glucose,
      notes1,
      notes2,
      username,
    } = req.body;

    const data = new newUrine({
      patient_id,
      date,
      appearance,
      color,
      protein,
      glucose,
      notes1,
      notes2,
      username,
    }).save();
    res.status(200).json(data);
  } catch (error) {}
};

const createPatientQuickTestRecord = async (req, res) => {
  try {
    const {
      patient_id,
      date,
      malaria,
      covid,
      pregnancy,
      username,

    } = req.body;

    const data = new newQuickTest({
      patient_id,
      date,
      malaria,
      covid,
      pregnancy,
      username,
    }).save();
    res.status(200).json(data);
  } catch (error) {}
};



export { createPatientWardRecord,createPatientLabRecord, createPatientQuickTestRecord,
  createPatientLabUrineRecord
  ,createPatientRecord, createPatientOPDRecord };
