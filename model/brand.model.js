const mongoosePaginate = require("mongoose-paginate-v2");
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
brandSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("brandEntity", brandSchema, "brand");
