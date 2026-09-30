import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CommerceApiError,
  fetchCommerceOrder,
  postCommerceCheckout,
} from "@/lib/commerceApi";

describe("commerce API errors", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("surfaces checkout out_of_stock inline", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({
          code: "out_of_stock",
          detail: "Insufficient stock",
        }),
      }),
    );

    await expect(
      postCommerceCheckout("TIP-1", "main", "key-1", {
        items: [{ product_id: "p1", quantity: 99 }],
        customer_email: "a@b.com",
        customer_name: "A",
        customer_phone: "+254700000000",
        payment_method: "card",
        fulfillment_mode: "ship",
      }),
    ).rejects.toMatchObject({
      code: "out_of_stock",
      status: 409,
    } satisfies Partial<CommerceApiError>);
  });

  it("maps tracking auth failures", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        json: async () => ({
          code: "order_access_denied",
          detail: "Email mismatch",
        }),
      }),
    );

    await expect(
      fetchCommerceOrder("order-1", "token", "wrong@example.com"),
    ).rejects.toMatchObject({
      code: "order_access_denied",
      status: 403,
    });
  });
});
