//import nodemailer from "nodemailer";

const nodemailer = require("nodemailer");

exports.sendMail = async ({to , subject, text, html}) => {
    try{
const transporter = nodemailer.createTransport({
  host: "smtp.turbo-smtp.com",
  port: 587,                // or 465 for SSL
  secure: false,            // true for 465
  auth: {
    user: process.env.TURBO_SMTP_EMAIL,  // usually your email
    pass: process.env.TURBO_SMTP_PASSWORD   // 👈 security key as password
  }
});

const info = await transporter.sendMail({
  from: process.env.TURBO_SMTP_EMAIL,
  to: to,
  subject: subject,
  text: text,
  html: html
});

    console.log(`Message sent : ${info.messageId}`);
    return info;

    }catch(error){
       console.error(`error sending email: ${error.message}`);
       throw error;
   }

   transporter.sendMail(mailOptions, (err, info) => {
     if (err) {
       console.error(err);
     } else {
       console.log("Email sent: " + info.response);
  }
});
}


console.log("User:", process.env.TURBO_SMTP_EMAIL);
console.log("Pass:", process.env.TURBO_SMTP_API_KEY ? "Loaded ✅" : "Missing ❌");
