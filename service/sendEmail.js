const nodemailer = require("nodemailer");

const sendEmail = async (to, code, subject) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: "Nhom4.com     <huy91856@gmail.com>",
      to: to,
      subject: subject,
      text: "Confirm Code: " + code,
      html: `<b>Code: ${code}</b>`,
    });
    console.log("Message sent:", info.messageId);
    return info;
  } catch (err) {
    console.log("Error occurred. " + err.message);
  }
};
module.exports = sendEmail;
