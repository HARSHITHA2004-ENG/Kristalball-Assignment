import { useEffect, useState } from "react";
import API from "../utils/api";
import "./dashboard.css";

export default function Dashboard() {
  const [data, setData] = useState(null);

  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    base_id: "",
    asset_type: ""
  });

  const loadDashboard = () => {
    API.get("/dashboard", { params: filters })
      .then(res => setData(res.data))
      .catch(() => alert("Failed to load dashboard"));
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="dashboard-page">
      <h2 className="dashboard-title">Dashboard</h2>

      {/* FILTERS */}
      <div className="filter-bar">
        <input type="date" name="start_date" onChange={handleChange} />
        <input type="date" name="end_date" onChange={handleChange} />
        <input placeholder="Base ID" name="base_id" onChange={handleChange} />
        <select name="asset_type" onChange={handleChange}>
          <option value="">All Equipment</option>
          <option value="Weapon">Weapon</option>
          <option value="Vehicle">Vehicle</option>
          <option value="Ammo">Ammo</option>
        </select>

        <button onClick={loadDashboard}>Apply Filters</button>
      </div>

      {!data ? (
        <h3>Loading...</h3>
      ) : (
        <div className="dashboard-grid">
          <Card title="Opening Balance" value={data.opening_balance} />
          <Card title="Purchases" value={data.purchases} />
          <Card title="Transfer In" value={data.transfer_in} />
          <Card title="Transfer Out" value={data.transfer_out} />
          <Card title="Assigned" value={data.assigned} />
          <Card title="Expended" value={data.expended} />
          <Card title="Net Movement" value={data.net_movement} />
          <Card title="Closing Balance" value={data.closing_balance} />
        </div>
      )}
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="dashboard-card">
      <p>{title}</p>
      <h3>{value}</h3>
    </div>
  );
}
