const mongoosePaginate = require("mongoose-paginate-v2");
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
      enum: ["còn bán", "ngừng bán"],
      default: "còn bán",
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

    colors: [
      {
        type : String
      },
    ],
  },
  {
    timestamps: true,
  }
);
productSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("productEntity", productSchema, "product");
