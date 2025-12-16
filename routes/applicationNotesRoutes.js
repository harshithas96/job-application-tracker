const express = require("express");
const router = express.Router();

const { userAuth } = require("../middleware/auth");
const {
  addNote,
  getNotes,
  updateNote,
  deleteNote
} = require("../controllers/applicationNoteController");


router.post(
  "/applications/:applicationId/notes",
  userAuth,
  addNote
);


router.get(
  "/applications/:applicationId/notes",
  userAuth,
  getNotes
);


router.put(
  "/applications/notes/:noteId",
  userAuth,
  updateNote
);


router.delete(
  "/applications/notes/:noteId",
  userAuth,
  deleteNote
);

module.exports = router;
