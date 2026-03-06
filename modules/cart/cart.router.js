const express = require("express");
const router = express.Router();
const cartController = require("./cart.controller");
const prefix = "";
router.post(`${prefix}/cart`, cartController.postCart);
router.get(`${prefix}/cart`, cartController.getCart);
router.put(`${prefix}/cart`, cartController.putQuantity);
router.delete(`${prefix}/cart`, cartController.deleteItem);
module.exports = router;
