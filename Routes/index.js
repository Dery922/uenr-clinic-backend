import {Router} from "express";
import { getDepartment } from "../Controllers/department.js";
import { createDepartment } from "../Controllers/department.js";
import { createUser, getlogin } from "../Controllers/auth.js";
import { createPatientLabRecord, createPatientLabUrineRecord, createPatientQuickTestRecord, createPatientRecord, createPatientWardRecord} from "../Controllers/PatientController.js";
import {createPatientOPDRecord} from "../Controllers/PatientController.js";
import Message from "../Models/Message.js";
import { 
  UpdateSubjectiveConsultation,
  createAppointment, 
  getDoctors,getAppointmens, 
  getOnlineEmployees, 
  getPatients, getAllEmployees, 
  editPatient,
  deleteAppointment,
  getOPDRecords,
  updatePatient,
  updateAppointment,
  DoctorSubjective,
  DoctorObjective,
  DoctorAssessment,
  getOPDToDay,
  createDoctorPlan,
  getTodayPrescription,
  getSOAPNotes , getTodayAppointments,
  addInventory,
  getPatientMed,
  allInventory,
  getOPDSession} from "../Controllers/GeneralController.js";
import upload from "./upload.js";
import Imaging from "../Models/Imaging.js";
import { register, RegisterStudent, StudentLogin } from "../Controllers/AppController.js";

import OPDWard from "../Models/OPDWard.js";
import { allOutPatients, allPatients, allStudentsPatients, allUsers, getGenderDistribution, getMonthlyPatientStats } from "../Controllers/DashboardController.js";
const router = Router();



//dashbaord routes here

router.get("/api/dashboard/all-users", allUsers);
router.get("/api/dashboard/all-patients", allPatients);
router.get("/api/dashboard/all-patients-students", allStudentsPatients);
router.get("/api/dashboard/all-out-patients", allOutPatients);
router.get("/api/patients/monthly-patient-stats", getMonthlyPatientStats);
router.get("/api/patients/gender-distribution", getGenderDistribution);



//pharmacy
router.get("/pharmacy/prescription/:patientId", getPatientMed);

router.get("/opd-session-view/:patientId", getOPDSession);


// router.get("/", getDashboard);
router.get("/departments",getDepartment);
router.get("/api/online-users", getOnlineEmployees);
router.get("/api/getDoctors", getDoctors);
router.get("/api/getPatients", getPatients);
router.get("/api/getPatients/opd-records",getOPDRecords);
router.get("/api/getAppointments", getAppointmens);
router.get("/api/getEmployees",getAllEmployees);
router.get("/api/edit-patients/:id", editPatient);
router.put("/api/edit-patients/:id", updatePatient);
// router.get("/api/patients/search", searchPatientRecord);
router.get("/api/all-patient-record-opd-today",getOPDToDay);
router.get("/api/all-patients-prescription",getTodayPrescription);
router.get("/api/patients/:patientId/medical-records", getSOAPNotes);
router.get("/api/pending-appointments", getTodayAppointments);


router.post("/create-patient-laptest-record", createPatientLabRecord);
router.post("/create-patient-laptest-urine-record", createPatientLabUrineRecord)
router.post("/create-patient-laptest-quicktest-record", createPatientQuickTestRecord)
//routes for mobile version
router.post("/api/student-registration",register);
router.post("/api/student-login", StudentLogin);
// router.patch("/api/complete/:patientId", UpdateSubjectiveConsultation)

//inventory
router.post("/api/add-inventory", addInventory);
router.get("/api/all-inventory", allInventory);


router.post("/api/doctor-subjective",DoctorSubjective);
router.post("/api/doctor-objective",DoctorObjective);
router.post("/api/doctor-assessment", DoctorAssessment);

//end of mobile routes here

router.post("/api/students-patient-registration", RegisterStudent)

router.post("/create/departments", createDepartment);
router.post("/login", getlogin);
router.post("/createUser", upload.single("profile_picture"), createUser);
router.post("/create-patient-record", createPatientRecord);
router.post("/create-patient-opdward-record", createPatientOPDRecord );
router.post("/create-patient-ward-record",  createPatientWardRecord);
router.post("/create-appointment", createAppointment);
router.delete("/delete-appointment/:id", deleteAppointment);
router.put("/update-appointment/:id", updateAppointment);
router.post("/api/doctor-plan", createDoctorPlan);






// GET /api/messages/:senderId/:receiverId
router.get("/messages/:senderId/:receiverId", async (req, res) => {
  console.log("📡 Fetch messages API hit:", req.params);
  try {
    const { senderId, receiverId } = req.params;
    
    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(senderId) || 
        !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ error: "Invalid user IDs" });
    }

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    })
    .sort({ timestamp: 1 })
    .lean(); // Convert to plain objects

    // Convert ObjectIds to strings for client
    const formattedMessages = messages.map(msg => ({
      ...msg,
      _id: msg._id.toString(),
      senderId: msg.senderId.toString(),
      receiverId: msg.receiverId.toString(),
      timestamp: msg.timestamp.toISOString()
    }));

    res.json(formattedMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});


//
router.patch('/api/opd/complete/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const updatedOpdRecord = await OPDWard.findOneAndUpdate(
      { patient_id: patientId, status: 0 }, // Find by patientId and status 0
      { 
        $set: { 
          status: 1, // Update status to 1 (complete)
          updatedAt: new Date() 
        } 
      },
      { new: true } // Return updated document
    );

    if (!updatedOpdRecord) {
      return res.status(404).json({ 
        error: "Patient not found in OPD or already completed" 
      });
    }

    res.status(200).json(updatedOpdRecord);
  } catch (error) {
    console.error("Error updating OPD status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/api/imaging", upload.single("image"), async (req, res) => {
  try {
    const { patient_id, patient_name, registration_date, image_type, findings, username } = req.body;
    const filePath = req.file?.path;

    if (!filePath) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const newImaging = new Imaging({
      patient_id,
      patient_name,
      registration_date,
      image_type,
      findings,
      username,
      image: filePath,
    });

    await newImaging.save();
    res.status(201).json({ message: "Imaging result saved", data: newImaging });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
  


export default router;