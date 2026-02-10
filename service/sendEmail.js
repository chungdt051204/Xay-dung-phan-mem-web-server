const nodemailer = require("nodemailer");

const sendEmail = async (to, code, subject) => {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: "apikey",
      pass: process.env.SMTP_KEY,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: "ChungDo <huy91856@gmail.com>",
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
