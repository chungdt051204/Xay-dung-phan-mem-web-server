const express = require("express");
const router = express.Router();
const brandController = require("./brand.controller");
const prefix = "";
router.get(`${prefix}/brand`, brandController.getBrands);
router.delete(`${prefix}/brand/:id`, brandController.deleteBrand);
router.post(`${prefix}/brand`, brandController.createBrand);
router.put(`${prefix}/brand/`, brandController.updateBrand);
module.exports = router;
