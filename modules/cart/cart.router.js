const express = require("express");
const router = express.Router();
const cartController = require("./cart.controller");
const { verifyToken } = require("../../service/middleware/authMiddleware");
const prefix = "";
router.post(`${prefix}/cart`, verifyToken, cartController.addCart);
router.get(`${prefix}/cart`, verifyToken, cartController.getCart);
router.put(`${prefix}/cart/:id`, verifyToken, cartController.updateQuantity);
router.delete(`${prefix}/cart/:id`, verifyToken, cartController.deleteCartItem);
router.delete(
  `${prefix}/cart`,
  verifyToken,
  cartController.deleteCartItemSelected
);
module.exports = router;
