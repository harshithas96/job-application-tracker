const cron = require("node-cron");
const Reminder = require("../models/Reminder");
const User = require("../models/User");
const { sendEmail } = require("../utils/sendEmail");

cron.schedule("*/5 * * * *", async () => {
  const now = new Date();

  const reminders = await Reminder.find({
    reminderDate: { $lte: now },
    isSent: false
  }).populate("user");

  for (const reminder of reminders) {
    await sendEmail(
      reminder.user.email,
      "Job Follow-up Reminder",
      reminder.message || "You have a job application follow-up reminder."
    );

    reminder.isSent = true;
    await reminder.save();
  }
});
