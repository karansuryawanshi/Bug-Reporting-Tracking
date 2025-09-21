require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

// app.use(cors());
app.use(
  cors({
    origin: "https://bug-reporting-tracking.vercel.app", // frontend domain
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // <--- allow Content-Type
  })
);

app.options("/*", cors());
app.use(express.json());

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/bugs", require("./routes/bugs"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server listening on", PORT));
