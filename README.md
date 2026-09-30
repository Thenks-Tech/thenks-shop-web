# Thenks Shop Web

Mobile-first e-commerce storefront for hospitality brands, deployed at **shop.thenks.co**. Part of the Thenks platform alongside [thenks-web](../thenks-web) (tipping) and [thenks-donations-web](../thenks-donations-web) (donations).

The first merchant demo is **ILISAH** — a luxury handcrafted souvenir and home textile brand for lodges and boutiques.

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | React 19, Vite 8, TypeScript 6 |
| Styling | Tailwind CSS 3.4, brand tokens from `thenks-web` |
| State | Zustand (in-memory cart) |
| Routing | React Router DOM 7 |
| Maps | Leaflet + React-Leaflet (OpenStreetMap) |
| Toasts | Sonner |
| Icons | Lucide React |

## Quick start

```bash
cd thenks-shop-web
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The root redirects to `/s/ilisah`.

## Project structure

```
src/
├── components/
│   ├── layout/
│   │   ├── AdminLayout.tsx      # Merchant admin shell (sidebar, header)
│   │   ├── CartFab.tsx          # Floating cart bar on public pages
│   │   ├── PublicLayout.tsx     # Shopper shell (header, outlet, FAB)
│   │   └── ShopHeader.tsx       # Sticky header with brand + cart icon
│   ├── AddressMap.tsx           # Leaflet map with geocoding for delivery address
│   ├── ProductCard.tsx          # Product tile for the grid
│   └── QuantityStepper.tsx      # +/- stepper control
├── data/
│   └── ilisahCatalog.ts         # Mock catalog: products, merchant, demo orders
├── lib/
│   ├── pricing.ts               # VAT, promo, subtotal calculations
│   ├── runtime.ts               # Env var helpers
│   ├── shopApi.ts               # API interfaces (mocked for demo)
│   └── utils.ts                 # cn(), formatKES(), generateOrderRef()
├── pages/
│   ├── admin/
│   │   ├── AdminCatalogPage.tsx  # Read-only catalog view
│   │   ├── AdminDashboardPage.tsx# KPIs, recent orders
│   │   ├── AdminOrdersPage.tsx   # Order list with status
│   │   └── AdminSettingsPage.tsx # Pricing/promo assumptions
│   ├── CartPage.tsx              # Cart with line items + summary
│   ├── CheckoutPage.tsx          # Contact, address/map, promo, payment, submit
│   ├── ProductPage.tsx           # Product detail with options + add to cart
│   ├── StorefrontPage.tsx        # Home: hero, search, categories, product grid
│   └── SuccessPage.tsx           # Order confirmation
├── store/
│   └── cartStore.ts              # Zustand cart (items, customer, promo, payment)
├── types.ts                      # Shared TypeScript interfaces
├── App.tsx                       # Router config
├── main.tsx                      # Entry point
└── index.css                     # Tailwind + brand tokens
```

## Routes

### Public (shopper)

| Path | Page |
|------|------|
| `/s/:merchantSlug` | Storefront (product grid) |
| `/s/:merchantSlug/product/:productSlug` | Product detail |
| `/s/:merchantSlug/cart` | Cart |
| `/s/:merchantSlug/checkout` | Checkout (contact, address, payment) |
| `/s/:merchantSlug/success` | Order confirmation |

### Merchant admin

| Path | Page |
|------|------|
| `/admin/s/:merchantSlug` | Dashboard |
| `/admin/s/:merchantSlug/orders` | Orders |
| `/admin/s/:merchantSlug/catalog` | Catalog |
| `/admin/s/:merchantSlug/settings` | Settings |

Access admin from the storefront via the gear icon in the header (home page only).

## Brand tokens

Consistent with the core Thenks platform:

- **Cream** `#FFF8F0` — page background
- **Primary / Orange** `#FF9900` — CTAs, active states, badges
- **Secondary / Navy** `#05255E` — headings, totals, header brand text
- **M-PESA green** `#43B649` — M-PESA payment option

## Demo data

Product data in `src/data/ilisahCatalog.ts` is transcribed from the ILISAH wholesale catalog PDF (`docs/ILISAH Wholesale Catalog.pdf`). It includes 13 products across Animal, Bird, Wooden, and Accessory lines with KES pricing and MOQ thresholds.

The hero image for the storefront is configured via `merchant.heroImage` in the catalog data. Set it to a URL or local path to display a banner image; when `null`, the hero falls back to a solid navy block with the tagline.

## COM-2 commerce storefront (feature flag)

When `VITE_FEATURE_COM2_STOREFRONT=true`, the app exposes the public COM-2 shopper flow against `thenks-backend` (`COM1_COMMERCE_STORES` + `COM2_COMMERCE_CHECKOUT` must be enabled server-side).

| Route | Purpose |
|-------|---------|
| `/:entityThenksId/:storeSlug` | Store catalogue |
| `/:entityThenksId/:storeSlug/product/:productId` | Product detail |
| `/:entityThenksId/:storeSlug/cart` | Client cart (per store) |
| `/:entityThenksId/:storeSlug/checkout` | Checkout, server totals, Stripe / M-PESA |
| `/:entityThenksId/:storeSlug/orders/:orderId?token=…` | Order tracking |

**Env vars:** `VITE_API_BASE_URL`, `VITE_STRIPE_PUBLISHABLE_KEY`, `VITE_FEATURE_COM2_STOREFRONT` (default off).

**Public API base:** `/api/v1/commerce/public/entities/{entity_thenks_id}/stores/{store_slug}/` (store, products, checkout with `Idempotency-Key`) and `/api/v1/commerce/public/orders/{order_id}/?token=…`.

Run tests: `npm test`.

## Current status

### Done (demo-ready)

- [x] Storefront with hero banner, search, category filters, 2-column product grid
- [x] Product detail with options, variants, colours, quantity stepper, sticky add-to-cart
- [x] Cart with line items, quantity editing, pricing summary
- [x] Checkout with contact details (name, email, phone), delivery address with interactive map (Leaflet/OpenStreetMap, geocoding), order notes, promo codes, payment method (Card/M-PESA)
- [x] Order success page
- [x] Merchant admin: dashboard, orders list, catalog view, settings
- [x] Brand-aligned design (cream/orange/navy)
- [x] Mobile-first layout, touch targets, scrollable category pills

### COM-2 (behind `VITE_FEATURE_COM2_STOREFRONT`)

- [x] Public store + products from commerce API
- [x] Client cart with stock limits
- [x] Server-priced checkout, idempotent retries, Stripe Payment Element, M-PESA polling via order status
- [x] Order tracking with access token (+ optional email)

### Planned (post-demo / production)

- [ ] Real product images (replace emoji placeholders)
- [ ] Legacy ILISAH demo retirement when all merchants use COM-2
- [ ] Shipping address collection (COM-2.1)
- [ ] Merchant auth via `app.thenks.co` handoff
- [ ] Inventory tracking and order lifecycle
- [ ] Multi-merchant support (currently single-tenant ILISAH demo)
- [ ] Deployment to `shop.thenks.co`

## Related docs

- [`api-schemas/thenks-shop.yaml`](../api-schemas/thenks-shop.yaml) — OpenAPI spec for the shop backend
- [`docs/features/thenks-shop-pricing-tax-spec.md`](../docs/features/thenks-shop-pricing-tax-spec.md) — Pricing, VAT, and promo rules
- [`docs/features/thenks-shop-backend-contract.md`](../docs/features/thenks-shop-backend-contract.md) — Backend domain model and API contract
- [`docs/operations/thenks-shop-runtime-notes.md`](../docs/operations/thenks-shop-runtime-notes.md) — Hosting, env vars, CORS, Stripe config
- [`docs/ILISAH Wholesale Catalog.pdf`](../docs/ILISAH%20Wholesale%20Catalog.pdf) — Source catalog for product data
