import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ThemeConfig } from "../../types";
import { apiGetCoupons, apiCreateCoupon, apiUpdateCoupon, apiDeleteCoupon } from "../../config/api";
import { IconPlus, IconEdit, IconTrash } from "../../components/Icons";

const CouponsTab: React.FC<{ theme: ThemeConfig }> = ({ theme }) => {
  const c = theme.colors; const f = theme.fonts;
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ code: "", type: "percentage", value: "", minOrder: "", maxDiscount: "", usageLimit: "100", validTo: "" });

  const load = async () => { try { const { data } = await apiGetCoupons(); setCoupons(data.coupons); } catch {} setLoading(false); };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ code: "", type: "percentage", value: "", minOrder: "", maxDiscount: "", usageLimit: "100", validTo: "" }); setShowForm(true); };
  const openEdit = (cp: any) => { setEditing(cp); setForm({ code: cp.code, type: cp.type, value: String(cp.value), minOrder: String(cp.minOrder), maxDiscount: String(cp.maxDiscount), usageLimit: String(cp.usageLimit), validTo: cp.validTo?.split("T")[0] || "" }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.code || !form.value || !form.validTo) { toast.error("Fill required fields"); return; }
    try {
      const payload = { ...form, value: +form.value, minOrder: +form.minOrder || 0, maxDiscount: +form.maxDiscount || 0, usageLimit: +form.usageLimit || 100 };
      if (editing) { await apiUpdateCoupon(editing._id, payload); toast.success("Updated"); }
      else { await apiCreateCoupon(payload); toast.success("Coupon created! 🎟️"); }
      setShowForm(false); load();
    } catch (e: any) { toast.error(e.response?.data?.message || "Error"); }
  };

  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; try { await apiDeleteCoupon(id); toast.success("Deleted"); load(); } catch { toast.error("Error"); } };

  const toggleActive = async (cp: any) => { try { await apiUpdateCoupon(cp._id, { isActive: !cp.isActive }); load(); } catch {} };

  const inp: React.CSSProperties = { width: "100%", padding: "12px 14px", borderRadius: 10, fontSize: 14, border: `2px solid ${c.border}`, background: c.bg };

  return (
    <div className="fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: c.text }}>{coupons.length} Coupons</h3>
        <button onClick={openCreate} className="btn-press" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: theme.btnRadius, background: c.primary, color: "#fff", border: "none", fontWeight: 600, fontSize: 14 }}><IconPlus /> Create Coupon</button>
      </div>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={() => setShowForm(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
          <div className="fade-up" style={{ background: c.bgCard, borderRadius: 20, padding: 28, width: "100%", maxWidth: 480, position: "relative", zIndex: 2 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, fontFamily: f.heading, color: c.text }}>{editing ? "Edit" : "Create"} Coupon</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input style={inp} placeholder="Coupon Code *" value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <select style={inp} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat (₹)</option>
                </select>
                <input style={inp} type="number" placeholder="Value *" value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <input style={inp} type="number" placeholder="Min Order ₹" value={form.minOrder} onChange={e => setForm(p => ({ ...p, minOrder: e.target.value }))} />
                <input style={inp} type="number" placeholder="Max Discount ₹" value={form.maxDiscount} onChange={e => setForm(p => ({ ...p, maxDiscount: e.target.value }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <input style={inp} type="number" placeholder="Usage Limit" value={form.usageLimit} onChange={e => setForm(p => ({ ...p, usageLimit: e.target.value }))} />
                <input style={inp} type="date" placeholder="Valid Until *" value={form.validTo} onChange={e => setForm(p => ({ ...p, validTo: e.target.value }))} />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: 12, borderRadius: 10, border: `1px solid ${c.border}`, background: "none", fontWeight: 600, cursor: "pointer", color: c.textLight }}>Cancel</button>
                <button onClick={handleSave} className="btn-press" style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: c.primary, color: "#fff", fontWeight: 600 }}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? <div style={{ textAlign: "center", padding: 40, color: c.textMuted }}>Loading...</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {coupons.map(cp => (
            <div key={cp._id} className="hover-lift" style={{ background: c.bgCard, borderRadius: theme.cardRadius, padding: 20, border: `1px solid ${c.border}`, position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ padding: "6px 14px", borderRadius: 8, background: `${c.primary}10`, border: `2px dashed ${c.primary}`, fontWeight: 800, fontSize: 18, color: c.primary, letterSpacing: 2, fontFamily: "monospace" }}>{cp.code}</div>
                <button onClick={() => toggleActive(cp)} style={{ padding: "4px 12px", borderRadius: 6, border: "none", background: cp.isActive ? `${c.success}15` : `${c.danger}15`, color: cp.isActive ? c.success : c.danger, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>{cp.isActive ? "Active" : "Disabled"}</button>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: c.text, marginBottom: 8 }}>
                {cp.type === "percentage" ? `${cp.value}% OFF` : `₹${cp.value} OFF`}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13, color: c.textMuted, marginBottom: 12 }}>
                {cp.minOrder > 0 && <span>Min order: ₹{cp.minOrder}</span>}
                {cp.maxDiscount > 0 && <span>Max discount: ₹{cp.maxDiscount}</span>}
                <span>Used: {cp.usedCount}/{cp.usageLimit}</span>
                <span>Expires: {new Date(cp.validTo).toLocaleDateString()}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => openEdit(cp)} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${c.border}`, background: "none", cursor: "pointer", fontSize: 12, color: c.textLight, display: "flex", alignItems: "center", gap: 4 }}><IconEdit /> Edit</button>
                <button onClick={() => handleDelete(cp._id)} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${c.danger}30`, background: "none", cursor: "pointer", fontSize: 12, color: c.danger, display: "flex", alignItems: "center", gap: 4 }}><IconTrash /> Delete</button>
              </div>
            </div>
          ))}
          {!coupons.length && <p style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, color: c.textMuted }}>No coupons yet. Create your first coupon!</p>}
        </div>
      )}
    </div>
  );
};

export default CouponsTab;
