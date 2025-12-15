import { Link } from "react-router-dom";
import { isAdmin, isLogistics, isCommander, logout } from "../utils/auth";

import "../styles/common.css";


export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <span className="logo">Military Asset System</span>

       
        <Link to="/dashboard">Dashboard</Link>

       
        {(isAdmin() || isLogistics()) && (
          <Link to="/purchases">Purchases</Link>
        )}

        
        {(isAdmin() || isLogistics()) && (
          <Link to="/transfers">Transfers</Link>
        )}
        {(isAdmin() || isCommander()) && (
          <Link to="/assignments">Assignments</Link>
        )}
      </div>

      <div className="nav-right">
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
