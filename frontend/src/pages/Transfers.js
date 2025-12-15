import { useEffect, useState } from "react";
import API from "../utils/api";
import "../styles/common.css";

export default function Transfers() {
  const [rows, setRows] = useState([]);

  
  const [toBase, setToBase] = useState("");
  const [assetId, setAssetId] = useState("");
  const [quantity, setQuantity] = useState("");


  const loadTransfers = async () => {
    try {
      const res = await API.get("/transfers");
      setRows(res.data);
    } catch {
      alert("Failed to load transfers");
    }
  };

  useEffect(() => {
    loadTransfers();
  }, []);

  const submitTransfer = async () => {
    if (!toBase || !assetId || !quantity) {
      alert("All fields required");
      return;
    }

    try {
      await API.post("/transfers", {
        to_base: Number(toBase),
        asset_id: Number(assetId),
        quantity: Number(quantity)
      });

      alert("Transfer successful");
      setToBase("");
      setAssetId("");
      setQuantity("");
      loadTransfers();
    } catch (err) {
      alert("Transfer failed (check inventory)");
    }
  };

  return (
    <div className="page">
      <div className="title">Asset Transfers</div>

      <div className="card">
        <h3>Transfer Asset</h3>

        <input
          placeholder="To Base ID"
          value={toBase}
          onChange={e => setToBase(e.target.value)}
        />

        <select
          value={assetId}
          onChange={e => setAssetId(e.target.value)}
        >
          <option value="">Select Asset</option>
          <option value="1">Rifle</option>
          <option value="2">Tank</option>
          <option value="3">Ammo Box</option>
        </select>

        <input
          placeholder="Quantity"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
        />

        <button onClick={submitTransfer}>Transfer</button>
      </div>

      {rows.map(t => (
        <div className="card" key={t.transfer_id}>
          <div className="row">
            <span>From Base</span>
            <span>{t.from_base}</span>
          </div>

          <div className="row">
            <span>To Base</span>
            <span>{t.to_base}</span>
          </div>

          <div className="row">
            <span>Asset</span>
            <span>{t.asset_name}</span>
          </div>

          <div className="row">
            <span>Quantity</span>
            <span>{t.quantity}</span>
          </div>

          <div className="row">
            <span>Date</span>
            <span>
              {new Date(t.created_at).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
