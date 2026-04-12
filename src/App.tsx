import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import SuperAdminPanel from "./pages/superadmin/SuperAdminPanel";
import SuperAdminLogin from "./pages/superadmin/SuperAdminLogin";
import { Toaster } from "react-hot-toast";

const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: string }> = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ fontSize: 24, fontWeight: 600, color: "#94A3B8" }}>Loading...</div></div>;
  if (!user) return <Navigate to="/" />; // redirect to super admin login
  if (role === "superadmin" && user.role !== "superadmin") return <Navigate to="/" />; // kick out normal users
  return <>{children}</>;
};

const App: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={user && user.role === "superadmin" ? <Navigate to="/dashboard" /> : <SuperAdminLogin />} />
        <Route path="/dashboard" element={<ProtectedRoute role="superadmin"><SuperAdminPanel /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
