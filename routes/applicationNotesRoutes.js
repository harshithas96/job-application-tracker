const express = require("express");
const router = express.Router();

const { userAuth } = require("../middleware/auth");
const {
  addNote,
  getNotes,
  updateNote,
  deleteNote
} = require("../controllers/applicationNoteController");

// Add note to application
router.post(
  "/applications/:applicationId/notes",
  userAuth,
  addNote
);

// Get notes
router.get(
  "/applications/:applicationId/notes",
  userAuth,
  getNotes
);

// Update note
router.put(
  "/applications/notes/:noteId",
  userAuth,
  updateNote
);

// Delete note
router.delete(
  "/applications/notes/:noteId",
  userAuth,
  deleteNote
);

module.exports = router;
