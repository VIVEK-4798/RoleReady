
const nodemailer = require("nodemailer");

const sendEmail = async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSS,
    },
  });
  const info = await transporter.sendMail(
		mailOptions
    ,
    (err) => {
      if (err) {
        console.log("it has error ", err);
      } else {
        console.log("email has been send");
      }
      console.log(info);
    }
  );
};

module.exports = sendEmail;