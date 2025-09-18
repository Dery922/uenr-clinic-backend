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
import PatientSession from "../Models/PatientSession.js";
import FinancialRecord from "../Models/FinancialRecord.js";
import Notification from "../Models/Notification.js";
import { io } from "../server.js";
import UrineTest from "../Models/UrineTest.js";
import Ward from "../Models/Ward.js";


import QuickTest from "../Models/QuickTest.js";
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
    const patient = await OPDWard.find().sort({createdAt : -1});
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all patients who are in session
// Get all patients who are in session, sorted by most recent
const getOPDToDay = async (req, res) => {
  try {
    const opds = await OPDWard.find()
      .populate({
        path: "session",
        match: { status: "open" },
      })
      .sort({ createdAt: -1 }); // Sort by most recently created first

    // Filter OPDs that actually have an open session
    const filteredOpds = opds.filter((opd) => opd.session !== null);

    res.status(200).json(filteredOpds);
    console.log(filteredOpds);
  } catch (error) {
    console.error("Internal server error", error);
    res.status(500).json({ error: "Internal server error" });
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

    const newAppointment = await new Appointment({
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

    // Save notification to DB
    await new Notification({
      doctor_name,
      message: `New appointment: ${patient_name} on ${appointment_date} at ${appointment_time}`,
      read: false,
    }).save();

    // Send email confirmation
    sendAppointmentTime(email, appointment_date, appointment_time);

    // // Emit real-time event if doctor is online
    // io.emit(`appointment:${doctor_name}`, {
    //   message: `New appointment for you: ${patient_name} on ${appointment_date} at ${appointment_time}`,
    //   appointment: newAppointment,
    // });

    io.to(doctor_name).emit("newNotification", {
      message: `New appointment for you: ${patient_name} on ${appointment_date} at ${appointment_time}`,
      appointment: newAppointment,
    });

    res.status(200).json(newAppointment);
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
      session_id,
      patient_id,
      registration_date,
      complaint,
      illness,
      review,
      username,
    } = req.body;

    const consult = await new Subjective({
      session: session_id, // FIXED
      patient: patient_id,
      registration_date,
      complaint,
      illness,
      review,
      username,
    }).save();

    res.status(200).json(consult);
  } catch (error) {
    console.error(error); // <-- Log actual error for debugging
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
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
  console.log(req.body)
  try {
    const {
      session_id,
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
      session: session_id,
      patient_id: patient_id,
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
      session_id,
      patient_id,
      patient_name,
      registration_date,
      differential_diagnosis,
      working_diagnosis,
      username,
    } = req.body;

    const consult = await new Assessment({
      session: session_id,
      patient_id: patient_id,
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

// GET /api/pharmacy/prescriptions
const getPendingPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Plan.find({
      "medications.dispense_status": "pending", // Match your schema
    })
      .populate("session") // Optional: populate session if needed
      .exec();

    res.json(prescriptions);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch prescriptions" });
  }
};

// PATCH /api/pharmacy/dispense/:id - CORRECTED VERSION
const markAsDispensed = async (req, res) => {
  try {
    const { planId } = req.params;
    const { pharmacist_username, drugIndex } = req.body;

    console.log("Dispense request:", {
      planId,
      pharmacist_username,
      drugIndex,
    });

    // Validate required fields
    if (!pharmacist_username) {
      return res.status(400).json({ error: "Pharmacist username is required" });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    if (!plan.medications || drugIndex >= plan.medications.length) {
      return res.status(400).json({ error: "Invalid medication index" });
    }

    const medication = plan.medications[drugIndex];

    // CHECK PAYMENT STATUS BEFORE DISPENSING
    if (
      !medication.covered_by_insurance &&
      medication.payment_status !== "paid"
    ) {
      return res.status(402).json({
        error: "Payment required before dispensing",
        details: {
          medication: medication.medication_name,
          amount: medication.amount,
          balance: medication.amount - (medication.paid_amount || 0),
          payment_status: medication.payment_status,
        },
        requires_payment: true,
      });
    }

    // Check if already dispensed
    if (medication.dispense_status === "completed") {
      return res.status(400).json({ error: "Medication already dispensed" });
    }

    // UPDATE INVENTORY STOCK (if medication came from inventory)
    if (medication.inventory_id) {
      await Inventory.findByIdAndUpdate(medication.inventory_id, {
        $inc: { quantity: -medication.quantity },
      });
    }

    // Update medication status
    medication.dispense_status = "completed";
    medication.dispensed_by = pharmacist_username;
    medication.dispensed_at = new Date();

    // Check if all medications are dispensed
    const allDispensed = plan.medications.every(
      (med) => med.dispense_status === "completed"
    );

    if (allDispensed) {
      plan.status = "dispatched";
    }

    await plan.save();

    res.json({
      success: true,
      message: "Medication dispensed successfully",
      updatedPlan: plan,
    });
  } catch (error) {
    console.error("Dispense error:", error);
    res.status(500).json({ error: "Failed to dispense medication" });
  }
};

const unpaidMedications = async(req,res) => {
   
     try {
        const getUnpaid = await Plan.find({
          "medications.payment_status": "pending",
     })

     res.status(200).json(getUnpaid)
     } catch (error) {
       res.status(404).json(error)
     }
}

// Process payment for medication
const processMedicationPayment = async (req, res) => {
  try {
    const {
      planId,
      drugIndex,
      amount_paid,
      payment_method,
      transaction_id,
      cashier_username,
    } = req.body;

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    const medication = plan.medications[drugIndex];
    if (!medication) {
      return res.status(404).json({ error: "Medication not found" });
    }

    // Calculate payment details
    const totalAmount = medication.amount;
    const paidAmount = amount_paid;
    const balance = totalAmount - paidAmount;

    // Update medication payment status
    medication.paid_amount = (medication.paid_amount || 0) + paidAmount;

    if (balance <= 0) {
      medication.payment_status = "paid";
      medication.payment_date = new Date();
      medication.payment_method = payment_method;
      medication.transaction_id = transaction_id;
    } else {
      medication.payment_status = "partial";
    }

    // Create financial record
    const financialRecord = new FinancialRecord({
      patient_id: plan.patient,
      patient_name: plan.patient_name,
      plan_id: planId,
      medication_index: drugIndex,
      medication_name: medication.medication_name,
      amount: totalAmount,
      covered_by_insurance: medication.covered_by_insurance,
      payment_status: medication.payment_status,
      paid_amount: paidAmount,
      balance: balance,
      payment_date: new Date(),
      payment_method: payment_method,
      transaction_id: transaction_id,
      created_by: cashier_username,
      department: "pharmacy",
    });

    await financialRecord.save();
    await plan.save();

    res.json({
      success: true,
      message: "Payment processed successfully",
      payment_status: medication.payment_status,
      balance: balance,
      financial_record: financialRecord,
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({ error: "Failed to process payment" });
  }
};

const createDoctorPlan = async (req, res) => {
  try {
    const {
      session,
      patient, // MRN (string)
      patient_name,
      registration_date,
      patient_education,
      username,
      medications = [],
      tests = [],
      admission
    } = req.body;

    // Basic validation (fast feedback)
    if (
      !session ||
      !patient ||
      !patient_name ||
      !registration_date ||
      !username
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Normalize date
    const regDate = new Date(registration_date);

    // Normalize medications and set statuses
    const normalizedMeds = medications.map((m) => {
      const covered = !!m.covered_by_insurance;
      return {
        medication_name: m.medication_name,
        dose: m.dose,
        frequency: m.frequency,
        covered_by_insurance: covered,
        amount: Number(m.amount || 0),
        payment_status: covered ? "not_required" : "pending",
        dispense_status: "pending",
      };
    });

    const plan = await Plan.create({
      session,
      patient,
      patient_name,
      registration_date: regDate,
      patient_education,
      username,
      medications: normalizedMeds,
      tests,
      status: "pending",
      admission:"not-admitted"
    });

    return res
      .status(201)
      .json({ message: "Plan saved successfully", data: plan });
  } catch (error) {
    console.error("Error saving plan:", error);
    return res.status(500).json({ error: "Failed to save doctor's plan" });
  }
};



 const processPayment = async (req, res) => {
  try {
    const {
      bills, // array of { planId, drugIndex, amount_paid }
      total_amount,
      payment_method,
      transaction_id,
      cashier_username,
    } = req.body;

    if (!bills || bills.length === 0) {
      return res.status(400).json({ message: "No bills provided" });
    }

    const results = [];

    for (const bill of bills) {
      const plan = await Plan.findById(bill.planId);
      if (!plan) continue;

      const drug = plan.medications[bill.drugIndex];
      if (!drug) continue;

      // Update payment info in Plan.medications
      drug.paid_amount += bill.amount_paid;
      drug.payment_status =
        drug.paid_amount >= drug.total_amount ? "paid" : "partial";
      drug.payment_date = new Date();
      drug.payment_method = payment_method;
      drug.transaction_id = transaction_id;

      await plan.save();

      // Create a financial record entry
      const record = await FinancialRecord.create({
        session: plan.session,
        patient_id: plan.patient,
        patient_name: plan.patient_name,
        plan_id: plan._id,
        medication_index: bill.drugIndex,
        medication_name: drug.medication_name,
        amount: drug.total_amount,
        covered_by_insurance: drug.covered_by_insurance,
        payment_status: drug.payment_status,
        paid_amount: drug.paid_amount,
        balance: Math.max(drug.total_amount - drug.paid_amount, 0),
        payment_date: new Date(),
        payment_method,
        transaction_id,
        created_by: cashier_username,
      });

      results.push(record);
    }

    res.status(200).json({
      message: "Payment processed successfully",
      total_amount,
      records: results,
    });
  } catch (error) {
    console.error("Payment error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSOAPNotes = async (req, res) => {

  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    // Fetch all related data in parallel
    const [assessments, subjectives, objectives, plans,bloodtest,urinetest] = await Promise.all([
      Assessment.find({ patient_id: patientId }).sort({ registration_date: -1 }).lean(),
      Subjective.find({ patient_id: patientId }).sort({ createdAt: -1 }).lean(),
      Objective.find({ patient_id: patientId }).sort({ createdAt: -1 }).lean(),
      Plan.find({ patient: patientId }).sort({ createdAt: -1 }).lean(),
      BloodTest.find({patient_id:patientId}).sort({ createdAt: -1 }).lean(),
      UrineTest.find({patient_id:patientId}).sort({ createdAt: -1 }).lean(),
    ]);



   


    // Structure the response by tabs
    res.status(200).json({
      patientId,
      history: assessments.map((a) => ({
        id: a._id,
        date: a.registration_date,
        working_diagnosis: a.working_diagnosis,
        differential_diagnosis: a.differential_diagnosis,
        recorded_by: a.username,
      })),
      soapNotes: assessments.map((a, i) => ({
        id: a._id,
        date: a.registration_date,
        doctor: a.username,
        subjective: subjectives[i]?.note || "",
        objective: objectives[i] || {},
        assessment: a.working_diagnosis,
        plan: plans[i] || {},
      })),
     
        bloodhistory: bloodtest.map((a) => ({
          id: a._id,
          patient: a.patient_id,
          date: a.date,
          hemoglobin: a.hemoglobin,
          hemoglobin_notes: a.hemoglobin_notes,
          wbc_count: a.wbc_count,
          wbc_flag: a.wbc_flag,
          recorded_by: a.username,
        })),
        urinetest: urinetest.map((a) => ({
          id: a._id,
          patient: a.patient_id,
          date: a.date,
          appearance: a.appearance,
          hemoglobin_notes: a.hemoglobin_notes,
          color: a.color,
          wbc_flag: a.wbc_flag,
          recorded_by: a.username,
        })),

       
      prescriptions: plans.map((p) => ({
        id: p.patient,
        date: p.registration_date,
        patient_name :p.patient_name,
        recorded_by: p.username,
        medications: p.medications?.map((m) => ({
          name: m.medication_name,
          dose: m.dose,
          frequency: m.frequency,
          status: m.dispense_status,
        })) || [],
      })),
      
      
      imaging: [], // <-- imaging model later
    });
  } catch (error) {
    console.error("Error fetching patient medical history:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }

};

const getTodayAppointments = async (req, res) => {
  try {
    // Get date in YYYY-MM-DD format
    const dateStr = req.query.date || new Date().toISOString().split("T")[0];

    // Direct match for string dates
    const appointments = await Appointment.find({
      appointment_date: dateStr,
    });

    res.json(appointments || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchMedication = async (req, res) => {
  try {
    const { query, category } = req.query;

    console.log("Search request received:", { query, category });

    // Build search filter correctly
    let searchFilter = {};

    // Only apply quantity filter if we're not searching (shows all available)
    // OR apply it always to only show available items
    searchFilter.quantity = { $gt: 0 }; // Show only items with stock

    if (query && query.trim() !== "") {
      // FIX: Proper regex search - escape special characters
      searchFilter.name = {
        $regex: query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      };
    }

    if (category && category !== "all" && category !== "") {
      searchFilter.category = category;
    }

    console.log("Final search filter:", JSON.stringify(searchFilter, null, 2));

    const medications = await Inventory.find(searchFilter)
      .select("name quantity unit price isCoveredByInsurance category")
      .sort({ name: 1 })
      .limit(20); // Increased limit for better testing

    console.log("Found medications:", medications.length);

    res.json(medications);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update addInventory to handle category
const addInventory = async (req, res) => {
  try {
    const {
      name,
      quantity,
      unit,
      price,
      isCoveredByInsurance,
      supplier,
      expiryDate,
      category,
    } = req.body;
    console.log("Received data:", req.body); // 👈 Add this for debugging
    const med = new Inventory({
      name: name.toUpperCase(), // Standardize
      quantity,
      unit,
      price,
      isCoveredByInsurance: isCoveredByInsurance === "Yes",
      supplier,
      expiryDate,
      category,
    });

    await med.save();
    res.status(201).json({ message: "Medication added", med });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Backend route for medication search
// router.get('/api/inventory/search', async (req, res) => {
//   try {
//     const { query, category } = req.query;

//     let searchFilter = {
//       quantity: { $gt: 0 } // Only show available medications
//     };

//     if (query) {
//       searchFilter.name = { $regex: query, $options: 'i' };
//     }

//     if (category) {
//       searchFilter.category = category;
//     }

//     const medications = await Inventory.find(searchFilter)
//       .select('name quantity unit price isCoveredByInsurance category')
//       .sort({ name: 1 })
//       .limit(10);

//     res.json(medications);
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });
const allInventory = async (req, res) => {
  try {
    const allInvent = await Inventory.find();
    console.log(allInvent);
    res.json(allInvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPatientMed = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({ message: "Patient ID is required" });
    }
    const plans = await Plan.find({
      patient: patientId,
      status:"pending"
    
    });
    const asse = await Assessment.find({
      patient_id: patientId,
 
    });

    if (!plans || (plans.length === 0 && (!asse || asse.length === 0))) {
      return res
        .status(404)
        .json({
          message: "No plans or diagnosis found for this patient today",
        });
    }

    res.status(200).json({
      plans: plans || [],
      assessment: asse || [],
    });
  } catch (error) {
    console.error("Error fetching today’s patient plans:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getPatientLabHistory = async (req,res) => {
  try {
    const { id } = req.params;
 

    if (!id) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    // Fetch all related data in parallel
    const [bloodtests, urinetests, quicktests,] = await Promise.all([
      BloodTest.find({ patient_id: id }).sort({ registration_date: -1 }).lean(),
      UrineTest.find({ patient_id: id }).sort({ createdAt: -1 }).lean(),
      QuickTest.find({ patient_id: id }).sort({ createdAt: -1 }).lean(),
   
    ]);

   

   


    // Structure the response by tabs

    
    res.status(200).json({
      id,
      bloodhistory: bloodtests.map((a) => ({
        id: a._id,
        patient: a.patient_id,
        date: a.date,
        hemoglobin: a.hemoglobin,
        hemoglobin_notes: a.hemoglobin_notes,
        wbc_count: a.wbc_count,
        wbc_flag: a.wbc_flag,
        recorded_by: a.username,
      })),
      urinetest: urinetests.map((a) => ({
        id: a._id,
        patient: a.patient_id,
        date: a.date,
        appearance: a.appearance,
        hemoglobin_notes: a.hemoglobin_notes,
        color: a.color,
        wbc_flag: a.wbc_flag,
        recorded_by: a.username,
      })),

    });
 

 




      // soapNotes: assessments.map((a, i) => ({
      //   id: a._id,
      //   date: a.registration_date,
      //   doctor: a.username,
      //   subjective: subjectives[i]?.note || "",
      //   objective: objectives[i] || {},
      //   assessment: a.working_diagnosis,
      //   plan: plans[i] || {},
      // })),
      // labs: [], // <-- you’ll plug in Lab model later
      // prescriptions: plans.map((p) => ({
      //   id: p.patient,
      //   date: p.registration_date,
      //   patient_name :p.patient_name,
      //   recorded_by: p.username,
      //   medications: p.medications?.map((m) => ({
      //     name: m.medication_name,
      //     dose: m.dose,
      //     frequency: m.frequency,
      //     status: m.dispense_status,
      //   })) || [],
      // })),
      
   

  } catch (error) {
    console.error("Error fetching patient medical history:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const getOPDSessionView = async (req, res) => {
  try {
    const { patientId } = req.params;
    if (!patientId) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    const patientVitals = await OPDWard.findById(patientId).populate("session");

    if (!patientVitals) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patientVitals);

  } catch (error) {
    console.error("Error fetching patient vitals:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllPatientRecordWard = async (req, res) => {
   try {
    const respose = await Ward.find().sort({createdAt : - 1});
    res.status(200).json(respose);
   } catch (error) {
     console.log(error)
   }
}



export {
  processPayment,
  getAllPatientRecordWard,
  unpaidMedications,
  getPatientLabHistory,
  processMedicationPayment,
  searchMedication,
  markAsDispensed,
  getPendingPrescriptions,
  getOPDSessionView,
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
  createAppointment,
  getPatients,
  getAppointmens,
};
