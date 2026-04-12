import React from "react";
import { useNavigate } from "react-router-dom";
import { THEMES } from "../config/themes";

const LandingPage: React.FC = () => {
  const nav = useNavigate();

  return (
    <div style={{ background: "#0A0A1A", color: "#fff", minHeight: "100vh", overflow: "hidden" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 5%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#6366F1,#EC4899)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18 }}>S</div>
          <span style={{ fontWeight: 700, fontSize: 22 }}>StoreBuilder</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => nav("/auth")} className="btn-press" style={{ padding: "10px 24px", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, background: "transparent", color: "#fff", fontSize: 14, fontWeight: 500 }}>Login</button>
          <button onClick={() => nav("/auth")} className="btn-press" style={{ padding: "10px 24px", border: "none", borderRadius: 10, background: "linear-gradient(135deg,#6366F1,#EC4899)", color: "#fff", fontSize: 14, fontWeight: 600 }}>Get Started Free</button>
        </div>
      </nav>

      <section style={{ textAlign: "center", padding: "80px 5% 60px", position: "relative" }}>
        <div style={{ position: "absolute", top: "10%", left: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.3),transparent)", filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "20%", right: "15%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle,rgba(236,72,153,0.25),transparent)", filter: "blur(80px)", pointerEvents: "none" }} />

        <div className="fade-up" style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-block", padding: "6px 20px", borderRadius: 50, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", fontSize: 13, fontWeight: 500, color: "#818CF8", marginBottom: 28 }}>🚀 Build Your Dream Store in Minutes</div>
          <h1 style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24, background: "linear-gradient(135deg,#fff 0%,#C7D2FE 50%,#FBCFE8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Create Beautiful<br />Online Stores<br /><span style={{ background: "linear-gradient(135deg,#6366F1,#EC4899)", WebkitBackgroundClip: "text" }}>With Zero Code</span>
          </h1>
          <p style={{ fontSize: "clamp(1rem,2vw,1.2rem)", color: "#94A3B8", maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Choose from stunning themes — Grocery, E-commerce, Toys, Pet Shop. Each with unique design, products, and admin panel.
          </p>
          <button onClick={() => nav("/auth")} className="btn-press" style={{ padding: "16px 40px", border: "none", borderRadius: 14, background: "linear-gradient(135deg,#6366F1,#EC4899)", color: "#fff", fontWeight: 700, fontSize: 16, boxShadow: "0 8px 30px rgba(99,102,241,0.4)" }}>
            Start Building — It's Free →
          </button>
        </div>
      </section>

      <section style={{ padding: "40px 5% 80px" }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 700, marginBottom: 48 }}>
          <span style={{ color: "#94A3B8" }}>4 Stunning Themes, </span>
          <span style={{ background: "linear-gradient(135deg,#6366F1,#EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Infinite Possibilities</span>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
          {Object.values(THEMES).map((t, i) => (
            <div key={t.id} className="hover-lift fade-up" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 28, cursor: "pointer", animationDelay: `${i * 0.1}s`, backdropFilter: "blur(10px)" }}>
              <div style={{ fontSize: 48, marginBottom: 16, animation: "float 3s ease-in-out infinite", animationDelay: `${i * 0.5}s` }}>{t.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{t.name}</h3>
              <p style={{ color: "#94A3B8", fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>{t.tagline}</p>
              <div style={{ display: "flex", gap: 6 }}>
                {[t.colors.primary, t.colors.secondary, t.colors.accent, t.colors.bg].map((c, j) => (
                  <div key={j} style={{ width: 24, height: 24, borderRadius: 6, background: c, border: "2px solid rgba(255,255,255,0.1)" }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "60px 5% 100px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 24, maxWidth: 900, margin: "0 auto" }}>
          {[
            { icon: "⚡", title: "Lightning Fast", desc: "Optimized for speed and performance" },
            { icon: "📱", title: "Mobile First", desc: "Perfect on every device and screen" },
            { icon: "🎨", title: "Unique Themes", desc: "Each theme is completely different" },
            { icon: "🔒", title: "Secure & Safe", desc: "JWT auth and encrypted data" },
          ].map((f, i) => (
            <div key={i} className="fade-up" style={{ textAlign: "center", padding: 32, borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", animationDelay: `${i * 0.1}s` }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{f.icon}</div>
              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{f.title}</h4>
              <p style={{ color: "#64748B", fontSize: 13, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
