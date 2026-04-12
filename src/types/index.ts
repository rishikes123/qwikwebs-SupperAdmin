export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: "superadmin" | "admin" | "customer";
  isActive: boolean;
  createdAt: string;
}

export type ThemeType = "grocery" | "ecommerce" | "toys" | "pet" | "stationery" | "kids";

export interface IStore {
  _id: string;
  owner: IUser | string;
  name: string;
  description: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  email: string;
  logo: string;
  theme: ThemeType;
  isActive: boolean;
  subscriptionPlan?: "free" | "basic" | "pro";
  subscribedPlan?: ISaaSPlan | string | null;
  subscriptionExpiry?: string | null;
  subscriptionStatus?: "none" | "active" | "expired";
  createdAt: string;
}

export interface ICategory {
  _id: string;
  store: string;
  name: string;
  icon: string;
  image: string;
  isActive: boolean;
  productCount?: number;
}

/* ── Variant (Fashion/Ecommerce theme) ── */
export interface IVariant {
  _id?: string;
  size: string;
  color: string;
  colorHex?: string;
  stock: number;
  sku: string;
  price?: number;
}

/* ── Product ── */
export interface IProduct {
  _id: string;
  store: string;
  category: ICategory | string;
  name: string;
  description: string;
  price: number;
  mrp: number;
  unit: string;
  image: string;
  images: string[];
  rating: number;
  stock: number;
  isActive: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  createdAt: string;

  // Theme-specific extra fields
  // Grocery  → expiry_date, unit
  // Toys     → material, age_group, gender, safety_info
  // Fashion  → material, gender, season
  // Pet      → brand, pet_type, breed, age_group, weight, flavor
  themeFields?: Record<string, any>;

  // Fashion variants (size + color)
  variants?: IVariant[];
  hasVariants?: boolean;

  // Grocery/Pet unit variants (quantity/volume)
  unitVariants?: { unit: string; price: number; stock: number; sku: string }[];
  hasUnitVariants?: boolean;
}

export interface IBanner {
  _id: string;
  store: string;
  title: string;
  subtitle: string;
  image: string;
  bgColor: string;
  link: string;
  isActive: boolean;
  order: number;
}

export interface IOrderItem {
  product?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  // For variant orders
  variantId?: string;
  size?: string;
  color?: string;
}

export interface IOrder {
  _id: string;
  store: string;
  customer: { name: string; email: string; phone: string; address: string };
  items: IOrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "cod" | "online";
  paymentStatus: "pending" | "paid" | "refunded";
  createdAt: string;
}

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  bg: string;
  bgCard: string;
  bgDark: string;
  text: string;
  textLight: string;
  textMuted: string;
  border: string;
  danger: string;
  success: string;
  gradient: string;
}

export interface ThemeFonts {
  heading: string;
  body: string;
  size: { h1: string; h2: string; h3: string; body: string; small: string };
}

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  tagline: string;
  icon: string;
  colors: ThemeColors;
  fonts: ThemeFonts;
  borderRadius: string;
  cardRadius: string;
  btnRadius: string;
}

export interface DashboardStats {
  totalOrders: number;
  revenue: number;
  recentOrders: IOrder[];
  monthlyRevenue: { _id: number; total: number; count: number }[];
}

export interface ISaaSPlan {
  _id: string;
  name: string;
  price: number;
  duration: "monthly" | "yearly";
  features: string[];
  featureKeys: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SuperDashboard {
  totalUsers: number;
  totalStores: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentStores: (IStore & { productCount?: number; orderCount?: number; subscriptionPlan?: string })[];
  recentUsers: IUser[];
  storesByTheme: { _id: string; count: number }[];
  trafficStats?: { _id: string; count: number }[];
  stateWiseTraffic?: { _id: string; count: number }[];
}

/* ── Theme Field Definition (used in themeFields.ts) ── */
export type FieldType = "text" | "select" | "date" | "number" | "textarea";

export interface ThemeFieldDef {
  key: string;           // maps to themeFields[key]
  label: string;
  type: FieldType;
  options?: string[];    // for select fields
  placeholder?: string;
  required?: boolean;
  icon?: string;
}
