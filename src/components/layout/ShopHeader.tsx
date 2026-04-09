import { ArrowLeft, Settings, ShoppingBag } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { merchant } from "@/data/ilisahCatalog";
import { selectItemCount, useCartStore } from "@/store/cartStore";

export function ShopHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { merchantSlug = "ilisah" } = useParams();
  const itemCount = useCartStore(selectItemCount);

  const isHome = location.pathname === `/s/${merchantSlug}`;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        {/* Left */}
        <div className="flex w-16 items-center gap-1">
          {!isHome ? (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate(`/admin/s/${merchantSlug}`)}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
              aria-label="Admin panel"
              title="Merchant admin"
            >
              <Settings className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Center — brand */}
        <button
          type="button"
          onClick={() => navigate(`/s/${merchantSlug}`)}
          className="text-center"
        >
          <span className="block text-lg font-bold tracking-[0.2em] text-secondary">
            {merchant.name}
          </span>
        </button>

        {/* Right — cart */}
        <div className="flex w-16 justify-end">
          <button
            type="button"
            onClick={() => navigate(`/s/${merchantSlug}/cart`)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5 text-gray-700" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-secondary">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
