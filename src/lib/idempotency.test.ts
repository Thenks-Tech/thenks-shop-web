import { afterEach, describe, expect, it } from "vitest";
import {
  clearCheckoutIdempotencyKey,
  getOrCreateCheckoutIdempotencyKey,
} from "@/lib/idempotency";

describe("checkout idempotency key", () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it("reuses the same key for a session on retry", () => {
    const session = "TIP-1/main";
    const first = getOrCreateCheckoutIdempotencyKey(session);
    const second = getOrCreateCheckoutIdempotencyKey(session);
    expect(second).toBe(first);
  });

  it("clears key after successful checkout flow", () => {
    const session = "TIP-1/main";
    const first = getOrCreateCheckoutIdempotencyKey(session);
    clearCheckoutIdempotencyKey(session);
    const after = getOrCreateCheckoutIdempotencyKey(session);
    expect(after).not.toBe(first);
  });
});
