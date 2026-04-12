import axios from "axios";

const API = axios.create({ baseURL: "/api" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

// Auth
export const apiRegister = (data: any) => API.post("/auth/register", data);
export const apiLogin = (data: any) => API.post("/auth/login", data);
export const apiGetMe = () => API.get("/auth/me");
export const apiUpdateProfile = (data: any) => API.put("/auth/profile", data);

// Store
export const apiCreateStore = (data: any) => API.post("/stores", data);
export const apiGetMyStore = () => API.get("/stores/my-store");
export const apiUpdateStore = (data: any) => API.put("/stores/my-store", data);
export const apiGetStore = (id: string) => API.get(`/stores/${id}`);

// Products
export const apiGetProducts = (params?: any) => API.get("/products", { params });
export const apiCreateProduct = (data: any) => API.post("/products", data);
export const apiUpdateProduct = (id: string, data: any) => API.put(`/products/${id}`, data);
export const apiDeleteProduct = (id: string) => API.delete(`/products/${id}`);
export const apiGetStoreProducts = (storeId: string) => API.get(`/products/store/${storeId}`);

// Categories
export const apiGetCategories = () => API.get("/categories");
export const apiCreateCategory = (data: any) => API.post("/categories", data);
export const apiUpdateCategory = (id: string, data: any) => API.put(`/categories/${id}`, data);
export const apiDeleteCategory = (id: string) => API.delete(`/categories/${id}`);

// Banners
export const apiGetBanners = () => API.get("/banners");
export const apiCreateBanner = (data: any) => API.post("/banners", data);
export const apiUpdateBanner = (id: string, data: any) => API.put(`/banners/${id}`, data);
export const apiDeleteBanner = (id: string) => API.delete(`/banners/${id}`);

// Orders
export const apiGetOrders = (params?: any) => API.get("/orders", { params });
export const apiUpdateOrderStatus = (id: string, data: any) => API.put(`/orders/${id}/status`, data);
export const apiGetDashboardStats = () => API.get("/orders/dashboard-stats");

// Upload
export const apiUploadImage = (file: File) => {
  const fd = new FormData();
  fd.append("image", file);
  return API.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
};

// Super Admin
export const apiGetSuperDashboard = () => API.get("/superadmin/dashboard");
export const apiGetAllUsers = () => API.get("/superadmin/users");
export const apiToggleUser = (id: string) => API.put(`/superadmin/users/${id}/toggle`);
export const apiDeleteUser = (id: string) => API.delete(`/superadmin/users/${id}`);
export const apiGetAllStoresAdmin = () => API.get("/superadmin/stores");
export const apiToggleStore = (id: string) => API.put(`/superadmin/stores/${id}/toggle`);
export const apiDeleteStoreAdmin = (id: string) => API.delete(`/superadmin/stores/${id}`);
export const apiUpdateStoreSubscription = (id: string, data: { planId: string }) => API.put(`/superadmin/stores/${id}/subscription`, data);

// New Super Admin functions
export const apiGetSaaSPlans = () => API.get("/superadmin/plans");
export const apiCreateSaaSPlan = (data: any) => API.post("/superadmin/plans", data);
export const apiUpdateSaaSPlan = (id: string, data: any) => API.put(`/superadmin/plans/${id}`, data);
export const apiDeleteSaaSPlan = (id: string) => API.delete(`/superadmin/plans/${id}`);
export const apiGetDetailedAnalytics = () => API.get("/superadmin/analytics");

// Payment Requests
export const apiGetPaymentRequests = () => API.get("/superadmin/payment-requests");
export const apiApprovePayment = (id: string) => API.put(`/superadmin/payment-requests/${id}/approve`);
export const apiRejectPayment = (id: string, reason: string) => API.put(`/superadmin/payment-requests/${id}/reject`, { reason });

// Coupons
export const apiGetCoupons = () => API.get("/features/coupons");
export const apiCreateCoupon = (data: any) => API.post("/features/coupons", data);
export const apiUpdateCoupon = (id: string, data: any) => API.put(`/features/coupons/${id}`, data);
export const apiDeleteCoupon = (id: string) => API.delete(`/features/coupons/${id}`);
export const apiValidateCoupon = (data: any) => API.post("/features/coupons/validate", data);

// Reviews
export const apiGetAdminReviews = () => API.get("/features/reviews/admin");
export const apiApproveReview = (id: string) => API.put(`/features/reviews/${id}/approve`);
export const apiDeleteReview = (id: string) => API.delete(`/features/reviews/${id}`);
export const apiGetProductReviews = (pid: string) => API.get(`/features/reviews/product/${pid}`);
export const apiCreateReview = (data: any) => API.post("/features/reviews", data);

// Flash Sales
export const apiGetFlashSales = () => API.get("/features/flash-sales");
export const apiCreateFlashSale = (data: any) => API.post("/features/flash-sales", data);
export const apiUpdateFlashSale = (id: string, data: any) => API.put(`/features/flash-sales/${id}`, data);
export const apiDeleteFlashSale = (id: string) => API.delete(`/features/flash-sales/${id}`);

// Subscriptions
export const apiGetSubscriptions = () => API.get("/features/subscriptions");
export const apiUpdateSubscription = (id: string, data: any) => API.put(`/features/subscriptions/${id}`, data);

// Store Settings
export const apiGetSettings = () => API.get("/features/settings");
export const apiUpdateSettings = (data: any) => API.put("/features/settings", data);
export const apiGetPublicSettings = (sid: string) => API.get(`/features/settings/public/${sid}`);

// Razorpay
export const apiCreateRazorpayOrder = (data: any) => API.post("/features/payment/razorpay/create", data);
export const apiVerifyRazorpay = (data: any) => API.post("/features/payment/razorpay/verify", data);

// Shiprocket
export const apiShiprocketLogin = () => API.post("/features/shipping/shiprocket/login");
export const apiCreateShipment = (orderId: string) => API.post(`/features/shipping/shiprocket/create/${orderId}`);

// Invoice
export const apiGetInvoice = (orderId: string) => API.get(`/features/invoice/${orderId}`);

// Platform Settings (SuperAdmin)
export const apiGetPlatformSettings = () => API.get("/platform/settings");
export const apiUpdatePlatformSettings = (data: any) => API.put("/platform/settings", data);

// Platform Announcements
export const apiGetAnnouncements = () => API.get("/platform/announcements");
export const apiCreateAnnouncement = (data: any) => API.post("/platform/announcements", data);
export const apiDeleteAnnouncement = (id: string) => API.delete(`/platform/announcements/${id}`);

// Platform Support Queries
export const apiGetSupportQueries = () => API.get("/platform/support");
export const apiUpdateQueryStatus = (id: string, status: string) => API.put(`/platform/support/${id}`, { status });
export const apiDeleteSupportQuery = (id: string) => API.delete(`/platform/support/${id}`);
export const apiCreateSupportQuery = (data: any) => API.post("/platform/support", data);

// Platform Advanced Analytics
export const apiGetRevenueStats = () => API.get("/platform/revenue");
export const apiGetAuditLogs = () => API.get("/platform/audit");

export default API;
