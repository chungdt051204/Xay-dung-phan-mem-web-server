const mongoose = require("mongoose");
const revenueSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "productEntity",
    },
    // productName: {
    //   type: String,
    //   required: true,
    // },
    totalQuantity: {
      type: Number,
      min: 0,
      required: true,
    },
    totalAmount: {
      type: Number,
      min: 0,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("revenueEntity", revenueSchema, "revenue");
