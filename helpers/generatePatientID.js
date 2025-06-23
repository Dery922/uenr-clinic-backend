import Patient from "../Models/Patient.js";

const generatePatientID = async () => {
   const count = Math.random().toString(36).substring(2, 7).toUpperCase();
   return `UENR-${count}`;
}

export {generatePatientID};