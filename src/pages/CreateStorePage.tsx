import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { apiCreateStore, apiGetMyStore } from "../config/api";

const CreateStorePage: React.FC = () => {
  const nav = useNavigate();
  const { store, setStore } = useAuth();
  const [form, setForm] = useState({ name: "", description: "", address: "", city: "", pincode: "", phone: "", email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (store) nav("/admin");
  }, [store]);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleCreate = async () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Store name required";
    if (!form.description.trim()) e.description = "Description required";
    if (!form.city.trim()) e.city = "City required";
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    try {
      // First go to theme selection with store data
      nav("/select-theme", { state: { storeData: form } });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error");
    }
    setLoading(false);
  };

  const inp = (field: string): React.InputHTMLAttributes<HTMLInputElement> & { style: React.CSSProperties } => ({
    style: { width: "100%", padding: "14px 16px", borderRadius: 12, fontSize: 15, border: `2px solid ${errors[field] ? "#EF4444" : "#E2E8F0"}`, background: "#F8FAFC" },
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#0F172A,#1E1B4B)", padding: 20 }}>
      <div className="fade-up" style={{ background: "#fff", borderRadius: 28, padding: "clamp(28px,5vw,48px)", width: "100%", maxWidth: 520, boxShadow: "0 25px 80px rgba(0,0,0,0.3)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🏪</div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#1E293B" }}>Create Your Store</h2>
          <p style={{ color: "#94A3B8", fontSize: 14, marginTop: 6 }}>Tell us about your business</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>Store Name *</label>
            <input {...inp("name")} placeholder="My Awesome Store" value={form.name} onChange={(e) => set("name", e.target.value)} />
            {errors.name && <span style={{ color: "#EF4444", fontSize: 12 }}>{errors.name}</span>}
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>Description *</label>
            <textarea style={{ ...inp("description").style, minHeight: 80, resize: "vertical" } as any} placeholder="What does your store sell?" value={form.description} onChange={(e) => set("description", e.target.value)} />
            {errors.description && <span style={{ color: "#EF4444", fontSize: 12 }}>{errors.description}</span>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>City *</label>
              <input {...inp("city")} placeholder="Mumbai" value={form.city} onChange={(e) => set("city", e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>Pin Code</label>
              <input {...inp("pincode")} placeholder="400001" value={form.pincode} onChange={(e) => set("pincode", e.target.value)} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>Address</label>
            <input {...inp("address")} placeholder="Shop no, Street, Area" value={form.address} onChange={(e) => set("address", e.target.value)} />
          </div>
          <button onClick={handleCreate} disabled={loading} className="btn-press" style={{ width: "100%", padding: 15, border: "none", borderRadius: 12, background: "linear-gradient(135deg,#6366F1,#EC4899)", color: "#fff", fontWeight: 700, fontSize: 16, marginTop: 8, opacity: loading ? 0.6 : 1 }}>
            {loading ? "Creating..." : "Continue to Theme Selection →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateStorePage;
