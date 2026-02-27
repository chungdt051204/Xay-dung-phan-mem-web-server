const express = require("express");
const router = express.Router();
const cartController = require("./cart.controller");
const prefix = "";
router.post(`${prefix}/cart`, cartController.postCart);
router.get(`${prefix}/cart`, cartController.getCart);
module.exports = router;
