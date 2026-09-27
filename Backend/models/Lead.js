const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    company: {
      type: String
    },

    serviceInterested: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Converted", "Lost"],
      default: "New"
    },

    followUpDate: {
      type: Date
    },

    notes: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Lead", leadSchema);