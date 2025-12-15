const router = require("express").Router();
const db = require("../db");
const auth = require("../middleware/auth");

/**
 * ======================================
 * GET EXPENDITURES
 * ADMIN → all bases
 * OTHERS → own base
 * ======================================
 */
router.get("/", auth, (req, res) => {
  const isAdmin = req.user.role === "ADMIN";

  const sql = isAdmin
    ? `
      SELECT
        e.id,
        e.base_id,
        e.asset_id,
        a.asset_name,
        a.asset_type,
        e.quantity,
        e.date
      FROM expenditures e
      JOIN assets a ON a.asset_id = e.asset_id
      ORDER BY e.date DESC
    `
    : `
      SELECT
        e.id,
        e.base_id,
        e.asset_id,
        a.asset_name,
        a.asset_type,
        e.quantity,
        e.date
      FROM expenditures e
      JOIN assets a ON a.asset_id = e.asset_id
      WHERE e.base_id = ?
      ORDER BY e.date DESC
    `;

  const params = isAdmin ? [] : [req.user.base_id];

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error("GET EXPENDITURES ERROR:", err);
      return res.status(500).json({ message: "Failed to fetch expenditures" });
    }
    res.json(rows);
  });
});

module.exports = router;
