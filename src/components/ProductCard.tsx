import { Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import type { Product } from "@/types";
import { formatKES } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
  product: Product;
}

const familyEmoji: Record<string, string> = {
  animal: "🦁",
  bird: "🦜",
  wooden: "🪵",
  general: "✨",
};

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { merchantSlug = "ilisah" } = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const defaultOption =
    product.options.find((o) => o.default) ?? product.options[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, defaultOption);
    toast.success(`Added ${product.shortName}`, {
      description: `${product.moq} ${product.unitLabel}s at ${formatKES(defaultOption.price)} each`,
    });
  };

  return (
    <button
      type="button"
      onClick={() =>
        navigate(`/s/${merchantSlug}/product/${product.slug}`)
      }
      className="group flex flex-col overflow-hidden rounded-2xl bg-white text-left shadow-soft transition-shadow hover:shadow-md"
    >
      {/* Image placeholder */}
      <div
        className={`relative flex aspect-square items-center justify-center bg-gradient-to-br ${product.accent}`}
      >
        <span className="text-5xl opacity-80">
          {familyEmoji[product.family] ?? "🛍️"}
        </span>

        {/* Quick add button */}
        <div
          role="button"
          tabIndex={0}
          onClick={handleQuickAdd}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleQuickAdd(e as unknown as React.MouseEvent);
          }}
          className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-secondary shadow-md transition-transform group-hover:scale-110"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          {product.family}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-tight text-gray-900">
          {product.shortName}
        </h3>
        <div className="mt-auto pt-2">
          <p className="text-sm font-bold text-secondary">
            {formatKES(defaultOption.price)}
          </p>
          <p className="text-[10px] text-gray-400">
            min. {product.moq} {product.unitLabel}s
          </p>
        </div>
      </div>
    </button>
  );
}
