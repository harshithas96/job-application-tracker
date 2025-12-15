const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    industry: {
      type: String,
      trim: true
    },

    companySize: {
      type: String,
      enum: ["startup", "small", "medium", "enterprise"]
    },

    website: {
      type: String,
      trim: true
    },

    contactEmail: {
      type: String,
      lowercase: true,
      trim: true
    },

    notes: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

companySchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Company", companySchema);
