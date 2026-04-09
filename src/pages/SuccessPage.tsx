import { Link, useLocation, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { formatKES } from "@/lib/utils";
import type { CartItem, CustomerDetails, PaymentMethod, PromoApplication } from "@/types";

interface SuccessState {
  ref: string;
  items: CartItem[];
  total: number;
  paymentMethod: PaymentMethod;
  customer: CustomerDetails;
  promo: PromoApplication | null;
}

export function SuccessPage() {
  const location = useLocation();
  const { merchantSlug = "ilisah" } = useParams();
  const state = location.state as SuccessState | null;

  return (
    <div className="flex flex-col items-center py-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="h-8 w-8 text-green-600" />
      </div>

      <h1 className="mt-5 text-2xl font-bold text-gray-900">
        Order placed!
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Reference: {state?.ref ?? "ILISAH-DEMO"}
      </p>

      {state && (
        <div className="mt-6 w-full max-w-sm space-y-3 text-left">
          <div className="card space-y-2">
            <p className="text-xs font-medium text-gray-400">
              {state.customer.contactName} · {state.customer.email}
            </p>
            {state.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium">
                  {formatKES(item.lineTotal)}
                </span>
              </div>
            ))}
            <div className="border-t pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-lg font-bold text-secondary">
                  {formatKES(state.total)}
                </span>
              </div>
              <p className="mt-1 text-[10px] text-gray-400">
                Paid via{" "}
                {state.paymentMethod === "card"
                  ? "Card (Stripe)"
                  : "M-PESA"}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 grid w-full max-w-sm gap-3 sm:grid-cols-2">
        <Link
          to={`/s/${merchantSlug}`}
          className="btn-primary w-full"
        >
          Continue shopping
        </Link>
        <Link
          to={`/admin/s/${merchantSlug}`}
          className="btn-outline w-full"
        >
          View admin
        </Link>
      </div>
    </div>
  );
}
