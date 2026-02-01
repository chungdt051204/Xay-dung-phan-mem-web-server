const mongoose = require("mongoose");
const colorSchema = new mongoose.Schema(
  {
    colorName: {
      type: String,
      required: true,
      trim: true,
    },
    hexCode: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("colorEntity", colorSchema, "color");
