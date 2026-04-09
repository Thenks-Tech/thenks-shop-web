import { useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Check, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { QuantityStepper } from "@/components/QuantityStepper";
import { ilisahProducts } from "@/data/ilisahCatalog";
import { formatKES } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

const familyEmoji: Record<string, string> = {
  animal: "🦁",
  bird: "🦜",
  wooden: "🪵",
  general: "✨",
};

export function ProductPage() {
  const navigate = useNavigate();
  const { merchantSlug = "ilisah", productSlug } = useParams();
  const addItem = useCartStore((state) => state.addItem);

  const product = useMemo(
    () => ilisahProducts.find((p) => p.slug === productSlug),
    [productSlug],
  );

  const [selectedOptionId, setSelectedOptionId] = useState(
    product?.options.find((o) => o.default)?.id ??
      product?.options[0]?.id ??
      "",
  );
  const [quantity, setQuantity] = useState(product?.moq ?? 1);

  if (!product) {
    return <Navigate to={`/s/${merchantSlug}`} replace />;
  }

  const selectedOption =
    product.options.find((o) => o.id === selectedOptionId) ??
    product.options[0];
  const lineTotal = selectedOption.price * quantity;

  return (
    <div className="space-y-5">
      {/* Hero image */}
      <div
        className={`flex aspect-[4/3] items-center justify-center rounded-2xl bg-gradient-to-br ${product.accent}`}
      >
        <span className="text-7xl opacity-70">
          {familyEmoji[product.family] ?? "🛍️"}
        </span>
      </div>

      {/* Title + price */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">
          {product.family} collection
        </p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          {product.name}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          {product.description}
        </p>
        <p className="mt-3 text-xl font-bold text-secondary">
          {formatKES(selectedOption.price)}{" "}
          <span className="text-sm font-normal text-gray-400">
            / {product.unitLabel}
          </span>
        </p>
      </div>

      {/* Options selector (only if >1 option) */}
      {product.options.length > 1 && (
        <div className="space-y-2">
          <p className="section-label">Options</p>
          <div className="grid gap-2">
            {product.options.map((option) => {
              const selected = option.id === selectedOptionId;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedOptionId(option.id)}
                  className={
                    selected
                      ? "flex items-center justify-between rounded-xl border-2 border-primary bg-primary/5 px-4 py-3 text-left"
                      : "flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-left transition-colors hover:border-gray-300"
                  }
                >
                  <span className="text-sm font-medium text-gray-900">
                    {option.label}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-secondary">
                      {formatKES(option.price)}
                    </span>
                    {selected && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Variants chips */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-2">
          <p className="section-label">Variants</p>
          <div className="flex flex-wrap gap-1.5">
            {product.variants.map((v) => (
              <span
                key={v}
                className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-gray-600"
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Colors chips */}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-2">
          <p className="section-label">Colours</p>
          <div className="flex flex-wrap gap-1.5">
            {product.colors.map((c) => (
              <span
                key={c}
                className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quantity + add to cart */}
      <div className="sticky bottom-0 -mx-4 border-t border-gray-100 bg-white px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <QuantityStepper
              value={quantity}
              onChange={setQuantity}
              min={1}
            />
            <p className="mt-1 text-[10px] text-gray-400">
              min. order {product.moq}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Total</p>
            <p className="text-lg font-bold text-secondary">
              {formatKES(lineTotal)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            addItem(product, selectedOption, quantity);
            toast.success(`${product.shortName} added to cart`);
            navigate(`/s/${merchantSlug}/cart`);
          }}
          className="btn-primary mt-3 w-full"
        >
          <ShoppingBag className="h-4 w-4" />
          Add to cart
        </button>
      </div>
    </div>
  );
}
