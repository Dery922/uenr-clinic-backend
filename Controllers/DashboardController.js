import Patient from "../Models/Patient.js";
import User from "../Models/User.js"

const allUsers = async (req, res) => {
   
    try {
        const users = await User.countDocuments();
        res.status(200).json(users);
        console.log("all users ",users)
    } catch (error) {
        console.log({error : error.message});
        res.status(404).json({error : error.message})
    } 
}

const allPatients = async (req, res) => {
    try {
        const allPatients = await Patient.countDocuments();
        res.status(200).json(allPatients);
        console.log("all patients here",allPatients);
    } catch (error) {
        console.log({error : error.message});
        res.status(404).json({error : error.message})
    }
}

const allStudentsPatients = async (req, res) => {
  
    try {
        const allPatientsStudents = await Patient.countDocuments({ patient_type: "student" });
        res.status(200).json(allPatientsStudents);
        console.log("all patients here",allPatientsStudents);
    } catch (error) {
        console.log({error : error.message});
        res.status(404).json({error : error.message})
    }
}

const allOutPatients = async (req, res) => {
    try {
        const allOutPatients = await Patient.countDocuments({ patient_type: "out-patient" });
        res.status(200).json(allOutPatients);
        console.log("all out patients here", allOutPatients);
    } catch (error) {
        console.log({error : error.message});
        res.status(404).json({error : error.message})
    }
}



const getMonthlyPatientStats = async (req, res) => {
  try {
    const stats = await Patient.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), 0, 1), // start of current year
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    // Optional: Map month numbers to names
    const months = [
      "", "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const formatted = stats.map((item) => ({
      month: months[item._id],
      Patients: item.count
    }));

    res.status(200).json(formatted);
    console.log(formatted)
  } catch (error) {
    console.error("Monthly stats error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getGenderDistribution = async (req, res) => {
    try {
        const maleCount = await Patient.countDocuments({ gender: "male" });
        const femaleCount = await Patient.countDocuments({ gender: "female" });
    
        res.status(200).json({
          male: maleCount,
          female: femaleCount,
        });
      } catch (error) {
        console.error("Error getting gender distribution:", error);
        res.status(500).json({ error: error.message });
      }
}

export {getGenderDistribution,
   allUsers, 
   allPatients, allStudentsPatients, 
   allOutPatients, getMonthlyPatientStats}