import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { apiLogin } from "../../config/api";

const SuperAdminLogin: React.FC = () => {
  const nav = useNavigate();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Credentials required");
    
    setLoading(true);
    try {
      const { data } = await apiLogin({ email, password });
      if (data.user.role !== "superadmin") {
        toast.error("Unauthorized access.");
        setLoading(false);
        return;
      }
      setAuth(data.user, data.token);
      toast.success("Welcome, Super Admin");
      nav("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050505", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
      <div style={{ background: "#111", border: "1px solid #333", padding: 40, borderRadius: 12, width: "100%", maxWidth: 400, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, background: "#fff", color: "#000", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, margin: "0 auto 16px" }}>S</div>
          <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 600, margin: 0 }}>System Management</h2>
          <p style={{ color: "#888", fontSize: 13, marginTop: 4 }}>Restricted Access Portal</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ color: "#aaa", fontSize: 12, fontWeight: 500, marginBottom: 8, display: "block" }}>Admin Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
              placeholder="admin@system.com"
            />
          </div>
          <div>
             <label style={{ color: "#aaa", fontSize: 12, fontWeight: 500, marginBottom: 8, display: "block" }}>Master Password</label>
             <input 
               type="password" 
               value={password} 
               onChange={e => setPassword(e.target.value)}
               style={{ width: "100%", padding: "12px 16px", background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
               placeholder={"••••••••"}
             />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ marginTop: 12, padding: "14px", background: "#fff", color: "#000", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Authenticating..." : "Authorize"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
