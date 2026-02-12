const express = require("express");
const router = express.Router();
const productController = require("./product.controller");
const prefix = "";
router.get(`${prefix}/product`, productController.getProduct);
module.exports = router;
