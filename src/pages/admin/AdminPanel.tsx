import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { THEMES } from "../../config/themes";
import { IconHome, IconBox, IconGrid, IconImage, IconOrder, IconSettings, IconMenu, IconEye, IconLogout, IconBell } from "../../components/Icons";
import DashboardTab from "./DashboardTab";
import ProductsTab from "./ProductsTab";
import CategoriesTab from "./CategoriesTab";
import BannersTab from "./BannersTab";
import OrdersTab from "./OrdersTab";
import SettingsTab from "./SettingsTab";
import CouponsTab from "./CouponsTab";
import ReviewsTab from "./ReviewsTab";
import FlashSaleTab from "./FlashSaleTab";


const Ic = {
  tag: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><circle cx="7" cy="7" r="1"/></svg>,
  star: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  bolt: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
};

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: <IconHome /> },
  { id: "products", label: "Products", icon: <IconBox /> },
  { id: "categories", label: "Categories", icon: <IconGrid /> },
  { id: "banners", label: "Banners", icon: <IconImage /> },
  { id: "orders", label: "Orders", icon: <IconOrder /> },
  { id: "coupons", label: "Coupons", icon: Ic.tag },
  { id: "reviews", label: "Reviews", icon: Ic.star },
  { id: "flashsale", label: "Flash Sales", icon: Ic.bolt },

  { id: "settings", label: "Settings", icon: <IconSettings /> },
];

const AdminPanel: React.FC = () => {
  const nav = useNavigate();
  const { user, store, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => { if (!store) nav("/create-store"); }, [store]);

  const theme = store?.theme ? THEMES[store.theme] : THEMES.grocery;
  const c = theme.colors; const f = theme.fonts;
  const handleLogout = () => { logout(); nav("/"); };

  const Sidebar = () => (
    <div style={{ width: 260, background: c.bgDark, color: "#fff", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28 }}>{theme.icon}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, fontFamily: f.heading }}>{theme.name}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{store?.name}</div>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => { setActiveTab(t.id); setMobileMenu(false); }} className="btn-press"
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12, border: "none", background: activeTab === t.id ? "rgba(255,255,255,0.15)" : "transparent", color: activeTab === t.id ? "#fff" : "rgba(255,255,255,0.6)", fontWeight: activeTab === t.id ? 600 : 400, fontSize: 14, textAlign: "left", transition: "all 0.15s" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <div style={{ padding: "14px 10px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <button onClick={() => nav(`/store/${store?._id}`)} className="btn-press" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "11px 14px", borderRadius: 12, border: "none", background: c.primary, color: "#fff", fontWeight: 600, fontSize: 13, justifyContent: "center", marginBottom: 6 }}><IconEye /> View Store</button>
        <button onClick={handleLogout} className="btn-press" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 12, border: "none", background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: 13, justifyContent: "center" }}><IconLogout /> Logout</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: f.body }}>
      <div className="desktop-only" style={{ position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 100 }}><Sidebar /></div>
      {mobileMenu && (<div style={{ position: "fixed", inset: 0, zIndex: 1000 }}><div onClick={() => setMobileMenu(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} /><div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: 280, animation: "slideIn 0.3s ease" }}><Sidebar /></div></div>)}
      <div style={{ flex: 1, minHeight: "100vh", background: c.bg }} className="admin-main-content">
        <style>{`@media(min-width:769px){.admin-main-content{margin-left:260px!important}}`}</style>
        <div className="mobile-only" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: c.bgCard, borderBottom: `1px solid ${c.border}`, position: "sticky", top: 0, zIndex: 50 }}>
          <button onClick={() => setMobileMenu(true)} style={{ background: "none", border: "none", color: c.text, cursor: "pointer" }}><IconMenu /></button>
          <span style={{ fontWeight: 700, fontFamily: f.heading, fontSize: 16 }}>{theme.icon} {theme.name}</span>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: c.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>{user?.name?.[0]}</div>
        </div>
        <div className="desktop-only" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px", background: c.bgCard, borderBottom: `1px solid ${c.border}` }}>
          <h1 style={{ fontSize: f.size.h3, fontWeight: 700, color: c.text, fontFamily: f.heading }}>{tabs.find((t) => t.id === activeTab)?.label}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative", cursor: "pointer", color: c.textLight }}><IconBell /><div style={{ position: "absolute", top: 0, right: 0, width: 8, height: 8, borderRadius: "50%", background: c.danger }} /></div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: c.gradient, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>{user?.name?.[0]}</div>
          </div>
        </div>
        <div style={{ padding: "clamp(16px,3vw,28px)" }}>
          {activeTab === "dashboard" && <DashboardTab theme={theme} />}
          {activeTab === "products" && <ProductsTab theme={theme} />}
          {activeTab === "categories" && <CategoriesTab theme={theme} />}
          {activeTab === "banners" && <BannersTab theme={theme} />}
          {activeTab === "orders" && <OrdersTab theme={theme} />}
          {activeTab === "coupons" && <CouponsTab theme={theme} />}
          {activeTab === "reviews" && <ReviewsTab theme={theme} />}
          {activeTab === "flashsale" && <FlashSaleTab theme={theme} />}

          {activeTab === "settings" && <SettingsTab theme={theme} />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
