import nodemailer from 'nodemailer'
import dotenv from "dotenv";
dotenv.config();


const transporter = nodemailer.createTransport({
    host : "smtp.gmail.com",
    port : 587,
    secure : false,
    auth: {
        user: "techiso922@gmail.com",
        pass: 'lkzidvncwjyjlcbd'
      },
  })
  
const sendAppointmentTime = async (email , date, time) => {
    try {
       const info =  await transporter.sendMail({
            from: '"University of energy and natural resource" <techiso922@gmail.com>',
            to: `${email}`,
            subject:  ` please here is your appointment date and time ${date, time} make sure to turn up`,
            text: ` Please here is your appointment date and time ${date, time} make sure to turn up`, // plain‑text body
            html: "<b>Hello world?</b>", // HTML body
    })
       
    } catch (error) {
        console.log(error)
    }
}

export default sendAppointmentTime;