import React, { useState, useEffect } from "react";
import { ThemeConfig, DashboardStats } from "../../types";
import { apiGetDashboardStats, apiGetProducts, apiGetCategories } from "../../config/api";
import { IconOrder, IconChart, IconUsers, IconBox, IconStar } from "../../components/Icons";

const DashboardTab: React.FC<{ theme: ThemeConfig }> = ({ theme }) => {
  const c = theme.colors;
  const f = theme.fonts;
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, p] = await Promise.all([apiGetDashboardStats(), apiGetProducts()]);
        setStats(s.data);
        setProductCount(p.data.total || 0);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div style={{ textAlign: "center", padding: 60, color: c.textMuted }}>Loading dashboard...</div>;

  const statCards = [
    { label: "Total Orders", value: stats?.totalOrders || 0, icon: <IconOrder />, color: c.primary, change: "+12%" },
    { label: "Revenue", value: `₹${((stats?.revenue || 0) / 1000).toFixed(0)}K`, icon: <IconChart />, color: c.secondary, change: "+8%" },
    { label: "Products", value: productCount, icon: <IconBox />, color: c.success, change: "+5" },
  ];

  const statusColor = (s: string) => {
    if (s === "delivered") return c.success;
    if (s === "processing") return "#3B82F6";
    if (s === "shipped") return c.primary;
    return c.textMuted;
  };

  return (
    <div className="fade-up">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
        {statCards.map((st, i) => (
          <div key={i} className="hover-lift" style={{ background: c.bgCard, borderRadius: theme.cardRadius, padding: "clamp(16px,2vw,24px)", border: `1px solid ${c.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${st.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: st.color }}>{st.icon}</div>
              <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: `${c.success}15`, color: c.success }}>{st.change}</span>
            </div>
            <div style={{ fontSize: "clamp(1.2rem,2.5vw,1.8rem)", fontWeight: 700, color: c.text, fontFamily: f.heading }}>{st.value}</div>
            <div style={{ fontSize: 13, color: c.textMuted, marginTop: 2 }}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart + Recent Orders */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
        <div style={{ background: c.bgCard, borderRadius: theme.cardRadius, padding: 24, border: `1px solid ${c.border}` }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: c.text, marginBottom: 20, fontFamily: f.heading }}>Revenue Overview</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 160 }}>
            {(() => {
              const data = stats?.monthlyRevenue?.length ? stats.monthlyRevenue : Array.from({ length: 12 }, (_, i) => ({ _id: i + 1, total: Math.random() * 50000 + 10000 }));
              const max = Math.max(1, ...data.map((x: any) => x.total || 0));
              return data.map((m: any, i: number) => {
                const h = Math.max(10, ((m.total || 0) / max) * 100);
                return (
                  <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "6px 6px 0 0", background: i === data.length - 1 ? c.primary : `${c.primary}30`, transition: "height 0.5s" }} />
                );
              });
            })()}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            {["J","F","M","A","M","J","J","A","S","O","N","D"].map((m, i) => (
              <span key={i} style={{ fontSize: 10, color: c.textMuted, flex: 1, textAlign: "center" }}>{m}</span>
            ))}
          </div>
        </div>

        <div style={{ background: c.bgCard, borderRadius: theme.cardRadius, padding: 24, border: `1px solid ${c.border}` }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: c.text, marginBottom: 16, fontFamily: f.heading }}>Recent Orders</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(stats?.recentOrders || []).map((o) => (
              <div key={o._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 10, background: c.bg, fontSize: 13 }}>
                <div>
                  <div style={{ fontWeight: 600, color: c.text }}>{o.customer.name}</div>
                  <div style={{ fontSize: 11, color: c.textMuted }}>{new Date(o.createdAt).toLocaleDateString()}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, color: c.text }}>₹{o.totalAmount}</div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: statusColor(o.status), padding: "2px 8px", borderRadius: 4, background: `${statusColor(o.status)}15` }}>{o.status}</span>
                </div>
              </div>
            ))}
            {!stats?.recentOrders?.length && <p style={{ color: c.textMuted, textAlign: "center", padding: 20 }}>No orders yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
