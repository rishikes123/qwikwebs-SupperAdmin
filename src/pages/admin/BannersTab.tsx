import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ThemeConfig, IBanner } from "../../types";
import { apiGetBanners, apiCreateBanner, apiUpdateBanner, apiDeleteBanner, apiUploadImage } from "../../config/api";
import { IconPlus, IconEdit, IconTrash, IconUpload } from "../../components/Icons";

const BannersTab: React.FC<{ theme: ThemeConfig }> = ({ theme }) => {
  const c = theme.colors;
  const f = theme.fonts;
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<IBanner | null>(null);
  const [form, setForm] = useState({ title: "", subtitle: "", bgColor: c.gradient, image: "", link: "" });

  const load = async () => { try { const { data } = await apiGetBanners(); setBanners(data.banners); } catch {} setLoading(false); };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ title: "", subtitle: "", bgColor: c.gradient, image: "", link: "" }); setShowForm(true); };
  const openEdit = (b: IBanner) => { setEditing(b); setForm({ title: b.title, subtitle: b.subtitle, bgColor: b.bgColor, image: b.image, link: b.link }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.title) { toast.error("Title required"); return; }
    try {
      if (editing) { await apiUpdateBanner(editing._id, form); toast.success("Updated"); }
      else { await apiCreateBanner(form); toast.success("Banner created!"); }
      setShowForm(false); load();
    } catch (err: any) { toast.error(err.response?.data?.message || "Error"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete banner?")) return;
    try { await apiDeleteBanner(id); toast.success("Deleted"); load(); } catch { toast.error("Error"); }
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    try { const { data } = await apiUploadImage(file); setForm(p => ({ ...p, image: data.url })); } catch { toast.error("Failed"); }
  };

  const inp: React.CSSProperties = { width: "100%", padding: "12px 14px", borderRadius: 10, fontSize: 14, border: `2px solid ${c.border}`, background: c.bg };

  return (
    <>
      <div className="fade-up">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: c.text }}>{banners.length} Banners</h3>
          <button onClick={openCreate} className="btn-press" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: theme.btnRadius, background: c.primary, color: "#fff", border: "none", fontWeight: 600, fontSize: 14 }}><IconPlus /> Add Banner</button>
        </div>

        {loading ? <div style={{ textAlign: "center", padding: 40, color: c.textMuted }}>Loading...</div> : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {banners.map((b) => (
              <div key={b._id} className="hover-lift" style={{ background: b.image ? `url(${b.image}) center/cover` : b.bgColor, borderRadius: theme.cardRadius, padding: "clamp(24px,4vw,40px)", color: "#fff", position: "relative", overflow: "hidden", minHeight: 140 }}>
                {b.image && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />}
                <div style={{ position: "relative", zIndex: 2 }}>
                  <h3 style={{ fontSize: "clamp(1.2rem,3vw,1.8rem)", fontWeight: 700, fontFamily: f.heading, marginBottom: 8 }}>{b.title}</h3>
                  <p style={{ fontSize: "clamp(0.85rem,2vw,1.1rem)", opacity: 0.9 }}>{b.subtitle}</p>
                </div>
                <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 8, zIndex: 3 }}>
                  <button onClick={() => openEdit(b)} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "rgba(255,255,255,0.2)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><IconEdit /></button>
                  <button onClick={() => handleDelete(b._id)} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "rgba(255,255,255,0.2)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><IconTrash /></button>
                </div>
              </div>
            ))}
            {!banners.length && <p style={{ textAlign: "center", padding: 40, color: c.textMuted }}>No banners yet</p>}
          </div>
        )}
      </div>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={() => setShowForm(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)" }} />
          <div className="fade-up" style={{ background: c.bgCard, borderRadius: 24, padding: 28, width: "100%", maxWidth: 480, position: "relative", zIndex: 2, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, fontFamily: f.heading, color: c.text }}>{editing ? "Edit" : "Add"} Banner</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input style={inp} placeholder="Banner Title *" value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} />
              <input style={inp} placeholder="Subtitle" value={form.subtitle} onChange={(e) => setForm(p => ({ ...p, subtitle: e.target.value }))} />
              <input style={inp} placeholder="Background CSS (gradient/color)" value={form.bgColor} onChange={(e) => setForm(p => ({ ...p, bgColor: e.target.value }))} />
              <input style={inp} placeholder="Link URL" value={form.link} onChange={(e) => setForm(p => ({ ...p, link: e.target.value }))} />
              <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 10, border: `2px dashed ${c.border}`, cursor: "pointer", color: c.textMuted, fontSize: 14 }}>
                <IconUpload /> Upload Banner Image
                <input type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
              </label>
              {form.image && <img src={form.image} alt="" style={{ width: "100%", height: 100, borderRadius: 10, objectFit: "cover" }} />}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: 12, borderRadius: 10, border: `1px solid ${c.border}`, background: "none", fontWeight: 600, cursor: "pointer", color: c.textLight }}>Cancel</button>
                <button onClick={handleSave} className="btn-press" style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: c.primary, color: "#fff", fontWeight: 600 }}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BannersTab;
