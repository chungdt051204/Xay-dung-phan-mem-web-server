const express = require("express");
const router = express.Router();
const staffController = require("./staff.controller");
const prefix = "";
router.get(`${prefix}/staff`, staffController.getStaff);
module.exports = router;
