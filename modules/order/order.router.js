const express = require("express");
const router = express.Router();
const orderController = require("./order.controller");

// Order routes
router.get("/order", orderController.getOrder);
router.get("/order/id", orderController.getOrderById);
router.post("/order", orderController.createOrder);
router.put("/order", orderController.updateOrderStatus);
router.delete("/order", orderController.deleteOrder);

// Additional routes
router.post("/order/cancel", orderController.cancelOrder);
router.get("/user/orders", orderController.getUserOrders);
router.get("/order/stats", orderController.getOrderStats);

module.exports = router;
