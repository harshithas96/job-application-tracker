const Reminder = require("../models/Reminder");
const JobApplication = require("../models/JobApplication");

const createReminder = async (req, res) => {
  try {
    const { jobApplicationId, reminderDate, message } = req.body;

    const job = await JobApplication.findOne({
      _id: jobApplicationId,
      user: req.user._id
    });

    if (!job) {
      return res.status(404).json({ message: "Job application not found" });
    }

    const reminder = await Reminder.create({
      user: req.user._id,
      jobApplication: jobApplicationId,
      reminderDate,
      message
    });

    res.status(201).json({
      message: "Reminder created",
      reminder
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getMyReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user._id })
      .populate("jobApplication", "companyName jobTitle status")
      .sort({ reminderDate: 1 });

    res.status(200).json(reminders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.status(200).json({
      message: "Reminder updated",
      reminder
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.status(200).json({ message: "Reminder deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createReminder,
  getMyReminders,
  updateReminder,
  deleteReminder
};
