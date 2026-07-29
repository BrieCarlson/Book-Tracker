const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    coverImage: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Want To Read",
        "Reading",
        "Finished",
        "Did Not Finish",
      ],
      default: "Want To Read",
    },

    rating: {
      type: Number,
      default: 0,
    },

    genre: {
      type: String,
      default: "",
    },

    series: {
      type: String,
      default: "",
    },

    pages: {
      type: Number,
      default: null,
    },

    isbn: {
      type: String,
      default: "",
    },

    publisher: {
      type: String,
      default: "",
    },

    format: {
      type: String,
      default: "",
    },

    summary: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },

    dateStarted: {
      type: String,
      default: "",
    },

    dateFinished: {
      type: String,
      default: "",
    },

    dateAdded: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", bookSchema);