const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
      required: true,
    },

    techSpecs: {
      //Thông số kỹ thuật
      type: String,
      default: "",
    },

    thumbnail: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    images: [
      {
        type: String,
        default: "",
      },
    ],

    quantityStock: {
      //Tồn kho
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["còn hàng", "hết hàng"],
      default: "còn hàng",
    },

    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brandEntity",
      required: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categoryEntity",
      required: true,
    },

    colorId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "colorEntity",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("productEntity", productSchema, "product");
