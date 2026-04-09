import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { QuantityStepper } from "@/components/QuantityStepper";
import { calculatePricing, validatePromo } from "@/lib/pricing";
import { formatKES } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

export function CartPage() {
  const navigate = useNavigate();
  const { merchantSlug = "ilisah" } = useParams();
  const items = useCartStore((s) => s.items);
  const promoCode = useCartStore((s) => s.promoCode);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const promoState = validatePromo(promoCode, subtotal);
  const pricing = calculatePricing(items, promoState.promo);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <ShoppingBag className="h-7 w-7 text-gray-400" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          Your cart is empty
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Browse products and add them to your cart.
        </p>
        <Link
          to={`/s/${merchantSlug}`}
          className="btn-primary mt-6"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">
        Cart ({items.length})
      </h1>

      {/* Line items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="card flex gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">
                {item.name}
              </h3>
              <p className="mt-0.5 text-xs text-gray-400">
                {item.optionLabel}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {formatKES(item.unitPrice)} / {item.unitLabel}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <QuantityStepper
                  value={item.quantity}
                  onChange={(v) => updateQuantity(item.id, v)}
                />
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-sm font-bold text-secondary">
              {formatKES(item.lineTotal)}
            </p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="card space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium">{formatKES(pricing.subtotal)}</span>
        </div>
        {pricing.discountAmount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Discount</span>
            <span className="font-medium text-green-600">
              -{formatKES(pricing.discountAmount)}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">VAT (incl.)</span>
          <span className="font-medium">{formatKES(pricing.vatIncluded)}</span>
        </div>
        <div className="border-t border-dashed pt-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-secondary">
              {formatKES(pricing.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          to={`/s/${merchantSlug}`}
          className="btn-outline w-full"
        >
          Continue shopping
        </Link>
        <button
          type="button"
          onClick={() => navigate(`/s/${merchantSlug}/checkout`)}
          className="btn-primary w-full"
        >
          Checkout
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
