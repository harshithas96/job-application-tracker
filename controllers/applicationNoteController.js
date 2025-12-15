const ApplicationNote = require("../models/ApplicationNote");
const JobApplication = require("../models/JobApplication");

// ADD note
const addNote = async (req, res) => {
  try {
    const { content } = req.body;

    const application = await JobApplication.findOne({
      _id: req.params.applicationId,
      user: req.user._id
    });

    if (!application) {
      return res.status(404).json({ message: "Job application not found" });
    }

    const note = await ApplicationNote.create({
      user: req.user._id,
      jobApplication: req.params.applicationId,
      content
    });

    res.status(201).json({
      message: "Note added",
      note
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET notes for application
const getNotes = async (req, res) => {
  try {
    const notes = await ApplicationNote.find({
      jobApplication: req.params.applicationId,
      user: req.user._id
    }).sort({ createdAt: -1 });

    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// UPDATE note
const updateNote = async (req, res) => {
  try {
    const note = await ApplicationNote.findOneAndUpdate(
      { _id: req.params.noteId, user: req.user._id },
      { content: req.body.content },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({
      message: "Note updated",
      note
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// DELETE note
const deleteNote = async (req, res) => {
  try {
    const note = await ApplicationNote.findOneAndDelete({
      _id: req.params.noteId,
      user: req.user._id
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addNote,
  getNotes,
  updateNote,
  deleteNote
};
