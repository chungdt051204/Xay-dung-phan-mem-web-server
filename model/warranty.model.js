const mongoose = require("mongoose");
const warrantySchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "userEntity",
    required: true,
  },

  orderItemsId: {
    type: Schema.Types.ObjectId,
    ref: "orderItemsEntity",
    required: true,
  },

  duration: {
    type: String,
    required: true,
  },

  startDate: {
    type: Date,
    required: true,
  },

  finishDate: {
    type: Date,
    required: true,
  },

  status: {
    type: Boolean,
    required: true,
  },

  note: {
    type: String,
  },
});

module.exports = mongoose.model("warrantyEntity", warrantySchema, "warranty");
