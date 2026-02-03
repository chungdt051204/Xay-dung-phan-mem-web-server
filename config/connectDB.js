const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Kết nối thành công");
  } catch (error) {
    console.log("Kết nối thất bại", { error: error.message });
    process.exit(1);
  }
};
module.exports = connectDB;
