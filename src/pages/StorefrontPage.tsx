import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Search } from "lucide-react";
import { ilisahProducts, merchant } from "@/data/ilisahCatalog";
import { ProductCard } from "@/components/ProductCard";
import type { ProductFamily } from "@/types";

const categories: Array<{ id: ProductFamily | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "animal", label: "Animal" },
  { id: "bird", label: "Bird" },
  { id: "wooden", label: "Wooden" },
  { id: "general", label: "Accessories" },
];

export function StorefrontPage() {
  useParams();
  const [activeCategory, setActiveCategory] = useState<
    ProductFamily | "all"
  >("all");
  const [search, setSearch] = useState("");

  const products = useMemo(() => {
    let list = ilisahProducts;
    if (activeCategory !== "all") {
      list = list.filter((p) => p.family === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    return list;
  }, [activeCategory, search]);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-2xl bg-secondary px-5 py-6 text-white">
        <p className="text-xl font-bold leading-tight">
          {merchant.tagline}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          {merchant.blurb}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="input pl-11"
        />
      </div>

      {/* Category pills */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={
              activeCategory === cat.id
                ? "shrink-0 rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-white transition-colors"
                : "shrink-0 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 transition-colors hover:border-gray-300"
            }
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product count */}
      <p className="text-xs text-gray-400">
        {products.length} product{products.length !== 1 ? "s" : ""}
      </p>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm text-gray-500">No products found.</p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory("all");
              setSearch("");
            }}
            className="mt-3 text-sm font-medium text-primary"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
