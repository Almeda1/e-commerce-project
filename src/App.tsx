import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { MainLayout, ScrollToTop } from './components';
import AuthModal from './components/AuthModal';
import ProtectedRoute from './components/ProtectedRoute';

// --- HYBRID IMPORT STRATEGY ---

// 1. STANDARD IMPORT: The Home page
// We import this normally so the user sees the landing page INSTANTLY (no loading spinner).
// Note: Make sure './pages/Home' points to your actual Home file location.
import Home from './pages/Home'; 

// 2. DYNAMIC IMPORTS: Secondary Pages
// These are split into separate chunks and only load when the user clicks a link.
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Account = lazy(() => import('./pages/Account'));
const Admin = lazy(() => import('./pages/Admin'));
const About = lazy(() => import('./pages/About'));

// A sleek loading indicator for when users navigate between lazy pages
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-2">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-gray-500 text-sm font-medium">Loading...</p>
    </div>
  </div>
);

function AppRoutes() {
  return (
    // We wrap Routes in Suspense to handle the lazy-loaded components
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* --- MAIN APP ROUTES WITH NAVBAR/LAYOUT --- */}
        <Route element={<MainLayout />}>
          
          {/* Home loads instantly (Standard Import) */}
          <Route path="/" element={<Home />} />

          {/* These pages will trigger the PageLoader briefly on first visit */}
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/account" element={<Account />} />
            <Route path="/admin" element={<Admin />} />
          </Route>

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <div className="text-center py-20">
                <span className="text-6xl mb-4 block">🔍</span>
                <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
                <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
              </div>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
}

function App() {
  // Supabase Connection Test
  useEffect(() => {
    // Optional: You can keep or remove this logging for production
    supabase.from('products').select('count').limit(1)
      .then(({ error }) => {
        if (error) console.warn('Supabase check failed:', error.message);
        else console.log('Supabase connected successfully.');
      });
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <AuthModal />
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;