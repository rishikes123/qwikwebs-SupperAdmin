import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ThemeConfig } from "../../types";
import { apiGetAdminReviews, apiApproveReview, apiDeleteReview } from "../../config/api";
import { IconTrash, IconCheck } from "../../components/Icons";

const ReviewsTab: React.FC<{ theme: ThemeConfig }> = ({ theme }) => {
  const c = theme.colors; const f = theme.fonts;
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all"|"pending"|"approved">("all");

  const load = async () => { try { const { data } = await apiGetAdminReviews(); setReviews(data.reviews); } catch {} setLoading(false); };
  useEffect(() => { load(); }, []);

  const approve = async (id: string) => { try { await apiApproveReview(id); toast.success("Review approved ✓"); load(); } catch { toast.error("Error"); } };
  const remove = async (id: string) => { if (!confirm("Delete review?")) return; try { await apiDeleteReview(id); toast.success("Deleted"); load(); } catch { toast.error("Error"); } };

  const filtered = reviews.filter(r => filter === "all" ? true : filter === "pending" ? !r.isApproved : r.isApproved);

  const Stars: React.FC<{ n: number }> = ({ n }) => (
    <div style={{ display: "flex", gap: 2 }}>{[1, 2, 3, 4, 5].map(i => <span key={i} style={{ color: i <= n ? "#F59E0B" : "#E5E7EB", fontSize: 14 }}>★</span>)}</div>
  );

  return (
    <div className="fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: c.text }}>{reviews.length} Reviews</h3>
        <div style={{ display: "flex", gap: 6 }}>
          {(["all", "pending", "approved"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 16px", borderRadius: 8, border: filter === f ? "none" : `1px solid ${c.border}`, background: filter === f ? c.primary : c.bgCard, color: filter === f ? "#fff" : c.textLight, fontWeight: 600, fontSize: 12, cursor: "pointer", textTransform: "capitalize" }}>{f}</button>
          ))}
        </div>
      </div>

      {loading ? <div style={{ textAlign: "center", padding: 40, color: c.textMuted }}>Loading...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(r => (
            <div key={r._id} style={{ background: c.bgCard, borderRadius: theme.cardRadius, padding: 20, border: `1px solid ${c.border}`, display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: c.gradient, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16 }}>{r.customerName?.[0]}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: c.text }}>{r.customerName}</div>
                    <div style={{ fontSize: 12, color: c.textMuted }}>{r.customerEmail}</div>
                  </div>
                </div>
                <Stars n={r.rating} />
                {r.title && <h4 style={{ fontSize: 14, fontWeight: 600, color: c.text, marginTop: 8 }}>{r.title}</h4>}
                {r.comment && <p style={{ fontSize: 13, color: c.textLight, marginTop: 4, lineHeight: 1.6 }}>{r.comment}</p>}
                <div style={{ fontSize: 11, color: c.textMuted, marginTop: 8 }}>
                  Product: <span style={{ fontWeight: 600 }}>{typeof r.product === "object" ? r.product.name : "—"}</span>
                  {" · "}{new Date(r.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, justifyContent: "center" }}>
                <span style={{ padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: r.isApproved ? `${c.success}15` : `${c.secondary}15`, color: r.isApproved ? c.success : c.secondary, textAlign: "center" }}>{r.isApproved ? "Approved" : "Pending"}</span>
                {!r.isApproved && <button onClick={() => approve(r._id)} className="btn-press" style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: c.success, color: "#fff", fontWeight: 600, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, justifyContent: "center" }}><IconCheck /> Approve</button>}
                <button onClick={() => remove(r._id)} className="btn-press" style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${c.danger}30`, background: "none", color: c.danger, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, justifyContent: "center" }}><IconTrash /> Delete</button>
              </div>
            </div>
          ))}
          {!filtered.length && <p style={{ textAlign: "center", padding: 40, color: c.textMuted }}>No reviews found</p>}
        </div>
      )}
    </div>
  );
};

export default ReviewsTab;
