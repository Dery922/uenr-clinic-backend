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
  
const sendUserDetails = async (email , username, password) => {
    try {
       const info =  await transporter.sendMail({
            from: '"University of energy and natural resource" <techiso922@gmail.com>',
            to: `${email}`,
            subject:  ` please here is your credentials username ${username} and you password is ${password}`,
            text: ` please here is your credentials username ${username} and you password is ${password}`,

    })
       
    } catch (error) {
        console.log(error)
    }
}

export default sendUserDetails;