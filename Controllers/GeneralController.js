import sendAppointmentTime from "../helpers/sendAppointmentTime.js";
import Appointment from "../Models/Appointment.js";
import Patient from "../Models/Patient.js";
import User from "../Models/User.js";
import OPDWard from "../Models/OPDWard.js";
import Objective from "../Models/Objective.js";
import { onlineUsers } from "../socket/onlineusers.js";
import Subjective from "../Models/Subjective.js";
import Assessment from "../Models/Assessment.js";
import Plan from "../Models/Plan.js";
import StudentPatient from "../Models/StudentPatient.js";
import BloodTest from "../Models/BloodTest.js";
import Inventory from "../Models/Inventory.js";

const getOnlineEmployees = async (req, res) => {
  try {
    const onlineUserIds = Array.from(onlineUsers.keys());

    const users = await User.find({ _id: { $in: onlineUserIds } });

    res.status(200).json(users);
  } catch (error) {
    console.error("Failed to fetch online users:", error);
    res.status(500).json({ error: "Server error" });
  }
};
const getAllEmployees = async (req, res) => {
  try {
    const allEmp = await User.find();
    res.status(200).json(allEmp);
  } catch (error) {
    console.log(error);
  }
};
const getOPDRecords = async (req, res) => {
  try {
    const patient = await OPDWard.find();
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOPDToDay = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today (00:00:00)

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1); // Start of next day (00:00:00)
  try {
    const result = await OPDWard.find({
      createdAt: {
        // Replace "createdAt" with your date field
        $gte: today, // Greater than or equal to today 00:00:00
        $lt: tomorrow, // Less than tomorrow 00:00:00
      },
    });
    res.status(200).json(result);
  } catch (error) {
    console.log("Internal server error", { error });
  }
};

const getTodayPrescription = async (req, res) => {
  const dateTo = new Date();
  dateTo.setHours(0, 0, 0, 0);
  const tomorrow = new Date(dateTo);
  tomorrow.setDate(tomorrow.getDate() + 1);
  try {
    const result = await Plan.find({
      createdAt: {
        $gte: dateTo,
        $lt: tomorrow,
      },
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const getDoctors = async (req, res) => {
  try {
  } catch (error) {}
};
const getPatients = async (req, res) => {
  try {
    const patient = await Patient.find();
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const editPatient = async (req, res) => {
  try {
    const patient = Patient.findById(req.params.id);
    if (!patient) res.status(201).json({ message: "Patient not found" });
    res.json(patient);
  } catch (error) {
    console.log(error);
  }
};
const updatePatient = async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAppointmens = async (req, res) => {
  try {
    const appointmentD = await Appointment.find();
    res.json(appointmentD);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createAppointment = async (req, res) => {
  try {
    const {
      patient_name,
      doctor_name,
      appointment_type,
      appointment_date,
      appointment_time,
      reason,
      email,
      phone,
      appointment_status,
    } = req.body;

    const firstAppoint = await new Appointment({
      patient_name,
      doctor_name,
      appointment_type,
      appointment_date,
      appointment_time,
      reason,
      email,
      phone,
      appointment_status,
    }).save();

    sendAppointmentTime(email, appointment_date, appointment_time);
    res.status(200).json(firstAppoint);
  } catch (error) {
    console.error("Appointment creation error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    await Appointment.findByIdAndDelete(id); // assuming Mongoose
    res.status(200).json({ message: "Appointment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting appointment" });
  }
};
const updateAppointment = async (req, res) => {};
const DoctorSubjective = async (req, res) => {
  try {
    const {
      patient_id,
      patient_name,
      registration_date,
      complaint,
      illness,
      review,
      username,
    } = req.body;

    const consult = await new Subjective({
      patient_id,
      patient_name,
      registration_date,
      complaint,
      illness,
      review,
      username,
    }).save();
    res.status(200).json(consult);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const UpdateSubjectiveConsultation = async (req, res) => {
  try {
    const { patientId } = req.params;

    const updatedOpdRecord = await OPDWard.findOneAndUpdate(
      { patientId: patientId, status: 0 },
      { $set: { status: 1, updatedAt: new Date() } },
      { new: true }
    );

    if (!updatedOpdRecord) {
      return res
        .status(404)
        .json({ error: "Patient not found in OPD or already completed" });
    }

    res.status(200).json(updatedOpdRecord);
  } catch (error) {
    console.error("Error updating OPD status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const DoctorObjective = async (req, res) => {
  try {
    const {
      patient_id,
      patient_name,
      registration_date,
      physical_examination,
      cardiovascular,
      heent,
      respiratory,
      username,
    } = req.body;

    const consult = await new Objective({
      patient_id,
      patient_name,
      registration_date,
      physical_examination,
      cardiovascular,
      heent,
      respiratory,
      username,
    }).save();
    res.status(200).json(consult);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const DoctorAssessment = async (req, res) => {
  try {
    const {
      patient_id,
      patient_name,
      registration_date,
      differential_diagnosis,
      working_diagnosis,
      username,
    } = req.body;

    const consult = await new Assessment({
      patient_id,
      patient_name,
      registration_date,
      differential_diagnosis,
      working_diagnosis,
      username,
    }).save();
    res.status(200).json(consult);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const createDoctorPlan = async (req, res) => {
  try {
    const newPlan = new Plan(req.body);
    const savedPlan = await newPlan.save();
    res
      .status(201)
      .json({ message: "Plan saved successfully", data: savedPlan });
  } catch (error) {
    console.error("Error saving plan:", error);
    res.status(500).json({ error: "Failed to save doctor's plan" });
  }
};

const getSOAPNotes = async (req, res) => {
  const { patientId } = req.params;

  try {
    // Fetch records from all SOAP models
    const [subjectives, objectives, assessments, plans] = await Promise.all([
      Subjective.find({ patient_id: patientId }).lean(),
      Objective.find({ patient_id: patientId }).lean(),
      Assessment.find({ patient_id: patientId }).lean(),
      Plan.find({ patient_id: patientId }).lean()
    ]);

    // If nothing was found at all
    if (
      subjectives.length === 0 &&
      objectives.length === 0 &&
      assessments.length === 0 &&
      plans.length === 0
    ) {
      return res.status(404).json({ message: "No records found for this patient" });
    }

    // Create a unified map based on unique registration_date
    const recordMap = new Map();

    const addToMap = (record, type) => {
      // const key = record.registration_date.toISOString();
     
            // Ensure registration_date is a Date object
            const registrationDate = record.registration_date instanceof Date 
            ? record.registration_date 
            : new Date(record.registration_date);
          
          // Use timestamp as key to avoid timezone issues
          const key = registrationDate.getTime();



      if (!recordMap.has(key)) {
        recordMap.set(key, {
          date: record.registration_date,
          patient_id: record.patient_id,
          patient_name: record.patient_name || "Unknown",
          doctor: record.username || "Unknown",
          subjective: "No subjective data",
          objective: {
            physical_examination: "Not recorded",
            cardiovascular: "Not recorded",
            heent: "Not recorded",
            respiratory: "Not recorded",
            vitals: {}
          },
          assessment: "No assessment recorded",
          plan: {
            medications: [],
            tests: [],
            patient_education: "No instructions",
            follow_up: "No follow-up planned",
            status: "pending"
          }
        });
      }

      const current = recordMap.get(key);

      if (type === "subjective") {
        current.subjective = record.complaint || current.subjective;
      } else if (type === "objective") {
        current.objective = {
          physical_examination: record.physical_examination || current.objective.physical_examination,
          cardiovascular: record.cardiovascular || current.objective.cardiovascular,
          heent: record.heent || current.objective.heent,
          respiratory: record.respiratory || current.objective.respiratory,
          vitals: record.vitals || current.objective.vitals,
        };
        current.doctor = record.username || current.doctor;
        current.patient_name = record.patient_name || current.patient_name;
      } else if (type === "assessment") {
        current.assessment = record.diagnosis || current.assessment;
      } else if (type === "plan") {
        current.plan = {
          medications: record.medications || [],
          tests: record.tests || [],
          patient_education: record.patient_education || "No instructions",
          follow_up: record.follow_up || "No follow-up planned",
          status: record.status || "pending",
        };
      }

      recordMap.set(key, current);
    };

    subjectives.forEach((rec) => addToMap(rec, "subjective"));
    objectives.forEach((rec) => addToMap(rec, "objective"));
    assessments.forEach((rec) => addToMap(rec, "assessment"));
    plans.forEach((rec) => addToMap(rec, "plan"));

    // Convert map to sorted array
    const unifiedNotes = Array.from(recordMap.values()).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    res.status(200).json(unifiedNotes);
  } catch (err) {
    console.error("Error fetching SOAP notes:", err);
    res.status(500).json({
      error: "Failed to fetch medical records",
      details: err.message,
    });
  }
};


const getTodayAppointments = async (req, res) => {

    try {
      // Get date in YYYY-MM-DD format
      const dateStr = req.query.date || new Date().toISOString().split('T')[0];
      
      // Direct match for string dates
      const appointments = await Appointment.find({
        appointment_date: dateStr
      });
  
      res.json(appointments || []);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    
};

const addInventory = async (req, res) => {
  try {
    const { name, quantity, unit,price ,isCoveredByInsurance, supplier,expiryDate } = req.body;

    const med = new Inventory({
      name,
      quantity,
      unit,
      price,
      isCoveredByInsurance,
      supplier,
      expiryDate,
    });

    await med.save();
    res.status(201).json({ message: "Medication added", med });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

const allInventory = async (req, res) => {
   try {
     const allInvent = await Inventory.find();
      console.log(allInvent)
     res.json(allInvent);
   } catch (error) {
     res.status(500).json({error : error.message})
   }
}

const getPatientMed = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    // Get today's start and end timestamps
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Find plans for this patient created today
    const plans = await Plan.find({
      patient_id: patientId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
    const asse = await Assessment.find({
      patient_id : patientId,
      createdAt : {$gte : startOfDay, $lte : endOfDay}
    })

    if (!plans || plans.length === 0 && (!asse || asse.length === 0)) {
      return res.status(404).json({ message: "No plans or diagnosis found for this patient today" });
    }
    
    res.status(200).json({
      plans: plans || [],
      assessment: asse || []
    });

  } catch (error) {
    console.error("Error fetching today’s patient plans:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }

}

const getOPDSession = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    // Get today's start and end timestamps
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Find plans for this patient created today
    const plans = await OPDWard.find({
      patient_id: patientId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
 
    
    res.status(200).json({
      plans:plans
    });
    console.log(plans)

  } catch (error) {
    console.error("Error fetching today’s patient plans:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }

}

export {
  getOPDSession,
  getPatientMed,
  addInventory,
  allInventory,
  getTodayAppointments,
  getSOAPNotes,
  getTodayPrescription,
  createDoctorPlan,
  UpdateSubjectiveConsultation,
  getOPDToDay,
  DoctorAssessment,
  DoctorObjective,
  DoctorSubjective,
  deleteAppointment,
  updateAppointment,
  getOnlineEmployees,
  getOPDRecords,
  updatePatient,
  editPatient,
  getAllEmployees,
  getDoctors,
  createAppointment,
  getPatients,
  getAppointmens,
};
