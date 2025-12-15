// server.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());

// ==================== ROUTES ====================
app.use("/auth", require("./routes/auth"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/purchases", require("./routes/purchases"));
app.use("/transfers", require("./routes/transfers"));
app.use("/assignments", require("./routes/assignments"));
app.use("/expenditures", require("./routes/expenditures"));

// ==================== HEALTH CHECK ====================
app.get("/", (req, res) => {
  res.json({ message: "Military Asset Management API running" });
});

// ==================== ERROR HANDLER ====================
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
