const express = require("express");
const router = express.Router();
const brandController = require("./brand.controller");
const {
  verifyToken,
  verifyAdmin,
} = require("../../service/middleware/authMiddleware");
const prefix = "";
router.get(`${prefix}/brand`, brandController.getBrands);
router.get(`${prefix}/brand/:id`, brandController.getBrandById);
router.post(
  `${prefix}/brand`,
  verifyToken,
  verifyAdmin,
  brandController.createBrand
);
router.delete(
  `${prefix}/brand/:id`,
  verifyToken,
  verifyAdmin,
  brandController.deleteBrand
);
router.put(
  `${prefix}/brand/:id`,
  verifyToken,
  verifyAdmin,
  brandController.updateBrand
);
module.exports = router;
