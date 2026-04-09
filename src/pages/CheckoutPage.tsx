import { useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, CreditCard, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { calculatePricing, validatePromo } from "@/lib/pricing";
import { formatKES, generateOrderRef } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { AddressMap } from "@/components/AddressMap";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { merchantSlug = "ilisah" } = useParams();

  const items = useCartStore((s) => s.items);
  const customer = useCartStore((s) => s.customer);
  const promoCode = useCartStore((s) => s.promoCode);
  const paymentMethod = useCartStore((s) => s.paymentMethod);
  const setCustomerField = useCartStore((s) => s.setCustomerField);
  const setPromoCode = useCartStore((s) => s.setPromoCode);
  const setPaymentMethod = useCartStore((s) => s.setPaymentMethod);
  const clearCart = useCartStore((s) => s.clearCart);

  const [promoDraft, setPromoDraft] = useState(promoCode);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.lineTotal, 0),
    [items],
  );
  const promoState = validatePromo(promoCode, subtotal);
  const pricing = calculatePricing(items, promoState.promo);

  if (items.length === 0) {
    return <Navigate to={`/s/${merchantSlug}/cart`} replace />;
  }

  const canSubmit =
    customer.contactName.trim() &&
    customer.email.trim() &&
    customer.phone.trim() &&
    !submitting;

  const applyPromo = () => {
    const next = validatePromo(promoDraft, subtotal);
    setPromoError(next.error);
    if (next.error) {
      toast.error(next.error);
      return;
    }
    setPromoCode(promoDraft.trim().toUpperCase());
    toast.success("Promo applied");
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));

    const orderRef = generateOrderRef();
    const orderSnapshot = {
      ref: orderRef,
      items,
      total: pricing.total,
      paymentMethod,
      customer,
      promo: promoState.promo,
    };

    clearCart();
    toast.success("Order placed!", {
      description:
        paymentMethod === "card"
          ? "Card payment simulated."
          : "M-PESA push simulated.",
    });
    navigate(`/s/${merchantSlug}/success`, { state: orderSnapshot });
  };

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Checkout</h1>

      {/* Contact details */}
      <div className="card space-y-4">
        <p className="section-label">Contact details</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-gray-600">
              Full name *
            </span>
            <input
              value={customer.contactName}
              onChange={(e) =>
                setCustomerField("contactName", e.target.value)
              }
              className="input"
              placeholder="Jane Doe"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-gray-600">
              Business name
            </span>
            <input
              value={customer.businessName}
              onChange={(e) =>
                setCustomerField("businessName", e.target.value)
              }
              className="input"
              placeholder="Optional"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-gray-600">
              Email *
            </span>
            <input
              value={customer.email}
              onChange={(e) =>
                setCustomerField("email", e.target.value)
              }
              className="input"
              placeholder="jane@example.com"
              type="email"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-gray-600">
              Phone *
            </span>
            <input
              value={customer.phone}
              onChange={(e) =>
                setCustomerField("phone", e.target.value)
              }
              className="input"
              placeholder="+254 7XX XXX XXX"
              type="tel"
            />
          </label>
        </div>
      </div>

      {/* Delivery address with map */}
      <div className="card space-y-4">
        <p className="section-label">Delivery address</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-xs font-medium text-gray-600">
              Street address
            </span>
            <input
              value={customer.address}
              onChange={(e) =>
                setCustomerField("address", e.target.value)
              }
              className="input"
              placeholder="e.g. Kenyatta Avenue, CBD"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-gray-600">
              City / Town
            </span>
            <input
              value={customer.city}
              onChange={(e) =>
                setCustomerField("city", e.target.value)
              }
              className="input"
              placeholder="Nairobi"
            />
          </label>
        </div>

        <AddressMap
          address={customer.address}
          lat={customer.lat}
          lng={customer.lng}
          onAddressChange={(addr) => setCustomerField("address", addr)}
          onLocationChange={(lat, lng, addr) => {
            setCustomerField("lat", lat);
            setCustomerField("lng", lng);
            setCustomerField("address", addr);
          }}
        />
      </div>

      {/* Notes */}
      <div className="card space-y-3">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-gray-600">
            Order notes
          </span>
          <textarea
            value={customer.notes}
            onChange={(e) =>
              setCustomerField("notes", e.target.value)
            }
            className="input min-h-20 resize-none py-3"
            placeholder="Delivery instructions, variant preferences..."
          />
        </label>
      </div>

      {/* Promo code */}
      <div className="card space-y-3">
        <p className="section-label">Promo code</p>
        <div className="flex gap-2">
          <input
            value={promoDraft}
            onChange={(e) =>
              setPromoDraft(e.target.value.toUpperCase())
            }
            className="input flex-1"
            placeholder="Enter code"
          />
          <button
            type="button"
            onClick={applyPromo}
            className="btn-outline"
          >
            Apply
          </button>
        </div>
        {promoError && (
          <p className="text-xs text-red-500">{promoError}</p>
        )}
        {promoState.promo && (
          <div className="flex items-center gap-2 rounded-xl bg-green-50 p-3 text-xs text-green-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {promoState.promo.code} — {promoState.promo.description}
          </div>
        )}
      </div>

      {/* Payment method */}
      <div className="card space-y-3">
        <p className="section-label">Payment</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setPaymentMethod("card")}
            className={
              paymentMethod === "card"
                ? "flex items-center gap-3 rounded-xl border-2 border-primary bg-primary/5 px-4 py-3 text-left"
                : "flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-left transition-colors hover:border-gray-300"
            }
          >
            <CreditCard className="h-5 w-5 text-secondary" />
            <span>
              <span className="block text-sm font-semibold text-gray-900">
                Card
              </span>
              <span className="block text-[10px] text-gray-500">
                Visa, Mastercard
              </span>
            </span>
            {paymentMethod === "card" && (
              <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod("mpesa")}
            className={
              paymentMethod === "mpesa"
                ? "flex items-center gap-3 rounded-xl border-2 border-mpesa bg-mpesa/5 px-4 py-3 text-left"
                : "flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-left transition-colors hover:border-gray-300"
            }
          >
            <Smartphone className="h-5 w-5 text-mpesa" />
            <span>
              <span className="block text-sm font-semibold text-gray-900">
                M-PESA
              </span>
              <span className="block text-[10px] text-gray-500">
                STK push
              </span>
            </span>
            {paymentMethod === "mpesa" && (
              <CheckCircle2 className="ml-auto h-4 w-4 text-mpesa" />
            )}
          </button>
        </div>
      </div>

      {/* Order summary */}
      <div className="card space-y-3">
        <p className="section-label">Order summary</p>
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-gray-600">
              {item.name}{" "}
              <span className="text-gray-400">× {item.quantity}</span>
            </span>
            <span className="font-medium">
              {formatKES(item.lineTotal)}
            </span>
          </div>
        ))}
        <div className="border-t border-dashed pt-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span>{formatKES(pricing.subtotal)}</span>
          </div>
          {pricing.discountAmount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Discount</span>
              <span className="text-green-600">
                -{formatKES(pricing.discountAmount)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">VAT (incl.)</span>
            <span>{formatKES(pricing.vatIncluded)}</span>
          </div>
        </div>
        <div className="rounded-xl bg-cream p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-secondary">
              {formatKES(pricing.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={canSubmit ? "btn-primary w-full" : "btn-disabled w-full"}
      >
        {submitting ? "Placing order..." : "Place order"}
      </button>
    </div>
  );
}
