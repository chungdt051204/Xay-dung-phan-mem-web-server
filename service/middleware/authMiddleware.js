require("dotenv").config();
const crypto = require("crypto");
const userEntity = require("../../model/user.model");
exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.slice(7);
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const [encodedHeader, encodedPayload, tokenSignature] = token.split(".");
    //Tạo lại signature và so sánh với signature cũ
    const tokenData = `${encodedHeader}.${encodedPayload}`;
    //Tạo signature
    const hmac = crypto.createHmac("sha256", process.env.JWT_SECRET);
    const signature = hmac.update(tokenData).digest("base64url");
    if (signature === tokenSignature) {
      const payload = JSON.parse(atob(encodedPayload));
      if (payload.exp < Date.now())
        return res.status(401).json("Token đã hết hạn");
      req.payload = payload;
      return next();
    }
    return res.status(401).json({ message: "Token không khớp" });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm verifyToken", {
      error: error.message,
    });
    return res.status(500).json({ message: "Lỗi", error: error.message });
  }
};
exports.verifyAdmin = async (req, res, next) => {
  try {
    const payload = req.payload;
    if (!payload) return res.status(401).json({ message: "Unauthorized" });
    const user = await userEntity.findOne({ _id: payload.sub });
    if (!user || user.roles !== "admin")
      return res.status(401).json({ message: "Không đủ quyền truy cập" });
    return next();
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm verifyAdmin", {
      error: error.message,
    });
    return res.status(500).json({ message: "Lỗi", error: error.message });
  }
};
