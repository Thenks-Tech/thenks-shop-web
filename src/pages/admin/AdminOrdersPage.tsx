import { AdminLayout } from "@/components/layout/AdminLayout";
import { demoOrders } from "@/data/ilisahCatalog";
import { formatKES } from "@/lib/utils";

export function AdminOrdersPage() {
  return (
    <AdminLayout title="Orders">
      <section className="rounded-[28px] bg-white p-5 shadow-soft">
        <p className="section-label">Orders</p>
        <h1 className="mt-2 text-2xl font-semibold text-gray-900">
          Mock wholesale order feed
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          This admin view is intentionally static for the demo, but mirrors the status and line-item visibility merchants will expect.
        </p>
      </section>

      <section className="space-y-4">
        {demoOrders.map((order) => (
          <article key={order.id} className="rounded-[28px] bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">{order.company}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {order.id} · {order.createdAt} · {order.contactName}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                  {order.status}
                </span>
                <p className="mt-3 text-lg font-semibold text-secondary">
                  {formatKES(order.total)}
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {order.items.map((item) => (
                <div
                  key={`${order.id}-${item.name}-${item.optionLabel}`}
                  className="flex items-center justify-between rounded-3xl bg-gray-50 px-4 py-3 text-sm text-gray-700"
                >
                  <span>
                    {item.name} · {item.optionLabel}
                  </span>
                  <span>{item.quantity} units</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </AdminLayout>
  );
}
