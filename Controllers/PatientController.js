import { generatePatientID } from "../helpers/generatePatientID.js";
import sendFolderNum from "../helpers/sendFolderNum.js";
import pat from "../Models/Patient.js";
import nodemailler from "nodemailer";
import opdData from "../Models/OPDWard.js";
import Ward from "../Models/Ward.js"
import newLab from "../Models/BloodTest.js";
import newUrine from "../Models/UrineTest.js";
import newQuickTest from "../Models/QuickTest.js";
import PatientSession from "../Models/PatientSession.js";
import SavePrescription from "../Models/SavePrescription.js";

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
    res.status(401).json({message : error.message})
  }
};

const createPatientOPDRecord = async (req, res) => {
  try {
    const {
      session_id,
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

    // Save vitals
    const newVitals = await opdData({
      session: session_id,   // must be ObjectId
      patient: patient_id,   // custom string ID
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

    // Update session with vitals reference


    res.status(201).json(newVitals);
  } catch (error) {
    console.error("Error saving OPD record:", error);
    res.status(500).json({ message: "Failed to save OPD record" });
  }
};


const savePhamacyPrescribetion = async(req, res) => {
      console.log(req.body)
     try {
        const {patient, amount, registration_date,dispense_by,username} = req.body;
         const savePrescripetion = await new SavePrescription({
          patient, amount, registration_date,dispense_by,username
         }).save();

         res.status(200).json({message : "Prescription save successfully!"})
     } catch (error) {
       console.log(error)
     }
}



const getOpenSessionsWithPatients = async (req, res) => {
  try {
    const openSessions = await PatientSession.find({ status: "open" })
      .populate("patient_id"); // assuming you store patient ref in session
    res.json(openSessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPatientWardRecord = async (req, res) => {
  console.log(req.body)

  try {
    const {
      session,
      patient_id,
      registration_date,
      temperature,
      pulse,
      respiratory_rate,
      blood_pressure,
      height,
      weight,
      note,
      username,
      status,
    } = req.body;

    const newVitlas = new Ward({
      session,
      patient_id,
      registration_date,
      temperature,
      pulse,
      respiratory_rate,
      blood_pressure,
      height,
      weight,
      note,
      username,
      status,
    }).save();
    res.status(200).json(newVitlas);
  } catch (error) {}
};
const createPatientLabRecord = async (req, res) => {
  try {
    const {
      session_id,
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
      session_id,
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
      session,
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
      session,
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
      session_id,
      patient_id,
      date,
      malaria,
      covid,
      pregnancy,
      username,

    } = req.body;

    const data = new newQuickTest({
      session_id,
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

const Session = async (req, res) => {
  try {
    const session = await PatientSession.create({
      
      patient: req.body.patientId,
      patient_id : req.body.patient_id,
      doctor: req.body.doctorId,
      reasonForVisit: req.body.visitType, // map visitType → reasonForVisit
      admitted: req.body.admitted || false,
    });
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const getActiveSession = async (req, res) => {
  const sessions = await PatientSession.find({status:"open"})
    .populate("patient")
    .populate("doctor");
  res.json(sessions);
}

const sessionOpen = async (req, res) => {
  try {
    const openSessions = await PatientSession.find({ status: "open" }).populate("patient");
    res.json(openSessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
const sessionClose = async (req, res) => {
  console.log("Closing session ID:", req.params.id);

  try {  
    const session = await PatientSession.findByIdAndUpdate(
      req.params.id,
      { status: "closed", closedAt: new Date() },
      { new: true }
    );
    if(!session) return res.status(404).json({message : "Session not found!"})
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}




export { savePhamacyPrescribetion,getOpenSessionsWithPatients,getActiveSession,sessionClose,sessionOpen,Session,createPatientWardRecord,createPatientLabRecord, createPatientQuickTestRecord,
  createPatientLabUrineRecord
  ,createPatientRecord, createPatientOPDRecord };
