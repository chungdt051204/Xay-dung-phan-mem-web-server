const connectDB = require("./config/connectDB");
const userEntity = require("./model/user.model");
require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
connectDB();
app.use(
  cors({
    origin: "https://tech-shop-client.netlify.app",
    credentials: true,
  })
);
const userRouter = require("./modules/user/user.router");
app.use(express.json());
app.use("/", userRouter);
//Xử lý đăng nhập google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userEntity.findOne({
          email: profile.emails[0].value,
        });
        if (!user) {
          user = await userEntity.create({
            email: profile.emails[0].value,
            fullname: profile.displayName,
            username:
              profile.displayName + " " + Math.floor(Math.random() * 10000),
            avatar: profile.photos[0].value,
            loginMethod: "Google",
            isVerified: true,
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
app.listen(port, () => {
  console.log("Server đang chạy với port:" + port);
});
