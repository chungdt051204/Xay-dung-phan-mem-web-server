require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525,
  secure: false, // Dùng TLS
  auth: {
    user: process.env.EMAIL,
    pass: process.env.SMTP_KEY,
  },
  connectionTimeout: 60000,
  greetingTimeout: 60000,
  socketTimeout: 60000,
  // Thêm cái này để debug kết nối sâu hơn
  debug: true,
  logger: true,
});

// Kiểm tra kết nối với SMTP ngay khi khởi động server
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Lỗi cấu hình SMTP (Brevo):", error);
  } else {
    console.log("🚀 Server đã sẵn sàng gửi Email");
  }
});

const sendEmail = async (to, code, subject) => {
  try {
    const info = await transporter.sendMail({
      from: `"ChungDo" <huy91856@gmail.com>`,
      to,
      subject,
      text: `Confirm Code: ${code}`,
      html: `<b>Code: ${code}</b>`,
    });

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
    return info;
  } catch (err) {
    // In ra toàn bộ object lỗi để xem Render đang chặn ở đâu
    console.error("❌ Chi tiết lỗi gửi Email:");
    console.error("- Message:", err.message);
    console.error("- Code:", err.code);
    console.error("- Command:", err.command);
    throw err; // Throw lỗi để Controller phía ngoài có thể bắt được và trả về phía Client
  }
};

module.exports = sendEmail;
