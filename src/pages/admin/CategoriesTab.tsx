import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ThemeConfig, ICategory } from "../../types";
import { apiGetCategories, apiCreateCategory, apiUpdateCategory, apiDeleteCategory, apiUploadImage } from "../../config/api";
import { IconPlus, IconEdit, IconTrash, IconUpload } from "../../components/Icons";

const CategoriesTab: React.FC<{ theme: ThemeConfig }> = ({ theme }) => {
  const c = theme.colors;
  const f = theme.fonts;
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ICategory | null>(null);
  const [form, setForm] = useState({ name: "", icon: "📦", image: "" });

  const load = async () => { try { const { data } = await apiGetCategories(); setCategories(data.categories); } catch {} setLoading(false); };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ name: "", icon: "📦", image: "" }); setShowForm(true); };
  const openEdit = (cat: ICategory) => { setEditing(cat); setForm({ name: cat.name, icon: cat.icon, image: cat.image }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.name) { toast.error("Name required"); return; }
    try {
      if (editing) { await apiUpdateCategory(editing._id, form); toast.success("Updated"); }
      else { await apiCreateCategory(form); toast.success("Category created! 🎉"); }
      setShowForm(false); load();
    } catch (err: any) { toast.error(err.response?.data?.message || "Error"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete category?")) return;
    try { await apiDeleteCategory(id); toast.success("Deleted"); load(); } catch (err: any) { toast.error(err.response?.data?.message || "Error"); }
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    try { const { data } = await apiUploadImage(file); setForm(p => ({ ...p, image: data.url })); toast.success("Uploaded"); } catch { toast.error("Failed"); }
  };

  const inp: React.CSSProperties = { width: "100%", padding: "12px 14px", borderRadius: 10, fontSize: 14, border: `2px solid ${c.border}`, background: c.bg };

  return (
    <div className="fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: c.text }}>{categories.length} Categories</h3>
        <button onClick={openCreate} className="btn-press" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: theme.btnRadius, background: c.primary, color: "#fff", border: "none", fontWeight: 600, fontSize: 14 }}><IconPlus /> Add Category</button>
      </div>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={() => setShowForm(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
          <div className="fade-up" style={{ background: c.bgCard, borderRadius: 20, padding: 28, width: "100%", maxWidth: 420, position: "relative", zIndex: 2 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, fontFamily: f.heading, color: c.text }}>{editing ? "Edit" : "Add"} Category</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input style={inp} placeholder="Category Name *" value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} />
              <input style={inp} placeholder="Icon emoji (e.g. 🥕)" value={form.icon} onChange={(e) => setForm(p => ({ ...p, icon: e.target.value }))} />
              <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 10, border: `2px dashed ${c.border}`, cursor: "pointer", color: c.textMuted, fontSize: 14 }}>
                <IconUpload /> Upload Image
                <input type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
              </label>
              {form.image && <img src={form.image} alt="" style={{ width: 60, height: 60, borderRadius: 10, objectFit: "cover" }} />}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: 12, borderRadius: 10, border: `1px solid ${c.border}`, background: "none", fontWeight: 600, cursor: "pointer", color: c.textLight }}>Cancel</button>
                <button onClick={handleSave} className="btn-press" style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: c.primary, color: "#fff", fontWeight: 600 }}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? <div style={{ textAlign: "center", padding: 40, color: c.textMuted }}>Loading...</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
          {categories.map((cat) => (
            <div key={cat._id} className="hover-lift" style={{ background: c.bgCard, borderRadius: theme.cardRadius, padding: 24, textAlign: "center", border: `1px solid ${c.border}` }}>
              {cat.image ? <img src={cat.image} alt="" style={{ width: 60, height: 60, borderRadius: 12, objectFit: "cover", marginBottom: 12 }} /> : <div style={{ fontSize: 48, marginBottom: 12 }}>{cat.icon}</div>}
              <h4 style={{ fontSize: 16, fontWeight: 700, color: c.text, fontFamily: f.heading, marginBottom: 6 }}>{cat.name}</h4>
              <span style={{ fontSize: 13, color: c.textMuted }}>{cat.productCount || 0} products</span>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 16 }}>
                <button onClick={() => openEdit(cat)} style={{ padding: "6px 16px", borderRadius: 8, border: `1px solid ${c.border}`, background: "none", cursor: "pointer", fontSize: 12, color: c.textLight, display: "flex", alignItems: "center", gap: 4 }}><IconEdit /> Edit</button>
                <button onClick={() => handleDelete(cat._id)} style={{ padding: "6px 16px", borderRadius: 8, border: `1px solid ${c.danger}30`, background: "none", cursor: "pointer", fontSize: 12, color: c.danger, display: "flex", alignItems: "center", gap: 4 }}><IconTrash /> Delete</button>
              </div>
            </div>
          ))}
          {!categories.length && <p style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, color: c.textMuted }}>No categories yet</p>}
        </div>
      )}
    </div>
  );
};

export default CategoriesTab;
