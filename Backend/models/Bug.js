const mongoose = require("mongoose");

const BugSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    severity: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed"],
      default: "Open",
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bug", BugSchema);
