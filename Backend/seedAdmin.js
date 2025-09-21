require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = process.env.ADMIN_EMAIL;
    const pass = process.env.ADMIN_PASS || "admin123";
    let admin = await User.findOne({ email });
    if (admin) {
      console.log("Admin already exists");
      process.exit(0);
    }
    const hashed = await bcrypt.hash(pass, 10);
    admin = new User({ name: "Admin", email, password: hashed, role: "admin" });
    await admin.save();
    console.log("Admin created:", email, "pass:", pass);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
run();
