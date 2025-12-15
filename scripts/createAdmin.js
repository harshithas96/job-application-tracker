require("dotenv").config()
const mongoose = require("mongoose");
const User = require("../models/User"); 

const connectDB = async () => {
  await mongoose.connect(process.env.DB_SECRET)
}

const createAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const admin = new User({
      name: "Super Admin",
      email: "admin@jobtracker.com",
      phoneNumber: "9999999999",
      password: "Admin@123",
      role: "admin"
    });

    await admin.save();
    console.log("Admin created successfully");
    process.exit(0);

  } catch (err) {
    console.error("Error creating admin:", err.message);
    process.exit(1);
  }
};

createAdmin();
