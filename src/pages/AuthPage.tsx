import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { apiRegister, apiLogin, apiGoogleAuth } from "../config/api";

const AuthPage: React.FC = () => {
  const nav = useNavigate();
  const { setAuth } = useAuth();
  const [mode, setMode] = useState<"register" | "login">("register");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (mode === "register" && !form.name.trim()) e.name = "Name required";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (form.password.length < 6) e.password = "Min 6 characters";
    if (mode === "register" && !/^\d{10}$/.test(form.phone)) e.phone = "10-digit phone";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;
    setLoading(true);
    try {
      const { data } = await apiGoogleAuth({
        idToken: credentialResponse.credential,
        role: "superadmin",
      });
      if (data.user.role !== "superadmin") {
        toast.error("Unauthorized: Only super admins can access this portal.");
        setLoading(false);
        return;
      }
      setAuth(data.user, data.token);
      toast.success("Welcome, Super Admin!");
      nav("/create-store");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Google login failed");
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = mode === "register" ? await apiRegister(form) : await apiLogin({ email: form.email, password: form.password });
      
      if (data.user.role === "superadmin") {
         toast.error("Please log in via the management portal (admin. domain).");
         setLoading(false);
         return;
      }
      
      setAuth(data.user, data.token);
      toast.success(mode === "register" ? "Account created! 🎉" : "Welcome back! 👋");
      nav("/create-store");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  const inp = (field: string) => ({
    style: {
      width: "100%", padding: "14px 16px", borderRadius: 12, fontSize: 15,
      border: `2px solid ${errors[field] ? "#EF4444" : "#E2E8F0"}`, background: "#F8FAFC", transition: "border 0.2s",
    } as React.CSSProperties,
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#0A0A1A 0%,#1E1B4B 100%)", padding: 20 }}>
      <div className="fade-up" style={{ background: "#fff", borderRadius: 28, padding: "clamp(28px,5vw,48px)", width: "100%", maxWidth: 440, boxShadow: "0 25px 80px rgba(0,0,0,0.3)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, margin: "0 auto 16px", background: "linear-gradient(135deg,#6366F1,#EC4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "#fff" }}>S</div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#1E293B" }}>{mode === "register" ? "Create Account" : "Welcome Back"}</h2>
          <p style={{ color: "#94A3B8", fontSize: 14, marginTop: 6 }}>{mode === "register" ? "Start building your store today" : "Log in to your dashboard"}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {mode === "register" && (
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>Full Name</label>
              <input {...inp("name")} placeholder="John Doe" value={form.name} onChange={(e) => set("name", e.target.value)} />
              {errors.name && <span style={{ color: "#EF4444", fontSize: 12 }}>{errors.name}</span>}
            </div>
          )}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>Email</label>
            <input {...inp("email")} type="email" placeholder="you@email.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
            {errors.email && <span style={{ color: "#EF4444", fontSize: 12 }}>{errors.email}</span>}
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>Password</label>
            <input {...inp("password")} type="password" placeholder="Min 6 characters" value={form.password} onChange={(e) => set("password", e.target.value)} />
            {errors.password && <span style={{ color: "#EF4444", fontSize: 12 }}>{errors.password}</span>}
          </div>
          {mode === "register" && (
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>Phone</label>
              <input {...inp("phone")} placeholder="10-digit number" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              {errors.phone && <span style={{ color: "#EF4444", fontSize: 12 }}>{errors.phone}</span>}
            </div>
          )}
          <button onClick={handleSubmit} disabled={loading} className="btn-press" style={{ width: "100%", padding: 15, border: "none", borderRadius: 12, background: "linear-gradient(135deg,#6366F1,#EC4899)", color: "#fff", fontWeight: 700, fontSize: 16, marginTop: 8, opacity: loading ? 0.6 : 1, boxShadow: "0 6px 20px rgba(99,102,241,0.3)" }}>
            {loading ? "Please wait..." : mode === "register" ? "Create Account" : "Log In"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
            <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
            <span style={{ fontSize: 13, color: "#94A3B8" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google login failed")}
              size="large"
              shape="pill"
              text="signin_with"
            />
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "#94A3B8" }}>
          {mode === "register" ? "Already have an account? " : "Don't have an account? "}
          <span onClick={() => setMode(mode === "register" ? "login" : "register")} style={{ color: "#6366F1", fontWeight: 600, cursor: "pointer" }}>
            {mode === "register" ? "Log In" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
