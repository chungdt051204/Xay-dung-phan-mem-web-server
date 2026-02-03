const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const prefix = "";
router.get(`${prefix}/auth/google`, userController.getLoginGoogle);
router.get(
  `${prefix}/auth/google/callback`,
  userController.getResultLoginGoogle
);
router.post(`${prefix}/login`, userController.postLogin);
router.get(`${prefix}/me`, userController.getMe);
module.exports = router;
