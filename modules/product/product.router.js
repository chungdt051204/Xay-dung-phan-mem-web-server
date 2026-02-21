const express = require("express");
const router = express.Router();
const productController = require("./product.controller");
const prefix = "";
router.get(`${prefix}/product`, productController.getProduct);
router.post(`${prefix}/product`, productController.createProduct);
router.put(`${prefix}/product`, productController.updateProduct);
router.delete(`${prefix}/product/:id`, productController.deleteProduct);
module.exports = router;
