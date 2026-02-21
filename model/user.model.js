const mongoosePaginate = require("mongoose-paginate-v2");
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
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
    },

    phone: {
      type: String,
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
    },

    avatar: {
      type: String,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    loginMethod: {
      type: String,
      enum: ["Email thường", "Google", "Facebook"],
      default: "Email thường",
    },

    isVerified: {
      type: Boolean,
      default: false,
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
userSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("userEntity", userSchema, "user");
