const getSOAPNotes = async (req, res) => {

  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    // Find all assessments (SOAP records) for the patient
    const assessments = await Assessment.find({ patient_id: patientId })
      .sort({ registration_date: -1 }) // most recent first
      .lean();

    if (!assessments || assessments.length === 0) {
      return res.status(404).json({ message: "No medical history found for this patient" });
    }

    // Build a medical history summary (later you can expand this to include allergies, family history, etc.)
    const medicalHistory = assessments.map((record) => ({
      id: record._id,
      date: record.registration_date,
      working_diagnosis: record.working_diagnosis,
      differential_diagnosis: record.differential_diagnosis,
      recorded_by: record.username,
    }));

    res.status(200).json({
      patientId,
      totalRecords: assessments.length,
      history: medicalHistory,
    });
  } catch (error) {
    console.error("Error fetching patient medical history:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }

};