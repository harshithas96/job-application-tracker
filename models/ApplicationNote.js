const mongoose = require("mongoose");

const applicationNoteSchema = new mongoose.Schema(
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

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    }
  },
  { timestamps: true }
);

applicationNoteSchema.index({ jobApplication: 1, createdAt: -1 });

module.exports = mongoose.model("ApplicationNote", applicationNoteSchema);
