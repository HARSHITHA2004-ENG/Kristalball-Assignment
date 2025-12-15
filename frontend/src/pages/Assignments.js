import { useEffect, useState } from "react";
import API from "../utils/api";
import "../styles/common.css";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [expenditures, setExpenditures] = useState([]); 
  const [assetId, setAssetId] = useState("");
  const [quantity, setQuantity] = useState("");

  
  const loadAssignments = () => {
    API.get("/assignments")
      .then(res => setAssignments(res.data))
      .catch(() => alert("Failed to load assignments"));
  };

  
  const loadExpenditures = () => {
    API.get("/expenditures")
      .then(res => setExpenditures(res.data))
      .catch(() => alert("Failed to load expenditures"));
  };

  useEffect(() => {
    loadAssignments();
    loadExpenditures(); 
  }, []);

  
  const assignAsset = async () => {
    if (!assetId || !quantity) {
      alert("Enter asset & quantity");
      return;
    }

    try {
      await API.post("/assignments", {
        asset_id: Number(assetId),
        quantity: Number(quantity)
      });

      alert("Asset assigned successfully");
      setAssetId("");
      setQuantity("");
      loadAssignments();
      loadExpenditures(); 
    } catch (err) {
      alert(err.response?.data?.message || "Assignment failed");
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Assignments & Expenditures</h2>

      
      <div className="card">
        <h3>Assign Asset</h3>

        <input
          placeholder="Asset ID"
          value={assetId}
          onChange={e => setAssetId(e.target.value)}
        />

        <input
          placeholder="Quantity"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
        />

        <button onClick={assignAsset}>Assign</button>
      </div>

    
      <h3 style={{ marginTop: "25px" }}>Assignment History</h3>

      <div className="dashboard-grid">
        {assignments.map(a => (
          <div className="dashboard-card" key={a.assignment_id}>
            <p><b>Base:</b> {a.base_id}</p>
            <p><b>Asset:</b> {a.asset_name}</p>
            <p><b>Type:</b> {a.asset_type}</p>
            <p><b>Quantity:</b> {a.quantity}</p>
            <p><b>Status:</b> {a.status}</p>
            <p>
              <b>Date:</b>{" "}
              {new Date(a.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

    
      <h3 style={{ marginTop: "35px" }}>Expenditures</h3>

      <div className="dashboard-grid">
        {expenditures.map(e => (
          <div className="dashboard-card" key={e.id}>
            <p><b>Base:</b> {e.base_id}</p>
            <p><b>Asset:</b> {e.asset_name}</p>
            <p><b>Type:</b> {e.asset_type}</p>
            <p><b>Quantity Used:</b> {e.quantity}</p>
            <p>
              <b>Date:</b>{" "}
              {e.date
                ? new Date(e.date).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
