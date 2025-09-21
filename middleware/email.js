const nodemailer = require("nodemailer");


exports.sendMail = async ({to , subject, text, html}) => {
    try{
          const transporter = nodemailer.createTransport({
          service: "gmail",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
          user: process.env.email,
          pass: process.env.pass,
        },
    });


  const info = await transporter.sendMail({
    from:process.env.email,
    to,
    subject,
    text,
    html,
  });

     console.log(`Message sent : ${info.messageId}`);
        return info;
}
    catch(error){
       console.error(`error sending email: ${error.message}`);
       throw error;
       
    }

}


