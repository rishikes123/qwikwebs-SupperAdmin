import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { SuperDashboard, IUser, IStore } from "../../types";
import {
  apiGetSuperDashboard, apiGetAllUsers, apiToggleUser, apiDeleteUser, apiGetUserDetails, apiUpdateUser,
  apiGetAllStoresAdmin, apiToggleStore, apiDeleteStoreAdmin, apiUpdateStoreSubscription,
  apiGetSaaSPlans, apiCreateSaaSPlan, apiUpdateSaaSPlan, apiDeleteSaaSPlan, apiGetDetailedAnalytics,
  apiGetPlatformSettings, apiUpdatePlatformSettings, apiUploadImage,
  apiGetAnnouncements, apiCreateAnnouncement, apiDeleteAnnouncement,
  apiGetSupportQueries, apiUpdateQueryStatus, apiDeleteSupportQuery,
  apiGetRevenueStats, apiGetAuditLogs,
  apiGetPaymentRequests, apiApprovePayment, apiRejectPayment
} from "../../config/api";
import {
  IconHome, IconUsers, IconShop, IconSettings, IconLogout, IconMenu,
  IconTrash, IconEye, IconCrown, IconChart, IconOrder, IconBox, IconImage,
  IconBell, IconMessage, IconShield, IconClose
} from "../../components/Icons";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { Plus, Edit, Trash2, MapPin, TrendingUp, Users, CreditCard, Shield, Bell, MessageSquare, AlertTriangle, DollarSign, Activity, FileText, Download, Briefcase } from "lucide-react";

const INDIA_TOPO_JSON = "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@master/topojson/india.json";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: <IconHome /> },
  { id: "stores", label: "All Stores", icon: <IconShop /> },
  { id: "users", label: "All Users", icon: <IconUsers /> },
  { id: "subscriptions", label: "Subscriptions", icon: <CreditCard size={18} /> },
  { id: "revenue", label: "Financials", icon: <DollarSign size={18} /> },
  { id: "analytics", label: "Traffic", icon: <IconChart /> },
  { id: "logs", label: "Audit Trail", icon: <Activity size={18} /> },
  { id: "system", label: "System", icon: <IconShield /> },
];

const SuperAdminPanel: React.FC = () => {
  const nav = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiGetPlatformSettings();
        if (data.success) setSettings(data.settings);
      } catch {}
    })();
  }, []);

  const brandName = settings?.platformName || "StoreBuilder";
  const brandColor = settings?.brandColor || "#6366F1";

  const handleLogout = () => { logout(); nav("/"); };

  const Sidebar = () => (
    <div style={{ width: 260, background: "#0F0F23", color: "#fff", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {settings?.platformLogoUrl ? (
            <img src={settings.platformLogoUrl} alt="Logo" style={{ height: 32, width: 32, borderRadius: 8 }} />
          ) : (
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${brandColor}, ${brandColor}99)`, display: "flex", alignItems: "center", justifyContent: "center" }}><IconCrown /></div>
          )}
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{brandName}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Terminal</div>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => { setActiveTab(t.id); setMobileMenu(false); }} className="btn-press"
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, border: "none", background: activeTab === t.id ? "rgba(255,255,255,0.1)" : "transparent", color: activeTab === t.id ? "#fff" : "rgba(255,255,255,0.5)", fontWeight: activeTab === t.id ? 600 : 400, fontSize: 14, textAlign: "left" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <button onClick={handleLogout} className="btn-press" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 12, border: "none", background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: 13, justifyContent: "center" }}>
          <IconLogout /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Sora', sans-serif" }}>
      <div className="desktop-only" style={{ position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 100 }}><Sidebar /></div>

      {mobileMenu && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000 }}>
          <div onClick={() => setMobileMenu(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: 280, animation: "slideIn 0.3s ease" }}><Sidebar /></div>
        </div>
      )}

      <div style={{ flex: 1, background: "#F8FAFC", minHeight: "100vh" }} className="sa-main">
        <style>{`@media(min-width:769px){.sa-main{margin-left:260px!important}}`}</style>

        <div className="mobile-only" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "#fff", borderBottom: "1px solid #E2E8F0", position: "sticky", top: 0, zIndex: 50 }}>
          <button onClick={() => setMobileMenu(true)} style={{ background: "none", border: "none", cursor: "pointer" }}><IconMenu /></button>
          <span style={{ fontWeight: 700, fontSize: 16 }}>{brandName}</span>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: brandColor, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>{brandName[0]}</div>
        </div>

        <div className="desktop-only" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px", background: "#fff", borderBottom: "1px solid #E2E8F0" }}>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{tabs.find((t) => t.id === activeTab)?.label}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 14, color: "#64748B" }}>{user?.name}</span>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#F59E0B,#EF4444)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>S</div>
          </div>
        </div>

        <div style={{ padding: "clamp(16px,3vw,28px)" }}>
          {activeTab === "dashboard" && <SADashboard />}
          {activeTab === "stores" && <SAStores />}
          {activeTab === "users" && <SAUsers />}
          {activeTab === "subscriptions" && <SASubscriptions />}
          {activeTab === "revenue" && <SAFinancials />}
          {activeTab === "analytics" && <SAAnalytics />}
          {activeTab === "logs" && <SAAuditLogs />}
          {activeTab === "system" && <SASystem />}
        </div>
      </div>
    </div>
  );
};

// ── Super Admin Dashboard ──
const SADashboard: React.FC = () => {
  const [data, setData] = useState<SuperDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => { try { const r = await apiGetSuperDashboard(); setData(r.data); } catch {} setLoading(false); })();
  }, []);

  if (loading) return <Loader />;

  const stats = [
    { label: "Total Users", value: data?.totalUsers || 0, icon: <IconUsers />, color: "#6366F1" },
    { label: "Total Stores", value: data?.totalStores || 0, icon: <IconShop />, color: "#EC4899" },
    { label: "Total Products", value: data?.totalProducts || 0, icon: <IconBox />, color: "#10B981" },
    { label: "Total Orders", value: data?.totalOrders || 0, icon: <IconOrder />, color: "#F59E0B" },
    { label: "Total Revenue", value: `₹${((data?.totalRevenue || 0) / 1000).toFixed(0)}K`, icon: <IconChart />, color: "#EF4444" },
  ];

  const themeColors: Record<string, string> = { grocery: "#2D7A3A", ecommerce: "#1A1A2E", toys: "#FF6B35", pet: "#8B5E3C" };
  const themeIcons: Record<string, string> = { grocery: "🥬", ecommerce: "🛍️", toys: "🧸", pet: "🐾" };

  return (
    <div className="fade-up">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div key={i} className="hover-lift" style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #E2E8F0" }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: `${s.color}12`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, marginBottom: 12 }}>{s.icon}</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1E293B" }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
        {/* Stores by Theme */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #E2E8F0" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1E293B", marginBottom: 20 }}>Stores by Theme</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(data?.storesByTheme || []).map((t) => (
              <div key={t._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 12, background: "#F8FAFC" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 24 }}>{themeIcons[t._id] || "📦"}</span>
                  <span style={{ fontWeight: 600, color: "#1E293B", textTransform: "capitalize" }}>{t._id}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: Math.max(30, t.count * 40), height: 8, borderRadius: 4, background: themeColors[t._id] || "#6366F1" }} />
                  <span style={{ fontWeight: 700, fontSize: 14, color: "#1E293B" }}>{t.count}</span>
                </div>
              </div>
            ))}
            {!data?.storesByTheme?.length && <p style={{ color: "#94A3B8", textAlign: "center" }}>No stores yet</p>}
          </div>
        </div>

        {/* Recent Stores */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #E2E8F0" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1E293B", marginBottom: 20 }}>Recent Stores</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(data?.recentStores || []).slice(0, 5).map((s: any) => (
              <div key={s._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 10, background: "#F8FAFC" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#1E293B" }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8" }}>{typeof s.owner === "object" ? s.owner.email : ""} · {s.theme}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button onClick={() => window.open(`http://localhost:5173/store/${s._id}`, "_blank")} className="btn-press" style={{ background: "none", border: "none", cursor: "pointer", color: "#6366F1", padding: 4 }} title="View Store"><IconEye /></button>
                  <span style={{ fontSize: 20 }}>{themeIcons[s.theme] || "📦"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #E2E8F0" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1E293B", marginBottom: 20 }}>Recent Users</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(data?.recentUsers || []).slice(0, 5).map((u) => (
              <div key={u._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 10, background: "#F8FAFC" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#EC4899)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12 }}>{u.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#1E293B" }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: "#94A3B8" }}>{u.email}</div>
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: u.isActive ? "#10B98115" : "#EF444415", color: u.isActive ? "#10B981" : "#EF4444" }}>{u.isActive ? "Active" : "Blocked"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── All Stores ──
const SAStores: React.FC = () => {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = async () => { try { const { data } = await apiGetAllStoresAdmin(); setStores(data.stores); } catch {} setLoading(false); };
  useEffect(() => { load(); }, []);

  const exportToCSV = () => {
    const headers = "Name,Owner,Email,Theme,Plan,Products,Orders,Status,Joined\n";
    const rows = stores.map(s => `"${s.name}","${s.owner?.name}","${s.owner?.email}","${s.theme}","${s.subscriptionPlan}","${s.productCount}","${s.orderCount}","${s.isActive ? 'Active' : 'Disabled'}","${new Date(s.createdAt).toLocaleDateString()}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stores_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredStores = stores.filter(s => {
    if (filter === "pro") return s.subscriptionPlan === "pro";
    if (filter === "basic") return s.subscriptionPlan === "basic";
    if (filter === "free") return s.subscriptionPlan === "free" || !s.subscriptionPlan;
    return true;
  });

  const toggle = async (id: string) => { try { await apiToggleStore(id); toast.success("Status updated"); load(); } catch { toast.error("Error"); } };
  const remove = async (id: string) => { if (!confirm("Delete this store and ALL its data?")) return; try { await apiDeleteStoreAdmin(id); toast.success("Store deleted"); load(); } catch { toast.error("Error"); } };

  const [planModal, setPlanModal] = useState<any>(null);
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);

  useEffect(() => {
    apiGetSaaSPlans().then(res => setAvailablePlans(res.data.plans || [])).catch(() => {});
  }, []);

  const activatePlan = async (storeId: string, planId: string) => {
    try {
      await apiUpdateStoreSubscription(storeId, { planId });
      toast.success("Subscription activated!");
      setPlanModal(null);
      load();
    } catch {
      toast.error("Error updating subscription");
    }
  };

  const removePlan = async (storeId: string) => {
    if (!confirm("Remove subscription from this store?")) return;
    try {
      await apiUpdateStoreSubscription(storeId, { planId: "free" });
      toast.success("Subscription removed");
      setPlanModal(null);
      load();
    } catch {
      toast.error("Error");
    }
  };

  const themeIcons: Record<string, string> = { grocery: "🥬", ecommerce: "🛍️", toys: "🧸", pet: "🐾" };

  if (loading) return <Loader />;

  return (
    <div className="fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 10 }}>
          {["all", "free", "basic", "pro"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 16px", borderRadius: 8, border: "1px solid #E2E8F0", background: filter === f ? "#6366F1" : "#fff", color: filter === f ? "#fff" : "#64748B", fontSize: 12, fontWeight: 600, textTransform: "capitalize", cursor: "pointer" }}>{f}</button>
          ))}
        </div>
        <button onClick={exportToCSV} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, border: "none", background: "#10B981", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}><Download size={16} /> Export CSV</button>
      </div>

      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {["Store", "Owner", "Theme", "Plan", "Products", "Orders", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((s) => (
                <tr key={s._id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: 600, color: "#1E293B" }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "#94A3B8" }}>{s.city}</div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: 14, color: "#1E293B" }}>{typeof s.owner === "object" ? s.owner.name : ""}</div>
                    <div style={{ fontSize: 12, color: "#94A3B8" }}>{typeof s.owner === "object" ? s.owner.email : ""}</div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 20, marginRight: 6 }}>{themeIcons[s.theme]}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, textTransform: "capitalize" }}>{s.theme}</span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6, textTransform: "uppercase",
                      background: s.subscriptionPlan === "pro" ? "#8B5CF615" : s.subscriptionPlan === "basic" ? "#6366F115" : "#64748B15",
                      color: s.subscriptionPlan === "pro" ? "#8B5CF6" : s.subscriptionPlan === "basic" ? "#6366F1" : "#64748B"
                    }}>{s.subscriptionPlan || "free"}</span>
                    {s.subscriptionStatus === "active" && <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "#10B98115", color: "#10B981" }}>ACTIVE</span>}
                    {s.subscriptionStatus === "expired" && <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "#EF444415", color: "#EF4444" }}>EXPIRED</span>}
                  </td>
                  <td style={{ padding: "14px 16px", fontWeight: 600, color: "#1E293B" }}>{s.productCount || 0}</td>
                  <td style={{ padding: "14px 16px", fontWeight: 600, color: "#1E293B" }}>{s.orderCount || 0}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: s.isActive ? "#10B98115" : "#EF444415", color: s.isActive ? "#10B981" : "#EF4444" }}>{s.isActive ? "Active" : "Disabled"}</span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => window.open(`http://localhost:5173/store/${s._id}`, "_blank")} className="btn-press" style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #6366F1", background: "none", cursor: "pointer", fontSize: 12, color: "#6366F1", display: "flex", alignItems: "center", gap: 4 }}><IconEye /> View</button>
                      <button onClick={() => setPlanModal(s)} className="btn-press" style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #E2E8F0", background: "none", cursor: "pointer", fontSize: 12, color: "#8B5CF6", display: "flex", alignItems: "center", gap: 4 }}><IconCrown /> Plan</button>
                      <button onClick={() => toggle(s._id)} className="btn-press" style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #E2E8F0", background: "none", cursor: "pointer", fontSize: 12, color: s.isActive ? "#F59E0B" : "#10B981" }}>{s.isActive ? "Disable" : "Enable"}</button>
                      <button onClick={() => remove(s._id)} className="btn-press" style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #FCA5A5", background: "none", cursor: "pointer", fontSize: 12, color: "#EF4444", display: "flex", alignItems: "center", gap: 4 }}><IconTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!stores.length && <p style={{ textAlign: "center", padding: 40, color: "#94A3B8" }}>No stores yet</p>}
      </div>

      {/* Plan Activation Modal */}
      {planModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: 24, padding: 32, width: "100%", maxWidth: 520, boxShadow: "0 25px 60px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#1E293B" }}>Manage Subscription</h3>
                <p style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>Store: <strong>{planModal.name}</strong></p>
              </div>
              <button onClick={() => setPlanModal(null)} style={{ background: "#F1F5F9", border: "none", width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748B" }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Current Plan */}
            <div style={{ background: "#F8FAFC", borderRadius: 16, padding: "16px 20px", marginBottom: 24, border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 600, marginBottom: 4 }}>CURRENT PLAN</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  fontSize: 16, fontWeight: 800, textTransform: "uppercase",
                  color: planModal.subscriptionPlan === "pro" ? "#8B5CF6" : planModal.subscriptionPlan === "basic" ? "#6366F1" : "#94A3B8"
                }}>
                  {planModal.subscriptionPlan || "Free"}
                </span>
                {planModal.subscriptionStatus === "active" && (
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: "#10B98115", color: "#10B981" }}>ACTIVE</span>
                )}
                {planModal.subscriptionStatus === "expired" && (
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: "#EF444415", color: "#EF4444" }}>EXPIRED</span>
                )}
              </div>
              {planModal.subscriptionExpiry && (
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>
                  Expires: {new Date(planModal.subscriptionExpiry).toLocaleDateString()}
                </div>
              )}
            </div>

            {/* Available Plans */}
            <div style={{ fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 12 }}>ACTIVATE A PLAN</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              {availablePlans.map(plan => {
                const isCurrentPlan = planModal.subscribedPlan?._id === plan._id || planModal.subscribedPlan === plan._id;
                return (
                  <div key={plan._id} style={{
                    border: isCurrentPlan ? "2px solid #6366F1" : "1.5px solid #E2E8F0",
                    borderRadius: 16, padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: isCurrentPlan ? "#6366F108" : "#fff", transition: "all 0.2s"
                  }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: 16, color: "#1E293B" }}>{plan.name}</span>
                        {isCurrentPlan && <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: "#6366F1", color: "#fff" }}>CURRENT</span>}
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#6366F1", marginTop: 4 }}>
                        ₹{plan.price}<span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>/{plan.duration}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>{(plan.featureKeys || []).length} features included</div>
                    </div>
                    {!isCurrentPlan ? (
                      <button onClick={() => activatePlan(planModal._id, plan._id)} className="btn-press" style={{
                        padding: "10px 20px", borderRadius: 12, border: "none",
                        background: "#6366F1", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer"
                      }}>
                        Activate
                      </button>
                    ) : (
                      <div style={{ color: "#10B981", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        Active
                      </div>
                    )}
                  </div>
                );
              })}
              {!availablePlans.length && (
                <p style={{ textAlign: "center", color: "#94A3B8", padding: 20, fontSize: 14 }}>
                  No plans created yet. Go to Subscriptions tab to create plans.
                </p>
              )}
            </div>

            {/* Remove Plan */}
            {planModal.subscriptionStatus === "active" && (
              <button onClick={() => removePlan(planModal._id)} style={{
                width: "100%", padding: "12px", borderRadius: 12, border: "1.5px solid #FCA5A5",
                background: "#FEF2F2", color: "#EF4444", fontWeight: 700, fontSize: 13, cursor: "pointer"
              }}>
                Remove Subscription
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── All Users ──
const SAUsers: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<any>(null);
  const [editStore, setEditStore] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const load = async () => { try { const { data } = await apiGetAllUsers(); setUsers(data.users); } catch {} setLoading(false); };
  useEffect(() => { load(); }, []);

  const toggle = async (id: string) => { try { await apiToggleUser(id); toast.success("Updated"); load(); } catch { toast.error("Error"); } };
  const remove = async (id: string) => { if (!confirm("Delete this user and ALL their data?")) return; try { await apiDeleteUser(id); toast.success("Deleted"); load(); } catch { toast.error("Error"); } };

  const openEdit = async (id: string) => {
    try {
      const { data } = await apiGetUserDetails(id);
      setEditUser(data.user);
      setEditStore(data.store);
      setEditForm({ name: data.user.name, email: data.user.email, phone: data.user.phone, password: "" });
    } catch { toast.error("Failed to load user details"); }
  };

  const handleSave = async () => {
    if (!editUser) return;
    setSaving(true);
    try {
      const payload: any = { name: editForm.name, email: editForm.email, phone: editForm.phone };
      if (editForm.password) payload.password = editForm.password;
      await apiUpdateUser(editUser._id, payload);
      toast.success("User updated!");
      setEditUser(null);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    }
    setSaving(false);
  };

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <Loader />;

  return (
    <div className="fade-up">
      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid #E2E8F0", width: 320, fontSize: 14, outline: "none" }} />
      </div>

      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {["User", "Email", "Phone", "Role", "Status", "Joined", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#EC4899)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>{u.name[0]}</div>
                      <span style={{ fontWeight: 600, color: "#1E293B" }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 14, color: "#64748B" }}>{u.email}</td>
                  <td style={{ padding: "14px 16px", fontSize: 14, color: "#64748B" }}>{u.phone}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 6, background: "#6366F115", color: "#6366F1", textTransform: "capitalize" }}>{u.role}</span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: u.isActive ? "#10B98115" : "#EF444415", color: u.isActive ? "#10B981" : "#EF4444" }}>{u.isActive ? "Active" : "Blocked"}</span>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#94A3B8" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => openEdit(u._id)} className="btn-press" style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #6366F1", background: "none", cursor: "pointer", fontSize: 12, color: "#6366F1" }}>View / Edit</button>
                      <button onClick={() => toggle(u._id)} className="btn-press" style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #E2E8F0", background: "none", cursor: "pointer", fontSize: 12, color: u.isActive ? "#F59E0B" : "#10B981" }}>{u.isActive ? "Block" : "Unblock"}</button>
                      <button onClick={() => remove(u._id)} className="btn-press" style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #FCA5A5", background: "none", cursor: "pointer", fontSize: 12, color: "#EF4444", display: "flex", alignItems: "center", gap: 4 }}><IconTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && <p style={{ textAlign: "center", padding: 40, color: "#94A3B8" }}>No users found</p>}
      </div>

      {/* Edit User Modal */}
      {editUser && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }} onClick={() => setEditUser(null)}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 32, width: 520, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "#1E293B", margin: 0 }}>User Details</h3>
              <button onClick={() => setEditUser(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: 20 }}><IconClose /></button>
            </div>

            {/* Store Info */}
            {editStore && (
              <div style={{ background: "#F8FAFC", borderRadius: 12, padding: 16, marginBottom: 20, border: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", marginBottom: 8 }}>Store Info</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1E293B" }}>{editStore.name}</div>
                <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>Subdomain: {editStore.subdomain}.qwikwebs.com</div>
                <div style={{ fontSize: 13, color: "#64748B" }}>Theme: {editStore.theme} | Plan: {editStore.subscriptionPlan}</div>
              </div>
            )}

            {/* Edit Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#64748B", marginBottom: 6, display: "block" }}>Name</label>
                <input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 14, outline: "none" }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#64748B", marginBottom: 6, display: "block" }}>Email</label>
                <input value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 14, outline: "none" }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#64748B", marginBottom: 6, display: "block" }}>Phone</label>
                <input value={editForm.phone} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 14, outline: "none" }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#64748B", marginBottom: 6, display: "block" }}>New Password <span style={{ fontSize: 11, color: "#94A3B8" }}>(leave blank to keep current)</span></label>
                <input type="password" value={editForm.password} onChange={e => setEditForm(p => ({ ...p, password: e.target.value }))} placeholder="Min 6 characters" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 14, outline: "none" }} />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button onClick={() => setEditUser(null)} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "1px solid #E2E8F0", background: "none", cursor: "pointer", fontWeight: 600, fontSize: 14, color: "#64748B" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "#fff", cursor: saving ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 14, opacity: saving ? 0.7 : 1 }}>{saving ? "Saving..." : "Save Changes"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Super Admin Subscriptions (SaaS Plans) ──
const FEATURE_LABELS: Record<string, { label: string; icon: string }> = {
  products: { label: "Products Management", icon: "📦" },
  categories: { label: "Categories", icon: "📂" },
  banners: { label: "Banners", icon: "🖼️" },
  orders: { label: "Order Management", icon: "📋" },
  coupons: { label: "Coupon System", icon: "🏷️" },
  reviews: { label: "Review Management", icon: "⭐" },
  flashsale: { label: "Flash Sales", icon: "⚡" },
  analytics: { label: "Advanced Analytics", icon: "📊" },
  domain: { label: "Custom Domain", icon: "🌐" },
  staff: { label: "Staff Management", icon: "👥" },
  customers: { label: "Customer CRM", icon: "🤝" },
  carts: { label: "Lost Cart Recovery", icon: "🛒" },
  settings: { label: "Store Settings", icon: "⚙️" },
};

const SASubscriptions: React.FC = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [allFeatureKeys, setAllFeatureKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<any>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [subTab, setSubTab] = useState<"plans" | "requests">("requests");
  const [paymentRequests, setPaymentRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Platform Payment Credentials (Cashfree)
  const [qrData, setQrData] = useState<any>({
    cashfreeClientId: "",
    cashfreeClientSecret: "",
    cashfreeMode: "test",
    cashfreeEnabled: true
  });
  const [savingQr, setSavingQr] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [plansRes, qrRes] = await Promise.all([
        apiGetSaaSPlans(),
        apiGetPlatformSettings()
      ]);
      setPlans(plansRes.data.plans || []);
      setAllFeatureKeys(plansRes.data.allFeatureKeys || Object.keys(FEATURE_LABELS));
      if (qrRes.data.settings) setQrData(qrRes.data.settings);
      
      await loadRequests();
    } catch {}
    setLoading(false);
  };

  const loadRequests = async () => {
    setLoadingRequests(true);
    try {
      const { data } = await apiGetPaymentRequests();
      setPaymentRequests(data.requests || []);
    } catch {}
    setLoadingRequests(false);
  };

  useEffect(() => { loadData(); }, []);

  const openModal = (plan?: any) => {
    if (plan?._id) {
      setSelectedFeatures(plan.featureKeys || []);
      setModal(plan);
    } else {
      setSelectedFeatures([]);
      setModal({});
    }
  };

  // Quick shortcut to create a free plan with basic features pre-selected
  const openFreePlanModal = () => {
    const basicFreeFeatures = ["products", "categories", "banners", "orders"];
    setSelectedFeatures(basicFreeFeatures);
    setModal({ name: "Free", price: 0, duration: "monthly", isFree: true, _isFreeTemplate: true });
  };

  const toggleFeature = (key: string) => {
    setSelectedFeatures(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const selectAllFeatures = () => {
    setSelectedFeatures(prev => prev.length === allFeatureKeys.length ? [] : [...allFeatureKeys]);
  };

  const savePlan = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const displayFeatures = selectedFeatures.map(k => FEATURE_LABELS[k]?.label || k);
    const dur = formData.get("duration") as string;
    const durationMonthsMap: Record<string, number> = {
      monthly: 1, yearly: 12, "3months": 3, "6months": 6, "1year": 12
    };

    const data = {
      name: formData.get("name"),
      price: Number(formData.get("price")),
      duration: dur,
      durationMonths: durationMonthsMap[dur] || 1,
      features: displayFeatures,
      featureKeys: selectedFeatures,
      isFree: formData.get("isFree") === "on",
    };
    if (selectedFeatures.length === 0) {
      toast.error("Please select at least one feature");
      return;
    }
    try {
      if (modal._id) await apiUpdateSaaSPlan(modal._id, data);
      else await apiCreateSaaSPlan(data);
      toast.success("Plan saved successfully!");
      setModal(null);
      loadData();
    } catch { toast.error("Error saving plan"); }
  };

  const removePlan = async (id: string) => {
    if (!confirm("Delete this plan? All stores with this plan will be reverted to free.")) return;
    try { await apiDeleteSaaSPlan(id); toast.success("Plan deleted"); loadData(); } catch { toast.error("Error"); }
  };

  const handleQrSave = async () => {
    setSavingQr(true);
    try {
      await apiUpdatePlatformSettings(qrData);
      toast.success("Cashfree settings saved successfully!");
    } catch {
      toast.error("Error saving Cashfree settings.");
    }
    setSavingQr(false);
  };

  const approvePayment = async (id: string) => {
    if (!confirm("Approve this payment and activate the plan?")) return;
    try {
      await apiApprovePayment(id);
      toast.success("Payment approved and plan activated!");
      loadRequests();
    } catch { toast.error("Approval failed"); }
  };

  const rejectPayment = async (id: string) => {
    const reason = prompt("Enter rejection reason:");
    if (reason === null) return;
    try {
      await apiRejectPayment(id, reason || "Invalid UTR / Payment not received");
      toast.success("Payment rejected");
      loadRequests();
    } catch { toast.error("Rejection failed"); }
  };

  if (loading) return <Loader />;

  return (
    <div className="fade-up">
      {/* Sub-tabs for plans/requests */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, borderBottom: "1px solid #E2E8F0", paddingBottom: 16 }}>
        <button onClick={() => setSubTab("plans")} style={{ padding: "8px 20px", borderRadius: 10, border: "none", background: subTab === "plans" ? "#6366F1" : "transparent", color: subTab === "plans" ? "#fff" : "#64748B", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Plan Configuration</button>
        <button onClick={() => setSubTab("requests")} style={{ padding: "8px 20px", borderRadius: 10, border: "none", background: subTab === "requests" ? "#6366F1" : "transparent", color: subTab === "requests" ? "#fff" : "#64748B", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          Payment Requests
          {paymentRequests.filter(r => r.status === "pending").length > 0 && <span style={{ width: 18, height: 18, borderRadius: "50%", background: subTab === "requests" ? "#fff" : "#EF4444", color: subTab === "requests" ? "#6366F1" : "#fff", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>{paymentRequests.filter(r => r.status === "pending").length}</span>}
        </button>
      </div>

      {subTab === "plans" ? (
        <>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1E293B" }}>Subscription Plans</h2>
              <p style={{ fontSize: 14, color: "#94A3B8", marginTop: 4 }}>Manage plans and select features for each tier</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {/* Quick Free Plan Button */}
              {!plans.some((p: any) => p.isFree) && (
                <button onClick={openFreePlanModal} className="btn-press" style={{
                  background: "linear-gradient(135deg,#10B981,#059669)", color: "#fff", border: "none",
                  padding: "12px 20px", borderRadius: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8,
                  boxShadow: "0 4px 15px rgba(16,185,129,0.3)", fontSize: 13
                }}>
                  🆓 Quick Free Plan
                </button>
              )}
              <button onClick={() => openModal()} className="btn-press" style={{
                background: "linear-gradient(135deg, #6366F1, #4F46E5)", color: "#fff", border: "none",
                padding: "12px 24px", borderRadius: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8,
                boxShadow: "0 4px 15px rgba(99,102,241,0.3)", fontSize: 14
              }}>
                <Plus size={18} /> Create Plan
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24, marginBottom: 40 }}>
            {plans.map((p) => {
              const isPro = p.price > 500;
              return (
                <div key={p._id} style={{
                  background: "#fff", borderRadius: 24, overflow: "hidden",
                  border: isPro ? "2px solid #6366F1" : "1px solid #E2E8F0",
                  position: "relative", boxShadow: isPro ? "0 8px 30px rgba(99,102,241,0.12)" : "none",
                  transition: "all 0.3s"
                }}>
                  {/* Plan Header */}
                  <div style={{
                    background: isPro ? "linear-gradient(135deg, #6366F1, #4F46E5)" : "linear-gradient(135deg, #F8FAFC, #EEF2FF)",
                    padding: "28px 24px", textAlign: "center", position: "relative"
                  }}>
                    {isPro && (
                      <div style={{
                        position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,0.2)",
                        padding: "4px 10px", borderRadius: 8, fontSize: 10, fontWeight: 800, color: "#fff",
                        letterSpacing: "1px", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", gap: 4
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        POPULAR
                      </div>
                    )}
                    <div style={{
                      width: 56, height: 56, borderRadius: 18, margin: "0 auto 14px",
                      background: isPro ? "rgba(255,255,255,0.2)" : "#6366F110",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      backdropFilter: "blur(4px)"
                    }}>
                      {isPro ? <IconCrown /> : <CreditCard size={24} color="#6366F1" />}
                    </div>
                    <h3 style={{ fontSize: 22, fontWeight: 800, color: isPro ? "#fff" : "#1E293B", marginBottom: 8 }}>{p.name}</h3>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 2 }}>
                      <span style={{ fontSize: 40, fontWeight: 800, color: isPro ? "#fff" : "#6366F1" }}>₹{p.price}</span>
                      <span style={{ fontSize: 14, color: isPro ? "rgba(255,255,255,0.7)" : "#94A3B8" }}>/{p.duration}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div style={{ padding: "24px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "1px", marginBottom: 14 }}>
                      INCLUDED FEATURES ({(p.featureKeys || []).length}/{allFeatureKeys.length})
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
                      {allFeatureKeys.map(key => {
                        const included = (p.featureKeys || []).includes(key);
                        const fl = FEATURE_LABELS[key];
                        return (
                          <div key={key} style={{
                            display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
                            borderRadius: 10, background: included ? "#F0FDF4" : "#F8FAFC",
                            border: `1px solid ${included ? "#BBF7D0" : "#F1F5F9"}`
                          }}>
                            <span style={{ fontSize: 14 }}>{fl?.icon || "📦"}</span>
                            <span style={{
                              fontSize: 12, fontWeight: 600,
                              color: included ? "#166534" : "#CBD5E1",
                              textDecoration: included ? "none" : "line-through"
                            }}>
                              {fl?.label || key}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={() => openModal(p)} className="btn-press" style={{
                        flex: 1, padding: "12px", borderRadius: 12,
                        border: "1.5px solid #E2E8F0", background: "#F8FAFC",
                        color: "#1E293B", fontWeight: 700, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 13
                      }}>
                        <Edit size={15} /> Edit Plan
                      </button>
                      <button onClick={() => removePlan(p._id)} className="btn-press" style={{
                        padding: "12px 16px", borderRadius: 12,
                        border: "1.5px solid #FCA5A5", background: "#FEF2F2",
                        color: "#EF4444", cursor: "pointer"
                      }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {plans.length < 3 && (
              <div onClick={() => openModal()} style={{
                background: "#FAFAFA", borderRadius: 24, border: "2px dashed #E2E8F0",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                minHeight: 400, cursor: "pointer", transition: "all 0.3s"
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366F1"; e.currentTarget.style.background = "#F5F3FF"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.background = "#FAFAFA"; }}
              >
                <div style={{ width: 64, height: 64, borderRadius: 20, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Plus size={28} color="#6366F1" />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#475569" }}>Create New Plan</div>
                <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>Add a subscription tier</div>
              </div>
            )}
          </div>

          {/* Cashfree Integration Section */}
          <div style={{
            background: "#fff", borderRadius: 24, padding: 32, border: "1px solid #E2E8F0",
            marginBottom: 40, boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CreditCard size={24} color="#2563EB" />
              </div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#1E293B" }}>Cashfree Automation</h3>
                <p style={{ fontSize: 14, color: "#64748B" }}>Automate SaaS plan payments using Cashfree Gateway</p>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <button onClick={handleQrSave} disabled={savingQr} style={{
                  background: "#2563EB", color: "#fff", border: "none",
                  padding: "10px 24px", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(37,99,235,0.2)"
                }}>
                  {savingQr ? "Saving..." : "Save API Config"}
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 8, display: "block" }}>CASHFREE CLIENT ID</label>
                <input 
                  value={qrData.cashfreeClientId || ""} 
                  onChange={e => setQrData({ ...qrData, cashfreeClientId: e.target.value })}
                  placeholder="e.g. CF1234567890" 
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #E2E8F0", outline: "none", fontSize: 14 }} 
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 8, display: "block" }}>CASHFREE CLIENT SECRET</label>
                <input 
                  type="password"
                  value={qrData.cashfreeClientSecret || ""} 
                  onChange={e => setQrData({ ...qrData, cashfreeClientSecret: e.target.value })}
                  placeholder="••••••••••••••••" 
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #E2E8F0", outline: "none", fontSize: 14 }} 
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 8, display: "block" }}>PAYMENT MODE</label>
                <select 
                  value={qrData.cashfreeMode || "test"} 
                  onChange={e => setQrData({ ...qrData, cashfreeMode: e.target.value })}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #E2E8F0", outline: "none", fontSize: 14, background: "#fff" }}
                >
                  <option value="test">Sandbox / Testing</option>
                  <option value="production">Live / Production</option>
                </select>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 28 }}>
                <div 
                  onClick={() => setQrData({ ...qrData, cashfreeEnabled: !qrData.cashfreeEnabled })}
                  style={{ 
                    width: 50, height: 26, borderRadius: 13, background: qrData.cashfreeEnabled ? "#10B981" : "#E2E8F0",
                    padding: 3, cursor: "pointer", transition: "0.3s", display: "flex",
                    justifyContent: qrData.cashfreeEnabled ? "flex-end" : "flex-start"
                  }}
                >
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: qrData.cashfreeEnabled ? "#10B981" : "#64748B" }}>
                  {qrData.cashfreeEnabled ? "Gateway Active" : "Gateway Disabled"}
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #E2E8F0", overflow: "hidden" }}>
          <div style={{ padding: "24px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1E293B" }}>Pending Verifications</h3>
              <p style={{ fontSize: 13, color: "#94A3B8" }}>Approve plan upgrades after verifying UTR/Transaction IDs</p>
            </div>
            <button onClick={loadRequests} disabled={loadingRequests} style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid #E2E8F0", background: "#fff", color: "#64748B", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{loadingRequests ? "Refreshing..." : "Refresh List"}</button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#F8FAFC" }}>
                <tr>
                  {["Store / Owner", "Plan & Duration", "Amount", "UTR / Transaction ID", "Status", "Action"].map(h => <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase" }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {paymentRequests.map((pr) => (
                  <tr key={pr._id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ fontWeight: 700, color: "#1E293B" }}>{pr.storeName}</div>
                      <div style={{ fontSize: 12, color: "#94A3B8" }}>{pr.ownerEmail}</div>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontWeight: 800, color: "#6366F1", textTransform: "uppercase", fontSize: 13 }}>{pr.planName}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "#EEF2FF", color: "#6366F1" }}>{pr.durationLabel}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>Requested on {new Date(pr.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#1E293B" }}>₹{pr.finalAmount}</div>
                      {pr.discount > 0 && <div style={{ fontSize: 11, color: "#10B981", fontWeight: 700 }}>{pr.discount}% Discount Applied</div>}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ background: "#F1F5F9", padding: "8px 12px", borderRadius: 8, fontFamily: "monospace", fontWeight: 700, color: "#475569", display: "inline-block" }}>{pr.utrNumber}</div>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{
                        fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 8, textTransform: "uppercase",
                        background: pr.status === "pending" ? "#FFFBEB" : pr.status === "approved" ? "#F0FDF4" : "#FEF2F2",
                        color: pr.status === "pending" ? "#D97706" : pr.status === "approved" ? "#16A34A" : "#EF4444"
                      }}>{pr.status}</span>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      {pr.status === "pending" ? (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => approvePayment(pr._id)} style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: "#10B981", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Approve</button>
                          <button onClick={() => rejectPayment(pr._id)} style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: "#EF4444", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Reject</button>
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 600 }}>{pr.status === "approved" ? "Verified" : "Invalid Request"}</span>
                      )}
                    </td>
                  </tr>
                ))}
                {paymentRequests.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: "center", padding: "60px", color: "#94A3B8", fontSize: 14 }}>No payment requests found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Plan Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(4px)" }}>
          <form onSubmit={savePlan} style={{ background: "#fff", borderRadius: 24, padding: 0, width: "100%", maxWidth: 600, boxShadow: "0 25px 60px rgba(0,0,0,0.2)", overflow: "hidden", maxHeight: "95vh", overflowY: "auto" }}>
            <div style={{ background: "linear-gradient(135deg, #6366F1, #4F46E5)", padding: "28px 28px 24px", position: "relative" }}>
              <button type="button" onClick={() => setModal(null)} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.2)", border: "none", width: 32, height: 32, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}><IconClose /></button>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{modal._id ? "Edit Plan" : "Create New Plan"}</h3>
            </div>
            <div style={{ padding: "28px" }}>
              <input name="name" defaultValue={modal.name} placeholder="Plan Name" required style={{ width: "100%", padding: "14px 18px", borderRadius: 14, border: "1.5px solid #E2E8F0", outline: "none", marginBottom: 16 }} />
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <input name="price" type="number" defaultValue={modal.price} placeholder="Price" required style={{ flex: 1, padding: "14px 18px", borderRadius: 14, border: "1.5px solid #E2E8F0" }} />
                <select name="duration" defaultValue={modal.duration || "monthly"} style={{ width: 140, padding: "14px 18px", borderRadius: 14, border: "1.5px solid #E2E8F0" }}>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="3months">3 Months</option>
                  <option value="6months">6 Months</option>
                  <option value="1year">1 Year</option>
                </select>
              </div>
              {/* isFree toggle — auto-sets price to 0 */}
              <div style={{ marginBottom: 16, padding: "14px 18px", background: modal.isFree || modal._isFreeTemplate ? "#F0FDF4" : "#F8FAFC", borderRadius: 14, border: modal.isFree || modal._isFreeTemplate ? "2px solid #10B981" : "1.5px solid #E2E8F0" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                  <div style={{ position: "relative" }}>
                    <input
                      type="checkbox"
                      name="isFree"
                      defaultChecked={modal.isFree || modal._isFreeTemplate}
                      style={{ width: 20, height: 20, accentColor: "#10B981" }}
                      onChange={(e) => {
                        const priceInput = document.querySelector('input[name="price"]') as HTMLInputElement;
                        if (priceInput && e.target.checked) priceInput.value = "0";
                      }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#166534" }}>🆓 Set as Default Free Plan</div>
                    <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>New stores will automatically get this plan. Price should be ₹0.</div>
                  </div>
                </label>
              </div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8" }}>SELECT FEATURES ({selectedFeatures.length}/{allFeatureKeys.length})</div>
                  <button
                    type="button"
                    onClick={selectAllFeatures}
                    style={{ fontSize: 11, fontWeight: 700, color: "#6366F1", background: "#EEF2FF", border: "none", padding: "4px 10px", borderRadius: 6, cursor: "pointer" }}
                  >
                    {selectedFeatures.length === allFeatureKeys.length ? "Clear All" : "Select All"}
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {allFeatureKeys.map(key => (
                    <button type="button" key={key} onClick={() => toggleFeature(key)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px", borderRadius: 10, border: selectedFeatures.includes(key) ? "2px solid #6366F1" : "2px solid #F1F5F9", background: selectedFeatures.includes(key) ? "#EEF2FF" : "#fff", cursor: "pointer", textAlign: "left" }}>
                      <span style={{ fontSize: 14 }}>{FEATURE_LABELS[key]?.icon || "📦"}</span>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{FEATURE_LABELS[key]?.label || key}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button type="button" onClick={() => setModal(null)} style={{ flex: 1, padding: 14, borderRadius: 14, border: "none", background: "#F1F5F9", fontWeight: 700 }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: 14, borderRadius: 14, border: "none", background: "#6366F1", color: "#fff", fontWeight: 700 }}>Save Plan</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// ── Super Admin Analytics & India Map ──
const SAAnalytics: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: res } = await apiGetDetailedAnalytics();
        setData(res);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <Loader />;

  const chartData = data?.trafficStats?.map((s: any) => ({
    name: new Date(s._id).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    visits: s.count
  })) || [];

  const mapData: Record<string, number> = {};
  data?.stateWiseTraffic?.forEach((s: any) => { mapData[s._id] = s.count; });

  return (
    <div className="fade-up">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, marginBottom: 28 }}>
        <div style={{ background: "#fff", borderRadius: 24, padding: 28, border: "1px solid #E2E8F0", gridColumn: "span 2" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1E293B" }}>Traffic Trends</h3>
              <p style={{ fontSize: 13, color: "#94A3B8" }}>Daily visitor count for the last 30 days</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "#6366F110", borderRadius: 10, color: "#6366F1", fontWeight: 600, fontSize: 13 }}>
              <TrendingUp size={16} /> +12.5%
            </div>
          </div>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: "#94A3B8"}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: "#94A3B8"}} />
                <Tooltip 
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                  labelStyle={{ fontWeight: 700, color: "#1E293B" }}
                />
                <Area type="monotone" dataKey="visits" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", borderRadius: 20, padding: 24, color: "#fff" }}>
            <Users size={24} style={{ marginBottom: 12, opacity: 0.8 }} />
            <div style={{ fontSize: 14, opacity: 0.8 }}>Total Unique Visitors</div>
            <div style={{ fontSize: 32, fontWeight: 800 }}>{data?.trafficStats?.reduce((a:any,b:any)=>a+b.count, 0) || 0}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 20, padding: 24, border: "1px solid #E2E8F0" }}>
            <MapPin size={24} color="#6366F1" style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 14, color: "#94A3B8" }}>Top Region</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#1E293B" }}>{data?.stateWiseTraffic?.[0]?._id || "N/A"}</div>
            <div style={{ fontSize: 13, color: "#6366F1", fontWeight: 600, marginTop: 4 }}>{data?.stateWiseTraffic?.[0]?.count || 0} Visits</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        <div style={{ background: "#fff", borderRadius: 24, padding: 28, border: "1px solid #E2E8F0", textAlign: "center" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1E293B", marginBottom: 8, textAlign: "left" }}>Visitor Distribution (India)</h3>
          <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 30, textAlign: "left" }}>Real-time geographical traffic map</p>
          
          <div style={{ width: "100%", height: 500, background: "#F8FAFC", borderRadius: 20, overflow: "hidden" }}>
            <ComposableMap projectionConfig={{ scale: 1000, center: [78.9629, 22.5937] }} style={{ width: "100%", height: "100%" }}>
              <Geographies geography={INDIA_TOPO_JSON}>
                {({ geographies }: { geographies: any[] }) =>
                  geographies.map((geo: any) => {
                    const stateName = geo.properties.ST_NM || geo.properties.name;
                    const count = mapData[stateName] || 0;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={count > 0 ? `rgba(99, 102, 241, ${Math.min(1, 0.1 + count / 50)})` : "#E2E8F0"}
                        stroke="#fff"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none", transition: "all 250ms" },
                          hover: { fill: "#4F46E5", outline: "none", cursor: "pointer" },
                          pressed: { fill: "#3730A3", outline: "none" }
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 24, padding: 28, border: "1px solid #E2E8F0" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1E293B", marginBottom: 24 }}>Traffic by State</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {data?.stateWiseTraffic?.map((s: any, i: number) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, fontSize: 12, fontWeight: 700, color: "#94A3B8" }}>#{i+1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#1E293B" }}>{s._id}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#6366F1" }}>{s.count}</span>
                  </div>
                  <div style={{ width: "100%", height: 6, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, (s.count / (data.stateWiseTraffic[0].count || 1)) * 100)}%`, height: "100%", background: "#6366F1", borderRadius: 3 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Loader = () => <div style={{ textAlign: "center", padding: 60, color: "#94A3B8" }}>Loading...</div>;

// ── Super Admin Financials (SaaS Revenue) ──
const SAFinancials: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: res } = await apiGetRevenueStats();
        setData(res);
      } catch {}
      setLoading(false);
    })();
  }, []);

  if (loading) return <Loader />;

  const stats = [
    { label: "Monthly Recurring Revenue (MRR)", value: `₹${data?.mrr || 0}`, icon: <DollarSign />, color: "#10B981" },
    { label: "Projected Annual Revenue", value: `₹${data?.totalRevenue || 0}`, icon: <TrendingUp />, color: "#6366F1" },
    { label: "Pro Subscriptions", value: data?.proCount || 0, icon: <IconCrown />, color: "#F59E0B" },
    { label: "Conversion Rate", value: data?.conversionRate || "0%", icon: <Activity />, color: "#EC4899" },
  ];

  const chartData = [
    { name: "Pro Stores", value: data?.proCount || 0, color: "#6366F1" },
    { name: "Free Stores", value: data?.freeCount || 0, color: "#E2E8F0" },
  ];

  return (
    <div className="fade-up">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 32 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 20, padding: 24, border: "1px solid #E2E8F0" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}12`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, marginBottom: 16 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#1E293B" }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        <div style={{ background: "#fff", borderRadius: 24, padding: 32, border: "1px solid #E2E8F0" }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1E293B", marginBottom: 24 }}>Subscription Split</h3>
          <div style={{ height: 300, width: "100%" }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={chartData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 16 }}>
            {chartData.map(d => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748B", fontWeight: 600 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: d.color }} /> {d.name}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "linear-gradient(135deg, #0F0F23, #1E1E3F)", borderRadius: 24, padding: 32, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Briefcase size={40} style={{ marginBottom: 20, opacity: 0.5 }} />
          <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Business Insights</h3>
          <p style={{ fontSize: 15, lineHeight: 1.6, opacity: 0.8, marginBottom: 24 }}>
            Your platform is growing! You have a <b>{data?.conversionRate}</b> conversion rate from free to paid plans. Focus on converting your <b>{data?.freeCount}</b> free users into premium subscribers.
          </p>
          <button style={{ background: "#6366F1", color: "#fff", border: "none", padding: "14px 24px", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>View Growth Strategy</button>
        </div>
      </div>
    </div>
  );
};

// ── Super Admin Audit Logs (Activity Timeline) ──
const SAAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: res } = await apiGetAuditLogs();
        setLogs(res.logs);
      } catch {}
      setLoading(false);
    })();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="fade-up">
      <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #E2E8F0", padding: "12px 0" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1E293B" }}>System Activity Trail</h3>
          <span style={{ fontSize: 12, color: "#94A3B8" }}>Showing last 50 events</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {logs.map((log, i) => (
            <div key={log._id} style={{ display: "flex", gap: 20, padding: "20px 24px", borderBottom: i === logs.length - 1 ? "none" : "1px solid #F8FAFC" }}>
              <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                   <FileText size={16} color="#64748B" />
                </div>
                {i !== logs.length - 1 && <div style={{ position: "absolute", top: 36, bottom: -20, width: 2, background: "#F1F5F9" }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontWeight: 700, color: "#1E293B", fontSize: 14 }}>{log.action}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8" }}>{new Date(log.createdAt).toLocaleString()}</div>
                </div>
                <div style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>{log.details}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", display: "flex", alignItems: "center", gap: 6 }}>
                  <Users size={12} /> {log.user} {log.ip && `· IP: ${log.ip}`}
                </div>
              </div>
            </div>
          ))}
          {!logs.length && <p style={{ textAlign: "center", padding: 60, color: "#94A3B8" }}>No activity logs yet</p>}
        </div>
      </div>
    </div>
  );
};


// ── Super Admin System (Maintenance, Announcements, Support) ──
const SASystem: React.FC = () => {
  const [subTab, setSubTab] = useState("announcements");
  const [settings, setSettings] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [queries, setQueries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<any>(null);

  const load = async () => {
    try {
      const [{ data: s }, { data: a }, { data: q }] = await Promise.all([
        apiGetPlatformSettings(),
        apiGetAnnouncements(),
        apiGetSupportQueries()
      ]);
      setSettings(s.settings);
      setAnnouncements(a.announcements);
      setQueries(q.queries);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleMaintenance = async () => {
    const val = !settings?.isMaintenanceMode;
    try {
      await apiUpdatePlatformSettings({ isMaintenanceMode: val });
      setSettings({ ...settings, isMaintenanceMode: val });
      toast.success(`Maintenance mode ${val ? "Enabled" : "Disabled"}`);
    } catch { toast.error("Error toggling maintenance"); }
  };

  const addAnnouncement = async (e: any) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = { title: fd.get("title"), message: fd.get("message"), type: fd.get("type"), isActive: true };
    try {
      await apiCreateAnnouncement(data);
      toast.success("Announcement broadcasted");
      setModal(null);
      load();
    } catch { toast.error("Error"); }
  };

  const removeAnnouncement = async (id: string) => {
    try { await apiDeleteAnnouncement(id); toast.success("Deleted"); load(); } catch { toast.error("Error"); }
  };

  const resolveQuery = async (id: string) => {
    try { await apiUpdateQueryStatus(id, "resolved"); toast.success("Query resolved"); load(); } catch { toast.error("Error"); }
  };

  const removeQuery = async (id: string) => {
    try { await apiDeleteSupportQuery(id); toast.success("Deleted"); load(); } catch { toast.error("Error"); }
  };

  if (loading) return <Loader />;

  return (
    <div className="fade-up">
      <div style={{ display: "flex", gap: 12, marginBottom: 28, borderBottom: "1px solid #E2E8F0", paddingBottom: 16 }}>
        {["announcements", "support", "branding", "maintenance"].map((t) => (
          <button key={t} onClick={() => setSubTab(t)} style={{ padding: "8px 20px", borderRadius: 10, border: "none", background: subTab === t ? "#6366F1" : "transparent", color: subTab === t ? "#fff" : "#64748B", fontWeight: 600, fontSize: 13, textTransform: "capitalize", cursor: "pointer" }}>{t === "branding" ? "White-Labeling" : t}</button>
        ))}
      </div>

      {subTab === "branding" && <SABranding settings={settings} onUpdate={load} />}

      {subTab === "maintenance" && (
        <div style={{ background: "#fff", borderRadius: 24, padding: 32, border: "1px solid #E2E8F0", maxWidth: 650 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "#FEF9C3", display: "flex", alignItems: "center", justifyContent: "center", color: "#CA8A04" }}><AlertTriangle size={24} /></div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1E293B" }}>Maintenance Mode</h3>
              <p style={{ fontSize: 14, color: "#64748B" }}>Control global access to the platform.</p>
            </div>
          </div>
          <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.6, marginBottom: 28 }}>
            When enabled, all storefronts and store admin panels will show a maintenance page. Only you (Super Admin) can access the platform to perform updates or fixes.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 20, background: settings?.isMaintenanceMode ? "#FEF2F2" : "#F8FAFC", borderRadius: 16, border: `1.5px solid ${settings?.isMaintenanceMode ? "#FEE2E2" : "#E2E8F0"}` }}>
            <div>
              <div style={{ fontWeight: 700, color: settings?.isMaintenanceMode ? "#EF4444" : "#1E293B" }}>{settings?.isMaintenanceMode ? "Platform Locked" : "Platform Live"}</div>
              <div style={{ fontSize: 12, color: "#94A3B8" }}>Toggle to switch platform visibility</div>
            </div>
            <button onClick={toggleMaintenance} style={{ width: 56, height: 28, borderRadius: 20, background: settings?.isMaintenanceMode ? "#EF4444" : "#E2E8F0", border: "none", padding: 4, cursor: "pointer", transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: settings?.isMaintenanceMode ? "flex-end" : "flex-start" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} />
            </button>
          </div>
        </div>
      )}

      {subTab === "announcements" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1E293B" }}>Platform Broadcasts</h3>
            <button onClick={() => setModal({})} className="btn-press" style={{ background: "#6366F1", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              <Plus size={18} /> New Broadcast
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {announcements.map((a) => (
              <div key={a._id} style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: a.type === "warning" ? "#FFFBEB" : "#F0F9FF", display: "flex", alignItems: "center", justifyContent: "center", color: a.type === "warning" ? "#D97706" : "#0284C7" }}>
                    {a.type === "warning" ? <AlertTriangle size={20} /> : <IconBell />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#1E293B", fontSize: 15 }}>{a.title}</div>
                    <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>{a.message}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 8 }}>Posted on {new Date(a.createdAt).toLocaleString()}</div>
                  </div>
                </div>
                <button onClick={() => removeAnnouncement(a._id)} style={{ padding: 8, background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}><Trash2 size={18} /></button>
              </div>
            ))}
            {!announcements.length && <p style={{ textAlign: "center", color: "#94A3B8", padding: 40 }}>No active announcements</p>}
          </div>
        </>
      )}

      {subTab === "support" && (
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#F8FAFC" }}>
              <tr>
                {["Store", "Subject", "Status", "Date", "Actions"].map(h => <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#94A3B8" }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {queries.map((q) => (
                <tr key={q._id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ fontWeight: 600, color: "#1E293B" }}>{q.storeName}</div>
                    <div style={{ fontSize: 12, color: "#94A3B8" }}>{q.email}</div>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{q.subject}</div>
                    <div style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>{q.message}</div>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6, background: q.status === "pending" ? "#FFFBEB" : "#F0FDF4", color: q.status === "pending" ? "#D97706" : "#16A34A", textTransform: "uppercase" }}>{q.status}</span>
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: 13, color: "#94A3B8" }}>{new Date(q.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", gap: 10 }}>
                      {q.status === "pending" && <button onClick={() => resolveQuery(q._id)} style={{ padding: "6px 12px", borderRadius: 8, background: "#6366F1", color: "#fff", border: "none", fontSize: 12, fontWeight: 600 }}>Resolve</button>}
                      <button onClick={() => removeQuery(q._id)} style={{ padding: 6, color: "#EF4444", background: "none", border: "none" }}><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!queries.length && <p style={{ textAlign: "center", color: "#94A3B8", padding: 40 }}>No support queries yet</p>}
        </div>
      )}

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <form onSubmit={addAnnouncement} style={{ background: "#fff", borderRadius: 24, padding: 32, width: "100%", maxWidth: 450 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>New Announcement</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <input name="title" placeholder="Title (e.g. New Feature!)" required style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid #E2E8F0", outline: "none" }} />
              <textarea name="message" placeholder="Details..." rows={4} required style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid #E2E8F0", outline: "none", resize: "none" }} />
              <select name="type" style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid #E2E8F0", outline: "none" }}>
                <option value="info">Information (Blue)</option>
                <option value="warning">System Alert (Yellow)</option>
                <option value="success">Success / Launch (Green)</option>
                <option value="danger">Urgent (Red)</option>
              </select>
              <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                <button type="button" onClick={() => setModal(null)} style={{ flex: 1, padding: 12, borderRadius: 12, border: "none", background: "#F1F5F9", fontWeight: 700 }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: 12, borderRadius: 12, border: "none", background: "#6366F1", color: "#fff", fontWeight: 700 }}>Post Announcement</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// ── White-Labeling (Platform Branding) ──
const SABranding: React.FC<{ settings: any; onUpdate: () => void }> = ({ settings, onUpdate }) => {
  const [saving, setSaving] = useState(false);

  const save = async (e: any) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = {
      platformName: fd.get("name"),
      brandColor: fd.get("color"),
      platformLogoUrl: fd.get("logo"),
      supportEmail: fd.get("email")
    };
    setSaving(true);
    try {
      await apiUpdatePlatformSettings(data);
      toast.success("Platform branding updated!");
      onUpdate();
    } catch { toast.error("Error updating settings"); }
    setSaving(false);
  };

  return (
    <div style={{ background: "#fff", borderRadius: 24, padding: 32, border: "1px solid #E2E8F0", maxWidth: 700 }}>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1E293B", marginBottom: 24 }}>Platform White-Labeling</h3>
      <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 8, display: "block" }}>Platform Name</label>
            <input name="name" defaultValue={settings?.platformName} required style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #E2E8F0", outline: "none" }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 8, display: "block" }}>Brand Color</label>
            <div style={{ display: "flex", gap: 10 }}>
              <input name="color" type="color" defaultValue={settings?.brandColor || "#6366F1"} style={{ width: 44, height: 44, padding: 0, border: "none", background: "none", cursor: "pointer" }} />
              <input defaultValue={settings?.brandColor || "#6366F1"} disabled style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: "1px solid #E2E8F0", background: "#F8FAFC" }} />
            </div>
          </div>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 8, display: "block" }}>Logo URL</label>
          <input name="logo" defaultValue={settings?.platformLogoUrl} placeholder="https://example.com/logo.png" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #E2E8F0", outline: "none" }} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 8, display: "block" }}>Support Email</label>
          <input name="email" type="email" defaultValue={settings?.supportEmail} required style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #E2E8F0", outline: "none" }} />
        </div>
        <div style={{ marginTop: 12, padding: 20, background: "#F8FAFC", borderRadius: 16, border: "1px solid #E2E8F0" }}>
           <h4 style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", marginBottom: 8 }}>Live Preview Preview</h4>
           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
             <div style={{ width: 40, height: 40, borderRadius: 10, background: settings?.brandColor || "#6366F1", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800 }}>{settings?.platformName?.[0] || "S"}</div>
             <span style={{ fontWeight: 800, fontSize: 18, color: "#0F172A" }}>{settings?.platformName || "StoreBuilder"}</span>
           </div>
        </div>
        <button type="submit" disabled={saving} style={{ alignSelf: "flex-start", padding: "14px 40px", borderRadius: 12, border: "none", background: settings?.brandColor || "#6366F1", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: `0 8px 20px ${settings?.brandColor}40` }}>{saving ? "Saving..." : "Update Global Branding"}</button>
      </form>
    </div>
  );
};


export default SuperAdminPanel;
