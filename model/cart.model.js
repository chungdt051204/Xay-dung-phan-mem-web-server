const mongoose = require("mongoose");
const cartItemsSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "productEntity",
      required: true,
    },
    quantity: {
      type: Number,
      min: 1,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "userEntity",
      required: true,
    },
    items: [cartItemsSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("cartEntity", cartSchema, "cart");
