import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ThemeConfig } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { apiGetSettings, apiUpdateSettings, apiUploadImage, apiShiprocketLogin, apiUpdateStore } from "../../config/api";

const SettingsTab: React.FC<{ theme: ThemeConfig }> = ({ theme }) => {
  const c = theme.colors; const f = theme.fonts;
  const { store, refreshStore } = useAuth();
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [section, setSection] = useState("store");

  useEffect(() => { (async () => { try { const { data } = await apiGetSettings(); setSettings(data.settings || {}); } catch {} setLoading(false); })(); }, []);

  const set = (k: string, v: any) => setSettings((p: any) => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    try { await apiUpdateSettings(settings); toast.success("Settings saved! ✅"); refreshStore(); } catch { toast.error("Error saving"); }
    setSaving(false);
  };

  const uploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    try { const { data } = await apiUploadImage(file); set("logo", data.url); toast.success("Logo uploaded"); } catch { toast.error("Upload failed"); }
  };

  const uploadFavicon = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    try { const { data } = await apiUploadImage(file); set("favicon", data.url); toast.success("Favicon uploaded"); } catch { toast.error("Upload failed"); }
  };

  const uploadOgImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    try { const { data } = await apiUploadImage(file); set("ogImage", data.url); toast.success("OG Image uploaded"); } catch { toast.error("Upload failed"); }
  };

  const connectShiprocket = async () => {
    try { await apiShiprocketLogin(); toast.success("Shiprocket connected! 🚚"); } catch { toast.error("Connection failed"); }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 60, color: c.textMuted }}>Loading settings...</div>;

  const inp: React.CSSProperties = { width: "100%", padding: "13px 16px", borderRadius: 12, fontSize: 14, border: `2px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", transition: "border 0.2s" };
  const textarea: React.CSSProperties = { ...inp, minHeight: 120, resize: "vertical" as any, fontFamily: "inherit", lineHeight: 1.6 };
  const label: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: c.textLight, display: "block", marginBottom: 6 };
  const card: React.CSSProperties = { background: c.bgCard, borderRadius: theme.cardRadius, padding: "clamp(16px,3vw,28px)", border: `1px solid ${c.border}`, marginBottom: 20 };
  const toggle = (key: string, label: string, desc?: string) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${c.bg}` }}>
      <div><div style={{ fontSize: 14, fontWeight: 600, color: c.text }}>{label}</div>{desc && <div style={{ fontSize: 12, color: c.textMuted }}>{desc}</div>}</div>
      <button onClick={() => set(key, !settings[key])} style={{ width: 48, height: 26, borderRadius: 13, background: settings[key] ? c.success : c.border, border: "none", cursor: "pointer", position: "relative", transition: "all 0.2s" }}>
        <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: settings[key] ? 25 : 3, transition: "all 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
      </button>
    </div>
  );

  const sections = [
    { id: "store", icon: "🏪", label: "Store Info" },
    { id: "seo", icon: "🔍", label: "SEO" },
    { id: "payment", icon: "💳", label: "Payments" },
    { id: "shipping", icon: "🚚", label: "Shipping" },
    { id: "gst", icon: "🧾", label: "GST" },
    { id: "policies", icon: "📋", label: "Policies" },
    { id: "features", icon: "⚙️", label: "Features" },
    { id: "homepage", icon: "🏠", label: "Homepage" },
    { id: "delivery", icon: "📦", label: "Delivery" },
    { id: "social", icon: "🌐", label: "Social" },
    { id: "theme", icon: "🎨", label: "Theme" },
  ];

  return (
    <div className="fade-up">
      {/* Section Tabs */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 20, paddingBottom: 4 }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)} className="btn-press" style={{
            padding: "8px 16px", borderRadius: 10, border: section === s.id ? "none" : `1px solid ${c.border}`,
            background: section === s.id ? c.primary : c.bgCard, color: section === s.id ? "#fff" : c.textLight,
            fontWeight: 600, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4
          }}><span style={{ fontSize: 14 }}>{s.icon}</span> {s.label}</button>
        ))}
      </div>

      {/* ── Store Info ── */}
      {section === "store" && <div style={card}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: c.text, fontFamily: f.heading, marginBottom: 20 }}>🏪 Store Information</h3>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 20 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 100, height: 100, borderRadius: 20, background: c.bg, border: `2px dashed ${c.border}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: 8 }}>
              {settings.logo ? <img src={settings.logo} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <span style={{ fontSize: 36 }}>{theme.icon}</span>}
            </div>
            <label style={{ display: "inline-block", padding: "6px 16px", borderRadius: 8, background: c.primary, color: "#fff", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>Upload Logo<input type="file" accept="image/*" onChange={uploadLogo} style={{ display: "none" }} /></label>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 60, height: 60, borderRadius: 14, background: c.bg, border: `2px dashed ${c.border}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: 8 }}>
              {settings.favicon ? <img src={settings.favicon} alt="Favicon" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <span style={{ fontSize: 20 }}>🔖</span>}
            </div>
            <label style={{ display: "inline-block", padding: "6px 12px", borderRadius: 8, border: `1px solid ${c.border}`, fontSize: 11, cursor: "pointer", color: c.textLight, fontWeight: 500 }}>Favicon<input type="file" accept="image/*" onChange={uploadFavicon} style={{ display: "none" }} /></label>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div><label style={label}>Store Name</label><div style={{ ...inp, background: c.bg }}>{store?.name}</div></div>
          <div><label style={label}>Custom Domain</label><input style={inp} placeholder="www.yourstore.com" value={settings.customDomain || ""} onChange={e => set("customDomain", e.target.value)} /><span style={{ fontSize: 11, color: c.textMuted }}>Point your domain's CNAME to storebuilder.app</span></div>
          <div><label style={label}>Notification Email</label><input style={inp} placeholder="orders@yourstore.com" value={settings.orderNotifEmail || ""} onChange={e => set("orderNotifEmail", e.target.value)} /></div>
          <div><label style={label}>Notification Phone</label><input style={inp} placeholder="9876543210" value={settings.orderNotifPhone || ""} onChange={e => set("orderNotifPhone", e.target.value)} /></div>
        </div>
      </div>}

      {/* ── SEO ── */}
      {section === "seo" && <div style={card}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: c.text, fontFamily: f.heading, marginBottom: 20 }}>🔍 SEO Settings</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div><label style={label}>Page Title</label><input style={inp} placeholder="Your Store - Best Products Online" value={settings.seoTitle || ""} onChange={e => set("seoTitle", e.target.value)} /><span style={{ fontSize: 11, color: c.textMuted }}>{(settings.seoTitle || "").length}/60 characters</span></div>
          <div><label style={label}>Meta Description</label><textarea style={{ ...textarea, minHeight: 80 }} placeholder="Describe your store in 160 characters..." value={settings.seoDescription || ""} onChange={e => set("seoDescription", e.target.value)} /><span style={{ fontSize: 11, color: c.textMuted }}>{(settings.seoDescription || "").length}/160 characters</span></div>
          <div><label style={label}>Keywords</label><input style={inp} placeholder="grocery, online shopping, delivery" value={settings.seoKeywords || ""} onChange={e => set("seoKeywords", e.target.value)} /></div>
          <div>
            <label style={label}>OG Image (Social Sharing)</label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {settings.ogImage && <img src={settings.ogImage} alt="OG" style={{ width: 100, height: 60, borderRadius: 8, objectFit: "cover" }} />}
              <label style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${c.border}`, fontSize: 13, cursor: "pointer", color: c.textLight }}>Upload Image<input type="file" accept="image/*" onChange={uploadOgImage} style={{ display: "none" }} /></label>
            </div>
          </div>
        </div>
      </div>}

      {/* ── Payments (Razorpay) ── */}
      {section === "payment" && <div style={card}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: c.text, fontFamily: f.heading, marginBottom: 20 }}>💳 Payment Settings (Razorpay)</h3>
        {toggle("razorpayEnabled", "Enable Razorpay", "Accept online payments via UPI, Cards, Net Banking")}
        {settings.razorpayEnabled && <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
          <div><label style={label}>Razorpay Key ID</label><input style={inp} placeholder="rzp_live_xxxxxxxxx" value={settings.razorpayKeyId || ""} onChange={e => set("razorpayKeyId", e.target.value)} /></div>
          <div><label style={label}>Razorpay Key Secret</label><input style={inp} type="password" placeholder="••••••••••" value={settings.razorpayKeySecret || ""} onChange={e => set("razorpayKeySecret", e.target.value)} /></div>
          <div style={{ padding: 14, borderRadius: 10, background: `${c.primary}06`, border: `1px solid ${c.primary}15`, fontSize: 13, color: c.textLight, lineHeight: 1.6 }}>
            💡 Get your Razorpay keys from <a href="https://dashboard.razorpay.com" target="_blank" style={{ color: c.primary, fontWeight: 600 }}>Razorpay Dashboard</a> → Settings → API Keys
          </div>
        </div>}
      </div>}

      {/* ── Shipping (Shiprocket) ── */}
      {section === "shipping" && <div style={card}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: c.text, fontFamily: f.heading, marginBottom: 20 }}>🚚 Shipping (Shiprocket)</h3>
        {toggle("shiprocketEnabled", "Enable Shiprocket", "Automated shipping with 25+ courier partners")}
        {settings.shiprocketEnabled && <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
          <div><label style={label}>Shiprocket Email</label><input style={inp} placeholder="your@email.com" value={settings.shiprocketEmail || ""} onChange={e => set("shiprocketEmail", e.target.value)} /></div>
          <div><label style={label}>Shiprocket Password</label><input style={inp} type="password" placeholder="••••••••" value={settings.shiprocketPassword || ""} onChange={e => set("shiprocketPassword", e.target.value)} /></div>
          <button onClick={connectShiprocket} className="btn-press" style={{ padding: "12px 24px", borderRadius: theme.btnRadius, background: c.gradient, color: "#fff", border: "none", fontWeight: 700, fontSize: 14, width: "fit-content" }}>🔗 Connect Shiprocket</button>
          {settings.shiprocketToken && <div style={{ padding: 10, borderRadius: 8, background: `${c.success}10`, color: c.success, fontWeight: 600, fontSize: 13 }}>✅ Shiprocket Connected</div>}
        </div>}
      </div>}

      {/* ── GST ── */}
      {section === "gst" && <div style={card}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: c.text, fontFamily: f.heading, marginBottom: 20 }}>🧾 GST & Invoicing</h3>
        {toggle("gstEnabled", "Enable GST", "Add GST to invoices")}
        {settings.gstEnabled && <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
          <div><label style={label}>GST Number (GSTIN)</label><input style={inp} placeholder="22AAAAA0000A1Z5" value={settings.gstNumber || ""} onChange={e => set("gstNumber", e.target.value)} /></div>
          <div><label style={label}>GST Percentage (%)</label><input style={inp} type="number" placeholder="18" value={settings.gstPercentage || 18} onChange={e => set("gstPercentage", +e.target.value)} /></div>
        </div>}
      </div>}

      {/* ── Policies ── */}
      {section === "policies" && <div>
        {[
          { key: "privacyPolicy", title: "📄 Privacy Policy", placeholder: "Enter your privacy policy..." },
          { key: "returnPolicy", title: "🔄 Return & Refund Policy", placeholder: "Enter return and refund policy..." },
          { key: "shippingPolicy", title: "📦 Shipping & Delivery Policy", placeholder: "Enter shipping and delivery policy..." },
          { key: "termsConditions", title: "📋 Terms & Conditions", placeholder: "Enter terms and conditions..." },
        ].map(p => (
          <div key={p.key} style={card}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: c.text, marginBottom: 14 }}>{p.title}</h3>
            <textarea style={textarea} placeholder={p.placeholder} value={settings[p.key] || ""} onChange={e => set(p.key, e.target.value)} />
            <span style={{ fontSize: 11, color: c.textMuted }}>Supports plain text. HTML tags will be rendered on the store page.</span>
          </div>
        ))}
      </div>}

      {/* ── Features ── */}
      {section === "features" && <div style={card}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: c.text, fontFamily: f.heading, marginBottom: 16 }}>⚙️ Store Features</h3>
        {toggle("enableCOD", "Cash on Delivery", "Allow customers to pay on delivery")}
        {toggle("enableOnlinePayment", "Online Payment", "Accept online payments (requires Razorpay)")}
        {toggle("enableReviews", "Customer Reviews", "Allow customers to review products")}
        {toggle("enableWishlist", "Wishlist", "Let customers save favorite products")}
        {toggle("enableCoupons", "Discount Coupons", "Enable coupon/promo code system")}
        {toggle("enableFlashSale", "Flash Sales", "Time-limited discount sales")}
        {toggle("enableSubscription", "Subscriptions", "Recurring product subscriptions")}
      </div>}

      {/* ── Homepage ── */}
      {section === "homepage" && <div style={card}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: c.text, fontFamily: f.heading, marginBottom: 16 }}>🏠 Homepage Sections</h3>
        <p style={{ fontSize: 13, color: c.textMuted, marginBottom: 16 }}>Enable or disable sections on your store's homepage</p>
        {toggle("showBanners", "Hero Banners", "Slideshow banners at the top")}
        {toggle("showCategories", "Categories", "Category grid/scroll section")}
        {toggle("showTrending", "Trending Products", "Show trending/popular products")}
        {toggle("showNewArrivals", "New Arrivals", "Show recently added products")}
        {toggle("showFlashSale", "Flash Sale Section", "Show active flash sales on homepage")}
      </div>}

      {/* ── Delivery ── */}
      {section === "delivery" && <div style={card}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: c.text, fontFamily: f.heading, marginBottom: 20 }}>📦 Delivery Settings</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div><label style={label}>Minimum Order Amount (₹)</label><input style={inp} type="number" placeholder="0" value={settings.minOrderAmount || 0} onChange={e => set("minOrderAmount", +e.target.value)} /></div>
          <div><label style={label}>Free Delivery Above (₹)</label><input style={inp} type="number" placeholder="499" value={settings.freeDeliveryAbove || 499} onChange={e => set("freeDeliveryAbove", +e.target.value)} /></div>
          <div><label style={label}>Delivery Charge (₹)</label><input style={inp} type="number" placeholder="40" value={settings.deliveryCharge || 40} onChange={e => set("deliveryCharge", +e.target.value)} /></div>
        </div>
      </div>}

      {/* ── Social ── */}
      {section === "social" && <div style={card}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: c.text, fontFamily: f.heading, marginBottom: 20 }}>🌐 Social Links</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { key: "socialFacebook", icon: "📘", label: "Facebook URL" },
            { key: "socialInstagram", icon: "📸", label: "Instagram URL" },
            { key: "socialTwitter", icon: "🐦", label: "Twitter/X URL" },
            { key: "socialWhatsapp", icon: "💬", label: "WhatsApp Number" },
          ].map(s => (
            <div key={s.key}><label style={label}>{s.icon} {s.label}</label><input style={inp} placeholder={s.label} value={settings[s.key] || ""} onChange={e => set(s.key, e.target.value)} /></div>
          ))}
        </div>
      </div>}

      {/* ── Theme Variables ── */}
      {section === "theme" && <div style={card}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: c.text, fontFamily: f.heading, marginBottom: 20 }}>🎨 Theme Variables</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { l: "Theme", v: theme.name },
            { l: "Primary Color", v: c.primary, isColor: true },
            { l: "Secondary Color", v: c.secondary, isColor: true },
            { l: "Accent Color", v: c.accent, isColor: true },
            { l: "Heading Font", v: f.heading },
            { l: "Body Font", v: f.body },
            { l: "H1 Size", v: f.size.h1 },
            { l: "Body Size", v: f.size.body },
            { l: "Border Radius", v: theme.borderRadius },
            { l: "Card Radius", v: theme.cardRadius },
            { l: "Button Radius", v: theme.btnRadius },
          ].map(item => (
            <div key={item.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: 10, background: c.bg }}>
              <span style={{ fontSize: 13, color: c.textLight }}>{item.l}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {item.isColor && <div style={{ width: 20, height: 20, borderRadius: 5, background: item.v, border: `1px solid ${c.border}` }} />}
                <span style={{ fontSize: 13, fontWeight: 600, color: c.text, fontFamily: "monospace" }}>{item.v}</span>
              </div>
            </div>
          ))}
        </div>
      </div>}

      {/* Save Button */}
      <button onClick={save} disabled={saving} className="btn-press" style={{
        width: "100%", maxWidth: 400, padding: 16, borderRadius: theme.btnRadius, border: "none",
        background: c.gradient, color: "#fff", fontWeight: 700, fontSize: 16,
        opacity: saving ? 0.6 : 1, margin: "0 auto", display: "block",
        boxShadow: `0 6px 25px ${c.primary}30`,
      }}>
        {saving ? "Saving..." : "💾 Save All Settings"}
      </button>
    </div>
  );
};

export default SettingsTab;
