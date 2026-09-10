const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
      select: false,
    },

    tokenVersion: {
      type: Number,
      required: true,
      default: 0,
    },

    pendingEmail: {
      type: String,
      default: null,
      lowercase: true,
      trim: true,
    },

    pendingEmailTokenHash: {
      type: String,
      default: null,
      select: false,
    },

    pendingEmailExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);