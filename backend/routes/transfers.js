const router = require("express").Router();
const db = require("../db");
const auth = require("../middleware/auth");
const rbac = require("../middleware/rbac");


router.post(
  "/",
  auth,
  rbac(["ADMIN", "LOGISTICS"]),
  (req, res) => {
    let { from_base, to_base, asset_id, quantity } = req.body;

    if (req.user.role !== "ADMIN") {
      from_base = req.user.base_id;
    }

    if (!from_base || !to_base || !asset_id || !quantity) {
      return res.status(400).json({
        message: "from_base, to_base, asset_id, quantity are required"
      });
    }

    if (from_base === to_base) {
      return res.status(400).json({
        message: "from_base and to_base cannot be same"
      });
    }
    db.query(
      `
      INSERT INTO transfers (from_base, to_base, asset_id, quantity)
      VALUES (?, ?, ?, ?)
      `,
      [from_base, to_base, asset_id, quantity],
      (err, result) => {
        if (err) {
          console.error("TRANSFER INSERT ERROR:", err);
          return res.status(500).json({
            message: "Failed to record transfer"
          });
        }

        res.json({
          message: "Transfer completed successfully",
          transfer_id: result.insertId
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
        t.transfer_id,
        t.from_base,
        t.to_base,
        t.asset_id,
        a.asset_name,
        a.asset_type,
        t.quantity,
        t.created_at
      FROM transfers t
      JOIN assets a ON a.asset_id = t.asset_id
      ORDER BY t.created_at DESC
    `
    : `
      SELECT
        t.transfer_id,
        t.from_base,
        t.to_base,
        t.asset_id,
        a.asset_name,
        a.asset_type,
        t.quantity,
        t.created_at
      FROM transfers t
      JOIN assets a ON a.asset_id = t.asset_id
      WHERE t.from_base = ? OR t.to_base = ?
      ORDER BY t.created_at DESC
    `;

  const params = isAdmin
    ? []
    : [req.user.base_id, req.user.base_id];

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error("GET TRANSFERS ERROR:", err);
      return res.status(500).json({
        message: "Failed to fetch transfers"
      });
    }

    res.json(rows);
  });
});

module.exports = router;
