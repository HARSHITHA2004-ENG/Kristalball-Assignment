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

    if (!asset_id || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }
    db.query(
      `SELECT quantity FROM inventory WHERE base_id = ? AND asset_id = ?`,
      [base_id, asset_id],
      (err, rows) => {
        if (err) {
          return res.status(500).json({ message: "Inventory check failed" });
        }

        if (rows.length === 0 || rows[0].quantity < quantity) {
          return res.status(400).json({
            message: "Insufficient inventory"
          });
        }

        db.query(
          `
          UPDATE inventory
          SET quantity = quantity - ?
          WHERE base_id = ? AND asset_id = ?
          `,
          [quantity, base_id, asset_id],
          err => {
            if (err) {
              return res.status(500).json({
                message: "Inventory update failed"
              });
            }

           
            db.query(
              `
              INSERT INTO assignments (base_id, asset_id, quantity, status)
              VALUES (?, ?, ?, 'ASSIGNED')
              `,
              [base_id, asset_id, quantity],
              (err, result) => {
                if (err) {
                  return res.status(500).json({
                    message: "Assignment failed"
                  });
                }

                res.json({
                  message: "Asset assigned successfully",
                  assignment_id: result.insertId
                });
              }
            );
          }
        );
      }
    );
  }
);
router.get("/", auth, (req, res) => {
  const sql = `
    SELECT
      a.assignment_id,
      a.base_id,
      a.asset_id,
      ast.asset_name,
      ast.asset_type,
      a.quantity,
      a.status,
      a.created_at
    FROM assignments a
    JOIN assets ast ON ast.asset_id = a.asset_id
    WHERE a.base_id = ?
    ORDER BY a.created_at DESC
  `;

  db.query(sql, [req.user.base_id], (err, rows) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch assignments"
      });
    }

    res.json(rows);
  });
});

module.exports = router;
