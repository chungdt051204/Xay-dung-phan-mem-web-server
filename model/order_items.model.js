const mongoose = require("mongoose");
const orderItemsSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.ObjectId,
      ref: "orderEntity",
      required: true,
    },

    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "productEntity",
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      min: 1,
      required: true,
    },

    price: {
      type: Number,
      min: 0,
      required: true,
    },

    amount: {
      type: Number,
      min: 0,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "orderItemsEntity",
  orderItemsSchema,
  "orderItems"
);
