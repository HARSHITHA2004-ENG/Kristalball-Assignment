import { useEffect, useState } from "react";
import API from "../utils/api";
import "../styles/common.css";

export default function Purchases() {
  const [rows, setRows] = useState([]);


  const [assetId, setAssetId] = useState("");
  const [quantity, setQuantity] = useState("");

  const [assetFilter, setAssetFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const loadPurchases = async () => {
    try {
      const res = await API.get("/purchases");
      setRows(res.data);
    } catch {
      alert("Failed to load purchases");
    }
  };

  useEffect(() => {
    loadPurchases();
  }, []);


  const submitPurchase = async () => {
    if (!assetId || !quantity) {
      alert("Select asset and quantity");
      return;
    }

    try {
      await API.post("/purchases", {
        asset_id: assetId,
        quantity: Number(quantity)
      });

      alert("Purchase recorded");
      setAssetId("");
      setQuantity("");
      loadPurchases();
    } catch (err) {
      alert("Not authorized or failed");
    }
  };

  const filteredRows = rows.filter(p => {
    if (assetFilter !== "ALL" && String(p.asset_id) !== assetFilter)
      return false;

    if (fromDate && new Date(p.created_at) < new Date(fromDate))
      return false;

    if (toDate && new Date(p.created_at) > new Date(toDate))
      return false;

    return true;
  });

  return (
    <div className="page">
      <div className="title">Asset Purchases</div>

  
      <div className="card">
        <h3>Filter Purchases</h3>

        <select
          value={assetFilter}
          onChange={e => setAssetFilter(e.target.value)}
        >
          <option value="ALL">All Assets</option>
          <option value="1">Rifle</option>
          <option value="2">Tank</option>
          <option value="3">Ammo Box</option>
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
        />

        <input
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
        />
      </div>

  
      <div className="card">
        <h3>Record Purchase</h3>

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
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
        />

        <button onClick={submitPurchase}>Save</button>
      </div>

    
      {filteredRows.map(p => (
        <div className="card" key={p.purchase_id}>
          <div className="row">
            <span>Base</span>
            <span>{p.base_id}</span>
          </div>

          <div className="row">
            <span>Asset</span>
            <span>{p.asset_name}</span>
          </div>

          <div className="row">
            <span>Quantity</span>
            <span>{p.quantity}</span>
          </div>

          <div className="row">
            <span>Date</span>
            <span>
              {p.created_at
                ? new Date(p.created_at.replace(" ", "T")).toLocaleDateString()
                : "-"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
