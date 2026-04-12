import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { ThemeConfig, IProduct, ICategory, IVariant } from "../../types";
import { apiGetProducts, apiCreateProduct, apiUpdateProduct, apiDeleteProduct, apiGetCategories, apiUploadImage } from "../../config/api";
import { getThemeFields, themeHasVariants, themeHasUnitVariants, COLOR_PALETTE, SIZE_OPTIONS, UNIT_PRESETS } from "../../config/themeFields";
import { useAuth } from "../../context/AuthContext";

/* ── Icons ── */
const I = {
  search: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  plus:   <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>,
  edit:   <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  upload: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>,
  close:  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  star:   <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  tag:    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><circle cx="7" cy="7" r="1"/></svg>,
  variant:<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
  img:    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
};

/* ── Empty form shapes ── */
const emptyForm = {
  name: "", description: "", price: "", mrp: "", unit: "",
  category: "", stock: "", image: "", images: [] as string[],
  isTrending: false, isNewArrival: true, isFeatured: false,
};
const emptyThemeFields = (): Record<string, string> => ({});
const emptyVariant = (): Omit<IVariant, "_id"> => ({
  size: "M", color: "Black", colorHex: "#1a1a1a", stock: 0, sku: "", price: undefined,
});
const emptyUnitVariant = (unit = "") => ({ unit, price: "", stock: "", sku: "" });

/* ═══════════════════════════════════════════
   PRODUCTS TAB COMPONENT
═══════════════════════════════════════════ */
const ProductsTab: React.FC<{ theme: ThemeConfig }> = ({ theme }) => {
  const { store } = useAuth();
  const c = theme.colors;
  const f = theme.fonts;
  const themeId = (store?.theme ?? "grocery") as import("../../types").ThemeType;
  const fieldDefs = getThemeFields(themeId);
  const showVariants = themeHasVariants(themeId);
  const showUnitVariants = themeHasUnitVariants(themeId);
  const unitPresets = UNIT_PRESETS[themeId] || [];

  /* ── State ── */
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<IProduct | null>(null);
  const [activeTab, setActiveTab] = useState<"basic" | "theme" | "variants" | "units" | "images">("basic");
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [themeForm, setThemeForm] = useState<Record<string, string>>(emptyThemeFields());
  const [variants, setVariants] = useState<Omit<IVariant, "_id">[]>([]);
  const [unitVariants, setUnitVariants] = useState<{unit:string;price:string;stock:string;sku:string}[]>([]);

  /* ── Load ── */
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, cat] = await Promise.all([
        apiGetProducts({ search }),
        apiGetCategories(),
      ]);
      setProducts(p.data.products);
      setCategories(cat.data.categories);
    } catch {}
    setLoading(false);
  }, [search]);

  useEffect(() => { load(); }, [load]);

  /* ── Helpers ── */
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));
  const setTF = (k: string, v: string) => setThemeForm(p => ({ ...p, [k]: v }));

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, category: categories[0]?._id || "" });
    setThemeForm(emptyThemeFields);
    setVariants([]);
    setUnitVariants([]);
    setActiveTab("basic");
    setShowForm(true);
  };

  const openEdit = (p: IProduct) => {
    setEditing(p);
    setForm({
      name: p.name, description: p.description,
      price: String(p.price), mrp: String(p.mrp),
      unit: p.unit || "", stock: String(p.stock),
      image: p.image || "", images: p.images || [],
      category: typeof p.category === "string" ? p.category : p.category._id,
      isTrending: p.isTrending ?? false,
      isNewArrival: p.isNewArrival ?? false,
      isFeatured: p.isFeatured ?? false,
    });
    setThemeForm(p.themeFields
      ? Object.fromEntries(Object.entries(p.themeFields).map(([k, v]) => [k, String(v ?? "")]))
      : emptyThemeFields()
    );
    setVariants(
      (p.variants ?? []).map(v => ({
        size: v.size, color: v.color, colorHex: v.colorHex || "#1a1a1a",
        stock: v.stock, sku: v.sku, price: v.price,
      }))
    );
    // Load unit variants (stored as variants with color=="__unit__")
    const uvRaw = (p.unitVariants as any[] || []);
    setUnitVariants(uvRaw.length > 0 ? uvRaw.map((u:any) => ({ unit: u.unit||u.size||"", price: String(u.price||""), stock: String(u.stock||""), sku: u.sku||"" })) : []);
    setActiveTab("basic");
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Product name is required"); return; }
    if (!form.price) { toast.error("Price is required"); return; }
    if (!form.category) { toast.error("Select a category"); return; }
    try {
      const payload = {
        ...form,
        price: +form.price,
        mrp: +(form.mrp) || +form.price,
        stock: +form.stock || 0,
        themeFields: themeForm,
        variants: variants.map(v => ({ ...v, stock: +v.stock })),
        hasVariants: variants.length > 0,
        unitVariants: unitVariants.map(u => ({ unit: u.unit, price: +u.price, stock: +u.stock, sku: u.sku })),
        hasUnitVariants: unitVariants.length > 0,
      };
      if (editing) {
        await apiUpdateProduct(editing._id, payload);
        toast.success("Product updated ✅");
      } else {
        await apiCreateProduct(payload);
        toast.success("Product created 🎉");
      }
      setShowForm(false);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try { await apiDeleteProduct(id); toast.success("Deleted"); load(); }
    catch { toast.error("Delete failed"); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data } = await apiUploadImage(file);
      set("image", data.url);
      toast.success("Image uploaded");
    } catch { toast.error("Upload failed"); }
    setUploading(false);
  };

  const handleExtraImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(f => apiUploadImage(f).then(r => r.data.url)));
      set("images", [...form.images, ...urls]);
      toast.success(`${urls.length} image(s) uploaded`);
    } catch { toast.error("Upload failed"); }
    setUploading(false);
  };

  /* ── Variant helpers ── */
  const addVariant = () => setVariants(v => [...v, emptyVariant()]);
  const removeVariant = (i: number) => setVariants(v => v.filter((_, j) => j !== i));
  const updateVariant = (i: number, k: keyof Omit<IVariant, "_id">, val: any) =>
    setVariants(v => v.map((item, j) => j === i ? { ...item, [k]: val } : item));
  // Unit variant helpers
  const addUnitVariant = (unit = "") => setUnitVariants(v => [...v, emptyUnitVariant(unit)]);
  const removeUnitVariant = (i: number) => setUnitVariants(v => v.filter((_, j) => j !== i));
  const updateUnitVariant = (i: number, k: string, val: string) =>
    setUnitVariants(v => v.map((item, j) => j === i ? { ...item, [k]: val } : item));

  /* ── Styles ── */
  const inp: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 14,
    border: `1.5px solid ${c.border}`, background: c.bg, color: c.text,
    outline: "none", transition: "border-color 0.2s, box-shadow 0.2s", fontFamily: f.body,
  };
  const label: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, color: c.textMuted,
    textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 5, display: "block",
  };
  const chip = (active: boolean): React.CSSProperties => ({
    padding: "8px 18px", borderRadius: 50, border: "none", cursor: "pointer",
    fontSize: 13, fontWeight: 600, transition: "all 0.2s",
    background: active ? c.primary : c.bg,
    color: active ? "#fff" : c.textMuted,
    boxShadow: active ? `0 2px 12px ${c.primary}30` : "none",
  });

  /* ── Render ── */
  return (
    <div>
      {/* ── Toolbar ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: c.bgCard, borderRadius: 12, padding: "10px 16px", border: `1px solid ${c.border}`, flex: 1, maxWidth: 380 }}>
          {I.search}
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" style={{ border: "none", background: "none", fontSize: 14, flex: 1, color: c.text, outline: "none" }} />
        </div>
        <button onClick={openCreate} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 12, background: c.gradient, color: "#fff", border: "none", fontWeight: 600, fontSize: 14, cursor: "pointer", boxShadow: `0 4px 16px ${c.primary}30` }}>
          {I.plus} Add Product
        </button>
      </div>

      {/* ── Stats strip ── */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total", value: products.length, color: c.primary },
          { label: "Active", value: products.filter(p => p.isActive).length, color: c.success },
          { label: "Out of Stock", value: products.filter(p => p.stock === 0).length, color: c.danger },
          { label: "Featured", value: products.filter(p => p.isFeatured).length, color: c.secondary },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: c.bgCard, borderRadius: 14, padding: "14px 18px", border: `1px solid ${c.border}`, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: c.textMuted, fontWeight: 500, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Modal Form ── */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div onClick={() => setShowForm(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }} />
          <div style={{ background: c.bgCard, borderRadius: 24, width: "100%", maxWidth: 680, position: "relative", zIndex: 2, maxHeight: "92vh", display: "flex", flexDirection: "column", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}>

            {/* Modal header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 28px", borderBottom: `1px solid ${c.border}` }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: c.text, fontFamily: f.heading }}>{editing ? "Edit Product" : "Add New Product"}</h3>
                <p style={{ fontSize: 12, color: c.textMuted, marginTop: 2 }}>{theme.icon} {theme.name} store</p>
              </div>
              <button onClick={() => setShowForm(false)} style={{ width: 36, height: 36, borderRadius: 10, background: c.bg, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: c.textMuted }}>{I.close}</button>
            </div>

            {/* Tab nav */}
            <div style={{ display: "flex", gap: 4, padding: "12px 28px", borderBottom: `1px solid ${c.border}`, overflowX: "auto" }}>
              {(["basic", "theme", ...(showVariants ? ["variants"] : []), ...(showUnitVariants ? ["units"] : []), "images"] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab as any)} style={chip(activeTab === tab)}>
                  {tab === "basic" && "📝 Basic"}
                  {tab === "theme" && `${theme.icon} Details`}
                  {tab === "variants" && "🎨 Variants"}
                  {tab === "units" && "📦 Units"}
                  {tab === "images" && "📸 Images"}
                  {tab === "variants" && variants.length > 0 && (
                    <span style={{ marginLeft: 6, padding: "2px 7px", borderRadius: 10, background: "rgba(255,255,255,0.25)", fontSize: 11 }}>{variants.length}</span>
                  )}
                  {tab === "units" && unitVariants.length > 0 && (
                    <span style={{ marginLeft: 6, padding: "2px 7px", borderRadius: 10, background: "rgba(255,255,255,0.25)", fontSize: 11 }}>{unitVariants.length}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Scrollable body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>

              {/* ── TAB: BASIC ── */}
              {activeTab === "basic" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div>
                    <span style={label}>Product Name *</span>
                    <input style={inp} placeholder="Enter product name" value={form.name} onChange={e => set("name", e.target.value)} />
                  </div>
                  <div>
                    <span style={label}>Description</span>
                    <textarea style={{ ...inp, minHeight: 80, resize: "vertical" } as any} placeholder="Product description…" value={form.description} onChange={e => set("description", e.target.value)} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <span style={label}>Selling Price (₹) *</span>
                      <input style={inp} type="number" min="0" placeholder="0" value={form.price} onChange={e => set("price", e.target.value)} />
                    </div>
                    <div>
                      <span style={label}>MRP (₹)</span>
                      <input style={inp} type="number" min="0" placeholder="0" value={form.mrp} onChange={e => set("mrp", e.target.value)} />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <span style={label}>Unit</span>
                      <input style={inp} placeholder="e.g. 1 kg, per piece, 500ml" value={form.unit} onChange={e => set("unit", e.target.value)} />
                    </div>
                    <div>
                      <span style={label}>Stock Quantity</span>
                      <input style={inp} type="number" min="0" placeholder="0" value={form.stock} onChange={e => set("stock", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <span style={label}>Category *</span>
                    <select style={inp} value={form.category} onChange={e => set("category", e.target.value)}>
                      <option value="">— Select Category —</option>
                      {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.icon} {cat.name}</option>)}
                    </select>
                  </div>

                  {/* Main image */}
                  <div>
                    <span style={label}>Main Image</span>
                    <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderRadius: 12, border: `2px dashed ${c.border}`, cursor: "pointer", color: c.textMuted, fontSize: 14, justifyContent: "center", transition: "border-color 0.2s" }}>
                      {I.upload}
                      {uploading ? "Uploading…" : (form.image ? "Change main image" : "Upload main image")}
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                    </label>
                    {form.image && <img src={form.image} alt="" style={{ width: 80, height: 80, borderRadius: 12, objectFit: "cover", marginTop: 10, border: `2px solid ${c.border}` }} />}
                  </div>

                  {/* Badges */}
                  <div>
                    <span style={label}>Product Tags</span>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {[
                        { k: "isTrending",   label: "🔥 Trending" },
                        { k: "isNewArrival", label: "✨ New Arrival" },
                        { k: "isFeatured",   label: "⭐ Featured" },
                      ].map(({ k, label: lbl }) => (
                        <button key={k}
                          onClick={() => set(k, !(form as any)[k])}
                          style={{ padding: "8px 16px", borderRadius: 50, border: `2px solid ${(form as any)[k] ? c.primary : c.border}`, background: (form as any)[k] ? `${c.primary}10` : "transparent", color: (form as any)[k] ? c.primary : c.textMuted, fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}>
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB: THEME FIELDS ── */}
              {activeTab === "theme" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {fieldDefs.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 20px", color: c.textMuted }}>
                      <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                      <p>No extra fields for this theme.</p>
                    </div>
                  ) : fieldDefs.map(field => (
                    <div key={field.key}>
                      <span style={label}>{field.icon} {field.label}{field.required && " *"}</span>
                      {field.type === "select" ? (
                        <select style={inp} value={themeForm[field.key] || ""} onChange={e => setTF(field.key, e.target.value)}>
                          <option value="">— Select —</option>
                          {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : field.type === "date" ? (
                        <input style={inp} type="date" value={themeForm[field.key] || ""} onChange={e => setTF(field.key, e.target.value)} />
                      ) : field.type === "number" ? (
                        <input style={inp} type="number" placeholder={field.placeholder} value={themeForm[field.key] || ""} onChange={e => setTF(field.key, e.target.value)} />
                      ) : field.type === "textarea" ? (
                        <textarea style={{ ...inp, minHeight: 70 } as any} placeholder={field.placeholder} value={themeForm[field.key] || ""} onChange={e => setTF(field.key, e.target.value)} />
                      ) : (
                        <input style={inp} type="text" placeholder={field.placeholder} value={themeForm[field.key] || ""} onChange={e => setTF(field.key, e.target.value)} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* ── TAB: VARIANTS ── */}
              {activeTab === "variants" && showVariants && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: c.text }}>Size & Color Variants</h4>
                      <p style={{ fontSize: 12, color: c.textMuted, marginTop: 2 }}>Each variant = unique size + color combination with its own stock</p>
                    </div>
                    <button onClick={addVariant} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, background: c.gradient, color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, boxShadow: `0 2px 10px ${c.primary}30` }}>
                      {I.plus} Add Variant
                    </button>
                  </div>

                  {variants.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "48px 20px", border: `2px dashed ${c.border}`, borderRadius: 16, color: c.textMuted }}>
                      <div style={{ fontSize: 44, marginBottom: 12 }}>🎨</div>
                      <p style={{ fontWeight: 600, marginBottom: 6 }}>No variants yet</p>
                      <p style={{ fontSize: 13 }}>Add size/color combos (e.g. Red + M, Blue + L)</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {variants.map((v, i) => (
                        <div key={i} style={{ background: c.bg, borderRadius: 14, padding: "16px 18px", border: `1px solid ${c.border}` }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: c.text }}>Variant #{i + 1}</span>
                            <button onClick={() => removeVariant(i)} style={{ background: `${c.danger}10`, border: "none", color: c.danger, cursor: "pointer", padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>{I.trash} Remove</button>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                            <div>
                              <span style={label}>Size</span>
                              <select style={inp} value={v.size} onChange={e => updateVariant(i, "size", e.target.value)}>
                                {SIZE_OPTIONS.clothing.map(s => <option key={s}>{s}</option>)}
                                {SIZE_OPTIONS.free.map(s => <option key={s}>{s}</option>)}
                              </select>
                            </div>
                            <div>
                              <span style={label}>Color</span>
                              <select style={inp} value={v.color} onChange={e => {
                                const col = COLOR_PALETTE.find(p => p.name === e.target.value);
                                updateVariant(i, "color", e.target.value);
                                if (col) updateVariant(i, "colorHex", col.hex);
                              }}>
                                {COLOR_PALETTE.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                              </select>
                            </div>
                          </div>
                          {/* Color dot preview */}
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                            <div style={{ width: 24, height: 24, borderRadius: "50%", background: v.colorHex || "#ccc", border: "2px solid rgba(0,0,0,0.1)", flexShrink: 0 }} />
                            <span style={{ fontSize: 12, color: c.textMuted }}>{v.color} — {v.size}</span>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                            <div>
                              <span style={label}>Stock</span>
                              <input style={inp} type="number" min="0" value={v.stock} onChange={e => updateVariant(i, "stock", +e.target.value)} />
                            </div>
                            <div>
                              <span style={label}>SKU</span>
                              <input style={inp} placeholder="e.g. TSHIRT-RED-M" value={v.sku} onChange={e => updateVariant(i, "sku", e.target.value)} />
                            </div>
                            <div>
                              <span style={label}>Price Override (₹)</span>
                              <input style={inp} type="number" min="0" placeholder={form.price || "—"} value={v.price ?? ""} onChange={e => updateVariant(i, "price", e.target.value ? +e.target.value : undefined)} />
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Summary table */}
                      <div style={{ background: c.bgCard, borderRadius: 12, border: `1px solid ${c.border}`, overflow: "hidden", marginTop: 4 }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                          <thead>
                            <tr style={{ background: c.bg }}>
                              {["Color", "Size", "Stock", "SKU", "Price"].map(h => (
                                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: c.textMuted, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {variants.map((v, i) => (
                              <tr key={i} style={{ borderTop: `1px solid ${c.border}` }}>
                                <td style={{ padding: "10px 14px" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: v.colorHex, border: "1px solid rgba(0,0,0,0.1)", flexShrink: 0 }} />
                                    <span style={{ color: c.text }}>{v.color}</span>
                                  </div>
                                </td>
                                <td style={{ padding: "10px 14px" }}><span style={{ padding: "2px 10px", borderRadius: 6, background: `${c.primary}10`, color: c.primary, fontWeight: 600, fontSize: 12 }}>{v.size}</span></td>
                                <td style={{ padding: "10px 14px", color: v.stock === 0 ? c.danger : c.success, fontWeight: 600 }}>{v.stock}</td>
                                <td style={{ padding: "10px 14px", color: c.textMuted, fontFamily: "monospace" }}>{v.sku || "—"}</td>
                                <td style={{ padding: "10px 14px", fontWeight: 600, color: c.text }}>₹{v.price ?? form.price}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB: UNIT VARIANTS ── */}
              {activeTab === "units" && showUnitVariants && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: c.text }}>📦 Unit / Quantity Variants</h4>
                      <p style={{ fontSize: 12, color: c.textMuted, marginTop: 2 }}>Each unit = separate pack size with its own price & stock (e.g. 500ml ₹30, 1L ₹55)</p>
                    </div>
                    <button onClick={() => addUnitVariant()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, background: c.gradient, color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, boxShadow: `0 2px 10px ${c.primary}30` }}>
                      {I.plus} Add Unit
                    </button>
                  </div>

                  {/* Quick preset chips */}
                  {unitPresets.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                      <span style={label}>Quick Add (click to add preset units)</span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                        {unitPresets.map((group, gi) => (
                          group.map(preset => {
                            const alreadyAdded = unitVariants.some(u => u.unit === preset);
                            return (
                              <button key={`${gi}-${preset}`} onClick={() => !alreadyAdded && addUnitVariant(preset)}
                                disabled={alreadyAdded}
                                style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${alreadyAdded ? c.success : c.border}`, background: alreadyAdded ? `${c.success}10` : c.bg, color: alreadyAdded ? c.success : c.text, fontSize: 12, fontWeight: 600, cursor: alreadyAdded ? "default" : "pointer", transition: "all 0.2s" }}>
                                {alreadyAdded ? "✓ " : "+ "}{preset}
                              </button>
                            );
                          })
                        ))}
                      </div>
                    </div>
                  )}

                  {unitVariants.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "48px 20px", border: `2px dashed ${c.border}`, borderRadius: 16, color: c.textMuted }}>
                      <div style={{ fontSize: 44, marginBottom: 12 }}>📦</div>
                      <p style={{ fontWeight: 600, marginBottom: 6 }}>No unit variants yet</p>
                      <p style={{ fontSize: 13 }}>Add units like 500ml, 1L, 2L or Small/Medium/Large</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {unitVariants.map((u, i) => (
                        <div key={i} style={{ background: c.bg, borderRadius: 14, padding: "16px 18px", border: `1px solid ${c.border}` }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 32, height: 32, borderRadius: 10, background: `${c.primary}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📦</div>
                              <span style={{ fontSize: 14, fontWeight: 700, color: c.text }}>{u.unit || `Unit #${i + 1}`}</span>
                            </div>
                            <button onClick={() => removeUnitVariant(i)} style={{ background: `${c.danger}10`, border: "none", color: c.danger, cursor: "pointer", padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>{I.trash} Remove</button>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
                            <div>
                              <span style={label}>Unit Label</span>
                              <input style={inp} placeholder="e.g. 500 ml, 1 kg, Small" value={u.unit} onChange={e => updateUnitVariant(i, "unit", e.target.value)} />
                            </div>
                            <div>
                              <span style={label}>Price (₹) *</span>
                              <input style={inp} type="number" min="0" placeholder={form.price || "0"} value={u.price} onChange={e => updateUnitVariant(i, "price", e.target.value)} />
                            </div>
                            <div>
                              <span style={label}>Stock</span>
                              <input style={inp} type="number" min="0" placeholder="100" value={u.stock} onChange={e => updateUnitVariant(i, "stock", e.target.value)} />
                            </div>
                            <div>
                              <span style={label}>SKU (optional)</span>
                              <input style={inp} placeholder="e.g. MILK-1L" value={u.sku} onChange={e => updateUnitVariant(i, "sku", e.target.value)} />
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Summary table */}
                      <div style={{ background: c.bgCard, borderRadius: 12, border: `1px solid ${c.border}`, overflow: "hidden", marginTop: 4 }}>
                        <div style={{ padding: "10px 16px", background: c.bg, fontSize: 11, fontWeight: 700, color: c.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>Summary</div>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                          <thead>
                            <tr style={{ background: `${c.primary}05` }}>
                              {["Unit", "Price", "Stock", "SKU"].map(h => (
                                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: c.textMuted, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {unitVariants.map((u, i) => (
                              <tr key={i} style={{ borderTop: `1px solid ${c.border}` }}>
                                <td style={{ padding: "10px 16px" }}>
                                  <span style={{ padding: "3px 12px", borderRadius: 8, background: `${c.primary}10`, color: c.primary, fontWeight: 700, fontSize: 12 }}>{u.unit || "—"}</span>
                                </td>
                                <td style={{ padding: "10px 16px", fontWeight: 700, color: c.text }}>₹{u.price || "—"}</td>
                                <td style={{ padding: "10px 16px", color: (+u.stock || 0) === 0 ? c.danger : c.success, fontWeight: 600 }}>{u.stock || "—"}</td>
                                <td style={{ padding: "10px 16px", color: c.textMuted, fontFamily: "monospace", fontSize: 12 }}>{u.sku || "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB: IMAGES ── */}
              {activeTab === "images" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <span style={label}>Main Image</span>
                    <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderRadius: 14, border: `2px dashed ${c.border}`, cursor: "pointer", color: c.textMuted, justifyContent: "center", transition: "all 0.2s" }}>
                      {I.upload} {uploading ? "Uploading…" : (form.image ? "Replace main image" : "Upload main image")}
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                    </label>
                    {form.image && (
                      <div style={{ position: "relative", display: "inline-block", marginTop: 12 }}>
                        <img src={form.image} alt="" style={{ width: 120, height: 120, borderRadius: 14, objectFit: "cover", border: `2px solid ${c.primary}` }} />
                        <span style={{ position: "absolute", top: 4, left: 4, background: c.primary, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 6 }}>MAIN</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <span style={label}>Gallery Images (up to 8)</span>
                    <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderRadius: 14, border: `2px dashed ${c.border}`, cursor: "pointer", color: c.textMuted, justifyContent: "center", transition: "all 0.2s" }}>
                      {I.img} Upload more images (multi-select)
                      <input type="file" accept="image/*" multiple onChange={handleExtraImageUpload} style={{ display: "none" }} />
                    </label>
                    {form.images.length > 0 && (
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                        {form.images.map((url, i) => (
                          <div key={i} style={{ position: "relative" }}>
                            <img src={url} alt="" style={{ width: 90, height: 90, borderRadius: 12, objectFit: "cover", border: `1px solid ${c.border}` }} />
                            <button onClick={() => set("images", form.images.filter((_, j) => j !== i))} style={{ position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: "50%", background: c.danger, border: "none", color: "#fff", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div style={{ padding: "16px 28px", borderTop: `1px solid ${c.border}`, display: "flex", gap: 10, background: c.bgCard, borderRadius: "0 0 24px 24px" }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: "12px", borderRadius: 12, border: `1.5px solid ${c.border}`, background: "none", cursor: "pointer", color: c.textLight, fontWeight: 600, fontSize: 14 }}>Cancel</button>
              <button onClick={handleSave} style={{ flex: 2, padding: "12px", borderRadius: 12, border: "none", background: c.gradient, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: `0 4px 16px ${c.primary}30` }}>
                {editing ? "💾 Save Changes" : "🚀 Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Product Grid ── */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 16 }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} style={{ background: c.bgCard, borderRadius: 16, height: 280, border: `1px solid ${c.border}`, opacity: 0.5, animation: "pulse 1.5s infinite" }} />
          ))}
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(256px,1fr))", gap: 16 }}>
            {products.map(p => {
              const disc = p.mrp > 0 ? Math.round((1 - p.price / p.mrp) * 100) : 0;
              const catName = typeof p.category === "object" ? p.category.name : "";
              const catIcon = typeof p.category === "object" ? p.category.icon : "";
              return (
                <div key={p._id} style={{ background: c.bgCard, borderRadius: 16, overflow: "hidden", border: `1px solid ${c.border}`, transition: "transform 0.2s, box-shadow 0.2s" }}>
                  {/* Product image */}
                  <div style={{ height: 150, display: "flex", alignItems: "center", justifyContent: "center", background: c.bg, position: "relative", overflow: "hidden" }}>
                    {p.image
                      ? <img src={p.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <span style={{ fontSize: 48 }}>📦</span>
                    }
                    {/* Badges */}
                    <div style={{ position: "absolute", top: 8, left: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                      {disc > 0 && <span style={{ padding: "3px 8px", borderRadius: 6, background: c.danger, color: "#fff", fontSize: 11, fontWeight: 700 }}>{disc}% OFF</span>}
                      {p.isFeatured && <span style={{ padding: "3px 8px", borderRadius: 6, background: "#8B5CF6", color: "#fff", fontSize: 11, fontWeight: 700 }}>⭐ Featured</span>}
                      {p.isTrending && <span style={{ padding: "3px 8px", borderRadius: 6, background: c.secondary, color: "#fff", fontSize: 11, fontWeight: 700 }}>🔥 Trending</span>}
                    </div>
                    {/* Stock badge */}
                    <div style={{ position: "absolute", top: 8, right: 8 }}>
                      <span style={{ padding: "3px 8px", borderRadius: 6, background: p.stock === 0 ? `${c.danger}E0` : `${c.success}E0`, color: "#fff", fontSize: 11, fontWeight: 700 }}>
                        {p.stock === 0 ? "Out of Stock" : `${p.stock} left`}
                      </span>
                    </div>
                    {/* Variant badge */}
                    {p.hasVariants && p.variants && p.variants.length > 0 && (
                      <div style={{ position: "absolute", bottom: 8, left: 8 }}>
                        <span style={{ padding: "3px 8px", borderRadius: 6, background: `${c.primary}E0`, color: "#fff", fontSize: 11, fontWeight: 700 }}>
                          {p.variants.length} variants
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product info */}
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 6, background: `${c.primary}12`, color: c.primary, fontWeight: 600 }}>{catIcon} {catName}</span>
                    </div>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: c.text, fontFamily: f.heading, marginBottom: 6, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.name}</h4>

                    {/* Theme fields preview */}
                    {p.themeFields && Object.keys(p.themeFields).length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                        {Object.entries(p.themeFields).slice(0, 2).map(([k, v]) => v ? (
                          <span key={k} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 6, background: c.bg, color: c.textMuted, fontWeight: 500 }}>
                            {fieldDefs.find(f => f.key === k)?.icon} {String(v)}
                          </span>
                        ) : null)}
                      </div>
                    )}

                    {/* Price */}
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: 20, fontWeight: 800, color: c.text }}>₹{p.price}</span>
                      {disc > 0 && <span style={{ fontSize: 13, color: c.textMuted, textDecoration: "line-through" }}>₹{p.mrp}</span>}
                    </div>

                    {/* Rating + actions */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: `1px solid ${c.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ color: "#F59E0B" }}>{I.star}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: c.text }}>{p.rating}</span>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => openEdit(p)} style={{ padding: "6px 12px", borderRadius: 8, background: `${c.primary}10`, border: "none", cursor: "pointer", color: c.primary, display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600 }}>{I.edit} Edit</button>
                        <button onClick={() => handleDelete(p._id)} style={{ padding: "6px 12px", borderRadius: 8, background: `${c.danger}10`, border: "none", cursor: "pointer", color: c.danger, display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600 }}>{I.trash}</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {!products.length && !loading && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "80px 20px", color: c.textMuted }}>
                <div style={{ fontSize: 60, marginBottom: 16 }}>📦</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: c.text, marginBottom: 8 }}>No products yet</h3>
                <p style={{ marginBottom: 24 }}>Add your first product to get started!</p>
                <button onClick={openCreate} style={{ padding: "12px 28px", borderRadius: 12, background: c.gradient, color: "#fff", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                  {I.plus} Add First Product
                </button>
              </div>
            )}
          </div>
          <style>{`
            @keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:0.8} }
            input:focus,select:focus,textarea:focus { border-color: ${c.primary} !important; box-shadow: 0 0 0 3px ${c.primary}15 !important; }
          `}</style>
        </>
      )}
    </div>
  );
};

export default ProductsTab;
