const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  const header = req.header("Authorization") || "";
  const token = header.replace("Bearer ", "");
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ msg: "Invalid token" });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token invalid" });
  }
};

module.exports = auth;
