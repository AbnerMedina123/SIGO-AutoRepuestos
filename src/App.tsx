import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './store/useStore';
import { DataProvider } from './store/DataProvider';

// Layout
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { WhatsAppButton } from './components/layout/WhatsAppButton';

// Customer pages
import { Home } from './pages/customer/Home';
import { Catalog } from './pages/customer/Catalog';
import { ProductDetail } from './pages/customer/ProductDetail';
import { Cart } from './pages/customer/Cart';
import { Checkout } from './pages/customer/Checkout';
import { Login, Register } from './pages/customer/Auth';
import { Dashboard } from './pages/customer/Dashboard';
import { OrderConfirmation } from './pages/customer/OrderConfirmation';
import { Privacy } from './pages/customer/Privacy';
import { Terms } from './pages/customer/Terms';
import { NotFound } from './pages/customer/NotFound';
import { About } from './pages/customer/About';
import { Contact } from './pages/customer/Contact';
import { Categories } from './pages/customer/Categories';

// Admin
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminProductForm } from './pages/admin/AdminProductForm';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminReportsOps } from './pages/admin/AdminReportsOps';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminRoute } from './pages/admin/AdminRoute';

function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-sigo-black flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <DataProvider>
      <BrowserRouter>
        <Routes>
          {/* Customer routes */}
          <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
          <Route path="/catalog" element={<CustomerLayout><Catalog /></CustomerLayout>} />
          <Route path="/categories" element={<CustomerLayout><Categories /></CustomerLayout>} />
          <Route path="/product/:id" element={<CustomerLayout><ProductDetail /></CustomerLayout>} />
          <Route path="/cart" element={<CustomerLayout><Cart /></CustomerLayout>} />
          <Route path="/checkout" element={<CustomerLayout><Checkout /></CustomerLayout>} />
          <Route path="/order-confirmation" element={<CustomerLayout><OrderConfirmation /></CustomerLayout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<CustomerLayout><Dashboard /></CustomerLayout>} />
          <Route path="/orders" element={<CustomerLayout><Dashboard /></CustomerLayout>} />
          <Route path="/about" element={<CustomerLayout><About /></CustomerLayout>} />
          <Route path="/contact" element={<CustomerLayout><Contact /></CustomerLayout>} />
          <Route path="/privacy" element={<CustomerLayout><Privacy /></CustomerLayout>} />
          <Route path="/terms" element={<CustomerLayout><Terms /></CustomerLayout>} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductForm mode="new" />} />
            <Route path="products/edit/:id" element={<AdminProductForm mode="edit" />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="sales" element={<AdminReports />} />
            <Route path="reports" element={<AdminReportsOps />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Catch-all 404 */}
          <Route path="*" element={<CustomerLayout><NotFound /></CustomerLayout>} />
        </Routes>
      </BrowserRouter>
      </DataProvider>
    </StoreProvider>
  );
}
