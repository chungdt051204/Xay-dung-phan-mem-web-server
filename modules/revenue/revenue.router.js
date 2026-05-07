const express = require("express");
const router = express.Router();
const revenueController = require("./revenue.controller");
const prefix = "";
const {
  verifyToken,
  verifyAdmin,
} = require("../../service/middleware/authMiddleware");
router.get(
  `${prefix}/revenue-trend`,
  verifyToken,
  verifyAdmin,
  revenueController.getRevenueTrend
);
router.get(
  `${prefix}/category-stats`,
  verifyToken,
  verifyAdmin,
  revenueController.getDailyCategoryStats
);
router.get(
  `${prefix}/best-seller`,
  verifyToken,
  verifyAdmin,
  revenueController.getBestSeller
);
module.exports = router;
