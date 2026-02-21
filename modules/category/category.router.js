const express = require("express");
const router = express.Router();
const categoryController = require("./category.controller");
const prefix = "";
router.get(`${prefix}/category`, categoryController.getCategory);
router.post(`${prefix}/category`, categoryController.createCategory);
router.put(`${prefix}/category`, categoryController.updateCategory);
router.delete(`${prefix}/category/:id`, categoryController.deleteCategory);
module.exports = router;
