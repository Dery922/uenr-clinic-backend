
const getSOAPNotes = async (req, res) => {
  const { patientId } = req.params;
  
  try {
    // Get all objectives for the patient
    const objectives = await Objective.find({ patient_id: patientId })
      .sort({ registration_date: -1 }); // Sort by date descending

    if (!objectives || objectives.length === 0) {
      return res.status(404).json({ message: "No records found for this patient" });
    }


    // Process in batches to avoid memory issues
    const batchSize = 10;
    const unifiedNotes = [];
    
    for (let i = 0; i < objectives.length; i += batchSize) {
      const batch = objectives.slice(i, i + batchSize);
      
      const batchNotes = await Promise.all(
        batch.map(async (obj) => {
          const date = obj.registration_date;
          
          // Parallelize the queries for better performance
          const [subj, assess, plan, lab] = await Promise.all([
            Subjective.findOne({
              patient_id: patientId,
              registration_date: date,
            }).lean(),
            Assessment.findOne({
              patient_id: patientId,
              registration_date: date,
            }).lean(),
            Plan.findOne({ 
              patient_id: patientId, 
              registration_date: date 
            }).lean(),
            BloodTest.findOne({
              patient_id : patientId,
              registration_date : date
            }).lean()
          ]);

          return {
            id: obj._id, // Include document ID for reference
            date,
            doctor: obj.username,
            patient_id: patientId,
            patient_name: obj.patient_name,
            subjective: subj?.complaint || "No subjective data",
            objective: {
              physical_examination: obj.physical_examination || "Not recorded",
              cardiovascular: obj.cardiovascular || "Not recorded",
              heent: obj.heent || "Not recorded",
              respiratory: obj.respiratory || "Not recorded",
              vitals: obj.vitals || {} // Include vitals if they exist
            },
            assessment: assess?.diagnosis || "No assessment recorded",
            plan: {
              medications: plan?.medications || [],
              tests: plan?.tests || [],
              patient_education: plan?.patient_education || "No instructions",
              follow_up: plan?.follow_up || "No follow-up planned",
              status: plan?.status || "pending",
            },
          };
        })
      );
      
      unifiedNotes.push(...batchNotes);
    }

    res.status(200).json(unifiedNotes);
  } catch (err) {
    console.error("Error fetching SOAP notes:", err);
    res.status(500).json({ 
      error: "Failed to fetch medical records",
      details: err.message 
    });
  }
};
