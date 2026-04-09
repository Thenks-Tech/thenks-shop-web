import { runtime } from "@/lib/runtime";
import type { CustomerDetails, PaymentMethod } from "@/types";

export interface StorefrontResponse {
  merchant: {
    slug: string;
    name: string;
    logoUrl?: string | null;
    currency: string;
    priceDisplayMode: "vat_inclusive" | "vat_exclusive";
  };
  products: Array<{
    id: string;
    slug: string;
    name: string;
    description: string;
    moq: number;
    family: string;
    prices: Array<{
      id: string;
      label: string;
      amount: number;
    }>;
  }>;
}

export interface CheckoutPreviewRequest {
  merchantSlug: string;
  promoCode?: string;
  items: Array<{
    productId: string;
    priceOptionId: string;
    quantity: number;
  }>;
}

export interface CheckoutPreviewResponse {
  currency: string;
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  total: number;
  promoCode?: string;
}

export interface CreateOrderRequest extends CheckoutPreviewRequest {
  customer: CustomerDetails;
  paymentMethod: PaymentMethod;
}

export interface CreateOrderResponse {
  orderId: string;
  orderRef: string;
  paymentIntentId?: string;
  checkoutUrl?: string;
  mpesaRequestId?: string;
  status: "pending_payment" | "paid" | "failed";
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${runtime.apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Shop API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function fetchStorefront(merchantSlug: string) {
  return requestJson<StorefrontResponse>(`/shop/merchants/${merchantSlug}/storefront/`);
}

export function previewCheckout(payload: CheckoutPreviewRequest) {
  return requestJson<CheckoutPreviewResponse>("/shop/checkout/preview/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function createOrder(payload: CreateOrderRequest, idempotencyKey: string) {
  return requestJson<CreateOrderResponse>("/shop/orders/", {
    method: "POST",
    headers: {
      "X-Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(payload),
  });
}
