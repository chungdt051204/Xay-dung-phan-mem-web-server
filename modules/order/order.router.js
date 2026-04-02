const express = require("express");
const router = express.Router();
const orderController = require("./order.controller");
const {
  verifyToken,
  verifyAdmin,
} = require("../../service/middleware/authMiddleware");
const prefix = "";

// Order routes - More specific routes FIRST

// General routes
router.get("/order", orderController.getOrder);
router.post("/order", verifyToken, orderController.postOrder);
router.get(`${prefix}/momo-callback`, orderController.getMomoCallback);
router.put("/order", orderController.updateOrderStatus);
router.delete("/order", orderController.deleteOrder);
router.put("/order/cancel", orderController.cancelOrder);

// User specific routes
router.get("/user/orders", orderController.getUserOrders);

module.exports = router;
