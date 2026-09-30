import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { com2StorefrontEnabled } from "@/lib/features";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Com2Layout } from "@/components/com2/Com2Layout";
import { AdminCatalogPage } from "@/pages/admin/AdminCatalogPage";
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { AdminOrdersPage } from "@/pages/admin/AdminOrdersPage";
import { AdminSettingsPage } from "@/pages/admin/AdminSettingsPage";
import { CartPage } from "@/pages/CartPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { ProductPage } from "@/pages/ProductPage";
import { StorefrontPage } from "@/pages/StorefrontPage";
import { SuccessPage } from "@/pages/SuccessPage";
import { Com2CartPage } from "@/pages/com2/Com2CartPage";
import { Com2CheckoutPage } from "@/pages/com2/Com2CheckoutPage";
import { Com2HomePage } from "@/pages/com2/Com2HomePage";
import { Com2OrderTrackingPage } from "@/pages/com2/Com2OrderTrackingPage";
import { Com2ProductPage } from "@/pages/com2/Com2ProductPage";
import { Com2StorePage } from "@/pages/com2/Com2StorePage";

function LegacyShopRoutes() {
  return (
    <Route path="/s/:merchantSlug" element={<PublicLayout />}>
      <Route index element={<StorefrontPage />} />
      <Route path="product/:productSlug" element={<ProductPage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="checkout" element={<CheckoutPage />} />
      <Route path="success" element={<SuccessPage />} />
    </Route>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {com2StorefrontEnabled ? (
          <>
            <Route path="/" element={<Com2HomePage />} />
            <Route path="/:entityThenksId/:storeSlug" element={<Com2Layout />}>
              <Route index element={<Com2StorePage />} />
              <Route path="product/:productId" element={<Com2ProductPage />} />
              <Route path="cart" element={<Com2CartPage />} />
              <Route path="checkout" element={<Com2CheckoutPage />} />
              <Route
                path="orders/:orderId"
                element={<Com2OrderTrackingPage />}
              />
            </Route>
            {LegacyShopRoutes()}
            <Route path="*" element={<Com2HomePage />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/s/ilisah" replace />} />
            {LegacyShopRoutes()}
            <Route
              path="/admin/s/:merchantSlug"
              element={<AdminDashboardPage />}
            />
            <Route
              path="/admin/s/:merchantSlug/orders"
              element={<AdminOrdersPage />}
            />
            <Route
              path="/admin/s/:merchantSlug/catalog"
              element={<AdminCatalogPage />}
            />
            <Route
              path="/admin/s/:merchantSlug/settings"
              element={<AdminSettingsPage />}
            />
            <Route path="*" element={<Navigate to="/s/ilisah" replace />} />
          </>
        )}
        {com2StorefrontEnabled && (
          <>
            <Route
              path="/admin/s/:merchantSlug"
              element={<AdminDashboardPage />}
            />
            <Route
              path="/admin/s/:merchantSlug/orders"
              element={<AdminOrdersPage />}
            />
            <Route
              path="/admin/s/:merchantSlug/catalog"
              element={<AdminCatalogPage />}
            />
            <Route
              path="/admin/s/:merchantSlug/settings"
              element={<AdminSettingsPage />}
            />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
