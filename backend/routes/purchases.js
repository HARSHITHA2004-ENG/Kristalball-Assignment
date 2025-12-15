const router = require("express").Router();
const db = require("../db");
const auth = require("../middleware/auth");
const rbac = require("../middleware/rbac");
router.post(
  "/",
  auth,
  rbac(["ADMIN", "LOGISTICS"]),
  (req, res) => {
    const { asset_id, quantity } = req.body;
    const base_id = req.user.base_id;

  
    if (!asset_id || !quantity) {
      return res.status(400).json({
        message: "asset_id and quantity are required"
      });
    }
    db.query(
      `
      INSERT INTO purchases (base_id, asset_id, quantity)
      VALUES (?, ?, ?)
      `,
      [base_id, asset_id, quantity],
      (err, result) => {
        if (err) {
          console.error("PURCHASE INSERT ERROR:", err);
          return res.status(500).json({
            message: "Failed to record purchase"
          });
        }

        res.json({
          message: "Purchase recorded successfully",
          purchase_id: result.insertId
        });
      }
    );
  }
);


router.get("/", auth, (req, res) => {
  const isAdmin = req.user.role === "ADMIN";

  const sql = isAdmin
    ? `
      SELECT
        p.purchase_id,
        p.base_id,
        p.asset_id,
        a.asset_name,
        a.asset_type,
        p.quantity,
        p.created_at
      FROM purchases p
      JOIN assets a ON a.asset_id = p.asset_id
      ORDER BY p.created_at DESC
    `
    : `
      SELECT
        p.purchase_id,
        p.base_id,
        p.asset_id,
        a.asset_name,
        a.asset_type,
        p.quantity,
        p.created_at
      FROM purchases p
      JOIN assets a ON a.asset_id = p.asset_id
      WHERE p.base_id = ?
      ORDER BY p.created_at DESC
    `;

  const params = isAdmin ? [] : [req.user.base_id];

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error("GET PURCHASES ERROR:", err);
      return res.status(500).json({
        message: "Failed to fetch purchases"
      });
    }

    res.json(rows);
  });
});

module.exports = router;
