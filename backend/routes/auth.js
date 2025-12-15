const router = require("express").Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "DB error" });
      }

      if (result.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = result[0];

      const token = jwt.sign(
        {
          user_id: user.user_id,
          role: user.role,
          base_id: user.base_id
        },
        "SECRET_KEY",
        { expiresIn: "8h" }
      );

      res.json({
        token: token,
        role: user.role,
        base_id: user.base_id
      });
    }
  );
});

module.exports = router;
