import { useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, CreditCard, Smartphone } from "lucide-react";
import { toast } from "sonner";
import {
  CommerceApiError,
  postCommerceCheckout,
  fetchCommerceOrder,
  type CheckoutResponse,
} from "@/lib/commerceApi";
import {
  checkoutSessionKey,
  clearCheckoutIdempotencyKey,
  getOrCreateCheckoutIdempotencyKey,
} from "@/lib/idempotency";
import { formatMoneyFromDecimal } from "@/lib/money";
import { StripeCardPayment } from "@/components/com2/StripeCardPayment";
import { useCom2CartStore } from "@/store/com2CartStore";

const MPESA_POLL_MS = 3000;
const MPESA_POLL_MAX = 40;

function mapPaymentMethod(method: "card" | "mpesa"): "card" | "mpesa" {
  return method;
}

export function Com2CheckoutPage() {
  const navigate = useNavigate();
  const { entityThenksId = "", storeSlug = "" } = useParams();
  const lines = useCom2CartStore((s) => s.lines);
  const shopper = useCom2CartStore((s) => s.shopper);
  const paymentMethod = useCom2CartStore((s) => s.paymentMethod);
  const setShopperField = useCom2CartStore((s) => s.setShopperField);
  const setPaymentMethod = useCom2CartStore((s) => s.setPaymentMethod);
  const clearCart = useCom2CartStore((s) => s.clearCart);

  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<CheckoutResponse | null>(
    null,
  );
  const [mpesaPending, setMpesaPending] = useState(false);

  const sessionKey = useMemo(
    () => checkoutSessionKey(entityThenksId, storeSlug),
    [entityThenksId, storeSlug],
  );
  const basePath = `/${entityThenksId}/${storeSlug}`;

  if (lines.length === 0 && !checkoutResult) {
    return <Navigate to={`${basePath}/cart`} replace />;
  }

  const canStartCheckout =
    shopper.customerName.trim() &&
    shopper.customerEmail.trim() &&
    shopper.customerPhone.trim() &&
    !submitting &&
    !checkoutResult;

  const startCheckout = async () => {
    setCheckoutError(null);
    setSubmitting(true);
    const idempotencyKey = getOrCreateCheckoutIdempotencyKey(sessionKey);
    try {
      const result = await postCommerceCheckout(
        entityThenksId,
        storeSlug,
        idempotencyKey,
        {
          items: lines.map((l) => ({
            product_id: l.productId,
            quantity: l.quantity,
          })),
          customer_email: shopper.customerEmail.trim(),
          customer_name: shopper.customerName.trim(),
          customer_phone: shopper.customerPhone.trim(),
          payment_method: mapPaymentMethod(paymentMethod),
          fulfillment_mode: shopper.fulfillmentMode,
          notes: shopper.notes.trim(),
        },
      );
      setCheckoutResult(result);
      if (paymentMethod === "mpesa") {
        setMpesaPending(true);
        void pollMpesaPayment(result);
      }
    } catch (err) {
      if (err instanceof CommerceApiError) {
        if (err.code === "out_of_stock") {
          setCheckoutError(
            "An item in your cart is no longer available in the requested quantity.",
          );
        } else if (err.code === "cart_empty") {
          setCheckoutError("Your cart is empty.");
        } else if (err.code === "idempotency_key_conflict") {
          setCheckoutError(
            "This checkout was already started with different details. Refresh and try again.",
          );
        } else {
          setCheckoutError(err.message);
        }
      } else {
        setCheckoutError("Checkout failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const pollMpesaPayment = async (initial: CheckoutResponse) => {
    for (let i = 0; i < MPESA_POLL_MAX; i++) {
      await new Promise((r) => setTimeout(r, MPESA_POLL_MS));
      try {
        const order = await fetchCommerceOrder(
          initial.order_id,
          initial.access_token,
          shopper.customerEmail,
        );
        if (order.status !== "pending_payment") {
          setMpesaPending(false);
          finishOrder(initial);
          return;
        }
        if (order.payment_status && order.payment_status !== "pending") {
          setMpesaPending(false);
          finishOrder(initial);
          return;
        }
      } catch {
        /* keep polling */
      }
    }
    setMpesaPending(false);
    toast.message("Still waiting for M-PESA", {
      description: "Check your phone or view your order status.",
    });
  };

  const finishOrder = (result: CheckoutResponse) => {
    clearCheckoutIdempotencyKey(sessionKey);
    clearCart();
    navigate(
      `${basePath}/orders/${result.order_id}?token=${encodeURIComponent(result.access_token)}`,
      { replace: true },
    );
  };

  const handleCardSuccess = () => {
    if (checkoutResult) {
      toast.success("Payment received");
      finishOrder(checkoutResult);
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">Checkout</h1>

      {!checkoutResult && (
        <>
          <div className="card space-y-3">
            <p className="section-label">Your details</p>
            <label className="block space-y-1">
              <span className="text-xs text-gray-600">Full name *</span>
              <input
                className="input"
                value={shopper.customerName}
                onChange={(e) =>
                  setShopperField("customerName", e.target.value)
                }
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-gray-600">Email *</span>
              <input
                className="input"
                type="email"
                value={shopper.customerEmail}
                onChange={(e) =>
                  setShopperField("customerEmail", e.target.value)
                }
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-gray-600">Phone *</span>
              <input
                className="input"
                type="tel"
                value={shopper.customerPhone}
                onChange={(e) =>
                  setShopperField("customerPhone", e.target.value)
                }
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-gray-600">Fulfilment</span>
              <select
                className="input"
                value={shopper.fulfillmentMode}
                onChange={(e) =>
                  setShopperField(
                    "fulfillmentMode",
                    e.target.value as "ship" | "pickup",
                  )
                }
              >
                <option value="ship">Delivery</option>
                <option value="pickup">Pickup</option>
              </select>
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-gray-600">Notes</span>
              <textarea
                className="input min-h-16"
                value={shopper.notes}
                onChange={(e) => setShopperField("notes", e.target.value)}
              />
            </label>
          </div>

          <div className="card space-y-3">
            <p className="section-label">Payment</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={
                  paymentMethod === "card"
                    ? "flex items-center gap-2 rounded-xl border-2 border-primary px-3 py-2"
                    : "flex items-center gap-2 rounded-xl border px-3 py-2"
                }
              >
                <CreditCard className="h-4 w-4" />
                Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("mpesa")}
                className={
                  paymentMethod === "mpesa"
                    ? "flex items-center gap-2 rounded-xl border-2 border-mpesa px-3 py-2"
                    : "flex items-center gap-2 rounded-xl border px-3 py-2"
                }
              >
                <Smartphone className="h-4 w-4" />
                M-PESA
              </button>
            </div>
          </div>

          {checkoutError && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
              {checkoutError}
            </p>
          )}
          <button
            type="button"
            disabled={!canStartCheckout}
            onClick={startCheckout}
            className={
              canStartCheckout ? "btn-primary w-full" : "btn-disabled w-full"
            }
          >
            {submitting ? "Starting checkout…" : "Continue to payment"}
          </button>
        </>
      )}

      {checkoutResult && (
        <div className="space-y-4">
          <div className="card space-y-2 text-sm">
            <p className="section-label">Order totals (from server)</p>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                {formatMoneyFromDecimal(
                  checkoutResult.subtotal,
                  checkoutResult.currency_code,
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Platform fee</span>
              <span>
                {formatMoneyFromDecimal(
                  checkoutResult.platform_fee,
                  checkoutResult.currency_code,
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>
                {formatMoneyFromDecimal(
                  checkoutResult.tax_amount,
                  checkoutResult.currency_code,
                )}
              </span>
            </div>
            <div className="flex justify-between font-bold text-secondary">
              <span>Total</span>
              <span>
                {formatMoneyFromDecimal(
                  checkoutResult.total_amount,
                  checkoutResult.currency_code,
                )}
              </span>
            </div>
          </div>

          {paymentMethod === "card" && checkoutResult.client_secret && (
            <StripeCardPayment
              clientSecret={checkoutResult.client_secret}
              onSuccess={handleCardSuccess}
              onError={(msg) => setCheckoutError(msg)}
            />
          )}

          {paymentMethod === "mpesa" && (
            <div className="card space-y-2 text-sm">
              <div className="flex items-center gap-2 text-mpesa">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-medium">M-PESA prompt sent</span>
              </div>
              <p className="text-gray-600">
                Approve the payment on {shopper.customerPhone}. We will update
                your order when payment completes.
              </p>
              {mpesaPending && (
                <p className="text-xs text-gray-500">Checking payment status…</p>
              )}
              <button
                type="button"
                className="btn-outline w-full"
                onClick={() => finishOrder(checkoutResult)}
              >
                View order status
              </button>
            </div>
          )}

          {checkoutError && (
            <p className="text-sm text-red-600">{checkoutError}</p>
          )}
        </div>
      )}
    </div>
  );
}
