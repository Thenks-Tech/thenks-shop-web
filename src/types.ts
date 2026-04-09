export type MerchantSlug = "ilisah";

export type ProductFamily = "animal" | "bird" | "wooden" | "general";
export type ProductCategory =
  | "table"
  | "kitchen"
  | "textiles"
  | "accessories"
  | "bags"
  | "wooden";

export interface ProductOption {
  id: string;
  label: string;
  price: number;
  description?: string;
  default?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  family: ProductFamily;
  category: ProductCategory;
  description: string;
  materials: string[];
  moq: number;
  moqLabel: string;
  unitLabel: string;
  colors?: string[];
  variants?: string[];
  notes?: string[];
  pricePrefix?: string;
  options: ProductOption[];
  accent: string;
  image?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  slug: string;
  name: string;
  family: ProductFamily;
  optionId: string;
  optionLabel: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  moq: number;
  unitLabel: string;
}

export interface CustomerDetails {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
  lat: number | null;
  lng: number | null;
}

export type PaymentMethod = "card" | "mpesa";

export interface PromoDefinition {
  code: string;
  label: string;
  type: "percent" | "fixed";
  value: number;
  minSubtotal: number;
  description: string;
}

export interface PromoApplication {
  code: string;
  label: string;
  discountAmount: number;
  description: string;
}

export interface PricingBreakdown {
  subtotal: number;
  discountAmount: number;
  discountedSubtotal: number;
  vatIncluded: number;
  deliveryFee: number;
  total: number;
}

export type DemoOrderStatus =
  | "Awaiting payment"
  | "Paid"
  | "Packed"
  | "Ready for dispatch";

export interface DemoOrder {
  id: string;
  company: string;
  contactName: string;
  createdAt: string;
  total: number;
  paymentMethod: PaymentMethod;
  status: DemoOrderStatus;
  items: Array<{
    name: string;
    quantity: number;
    optionLabel: string;
  }>;
}
