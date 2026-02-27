const express = require("express");
const router = express.Router();
const orderItemsController = require("./order_items.controller");

router.get("/order-items", orderItemsController.getOrderItems);
router.get("/order-item", orderItemsController.getOrderItemById);
router.post("/order-items", orderItemsController.createOrderItem);
router.put("/order-items", orderItemsController.updateOrderItem);
router.delete("/order-items", orderItemsController.deleteOrderItem);

module.exports = router;
