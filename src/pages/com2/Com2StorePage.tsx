import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CommerceApiError,
  fetchCommerceProducts,
  fetchCommerceStore,
  type CommerceProduct,
} from "@/lib/commerceApi";
import { Com2ProductCard } from "@/components/com2/Com2ProductCard";
import { useCom2CartStore } from "@/store/com2CartStore";

export function Com2StorePage() {
  const { entityThenksId = "", storeSlug = "" } = useParams();
  const bindStore = useCom2CartStore((s) => s.bindStore);
  const [storeName, setStoreName] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [products, setProducts] = useState<CommerceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const basePath = `/${entityThenksId}/${storeSlug}`;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const [store, catalog] = await Promise.all([
          fetchCommerceStore(entityThenksId, storeSlug),
          fetchCommerceProducts(entityThenksId, storeSlug),
        ]);
        if (cancelled) {
          return;
        }
        const currency =
          catalog.products[0]?.currency_code ?? "KES";
        bindStore(entityThenksId, storeSlug, currency);
        setStoreName(store.name);
        setDescription(store.description);
        setProducts(catalog.products);
      } catch (err) {
        if (cancelled) {
          return;
        }
        if (err instanceof CommerceApiError && err.status === 404) {
          setError("This store is not available.");
        } else {
          setError("Could not load the store. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [entityThenksId, storeSlug, bindStore]);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading store…</p>;
  }

  if (error) {
    return (
      <div className="card py-12 text-center">
        <h1 className="text-lg font-semibold text-gray-900">Store not found</h1>
        <p className="mt-2 text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="card bg-secondary text-white">
        <h1 className="text-xl font-bold">{storeName}</h1>
        {description && (
          <p className="mt-2 text-sm text-white/80">{description}</p>
        )}
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-gray-500">No products available yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <Com2ProductCard
              key={product.id}
              product={product}
              basePath={basePath}
            />
          ))}
        </div>
      )}
    </div>
  );
}
