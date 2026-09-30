import { Link, useNavigate, useParams } from "react-router-dom";
import { ShoppingBag, Trash2 } from "lucide-react";
import { formatMoneyFromDecimal } from "@/lib/money";
import { QuantityStepper } from "@/components/QuantityStepper";
import { useCom2CartStore } from "@/store/com2CartStore";

export function Com2CartPage() {
  const navigate = useNavigate();
  const { entityThenksId = "", storeSlug = "" } = useParams();
  const lines = useCom2CartStore((s) => s.lines);
  const currencyCode = useCom2CartStore((s) => s.currencyCode) ?? "KES";
  const setQuantity = useCom2CartStore((s) => s.setQuantity);
  const removeLine = useCom2CartStore((s) => s.removeLine);
  const basePath = `/${entityThenksId}/${storeSlug}`;

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <ShoppingBag className="h-10 w-10 text-gray-300" />
        <h2 className="mt-4 font-semibold">Your cart is empty</h2>
        <Link to={basePath} className="btn-primary mt-6">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">Cart</h1>
      <div className="space-y-3">
        {lines.map((line) => (
          <div key={line.productId} className="card flex gap-3">
            <div className="flex-1">
              <h3 className="text-sm font-semibold">{line.name}</h3>
              <p className="text-xs text-gray-500">
                {formatMoneyFromDecimal(line.unitPrice, line.currencyCode)} each
              </p>
              <QuantityStepper
                value={line.quantity}
                min={1}
                max={line.stockQuantity}
                onChange={(q) => setQuantity(line.productId, q)}
              />
            </div>
            <button
              type="button"
              onClick={() => removeLine(line.productId)}
              className="text-gray-400 hover:text-red-500"
              aria-label="Remove"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Fees, tax, and total are calculated at checkout ({currencyCode}).
      </p>
      <button
        type="button"
        onClick={() => navigate(`${basePath}/checkout`)}
        className="btn-primary w-full"
      >
        Checkout
      </button>
    </div>
  );
}
