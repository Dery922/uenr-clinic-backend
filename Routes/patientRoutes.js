import express from 'express';

import pat from "../Models/Patient.js"
const router = express.Router();

const searchPatientRecord = async (req, res) => {
 

  try {
    const query = req.query.q;
    const regex = new RegExp(query, 'i');

    const patients = await pat.find({
      $or: [
       
        { patient_id: regex },
        { phone: regex },
        { email: regex },
      ],
    });

    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

router.get('/search', searchPatientRecord); // ✅ Correct route

export default router;
