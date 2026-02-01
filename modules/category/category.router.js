const express = require("express");
const router = express.Router();
const categoryController = require("./category.controller");
const prefix = "";
router.get(`${prefix}/category`, categoryController.getCategory);
module.exports = router;
