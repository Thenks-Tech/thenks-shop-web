import { AdminLayout } from "@/components/layout/AdminLayout";
import { ilisahProducts } from "@/data/ilisahCatalog";
import { formatKES } from "@/lib/utils";

export function AdminCatalogPage() {
  return (
    <AdminLayout title="Catalog">
      <section className="rounded-[28px] bg-white p-5 shadow-soft">
        <p className="section-label">Catalog</p>
        <h1 className="mt-2 text-2xl font-semibold text-gray-900">
          Transcribed ILISAH product matrix
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Read-only for the demo. Production will replace this with CRUD backed by the shop API.
        </p>
      </section>

      <section className="grid gap-4">
        {ilisahProducts.map((product) => (
          <article key={product.id} className="rounded-[28px] bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                    {product.family}
                  </span>
                  <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                    {product.category}
                  </span>
                </div>
                <h2 className="mt-3 text-lg font-semibold text-gray-900">{product.name}</h2>
                <p className="mt-2 text-sm text-gray-600">{product.moqLabel}</p>
              </div>
              <div className="rounded-3xl bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {product.options.map((option) => (
                  <p key={option.id}>
                    {option.label}: <span className="font-semibold">{formatKES(option.price)}</span>
                  </p>
                ))}
              </div>
            </div>

            {product.variants && (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.variants.slice(0, 8).map((variant) => (
                  <span
                    key={variant}
                    className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600"
                  >
                    {variant}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </section>
    </AdminLayout>
  );
}
