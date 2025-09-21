const express = require("express");
const router = express.Router();
const Bug = require("../models/Bug");
const auth = require("../middleware/auth");

// create bug
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, severity } = req.body;
    const bug = new Bug({
      title,
      description,
      severity,
      reporter: req.user._id,
    });
    await bug.save();
    res.json(bug);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// list bugs (with filter/search). admin sees all, reporter sees own only
router.get("/", auth, async (req, res) => {
  try {
    const { status, severity, search } = req.query;
    const q = {};
    if (status) q.status = status;
    if (severity) q.severity = severity;
    if (search) q.title = { $regex: search, $options: "i" };

    if (req.user.role !== "admin") q.reporter = req.user._id;

    const bugs = await Bug.find(q)
      .populate("reporter", "name email")
      .sort({ createdAt: -1 });
    res.json(bugs);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// update status
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["Open", "In Progress", "Closed"].includes(status))
      return res.status(400).json({ msg: "Invalid status" });

    const bug = await Bug.findById(id);
    if (!bug) return res.status(404).json({ msg: "Bug not found" });

    // only reporter of bug or admin can update
    if (
      req.user.role !== "admin" &&
      bug.reporter.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    bug.status = status;
    await bug.save();
    res.json(bug);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// get bug detail
router.get("/:id", auth, async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id).populate(
      "reporter",
      "name email"
    );
    if (!bug) return res.status(404).json({ msg: "Not found" });
    if (
      req.user.role !== "admin" &&
      bug.reporter._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ msg: "Not allowed" });
    }
    res.json(bug);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
