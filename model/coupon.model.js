const mongoose = require("mongoose");
const couponSchema = new mongoose.Schema(
  {
    coupon: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    discountPercent: {
      //Phần trăm giảm giá
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    startDate: {
      type: Date,
      default: Date.now,
      required: true,
    },

    finishDate: {
      type: Date,
      required: true,
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("couponEntity", couponSchema, "coupon");
