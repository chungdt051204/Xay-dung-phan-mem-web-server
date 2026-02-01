const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const prefix = "";
router.post(`${prefix}/login`, userController.postLogin);
router.get(`${prefix}/me`, userController.getMe);
module.exports = router;
