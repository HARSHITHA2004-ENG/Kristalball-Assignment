const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "military_user",
  password: "Harshu@2005",
  database: "military_assets"
});

db.connect(err => {
  if (err) {
    console.error(" DB connection failed:", err.message);
    process.exit(1);
  }
  console.log(" Connected to MySQL as military_user");
});

module.exports = db;

