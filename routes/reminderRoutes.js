const express = require("express");
const router = express.Router();

const { userAuth } = require("../middleware/auth");

const {
  createReminder,
  getMyReminders,
  updateReminder,
  deleteReminder
} = require("../controllers/reminderController");

router.post("/reminders", userAuth, createReminder);
router.get("/reminders", userAuth, getMyReminders);
router.put("/reminders/:id", userAuth, updateReminder);
router.delete("/reminders/:id", userAuth, deleteReminder);

module.exports = router;
