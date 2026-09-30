export const ORDER_STATUS_STEPS = [
  "pending_payment",
  "paid",
  "fulfilling",
  "shipped",
  "ready_for_pickup",
  "delivered",
  "completed",
] as const;

export type OrderLifecycleStatus =
  | (typeof ORDER_STATUS_STEPS)[number]
  | "cancelled"
  | "refunded"
  | "fulfilled";

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Awaiting payment",
  paid: "Payment received",
  fulfilling: "Preparing your order",
  shipped: "Shipped",
  ready_for_pickup: "Ready for pickup",
  delivered: "Delivered",
  completed: "Completed",
  fulfilled: "Fulfilled",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export function orderStatusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status.replaceAll("_", " ");
}

export function orderTimelineIndex(status: string): number {
  const idx = ORDER_STATUS_STEPS.indexOf(
    status as (typeof ORDER_STATUS_STEPS)[number],
  );
  if (idx >= 0) {
    return idx;
  }
  if (status === "fulfilled") {
    return ORDER_STATUS_STEPS.indexOf("completed");
  }
  if (status === "cancelled" || status === "refunded") {
    return -1;
  }
  return 0;
}

export function isTerminalOrderStatus(status: string): boolean {
  return ["completed", "fulfilled", "cancelled", "refunded"].includes(status);
}
