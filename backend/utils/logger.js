const db = require("../db");

module.exports = function log(action, userId, details) {
  db.query(
    "INSERT INTO logs (action, user_id, details) VALUES (?, ?, ?)",
    [action, userId, JSON.stringify(details)]
  );
};
