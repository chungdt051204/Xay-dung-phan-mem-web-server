const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    roles: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    gender: {
      type: String,
      enum: ["nam", "nữ", "chưa chọn"],
      default: "chưa chọn",
    },

    dateOfBirth: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    refreshToken: String,
    resetCode: Number,
    resetCodeExpiration: Date,

    // FOR GOOGLE/FACEBOOK LOGIN
    googleId: String,
    facebookId: String,
  },
  {
    timestamps: true, //Tự động tạo createdAt và UpdatedAt
  }
);

module.exports = mongoose.model("userEntity", userSchema, "user");
