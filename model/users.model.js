const mongoose = require("mongoose");
const usersSchema = new mongoose.Schema(
  {
    ID: {
      type: String,
      unique: true,
      required: true,
    },
    Name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("usersEntity", usersSchema, "users");
