const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    companyName: {
      type: String,
      required: true,
      trim: true
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: ["applied", "interviewed", "offered", "rejected", "withdrawn"],
      default: "applied"
    },

    applicationDate: {
      type: Date,
      default: Date.now
    },

    notes: {
      type: String,
      trim: true
    },

    attachments: [
      {
        fileName: String,
        filePath: String,
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

jobApplicationSchema.index({
  companyName: "text",
  jobTitle: "text",
  notes: "text"
});

jobApplicationSchema.index({ user: 1, status: 1 });
jobApplicationSchema.index({ createdAt: -1 });

module.exports = mongoose.model("JobApplication", jobApplicationSchema);
