import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CommerceProduct } from "@/lib/commerceApi";

export interface Com2CartLine {
  productId: string;
  name: string;
  unitPrice: string;
  currencyCode: string;
  quantity: number;
  stockQuantity: number;
  imageUrl?: string;
}

export interface Com2ShopperDetails {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fulfillmentMode: "ship" | "pickup";
  notes: string;
}

interface Com2CartState {
  storeKey: string | null;
  entityThenksId: string | null;
  storeSlug: string | null;
  currencyCode: string | null;
  lines: Com2CartLine[];
  paymentMethod: "card" | "mpesa";
  shopper: Com2ShopperDetails;
  bindStore: (
    entityThenksId: string,
    storeSlug: string,
    currencyCode: string,
  ) => void;
  addProduct: (product: CommerceProduct, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeLine: (productId: string) => void;
  clearCart: () => void;
  setPaymentMethod: (method: "card" | "mpesa") => void;
  setShopperField: <K extends keyof Com2ShopperDetails>(
    field: K,
    value: Com2ShopperDetails[K],
  ) => void;
}

const initialShopper: Com2ShopperDetails = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  fulfillmentMode: "ship",
  notes: "",
};

function storeKeyFor(entityThenksId: string, storeSlug: string) {
  return `${entityThenksId}:${storeSlug}`;
}

export function clampQuantityToStock(
  quantity: number,
  stockQuantity: number,
): number {
  if (stockQuantity <= 0) {
    return 0;
  }
  return Math.max(0, Math.min(quantity, stockQuantity));
}

export function nextLineQuantityAfterAdd(
  existingQuantity: number,
  addQuantity: number,
  stockQuantity: number,
): number {
  return clampQuantityToStock(existingQuantity + addQuantity, stockQuantity);
}

export const useCom2CartStore = create<Com2CartState>()(
  persist(
    (set, get) => ({
      storeKey: null,
      entityThenksId: null,
      storeSlug: null,
      currencyCode: null,
      lines: [],
      paymentMethod: "card",
      shopper: initialShopper,
      bindStore: (entityThenksId, storeSlug, currencyCode) => {
        const nextKey = storeKeyFor(entityThenksId, storeSlug);
        const state = get();
        if (state.storeKey && state.storeKey !== nextKey) {
          set({
            storeKey: nextKey,
            entityThenksId,
            storeSlug,
            currencyCode,
            lines: [],
            shopper: initialShopper,
            paymentMethod: "card",
          });
          return;
        }
        set({
          storeKey: nextKey,
          entityThenksId,
          storeSlug,
          currencyCode,
        });
      },
      addProduct: (product, quantity = 1) => {
        const state = get();
        const existing = state.lines.find((l) => l.productId === product.id);
        const baseQty = existing?.quantity ?? 0;
        const nextQty = clampQuantityToStock(
          baseQty + quantity,
          product.stock_quantity,
        );
        if (nextQty <= 0) {
          return;
        }
        const line: Com2CartLine = {
          productId: product.id,
          name: product.name,
          unitPrice: product.price,
          currencyCode: product.currency_code,
          quantity: nextQty,
          stockQuantity: product.stock_quantity,
          imageUrl: product.image_urls[0],
        };
        set({
          lines: existing
            ? state.lines.map((l) => (l.productId === product.id ? line : l))
            : [...state.lines, line],
          currencyCode: product.currency_code,
        });
      },
      setQuantity: (productId, quantity) => {
        set((state) => {
          const line = state.lines.find((l) => l.productId === productId);
          if (!line) {
            return state;
          }
          const nextQty = clampQuantityToStock(quantity, line.stockQuantity);
          if (nextQty <= 0) {
            return {
              lines: state.lines.filter((l) => l.productId !== productId),
            };
          }
          return {
            lines: state.lines.map((l) =>
              l.productId === productId ? { ...l, quantity: nextQty } : l,
            ),
          };
        });
      },
      removeLine: (productId) => {
        set((state) => ({
          lines: state.lines.filter((l) => l.productId !== productId),
        }));
      },
      clearCart: () => {
        set({
          lines: [],
          shopper: initialShopper,
          paymentMethod: "card",
        });
      },
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      setShopperField: (field, value) => {
        set((state) => ({
          shopper: { ...state.shopper, [field]: value },
        }));
      },
    }),
    {
      name: "com2-cart-v1",
      partialize: (state) => ({
        storeKey: state.storeKey,
        entityThenksId: state.entityThenksId,
        storeSlug: state.storeSlug,
        currencyCode: state.currencyCode,
        lines: state.lines,
        paymentMethod: state.paymentMethod,
        shopper: state.shopper,
      }),
    },
  ),
);

export function selectCom2ItemCount(state: Com2CartState): number {
  return state.lines.reduce((sum, line) => sum + line.quantity, 0);
}
