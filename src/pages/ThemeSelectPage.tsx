import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { apiCreateStore } from "../config/api";
import { THEMES } from "../config/themes";
import { ThemeType } from "../types";
import { IconCheck } from "../components/Icons";

const ThemeSelectPage: React.FC = () => {
  const nav = useNavigate();
  const location = useLocation();
  const { setStore } = useAuth();
  const storeData = (location.state as any)?.storeData;
  const [selected, setSelected] = useState<ThemeType | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selected) { toast.error("Please select a theme!"); return; }
    setLoading(true);
    try {
      const { data } = await apiCreateStore({ ...storeData, theme: selected });
      setStore(data.store);
      toast.success(`${THEMES[selected].name} theme activated! 🚀`);
      nav("/admin");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error creating store");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0F172A,#1E1B4B)", padding: "40px 5%" }}>
      <div className="fade-up" style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48, color: "#fff" }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🎨</div>
          <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.5rem)", fontWeight: 700 }}>Choose Your Theme</h2>
          <p style={{ color: "#94A3B8", fontSize: 16, marginTop: 8 }}>Each theme has unique design, products & admin panel</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24, marginBottom: 40 }}>
          {Object.values(THEMES).map((t) => {
            const isSel = selected === t.id;
            return (
              <div key={t.id} onClick={() => setSelected(t.id)} className="fade-up" style={{
                background: isSel ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                border: `2px solid ${isSel ? t.colors.primary : "rgba(255,255,255,0.06)"}`,
                borderRadius: 24, padding: 28, cursor: "pointer", transition: "all 0.3s",
                transform: isSel ? "scale(1.02)" : "none",
                boxShadow: isSel ? `0 12px 40px ${t.colors.primary}40` : "none",
                position: "relative",
              }}>
                {isSel && (
                  <div style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: "50%", background: t.colors.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><IconCheck /></div>
                )}
                <div style={{ fontSize: 56, marginBottom: 16 }}>{t.icon}</div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 6, fontFamily: t.fonts.heading }}>{t.name}</h3>
                <p style={{ color: "#94A3B8", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>{t.tagline}</p>
                <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                  {[t.colors.primary, t.colors.secondary, t.colors.accent, t.colors.bg].map((c, j) => (
                    <div key={j} style={{ width: 28, height: 28, borderRadius: 8, background: c, border: "2px solid rgba(255,255,255,0.15)" }} />
                  ))}
                </div>
                <div style={{ padding: "10px 16px", borderRadius: t.btnRadius, background: isSel ? t.colors.gradient : "rgba(255,255,255,0.06)", textAlign: "center", fontWeight: 600, fontSize: 14, color: isSel ? "#fff" : "#94A3B8" }}>
                  {isSel ? "✓ Selected" : "Select Theme"}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center" }}>
          <button onClick={handleContinue} disabled={loading} className="btn-press" style={{
            padding: "16px 48px", border: "none", borderRadius: 14,
            background: selected ? THEMES[selected].colors.gradient : "linear-gradient(135deg,#6366F1,#EC4899)",
            color: "#fff", fontWeight: 700, fontSize: 17, opacity: selected && !loading ? 1 : 0.5,
            boxShadow: "0 8px 30px rgba(99,102,241,0.4)",
          }}>{loading ? "Creating Store..." : "Launch Admin Panel →"}</button>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelectPage;
