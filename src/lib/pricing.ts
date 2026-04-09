import type {
  CartItem,
  PricingBreakdown,
  PromoApplication,
  PromoDefinition,
} from "@/types";

export const DEMO_VAT_RATE = 16;

export const promoDefinitions: PromoDefinition[] = [
  {
    code: "WELCOME10",
    label: "Welcome 10%",
    type: "percent",
    value: 10,
    minSubtotal: 12000,
    description: "Intro offer for first-time wholesale enquiries.",
  },
  {
    code: "LODGE5000",
    label: "Lodge Buyer Credit",
    type: "fixed",
    value: 5000,
    minSubtotal: 40000,
    description: "Fixed KES 5,000 off larger lodge restocks.",
  },
  {
    code: "BIRDLINE",
    label: "Bird Collection 7%",
    type: "percent",
    value: 7,
    minSubtotal: 18000,
    description: "Bird line showcase offer for the demo.",
  },
];

export function getSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.lineTotal, 0);
}

export function validatePromo(
  rawCode: string,
  subtotal: number,
): { promo: PromoApplication | null; error: string | null } {
  const normalized = rawCode.trim().toUpperCase();

  if (!normalized) {
    return { promo: null, error: null };
  }

  const match = promoDefinitions.find((promo) => promo.code === normalized);
  if (!match) {
    return { promo: null, error: "Promo code not recognised." };
  }

  if (subtotal < match.minSubtotal) {
    return {
      promo: null,
      error: `This code unlocks from KES ${match.minSubtotal.toLocaleString()}.`,
    };
  }

  const discountAmount =
    match.type === "percent"
      ? Math.round((subtotal * match.value) / 100)
      : Math.min(match.value, subtotal);

  return {
    promo: {
      code: match.code,
      label: match.label,
      discountAmount,
      description: match.description,
    },
    error: null,
  };
}

export function calculatePricing(
  items: CartItem[],
  appliedPromo: PromoApplication | null,
): PricingBreakdown {
  const subtotal = getSubtotal(items);
  const discountAmount = Math.min(appliedPromo?.discountAmount ?? 0, subtotal);
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const vatIncluded = Math.round(
    (discountedSubtotal * DEMO_VAT_RATE) / (100 + DEMO_VAT_RATE),
  );

  return {
    subtotal,
    discountAmount,
    discountedSubtotal,
    vatIncluded,
    deliveryFee: 0,
    total: discountedSubtotal,
  };
}

export function getMoqShortfall(quantity: number, moq: number) {
  return quantity >= moq ? 0 : moq - quantity;
}
