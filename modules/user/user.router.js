const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const prefix = "";
const multer = require("multer");
const cloudinary = require("../../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const {
  verifyToken,
  verifyAdmin,
} = require("../../service/middleware/authMiddleware");
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
  userController.Register
);
router.get(`${prefix}/auth/google`, userController.loginGoogle);
router.get(
  `${prefix}/auth/google/callback`,
  userController.getResultLoginGoogle
);
router.post(`${prefix}/login`, userController.Login);
router.post(`${prefix}/reset`, userController.resetPassword);
router.post(`${prefix}/confirm`, userController.confirmEmail);
router.get(`${prefix}/me`, verifyToken, userController.getMe);
router.put(
  `${prefix}/me`,
  verifyToken,
  upload.single("avatar"),
  userController.putMe
);
router.get(`${prefix}/user`, verifyToken, verifyAdmin, userController.getUser);
router.get(
  `${prefix}/user/:id`,
  verifyToken,
  verifyAdmin,
  userController.getUserById
);
router.put(
  `${prefix}/user/:id`,
  verifyToken,
  verifyAdmin,
  userController.updateStatus
);
module.exports = router;
