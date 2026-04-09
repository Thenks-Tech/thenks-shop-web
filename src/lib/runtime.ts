export const runtime = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "https://api.thenks.co",
  stripePublishableKey:
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "pk_test_replace_me",
  authHandoffUrl:
    import.meta.env.VITE_AUTH_HANDOFF_URL ??
    "https://app.thenks.co/recipient/login",
  shopOrigin: import.meta.env.VITE_SHOP_ORIGIN ?? "https://shop.thenks.co",
};
