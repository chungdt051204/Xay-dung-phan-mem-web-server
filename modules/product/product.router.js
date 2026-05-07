const express = require("express");
const router = express.Router();
const productController = require("./product.controller");
const prefix = "";
const {
  verifyToken,
  verifyAdmin,
} = require("../../service/middleware/authMiddleware");
router.get(`${prefix}/product`, productController.getProduct);
router.get(`${prefix}/product/:id`, productController.getProductById);
router.post(
  `${prefix}/product`,
  verifyToken,
  verifyAdmin,
  productController.createProduct
);
router.put(
  `${prefix}/product/:id`,
  verifyToken,
  verifyAdmin,
  productController.updateProduct
);
router.delete(
  `${prefix}/product/:id`,
  verifyToken,
  verifyAdmin,
  productController.deleteProduct
);
module.exports = router;
