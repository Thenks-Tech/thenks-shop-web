import { runtime } from "@/lib/runtime";

export interface CommerceStore {
  id: string;
  entity_thenks_id: string;
  public_store_slug: string;
  name: string;
  slug: string;
  description: string;
  timezone: string;
}

export interface CommerceProduct {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: string;
  currency_code: string;
  stock_quantity: number;
  image_urls: string[];
}

export interface CheckoutItemPayload {
  product_id: string;
  quantity: number;
}

export interface CheckoutRequestBody {
  items: CheckoutItemPayload[];
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  payment_method: "card" | "mpesa" | "mobile_money";
  fulfillment_mode: "ship" | "pickup";
  notes?: string;
  callback_url?: string;
  return_url?: string;
}

export interface CheckoutResponse {
  order_id: string;
  access_token: string;
  status: string;
  currency_code: string;
  subtotal: string;
  platform_fee: string;
  tax_amount: string;
  total_amount: string;
  customer_email: string;
  replay: boolean;
  items: unknown[];
  payment_request_id: string;
  payment_reference: string;
  payment_status: string;
  client_secret?: string;
  intent_id?: string;
}

export interface CommerceOrder {
  id: string;
  status: string;
  currency_code: string;
  subtotal: string;
  platform_fee: string;
  tax_amount: string;
  total_amount: string;
  customer_email: string;
  customer_name?: string;
  customer_phone?: string;
  payment_status?: string;
  fulfillment_mode?: string;
  items?: Array<{
    product_id: string;
    name: string;
    quantity: number;
    unit_price: string;
    line_total: string;
  }>;
  created_at?: string;
  updated_at?: string;
}

export type CommerceApiErrorCode =
  | "store_not_found"
  | "commerce_checkout_disabled"
  | "idempotency_key_required"
  | "idempotency_key_conflict"
  | "out_of_stock"
  | "cart_empty"
  | "mixed_currency_cart"
  | "commerce_payments_not_ready"
  | "payment_initiation_failed"
  | "order_token_required"
  | "order_access_denied"
  | "order_not_found"
  | string;

export class CommerceApiError extends Error {
  readonly status: number;
  readonly code: CommerceApiErrorCode;
  readonly details: unknown;

  constructor(
    status: number,
    code: CommerceApiErrorCode,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "CommerceApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function storeBasePath(entityThenksId: string, storeSlug: string): string {
  return `/api/v1/commerce/public/entities/${encodeURIComponent(entityThenksId)}/stores/${encodeURIComponent(storeSlug)}`;
}

async function parseError(response: Response): Promise<CommerceApiError> {
  let body: Record<string, unknown> = {};
  try {
    body = (await response.json()) as Record<string, unknown>;
  } catch {
    /* empty */
  }
  const code = (body.code as CommerceApiErrorCode) ?? "unknown_error";
  const message =
    (typeof body.detail === "string" ? body.detail : null) ??
    (typeof body.message === "string" ? body.message : null) ??
    `Request failed (${response.status})`;
  return new CommerceApiError(response.status, code, message, body);
}

async function requestJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${runtime.apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return response.json() as Promise<T>;
}

export function fetchCommerceStore(
  entityThenksId: string,
  storeSlug: string,
): Promise<CommerceStore> {
  return requestJson<CommerceStore>(
    `${storeBasePath(entityThenksId, storeSlug)}/`,
  );
}

export function fetchCommerceProducts(
  entityThenksId: string,
  storeSlug: string,
): Promise<{ products: CommerceProduct[] }> {
  return requestJson<{ products: CommerceProduct[] }>(
    `${storeBasePath(entityThenksId, storeSlug)}/products/`,
  );
}

export function postCommerceCheckout(
  entityThenksId: string,
  storeSlug: string,
  idempotencyKey: string,
  body: CheckoutRequestBody,
): Promise<CheckoutResponse> {
  return requestJson<CheckoutResponse>(
    `${storeBasePath(entityThenksId, storeSlug)}/checkout/`,
    {
      method: "POST",
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(body),
    },
  );
}

export function fetchCommerceOrder(
  orderId: string,
  accessToken: string,
  email?: string,
): Promise<CommerceOrder> {
  const params = new URLSearchParams({ token: accessToken });
  if (email?.trim()) {
    params.set("email", email.trim());
  }
  return requestJson<CommerceOrder>(
    `/api/v1/commerce/public/orders/${encodeURIComponent(orderId)}/?${params}`,
  );
}
