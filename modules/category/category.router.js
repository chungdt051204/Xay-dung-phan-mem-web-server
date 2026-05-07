const express = require("express");
const router = express.Router();
const categoryController = require("./category.controller");
const {
  verifyToken,
  verifyAdmin,
} = require("../../service/middleware/authMiddleware");
const prefix = "";
router.get(`${prefix}/category`, categoryController.getCategory);
router.get(`${prefix}/category/:id`, categoryController.getCategoryById);
router.post(
  `${prefix}/category`,
  verifyToken,
  verifyAdmin,
  categoryController.createCategory
);
router.put(
  `${prefix}/category/:id`,
  verifyToken,
  verifyAdmin,
  categoryController.updateCategory
);
router.delete(
  `${prefix}/category/:id`,
  verifyToken,
  verifyAdmin,
  categoryController.deleteCategory
);
module.exports = router;
