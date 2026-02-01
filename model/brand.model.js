const mongoose = require("mongoose");
const brandSchema = new mongoose.Schema(
  {
    //Hãng sản xuất/ thương hiệu
    brandName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("brandEntity", brandSchema, "brand");
