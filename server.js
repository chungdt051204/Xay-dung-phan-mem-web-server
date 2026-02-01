const connectDB = require("./config/connectDB");
require("dotenv").config();
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
app.listen(port, () => {
  console.log("Server đang chạy với port:" + port);
});
