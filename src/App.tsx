import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AdminCatalogPage } from "@/pages/admin/AdminCatalogPage";
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { AdminOrdersPage } from "@/pages/admin/AdminOrdersPage";
import { AdminSettingsPage } from "@/pages/admin/AdminSettingsPage";
import { CartPage } from "@/pages/CartPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { ProductPage } from "@/pages/ProductPage";
import { StorefrontPage } from "@/pages/StorefrontPage";
import { SuccessPage } from "@/pages/SuccessPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/s/ilisah" replace />} />

        <Route path="/s/:merchantSlug" element={<PublicLayout />}>
          <Route index element={<StorefrontPage />} />
          <Route path="product/:productSlug" element={<ProductPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="success" element={<SuccessPage />} />
        </Route>

        <Route path="/admin/s/:merchantSlug" element={<AdminDashboardPage />} />
        <Route path="/admin/s/:merchantSlug/orders" element={<AdminOrdersPage />} />
        <Route path="/admin/s/:merchantSlug/catalog" element={<AdminCatalogPage />} />
        <Route path="/admin/s/:merchantSlug/settings" element={<AdminSettingsPage />} />

        <Route path="*" element={<Navigate to="/s/ilisah" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
