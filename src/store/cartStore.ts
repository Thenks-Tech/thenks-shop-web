import { create } from "zustand";
import type {
  CartItem,
  CustomerDetails,
  PaymentMethod,
  Product,
  ProductOption,
} from "@/types";

interface CartState {
  merchantSlug: string;
  items: CartItem[];
  customer: CustomerDetails;
  promoCode: string;
  paymentMethod: PaymentMethod;
  addItem: (product: Product, option: ProductOption, quantity?: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  setCustomerField: <K extends keyof CustomerDetails>(
    field: K,
    value: CustomerDetails[K],
  ) => void;
  setPromoCode: (code: string) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
}

const initialCustomer: CustomerDetails = {
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  notes: "",
  lat: null,
  lng: null,
};

function buildCartItem(
  product: Product,
  option: ProductOption,
  quantity: number,
): CartItem {
  return {
    id: `${product.id}:${option.id}`,
    productId: product.id,
    slug: product.slug,
    name: product.shortName,
    family: product.family,
    optionId: option.id,
    optionLabel: option.label,
    unitPrice: option.price,
    quantity,
    lineTotal: option.price * quantity,
    moq: product.moq,
    unitLabel: product.unitLabel,
  };
}

export const useCartStore = create<CartState>()((set) => ({
  merchantSlug: "ilisah",
  items: [],
  customer: initialCustomer,
  promoCode: "",
  paymentMethod: "card",
  addItem: (product, option, quantity = product.moq) => {
    set((state) => {
      const key = `${product.id}:${option.id}`;
      const existing = state.items.find((item) => item.id === key);

      if (existing) {
        const nextQuantity = existing.quantity + quantity;
        return {
          items: state.items.map((item) =>
            item.id === existing.id
              ? {
                  ...item,
                  quantity: nextQuantity,
                  lineTotal: nextQuantity * item.unitPrice,
                }
              : item,
          ),
        };
      }

      return {
        items: [...state.items, buildCartItem(product, option, quantity)],
      };
    });
  },
  updateQuantity: (itemId, quantity) => {
    set((state) => ({
      items: state.items
        .map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity: Math.max(1, quantity),
                lineTotal: Math.max(1, quantity) * item.unitPrice,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    }));
  },
  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    }));
  },
  clearCart: () => {
    set({
      items: [],
      promoCode: "",
      paymentMethod: "card",
      customer: initialCustomer,
    });
  },
  setCustomerField: (field, value) => {
    set((state) => ({
      customer: {
        ...state.customer,
        [field]: value,
      },
    }));
  },
  setPromoCode: (code) => set({ promoCode: code }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
}));

export function selectItemCount(state: CartState) {
  return state.items.reduce((sum, item) => sum + item.quantity, 0);
}
