require("dotenv").config();
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.SMTP_KEY,
  },
});

const sendEmail = (to, code, subject) => {
  transporter
    .sendMail({
      from: "ChungDo <huy91856@gmail.com>",
      to,
      subject,
      text: `Confirm Code: ${code}`,
      html: `<b>Code: ${code}</b>`,
    })
    .then(() => console.log("✅ Email sent"))
    .catch((err) => console.error("❌ Send email error:", err.message));
};

module.exports = sendEmail;
