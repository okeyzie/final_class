// file: sendEmailSMTP.js
const nodemailer = require("nodemailer");

exports.sendMail = async ({to , subject, text, html}) => {
    try{
    const transporter = nodemailer.createTransport({
    host: "smtp.mailgun.org",
    port: 587,
    auth: {
      user: process.env.MAILGUN_DOMAIN_NAME,
      pass: process.env.MAILGUN_SMTP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from:  process.env.MAILGUN_DOMAIN_NAME,
    to,
    subject,
    text,
    html,
  });

  console.log("✅ Message sent:", info.messageId);
}
    catch(error){
         console.error(`error sending email: ${error.message}`);
            throw error;
    }

};
console.log("User:", process.env.MAILGUN_DOMAIN_NAME);
console.log("Pass:", process.env.MAILGUN_SMTP_PASSWORD ? "Loaded ✅" : "Missing ❌");