import {
  LayoutDashboard,
  ListOrdered,
  Package2,
  Settings,
  Store,
} from "lucide-react";
import type { ReactNode } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { merchant } from "@/data/ilisahCatalog";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  title: string;
  children: ReactNode;
}

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, suffix: "" },
  { label: "Orders", icon: ListOrdered, suffix: "/orders" },
  { label: "Catalog", icon: Package2, suffix: "/catalog" },
  { label: "Settings", icon: Settings, suffix: "/settings" },
];

export function AdminLayout({ title, children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { merchantSlug = "ilisah" } = useParams();

  const basePath = `/admin/s/${merchantSlug}`;

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="container max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-secondary">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-gray-500">
                  Thenks Shop Admin
                </p>
                <p className="text-sm font-semibold text-secondary">
                  {merchant.name} · {title}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/s/${merchantSlug}`)}
              className="rounded-full border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              View storefront
            </button>
          </div>
        </div>
      </header>

      <div className="container max-w-6xl px-4 py-6">
        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
          <aside className="hidden md:block">
            <nav className="space-y-1 rounded-3xl bg-white p-3 shadow-soft">
              {navItems.map((item) => {
                const target = `${basePath}${item.suffix}`;
                const active =
                  location.pathname === target ||
                  (!item.suffix && location.pathname === basePath);

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => navigate(target)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-secondary text-white"
                        : "text-gray-600 hover:bg-gray-50",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <nav className="scrollbar-hide flex items-center gap-2 overflow-x-auto md:hidden">
            {navItems.map((item) => {
              const target = `${basePath}${item.suffix}`;
              const active =
                location.pathname === target ||
                (!item.suffix && location.pathname === basePath);

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => navigate(target)}
                  className={cn(
                    "whitespace-nowrap rounded-full border px-3 py-2 text-xs font-medium",
                    active
                      ? "border-secondary bg-secondary text-white"
                      : "border-gray-200 bg-white text-gray-700",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <main className="space-y-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
