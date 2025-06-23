import {Router} from "express";
import { getDashboard } from "../Controllers/dashboard.js";
import { getDepartment } from "../Controllers/department.js";
import { createDepartment } from "../Controllers/department.js";
import { createUser, getlogin } from "../Controllers/auth.js";
import {  createPatientRecord } from "../Controllers/PatientController.js";
import { createAppointment, getDoctors, getEmployees, getPatients } from "../Controllers/GeneralController.js";

const router = Router();

router.get("/", getDashboard);
router.get("/departments",getDepartment);
router.get("/api/getEmployees", getEmployees);
router.get("/api/getDoctors", getDoctors);
router.get("/api/getPatients", getPatients);


router.post("/create/departments", createDepartment);
router.post("/login", getlogin);
router.post("/createUser", createUser);
router.post("/create-patient-record", createPatientRecord);
router.post("/create-appointment", createAppointment);




export default router;