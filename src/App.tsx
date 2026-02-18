import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Toaster } from 'react-hot-toast';

// --- CONTEXT PROVIDERS ---
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// --- COMPONENTS ---
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AuthModal from './components/AuthModal';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

// --- HYBRID IMPORT STRATEGY ---

// 1. STANDARD IMPORT: The Home page
// We import Home normally so the first paint is INSTANT.
import Home from './pages/Home'; 

// 2. DYNAMIC IMPORTS: Secondary Pages
// These align with the prefetching logic in your Navbar and ProductDetails.
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Account = lazy(() => import('./pages/Account'));
const Admin = lazy(() => import('./pages/Admin'));
const About = lazy(() => import('./pages/About'));

// --- LOADING UI ---
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-2">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Loading</p>
    </div>
  </div>
);

// --- ROUTES CONFIGURATION ---
function AppRoutes() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Suspense keeps the old page visible or shows a spinner while the new one loads */}
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />

            {/* Checkout Route 
               (Note: If you want Guest Checkout, move this outside ProtectedRoute) 
            */}
            <Route element={<ProtectedRoute />}>
               <Route path="/checkout" element={<Checkout />} />
               <Route path="/account" element={<Account />} />
               <Route path="/admin" element={<Admin />} />
            </Route>

            {/* 404 Page */}
            <Route
              path="*"
              element={
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                  <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">search_off</span>
                  <h2 className="text-xl font-light text-gray-900 tracking-widest uppercase">Page Not Found</h2>
                  <p className="text-xs text-gray-500 mt-2">The page you're looking for doesn't exist.</p>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

// --- MAIN APP COMPONENT ---
function App() {
  // Optional: Connection Check
  useEffect(() => {
    supabase.from('products').select('count').limit(1)
      .then(({ error }) => {
        if (error) console.warn('Supabase check failed:', error.message);
      });
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <Toaster position="bottom-right" toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
              fontSize: '12px',
              borderRadius: '0px',
              padding: '12px 24px',
            },
          }}/>
          <AuthModal />
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;