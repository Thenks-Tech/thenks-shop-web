import { AdminLayout } from "@/components/layout/AdminLayout";
import { demoOrders, ilisahProducts, merchant } from "@/data/ilisahCatalog";
import { formatCompactNumber, formatKES } from "@/lib/utils";

export function AdminDashboardPage() {
  const totalRevenue = demoOrders.reduce((sum, order) => sum + order.total, 0);
  const paidOrders = demoOrders.filter((order) => order.status === "Paid").length;

  return (
    <AdminLayout title="Dashboard">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[28px] bg-white p-5 shadow-soft">
          <p className="section-label">Catalog products</p>
          <p className="mt-3 text-2xl font-semibold text-secondary">{ilisahProducts.length}</p>
          <p className="mt-1 text-sm text-gray-500">Directly transcribed from the catalog PDF.</p>
        </article>
        <article className="rounded-[28px] bg-white p-5 shadow-soft">
          <p className="section-label">Mock GMV</p>
          <p className="mt-3 text-2xl font-semibold text-secondary">{formatKES(totalRevenue)}</p>
          <p className="mt-1 text-sm text-gray-500">Generated from demo orders for pitch flows.</p>
        </article>
        <article className="rounded-[28px] bg-white p-5 shadow-soft">
          <p className="section-label">Paid orders</p>
          <p className="mt-3 text-2xl font-semibold text-secondary">{paidOrders}</p>
          <p className="mt-1 text-sm text-gray-500">Illustrates order-state visibility for merchants.</p>
        </article>
        <article className="rounded-[28px] bg-white p-5 shadow-soft">
          <p className="section-label">Variant footprint</p>
          <p className="mt-3 text-2xl font-semibold text-secondary">
            {formatCompactNumber(
              ilisahProducts.reduce((sum, product) => sum + (product.variants?.length ?? 0), 0),
            )}
          </p>
          <p className="mt-1 text-sm text-gray-500">Animal, bird, and wooden storytelling lines.</p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[28px] bg-white p-5 shadow-soft">
          <p className="section-label">Merchant narrative</p>
          <h2 className="mt-2 text-xl font-semibold text-gray-900">{merchant.name}</h2>
          <p className="mt-3 text-sm leading-7 text-gray-600">{merchant.blurb}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-4 text-sm text-gray-700">
              VAT display is demo-only and treated as included in shelf price.
            </div>
            <div className="rounded-3xl bg-orange-50 p-4 text-sm text-gray-700">
              Payment status, payout handling, and tax reporting move server-side in production.
            </div>
          </div>
        </article>

        <article className="rounded-[28px] bg-white p-5 shadow-soft">
          <p className="section-label">Recent mock orders</p>
          <div className="mt-4 space-y-3">
            {demoOrders.slice(0, 3).map((order) => (
              <div key={order.id} className="rounded-3xl border border-gray-100 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{order.company}</p>
                    <p className="mt-1 text-xs text-gray-500">{order.id}</p>
                  </div>
                  <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                    {order.status}
                  </span>
                </div>
                <p className="mt-3 text-sm font-medium text-secondary">{formatKES(order.total)}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </AdminLayout>
  );
}
