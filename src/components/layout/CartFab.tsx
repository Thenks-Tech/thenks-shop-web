import { ShoppingBag } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { selectItemCount, useCartStore } from "@/store/cartStore";
import { formatKES } from "@/lib/utils";

export function CartFab() {
  const navigate = useNavigate();
  const { merchantSlug = "ilisah" } = useParams();
  const items = useCartStore((s) => s.items);
  const itemCount = useCartStore(selectItemCount);

  if (items.length === 0) return null;

  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);

  return (
    <button
      type="button"
      onClick={() => navigate(`/s/${merchantSlug}/cart`)}
      className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between rounded-2xl bg-secondary px-4 py-3.5 text-white shadow-lg transition-transform active:scale-[0.98]"
    >
      <span className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
          <ShoppingBag className="h-4 w-4" />
        </span>
        <span className="text-sm font-semibold">
          {itemCount} item{itemCount === 1 ? "" : "s"}
        </span>
      </span>
      <span className="text-sm font-bold">{formatKES(subtotal)}</span>
    </button>
  );
}
