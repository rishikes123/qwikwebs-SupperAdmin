import { ThemeType, ThemeFieldDef } from "../types";

/**
 * Central registry of theme-specific product fields.
 * Each ThemeType maps to an ordered list of field definitions
 * that drive both the admin product form and the storefront display.
 */
export const THEME_FIELDS: Record<ThemeType, ThemeFieldDef[]> = {

  /* ────────────────────────────────────────
     GROCERY — Perishable food items
     ─────────────────────────────────────── */
  grocery: [
    {
      key: "expiry_date",
      label: "Expiry Date",
      type: "date",
      icon: "📅",
      placeholder: "Best before date",
    },
    {
      key: "shelf_life",
      label: "Shelf Life",
      type: "text",
      icon: "⏳",
      placeholder: "e.g. 6 months",
    },
    {
      key: "storage_type",
      label: "Storage Type",
      type: "select",
      icon: "🌡️",
      options: ["Room temperature", "Refrigerated", "Frozen", "Dry & Cool"],
    },
    {
      key: "net_weight",
      label: "Net Weight/Volume",
      type: "text",
      icon: "⚖️",
      placeholder: "e.g. 500g, 1L",
    },
    {
      key: "is_organic",
      label: "Organic",
      type: "select",
      icon: "🌿",
      options: ["Yes", "No"],
    },
  ],

  /* ────────────────────────────────────────
     TOYS — Children's toys & games
     ─────────────────────────────────────── */
  toys: [
    {
      key: "age_group",
      label: "Recommended Age Group",
      type: "select",
      icon: "🎂",
      options: ["0–2 years", "3–5 years", "6–8 years", "9–12 years", "13+ years", "All ages"],
      required: true,
    },
    {
      key: "material",
      label: "Material",
      type: "select",
      icon: "🏭",
      options: ["Plastic", "Wood", "Fabric / Plush", "Metal", "Rubber", "Foam", "Mixed"],
    },
    {
      key: "gender",
      label: "Suitable For",
      type: "select",
      icon: "👦",
      options: ["Boys", "Girls", "Unisex"],
    },
    {
      key: "safety_info",
      label: "Safety Information",
      type: "select",
      icon: "🛡️",
      options: ["Non-toxic", "BPA Free", "CE Certified", "IS 9873 Certified", "Non-toxic & BPA Free"],
    },
    {
      key: "battery_required",
      label: "Battery Required",
      type: "select",
      icon: "🔋",
      options: ["Yes (included)", "Yes (not included)", "No"],
    },
    {
      key: "brand",
      label: "Brand",
      type: "text",
      icon: "🏷️",
      placeholder: "e.g. Hasbro, Lego, Funskool",
    },
  ],

  /* ────────────────────────────────────────
     ECOMMERCE (Fashion) — Clothing & apparel
     Variants (size/color) handled separately
     ─────────────────────────────────────── */
  ecommerce: [
    {
      key: "material",
      label: "Fabric / Material",
      type: "select",
      icon: "🧵",
      options: ["Cotton", "Polyester", "Denim", "Linen", "Silk", "Wool", "Nylon", "Blended", "Rayon", "Leather"],
    },
    {
      key: "gender",
      label: "For",
      type: "select",
      icon: "👗",
      options: ["Men", "Women", "Unisex", "Boys", "Girls", "Kids"],
      required: true,
    },
    {
      key: "season",
      label: "Season",
      type: "select",
      icon: "🌤️",
      options: ["Summer", "Winter", "Monsoon", "All Season"],
    },
    {
      key: "fit",
      label: "Fit Type",
      type: "select",
      icon: "📐",
      options: ["Regular Fit", "Slim Fit", "Oversized", "Relaxed Fit", "Tailored Fit"],
    },
    {
      key: "wash_care",
      label: "Wash Care",
      type: "select",
      icon: "🫧",
      options: ["Machine Wash", "Hand Wash", "Dry Clean Only", "Do Not Wash"],
    },
    {
      key: "brand",
      label: "Brand",
      type: "text",
      icon: "🏷️",
      placeholder: "e.g. Zara, H&M",
    },
  ],

  /* ────────────────────────────────────────
     PET — Pet food, toys & accessories
     ─────────────────────────────────────── */
  pet: [
    {
      key: "pet_type",
      label: "Pet Type",
      type: "select",
      icon: "🐾",
      options: ["Dog", "Cat", "Bird", "Fish", "Rabbit", "Hamster", "Multiple"],
      required: true,
    },
    {
      key: "age_group",
      label: "Life Stage",
      type: "select",
      icon: "📅",
      options: ["Puppy / Kitten (< 1yr)", "Adult (1–7 yrs)", "Senior (7+ yrs)", "All Ages"],
    },
    {
      key: "breed",
      label: "Breed (if specific)",
      type: "text",
      icon: "🐕",
      placeholder: "e.g. Labrador, Persian, All breeds",
    },
    {
      key: "brand",
      label: "Brand",
      type: "text",
      icon: "🏷️",
      placeholder: "e.g. Royal Canin, Pedigree",
      required: true,
    },
    {
      key: "weight",
      label: "Pack Weight",
      type: "text",
      icon: "⚖️",
      placeholder: "e.g. 1 kg, 3 kg",
    },
    {
      key: "flavor",
      label: "Flavor",
      type: "select",
      icon: "🍗",
      options: ["Chicken", "Fish", "Lamb", "Beef", "Vegetables", "Mixed", "N/A"],
    },
    {
      key: "sub_category",
      label: "Product Category",
      type: "select",
      icon: "📦",
      options: ["Food", "Treats", "Toy", "Grooming", "Accessories", "Healthcare", "Bedding"],
    },
  ],

  /* ────────────────────────────────────────
     STATIONERY — Office & art supplies
     ─────────────────────────────────────── */
  stationery: [
    {
      key: "brand",
      label: "Brand",
      type: "text",
      icon: "🏷️",
      placeholder: "e.g. Camlin, Faber-Castell",
    },
    {
      key: "material",
      label: "Material",
      type: "text",
      icon: "🏭",
      placeholder: "e.g. Plastic, Metal, Wood",
    },
    {
      key: "color_count",
      label: "Colors / Pack Size",
      type: "text",
      icon: "🎨",
      placeholder: "e.g. 12 colors, Pack of 10",
    },
    {
      key: "suitable_for",
      label: "Suitable For",
      type: "select",
      icon: "🎯",
      options: ["Students", "Professionals", "Artists", "Kids", "All"],
    },
  ],

  /* ────────────────────────────────────────
     KIDS — Educational & fun products
     ─────────────────────────────────────── */
  kids: [
    {
      key: "age_group",
      label: "Age Group",
      type: "select",
      icon: "🎂",
      options: ["0–2 years", "3–5 years", "6–8 years", "9–12 years"],
      required: true,
    },
    {
      key: "skill",
      label: "Skill / Subject",
      type: "text",
      icon: "📚",
      placeholder: "e.g. Math, Reading, Art",
    },
    {
      key: "material",
      label: "Material",
      type: "select",
      icon: "🏭",
      options: ["Plastic", "Wood", "Paper", "Fabric", "Foam", "Mixed"],
    },
    {
      key: "safety_info",
      label: "Safety",
      type: "select",
      icon: "🛡️",
      options: ["Non-toxic", "BPA Free", "CE Certified", "Non-toxic & BPA Free"],
    },
  ],
};

/**
 * Themes that support Product Variants (size + color combinations).
 * Variants panel will ONLY appear in the admin form for these themes.
 */
export const VARIANT_THEMES: ThemeType[] = ["ecommerce"];

/**
 * Themes that support Unit-based Variants (quantity/volume options).
 * e.g. Grocery: 500ml, 1L, 2L  |  Pet: 1kg, 3kg, 10kg
 */
export const UNIT_THEMES: ThemeType[] = ["grocery", "pet", "stationery"];

/**
 * Predefined unit option presets per unit-theme.
 * Admin can pick from these or type a custom unit.
 */
export const UNIT_PRESETS: Record<string, string[][]> = {
  grocery: [
    ["250 ml", "500 ml", "750 ml", "1 L", "2 L", "5 L"],
    ["100 g", "250 g", "500 g", "1 kg", "2 kg", "5 kg", "10 kg"],
    ["1 piece", "6 pieces", "12 pieces", "24 pieces"],
    ["Small", "Medium", "Large", "Extra Large"],
    ["Pack of 1", "Pack of 2", "Pack of 3", "Pack of 5", "Pack of 10"],
  ],
  pet: [
    ["500 g", "1 kg", "3 kg", "6 kg", "10 kg", "20 kg"],
    ["250 ml", "500 ml", "1 L"],
    ["Small", "Medium", "Large"],
    ["Pack of 1", "Pack of 3", "Pack of 6", "Pack of 12"],
  ],
  stationery: [
    ["Pack of 1", "Pack of 2", "Pack of 5", "Pack of 10", "Pack of 20"],
    ["Small", "Medium", "Large"],
    ["A5", "A4", "A3"],
  ],
};

/**
 * Predefined size options per sub-type.
 */
export const SIZE_OPTIONS = {
  clothing: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
  footwear: ["UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
  kids: ["0–3 M", "3–6 M", "6–12 M", "1–2 Y", "3–4 Y", "5–6 Y"],
  free: ["Free Size"],
};

/**
 * Common color palette for the variant color picker.
 */
export const COLOR_PALETTE = [
  { name: "Black",    hex: "#1a1a1a" },
  { name: "White",    hex: "#ffffff" },
  { name: "Navy",     hex: "#1a237e" },
  { name: "Red",      hex: "#c62828" },
  { name: "Maroon",   hex: "#880e4f" },
  { name: "Green",    hex: "#1b5e20" },
  { name: "Olive",    hex: "#827717" },
  { name: "Blue",     hex: "#1565c0" },
  { name: "Sky Blue", hex: "#0288d1" },
  { name: "Yellow",   hex: "#f9a825" },
  { name: "Orange",   hex: "#e65100" },
  { name: "Pink",     hex: "#e91e63" },
  { name: "Purple",   hex: "#6a1b9a" },
  { name: "Brown",    hex: "#4e342e" },
  { name: "Grey",     hex: "#757575" },
  { name: "Beige",    hex: "#d7ccc8" },
  { name: "Teal",     hex: "#00695c" },
  { name: "Cream",    hex: "#fff8e1" },
];

/** Returns theme fields for a given theme (empty array if not found) */
export const getThemeFields = (theme: ThemeType): ThemeFieldDef[] =>
  THEME_FIELDS[theme] ?? [];

/** Returns true if this theme supports variants */
export const themeHasVariants = (theme: ThemeType): boolean =>
  VARIANT_THEMES.includes(theme);

/** Returns true if this theme supports unit-based variants */
export const themeHasUnitVariants = (theme: ThemeType): boolean =>
  UNIT_THEMES.includes(theme);

