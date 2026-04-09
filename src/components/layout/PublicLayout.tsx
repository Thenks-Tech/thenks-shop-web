import { Outlet } from "react-router-dom";
import { CartFab } from "@/components/layout/CartFab";
import { ShopHeader } from "@/components/layout/ShopHeader";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-cream pb-24">
      <ShopHeader />
      <main className="container max-w-2xl px-4 py-4">
        <Outlet />
      </main>
      <CartFab />
    </div>
  );
}
