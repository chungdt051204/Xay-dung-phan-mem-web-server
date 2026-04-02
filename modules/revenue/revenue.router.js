const express = require("express");
const router = express.Router();
const revenueController = require("./revenue.controller");
const prefix = "";
router.get(`${prefix}/revenue-trend`, revenueController.getRevenueTrend);
router.get(`${prefix}/category-stats`, revenueController.getDailyCategoryStats);
router.get(`${prefix}/best-seller`, revenueController.getBestSeller);
module.exports = router;
