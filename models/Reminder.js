const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    jobApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobApplication",
      required: true
    },

    reminderDate: {
      type: Date,
      required: true
    },

    message: {
      type: String,
      trim: true
    },

    isSent: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reminder", reminderSchema);
