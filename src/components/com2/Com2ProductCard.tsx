import { Link } from "react-router-dom";
import { formatMoneyFromDecimal } from "@/lib/money";
import type { CommerceProduct } from "@/lib/commerceApi";

interface Com2ProductCardProps {
  product: CommerceProduct;
  basePath: string;
}

export function Com2ProductCard({ product, basePath }: Com2ProductCardProps) {
  const outOfStock = product.stock_quantity <= 0;
  const image = product.image_urls[0];

  return (
    <Link
      to={`${basePath}/product/${product.id}`}
      className="card block overflow-hidden p-0 transition-shadow hover:shadow-md"
    >
      <div className="aspect-square bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-gray-400">
            No image
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
          {product.name}
        </h3>
        <p className="mt-1 text-sm font-medium text-secondary">
          {formatMoneyFromDecimal(product.price, product.currency_code)}
        </p>
        {outOfStock ? (
          <p className="mt-1 text-xs font-medium text-red-600">Out of stock</p>
        ) : (
          <p className="mt-1 text-xs text-gray-500">
            {product.stock_quantity} in stock
          </p>
        )}
      </div>
    </Link>
  );
}
