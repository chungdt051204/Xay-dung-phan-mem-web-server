const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userEntity",
      required: true,
    },

    fullname: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    couponId: {
      type: mongoose.Schema.ObjectId,
      ref: "couponEntity",
      default: null,
    },

    paymentMethod: {
      type: String,
      enum: ["MoMo", "COD", "ZaloPay", "Cash"],
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Chờ xác nhận", "Đang giao", "Đã giao", "Đã xác nhận", "Đã hủy"],
      default: "Chờ xác nhận",
    },

    paymentStatus: {
      type: String,
      enum: ["Chưa thanh toán", "Đã thanh toán"],
      default: "Chưa thanh toán",
    },

    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

orderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("orderEntity", orderSchema, "order");
