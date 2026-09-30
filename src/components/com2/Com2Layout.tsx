import { Link, Outlet, useParams } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { selectCom2ItemCount, useCom2CartStore } from "@/store/com2CartStore";

export function Com2Layout() {
  const { entityThenksId = "", storeSlug = "" } = useParams();
  const itemCount = useCom2CartStore(selectCom2ItemCount);
  const base = `/${entityThenksId}/${storeSlug}`;

  return (
    <div className="min-h-screen bg-cream pb-20">
      <header className="sticky top-0 z-20 border-b border-gray-100 bg-cream/95 backdrop-blur">
        <div className="container flex max-w-2xl items-center justify-between px-4 py-3">
          <Link to={base} className="text-sm font-bold text-secondary">
            Thenks Shop
          </Link>
          <Link
            to={`${base}/cart`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5 text-secondary" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </header>
      <main className="container max-w-2xl px-4 py-4">
        <Outlet />
      </main>
    </div>
  );
}
