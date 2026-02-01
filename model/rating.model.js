const mongoose = require("mongoose");
const ratingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "userEntity",
      required: true,
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "productEntity",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    comment: {
      type: String,
      trim: true,
    },

    adminReply: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true, //Tự động tạo ngày đánh giá vàn gày phản hồi
  }
);

module.exports = mongoose.model("ratingEntity", ratingSchema, "rating");
