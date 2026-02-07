const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const prefix = "";
const multer = require("multer");
const cloudinary = require("../../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "User",
    allowedFormats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 300, height: 400, crop: "limit" }],
  },
});
const upload = multer({
  storage: storage,
});
router.post(
  `${prefix}/register`,
  upload.single("avatar"),
  userController.postRegister
);
router.get(`${prefix}/auth/google`, userController.getLoginGoogle);
router.get(
  `${prefix}/auth/google/callback`,
  userController.getResultLoginGoogle
);
router.post(`${prefix}/login`, userController.postLogin);
router.post(`${prefix}/reset`, userController.postReset);
router.post(`${prefix}/confirm`, userController.postConfirm);
router.get(`${prefix}/me`, userController.getMe);
module.exports = router;
