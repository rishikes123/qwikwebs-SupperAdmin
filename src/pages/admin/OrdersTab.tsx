import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ThemeConfig, IOrder } from "../../types";
import { apiGetOrders, apiUpdateOrderStatus } from "../../config/api";

const OrdersTab: React.FC<{ theme: ThemeConfig }> = ({ theme }) => {
  const c = theme.colors;
  const f = theme.fonts;
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => { try { const { data } = await apiGetOrders(); setOrders(data.orders); } catch {} setLoading(false); };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    try { await apiUpdateOrderStatus(id, { status }); toast.success("Status updated"); load(); } catch { toast.error("Error"); }
  };

  const statusColor = (s: string) => {
    if (s === "delivered") return c.success;
    if (s === "processing") return "#3B82F6";
    if (s === "shipped") return c.primary;
    if (s === "cancelled") return c.danger;
    return c.textMuted;
  };

  if (loading) return <div style={{ textAlign: "center", padding: 40, color: c.textMuted }}>Loading...</div>;

  return (
    <div className="fade-up">
      <div style={{ background: c.bgCard, borderRadius: theme.cardRadius, border: `1px solid ${c.border}`, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead>
              <tr style={{ background: c.bg }}>
                {["Customer", "Items", "Total", "Status", "Payment", "Date", "Action"].map((h) => (
                  <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: c.textMuted, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} style={{ borderBottom: `1px solid ${c.border}` }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: c.text }}>{o.customer.name}</div>
                    <div style={{ fontSize: 12, color: c.textMuted }}>{o.customer.email}</div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 14, color: c.textLight }}>{o.items.length}</td>
                  <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 700, color: c.text }}>₹{o.totalAmount}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, color: statusColor(o.status), background: `${statusColor(o.status)}12` }}>{o.status}</span>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 12, fontWeight: 500, color: o.paymentStatus === "paid" ? c.success : c.textMuted }}>{o.paymentStatus}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: c.textMuted }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}
                      style={{ padding: "6px 10px", borderRadius: 8, border: `1px solid ${c.border}`, fontSize: 12, background: c.bg, color: c.text, cursor: "pointer" }}>
                      {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!orders.length && <p style={{ textAlign: "center", padding: 40, color: c.textMuted }}>No orders yet</p>}
      </div>
    </div>
  );
};

export default OrdersTab;
