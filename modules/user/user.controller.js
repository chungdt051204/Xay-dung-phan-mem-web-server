const passport = require("passport");
const base64url = require("../../helper");
const userEntity = require("../../model/user.model");
const crypto = require("crypto");
const jwtSecret =
  "shYnTMnSsbRecWsZx/pcjWMtlAx1RkZD3muD1n68BT71prXoWPblE85ass7GTIpNTkDNPz3osyT9NN9gOSyQl5W+Tj24JeLJD9ox60JDivz4UjSuciDhOS7ffeSzl2Gs8oq8UtrvSB7nfApSGExk1LsqkwCubjH51Dl0BtVZitk4zbdXevD6nq7JPppJY4PEWZAnyOwQT5tAVlBWptGGmGBadkQZ7AsU9wvo80kGYdTmA6aK3nOU2jaM+cS/pKGwJDA9ZWFE6fUk3oaLFF6jui/+0o7iVzK7ehN4d+UTE4u05XdCaulQZt9MsZjbeipnF+qeFdQh6EB5Wgbx+PN1fA==";

//Hàm chuyển hướng đến trang đăng nhập google
exports.getLoginGoogle = passport.authenticate("google", {
  scope: ["profile", "email"], //Lấy giá trị profile và email
  prompt: "select_account", //Mỗi lần chuyển đến trang đăng nhập google, người dùng có thể chọn tài khoản khác
});
//Hàm xử lý kết quả đăng nhập google
exports.getResultLoginGoogle = [
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    const user = req.user;
    const header = {
      alg: "HS256",
      typ: "JWT",
    };
    const payload = {
      sub: user._id,
      exp: Date.now() + 3600000, //Token hạn 1 tiếng
    };
    //Mã hóa header
    const encodedHeader = base64url(JSON.stringify(header));
    //Mã hóa payload
    const encodedPayload = base64url(JSON.stringify(payload));
    //Tạo Token data với header và payload đã mã hóa
    const tokenData = `${encodedHeader}.${encodedPayload}`;
    //Tạo signature
    const hmac = crypto.createHmac("sha256", jwtSecret);
    const signature = hmac.update(tokenData).digest("base64url");
    res.redirect(
      `https://tech-shop-client.netlify.app?token=${
        tokenData + "." + signature
      }`
    ); //Đăng nhập google thành công thì tạo jwt token và chuyển hướng về trang chủ đính kèm token vừa tạo
  },
];
exports.postLogin = async (req, res) => {
  try {
    const { input, password } = req.body;
    const user = await userEntity.findOne({
      $or: [{ email: input }, { username: input }],
    });
    if (!user || password !== user.password)
      return res
        .status(401)
        .json({ message: "Thông tin đăng nhập không hợp lệ" });
    const header = {
      alg: "HS256",
      typ: "JWT",
    };
    const payload = {
      sub: user._id,
      exp: Date.now() + 3600000, //Token hạn 1 tiếng
    };
    //Mã hóa header
    const encodedHeader = base64url(JSON.stringify(header));
    //Mã hóa payload
    const encodedPayload = base64url(JSON.stringify(payload));
    //Tạo Token data với header và payload đã mã hóa
    const tokenData = `${encodedHeader}.${encodedPayload}`;
    //Tạo signature
    const hmac = crypto.createHmac("sha256", jwtSecret);
    const signature = hmac.update(tokenData).digest("base64url");
    return res.status(200).json({
      message: "Đăng nhập thành công",
      token: tokenData + "." + signature,
      data: user,
    });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm postLogin");
    return res
      .status(500)
      .json({ message: "Đăng nhập thất bại", error: error.message });
  }
};
exports.getMe = async (req, res) => {
  try {
    const token = req.headers.authorization.slice(7);
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const [encodedHeader, encodedPayload, tokenSignature] = token.split(".");
    //Tạo lại signature và so sánh với signature cũ
    const tokenData = `${encodedHeader}.${encodedPayload}`;
    //Tạo signature
    const hmac = crypto.createHmac("sha256", jwtSecret);
    const signature = hmac.update(tokenData).digest("base64url");
    if (signature === tokenSignature) {
      const payload = JSON.parse(atob(encodedPayload));
      if (payload.exp < Date.now())
        return res.status(401).json("Token đã hết hạn");
      const user = await userEntity.findOne({ _id: payload.sub });
      if (!user)
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      return res.status(200).json({ data: user });
    }
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getMe");
    return res
      .status(500)
      .json({ message: "Lấy thông tin người dùng thất bại" });
  }
};
