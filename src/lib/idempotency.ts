const STORAGE_PREFIX = "com2-checkout-idem:";

export function getOrCreateCheckoutIdempotencyKey(sessionKey: string): string {
  const storageKey = `${STORAGE_PREFIX}${sessionKey}`;
  const existing = sessionStorage.getItem(storageKey);
  if (existing) {
    return existing;
  }
  const key =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `idem-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  sessionStorage.setItem(storageKey, key);
  return key;
}

export function clearCheckoutIdempotencyKey(sessionKey: string): void {
  sessionStorage.removeItem(`${STORAGE_PREFIX}${sessionKey}`);
}

export function checkoutSessionKey(
  entityThenksId: string,
  storeSlug: string,
): string {
  return `${entityThenksId}/${storeSlug}`;
}
