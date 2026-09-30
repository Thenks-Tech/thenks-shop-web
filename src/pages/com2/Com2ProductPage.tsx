import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  CommerceApiError,
  fetchCommerceProducts,
  type CommerceProduct,
} from "@/lib/commerceApi";
import { formatMoneyFromDecimal } from "@/lib/money";
import { QuantityStepper } from "@/components/QuantityStepper";
import { useCom2CartStore } from "@/store/com2CartStore";

export function Com2ProductPage() {
  const { entityThenksId = "", storeSlug = "", productId = "" } = useParams();
  const addProduct = useCom2CartStore((s) => s.addProduct);
  const bindStore = useCom2CartStore((s) => s.bindStore);
  const cartLine = useCom2CartStore((s) =>
    s.lines.find((l) => l.productId === productId),
  );
  const setQuantity = useCom2CartStore((s) => s.setQuantity);

  const [product, setProduct] = useState<CommerceProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const basePath = `/${entityThenksId}/${storeSlug}`;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { products } = await fetchCommerceProducts(
          entityThenksId,
          storeSlug,
        );
        if (cancelled) {
          return;
        }
        const match = products.find((p) => p.id === productId);
        if (!match) {
          setError("Product not found.");
          return;
        }
        bindStore(entityThenksId, storeSlug, match.currency_code);
        setProduct(match);
      } catch (err) {
        if (cancelled) {
          return;
        }
        if (err instanceof CommerceApiError && err.status === 404) {
          setError("Product not found.");
        } else {
          setError("Could not load product.");
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
  }, [entityThenksId, storeSlug, productId, bindStore]);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading…</p>;
  }

  if (error || !product) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-600">{error ?? "Not found"}</p>
        <Link to={basePath} className="btn-outline inline-block">
          Back to store
        </Link>
      </div>
    );
  }

  const outOfStock = product.stock_quantity <= 0;
  const quantity = cartLine?.quantity ?? 0;

  const handleAdd = () => {
    if (outOfStock) {
      return;
    }
    addProduct(product, 1);
    toast.success("Added to cart");
  };

  return (
    <div className="space-y-5">
      <Link to={basePath} className="text-xs font-medium text-primary">
        ← Back
      </Link>
      <div className="card overflow-hidden p-0">
        <div className="aspect-square bg-gray-100">
          {product.image_urls[0] ? (
            <img
              src={product.image_urls[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div className="p-4 space-y-3">
          <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-lg font-semibold text-secondary">
            {formatMoneyFromDecimal(product.price, product.currency_code)}
          </p>
          {product.description && (
            <p className="text-sm text-gray-600">{product.description}</p>
          )}
          {outOfStock ? (
            <p className="text-sm font-medium text-red-600">Out of stock</p>
          ) : (
            <p className="text-xs text-gray-500">
              {product.stock_quantity} available
            </p>
          )}
          {quantity > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">In cart</span>
              <QuantityStepper
                value={quantity}
                min={0}
                max={product.stock_quantity}
                onChange={(q) => {
                  if (q <= 0) {
                    useCom2CartStore.getState().removeLine(product.id);
                  } else {
                    setQuantity(product.id, q);
                  }
                }}
              />
            </div>
          )}
          <button
            type="button"
            onClick={handleAdd}
            disabled={outOfStock}
            className={outOfStock ? "btn-disabled w-full" : "btn-primary w-full"}
          >
            {outOfStock ? "Out of stock" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
