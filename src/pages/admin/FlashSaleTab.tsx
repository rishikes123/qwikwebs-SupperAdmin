import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ThemeConfig } from "../../types";
import { apiGetFlashSales, apiCreateFlashSale, apiUpdateFlashSale, apiDeleteFlashSale, apiGetProducts } from "../../config/api";
import { IconPlus, IconEdit, IconTrash } from "../../components/Icons";

const FlashSaleTab: React.FC<{ theme: ThemeConfig }> = ({ theme }) => {
  const c = theme.colors; const f = theme.fonts;
  const [sales, setSales] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", startTime: "", endTime: "", selectedProducts: [] as { product: string; salePrice: string }[] });

  const load = async () => {
    try {
      const [s, p] = await Promise.all([apiGetFlashSales(), apiGetProducts()]);
      setSales(s.data.sales); setProducts(p.data.products);
    } catch {} setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", startTime: "", endTime: "", selectedProducts: [{ product: products[0]?._id || "", salePrice: "" }] });
    setShowForm(true);
  };

  const addProductRow = () => setForm(p => ({ ...p, selectedProducts: [...p.selectedProducts, { product: "", salePrice: "" }] }));
  const removeProductRow = (i: number) => setForm(p => ({ ...p, selectedProducts: p.selectedProducts.filter((_, idx) => idx !== i) }));
  const updateRow = (i: number, k: string, v: string) => setForm(p => ({ ...p, selectedProducts: p.selectedProducts.map((r, idx) => idx === i ? { ...r, [k]: v } : r) }));

  const handleSave = async () => {
    if (!form.title || !form.startTime || !form.endTime) { toast.error("Fill required fields"); return; }
    try {
      const payload = { title: form.title, startTime: form.startTime, endTime: form.endTime, products: form.selectedProducts.filter(p => p.product && p.salePrice).map(p => ({ product: p.product, salePrice: +p.salePrice })) };
      if (editing) { await apiUpdateFlashSale(editing._id, payload); toast.success("Updated"); }
      else { await apiCreateFlashSale(payload); toast.success("Flash Sale created! ⚡"); }
      setShowForm(false); load();
    } catch (e: any) { toast.error(e.response?.data?.message || "Error"); }
  };

  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; try { await apiDeleteFlashSale(id); toast.success("Deleted"); load(); } catch { toast.error("Error"); } };
  const toggleActive = async (s: any) => { try { await apiUpdateFlashSale(s._id, { isActive: !s.isActive }); load(); } catch {} };

  const inp: React.CSSProperties = { width: "100%", padding: "12px 14px", borderRadius: 10, fontSize: 14, border: `2px solid ${c.border}`, background: c.bg };

  const isLive = (s: any) => { const now = Date.now(); return s.isActive && new Date(s.startTime).getTime() <= now && new Date(s.endTime).getTime() >= now; };
  const timeLeft = (end: string) => { const d = new Date(end).getTime() - Date.now(); if (d <= 0) return "Ended"; const h = Math.floor(d / 3600000); const m = Math.floor((d % 3600000) / 60000); return `${h}h ${m}m left`; };

  return (
    <div className="fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: c.text }}>{sales.length} Flash Sales</h3>
        <button onClick={openCreate} className="btn-press" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: theme.btnRadius, background: c.primary, color: "#fff", border: "none", fontWeight: 600, fontSize: 14 }}><IconPlus /> Create Flash Sale</button>
      </div>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={() => setShowForm(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
          <div className="fade-up" style={{ background: c.bgCard, borderRadius: 20, padding: 28, width: "100%", maxWidth: 560, position: "relative", zIndex: 2, maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, fontFamily: f.heading, color: c.text }}>⚡ {editing ? "Edit" : "Create"} Flash Sale</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input style={inp} placeholder="Sale Title *" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div><label style={{ fontSize: 12, fontWeight: 600, color: c.textMuted, display: "block", marginBottom: 4 }}>Start Time *</label><input style={inp} type="datetime-local" value={form.startTime} onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))} /></div>
                <div><label style={{ fontSize: 12, fontWeight: 600, color: c.textMuted, display: "block", marginBottom: 4 }}>End Time *</label><input style={inp} type="datetime-local" value={form.endTime} onChange={e => setForm(p => ({ ...p, endTime: e.target.value }))} /></div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: c.text }}>Products & Sale Prices</label>
                  <button onClick={addProductRow} style={{ padding: "4px 12px", borderRadius: 6, border: `1px solid ${c.primary}`, background: "none", color: c.primary, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>+ Add</button>
                </div>
                {form.selectedProducts.map((row, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                    <select style={{ ...inp, flex: 2 }} value={row.product} onChange={e => updateRow(i, "product", e.target.value)}>
                      <option value="">Select Product</option>
                      {products.map((p: any) => <option key={p._id} value={p._id}>{p.name} (₹{p.price})</option>)}
                    </select>
                    <input style={{ ...inp, flex: 1 }} type="number" placeholder="Sale ₹" value={row.salePrice} onChange={e => updateRow(i, "salePrice", e.target.value)} />
                    {form.selectedProducts.length > 1 && <button onClick={() => removeProductRow(i)} style={{ background: "none", border: "none", cursor: "pointer", color: c.danger }}><IconTrash /></button>}
                  </div>
                ))}
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
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {sales.map(s => (
            <div key={s._id} className="hover-lift" style={{ background: c.bgCard, borderRadius: theme.cardRadius, padding: 20, border: `1px solid ${c.border}`, position: "relative", overflow: "hidden" }}>
              {isLive(s) && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${c.danger}, ${c.secondary})`, animation: "shimmer 2s infinite" }} />}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <h4 style={{ fontSize: 18, fontWeight: 700, color: c.text, fontFamily: f.heading }}>⚡ {s.title}</h4>
                  <div style={{ fontSize: 13, color: c.textMuted, marginTop: 4 }}>
                    {new Date(s.startTime).toLocaleString()} → {new Date(s.endTime).toLocaleString()}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {isLive(s) && <span style={{ padding: "4px 12px", borderRadius: 6, background: `${c.danger}15`, color: c.danger, fontWeight: 700, fontSize: 12, animation: "pulse 2s infinite" }}>🔴 LIVE — {timeLeft(s.endTime)}</span>}
                  <button onClick={() => toggleActive(s)} style={{ padding: "4px 12px", borderRadius: 6, border: "none", background: s.isActive ? `${c.success}15` : `${c.danger}15`, color: s.isActive ? c.success : c.danger, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>{s.isActive ? "Active" : "Disabled"}</button>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }}>
                {(s.products || []).map((sp: any, i: number) => (
                  <div key={i} style={{ minWidth: 140, padding: 12, borderRadius: 12, background: c.bg, textAlign: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: c.text, marginBottom: 4 }}>{typeof sp.product === "object" ? sp.product.name : "Product"}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: c.danger }}>₹{sp.salePrice}</div>
                    {typeof sp.product === "object" && <div style={{ fontSize: 12, color: c.textMuted, textDecoration: "line-through" }}>₹{sp.product.price}</div>}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button onClick={() => handleDelete(s._id)} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${c.danger}30`, background: "none", cursor: "pointer", fontSize: 12, color: c.danger, display: "flex", alignItems: "center", gap: 4 }}><IconTrash /> Delete</button>
              </div>
            </div>
          ))}
          {!sales.length && <p style={{ textAlign: "center", padding: 40, color: c.textMuted }}>No flash sales yet</p>}
        </div>
      )}
      <style>{`@keyframes shimmer{0%{opacity:1}50%{opacity:0.5}100%{opacity:1}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}`}</style>
    </div>
  );
};

export default FlashSaleTab;
