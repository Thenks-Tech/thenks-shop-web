import { AdminLayout } from "@/components/layout/AdminLayout";
import { promoDefinitions } from "@/lib/pricing";

export function AdminSettingsPage() {
  return (
    <AdminLayout title="Settings">
      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-[28px] bg-white p-5 shadow-soft">
          <p className="section-label">Pricing assumptions</p>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900">
            Demo pricing profile
          </h1>
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <p>Currency: KES</p>
            <p>VAT: 16% included in displayed prices</p>
            <p>Fulfilment: pickup or delivery arranged offline</p>
            <p>Payments: card via Stripe mock and M-PESA mock</p>
          </div>
        </article>

        <article className="rounded-[28px] bg-white p-5 shadow-soft">
          <p className="section-label">Promo examples</p>
          <div className="mt-4 space-y-3">
            {promoDefinitions.map((promo) => (
              <div key={promo.code} className="rounded-3xl bg-gray-50 p-4 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">{promo.code}</p>
                <p className="mt-1">{promo.description}</p>
                <p className="mt-2 text-xs text-gray-500">
                  Minimum subtotal: KES {promo.minSubtotal.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </AdminLayout>
  );
}
