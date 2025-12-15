const mongoose = require("mongoose");

const jobListingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      trim: true
    },

    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship"]
    },

    sourceUrl: {
      type: String,
      trim: true
    },

    isApplied: {
      type: Boolean,
      default: false
    },

    notes: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobListing", jobListingSchema);
