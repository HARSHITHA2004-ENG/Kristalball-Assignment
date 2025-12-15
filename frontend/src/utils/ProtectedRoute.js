import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Purchases from "./pages/Purchases";
import Transfers from "./pages/Transfers";
import Assignments from "./pages/Assignments";

import RoleRoute from "./components/RoleRoute";
import Navbar from "./components/Navbar";

export default function App() {
  const isAuth = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      {/* Show navbar only after login */}
      {isAuth && <Navbar />}

      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={!isAuth ? <Login /> : <Navigate to="/dashboard" />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={isAuth ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* Purchases (ADMIN, LOGISTICS) */}
        <Route
          path="/purchases"
          element={
            <RoleRoute allowedRoles={["ADMIN", "LOGISTICS"]}>
              <Purchases />
            </RoleRoute>
          }
        />

        {/* Transfers (ADMIN, LOGISTICS) */}
        <Route
          path="/transfers"
          element={
            <RoleRoute allowedRoles={["ADMIN", "LOGISTICS"]}>
              <Transfers />
            </RoleRoute>
          }
        />

        {/* Assignments (ADMIN, COMMANDER) */}
        <Route
          path="/assignments"
          element={
            <RoleRoute allowedRoles={["ADMIN", "COMMANDER"]}>
              <Assignments />
            </RoleRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
