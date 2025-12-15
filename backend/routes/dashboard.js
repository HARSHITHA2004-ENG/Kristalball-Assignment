const router = require("express").Router();
const db = require("../db");
const auth = require("../middleware/auth");

router.get("/", auth, (req, res) => {
  const baseId = req.user.base_id;

  const qPurchases = `
    SELECT IFNULL(SUM(quantity), 0) AS purchases
    FROM purchases
    WHERE base_id = ?
  `;

  const qTransferIn = `
    SELECT IFNULL(SUM(quantity), 0) AS transfer_in
    FROM transfers
    WHERE to_base = ?
  `;

  const qTransferOut = `
    SELECT IFNULL(SUM(quantity), 0) AS transfer_out
    FROM transfers
    WHERE from_base = ?
  `;

  const qAssigned = `
    SELECT IFNULL(SUM(quantity), 0) AS assigned
    FROM assignments
    WHERE base_id = ?
  `;

  const qExpended = `
    SELECT IFNULL(SUM(quantity), 0) AS expended
    FROM expenditures
    WHERE base_id = ?
  `;

  const qInventory = `
    SELECT IFNULL(SUM(quantity), 0) AS inventory
    FROM inventory
    WHERE base_id = ?
  `;

  db.query(qPurchases, [baseId], (e1, r1) => {
    db.query(qTransferIn, [baseId], (e2, r2) => {
      db.query(qTransferOut, [baseId], (e3, r3) => {
        db.query(qAssigned, [baseId], (e4, r4) => {
          db.query(qExpended, [baseId], (e5, r5) => {
            db.query(qInventory, [baseId], (e6, r6) => {

              if (e1 || e2 || e3 || e4 || e5 || e6) {
                return res.status(500).json({ message: "Dashboard query failed" });
              }

              const purchases = r1[0].purchases;
              const transferIn = r2[0].transfer_in;
              const transferOut = r3[0].transfer_out;
              const assigned = r4[0].assigned;
              const expended = r5[0].expended;
              const openingBalance = 0; 
              const netMovement = purchases + transferIn - transferOut;
              const closingBalance =
                openingBalance + netMovement - assigned - expended;

              res.json({
                opening_balance: openingBalance,
                purchases,
                transfer_in: transferIn,
                transfer_out: transferOut,
                assigned,
                expended,
                net_movement: netMovement,
                closing_balance: closingBalance
              });

            });
          });
        });
      });
    });
  });
});

module.exports = router;
