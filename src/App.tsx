import { useEffect, Suspense, lazy } from 'react'; // <--- Added lazy & Suspense
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { MainLayout, ScrollToTop } from './components';
import AuthModal from './components/AuthModal';
import ProtectedRoute from './components/ProtectedRoute';

// --- STEP 1: CHANGE THE IMPORTS ---
// Instead of importing from './pages', we import each file individually.
// NOTE: If your app crashes, check these file paths! 
// (e.g., is it './pages/Home.jsx' or './pages/Home/index.jsx'?)

const Home = lazy(() => import('./pages/Home'));
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Account = lazy(() => import('./pages/Account'));
const Admin = lazy(() => import('./pages/Admin'));
const About = lazy(() => import('./pages/About'));

// --- STEP 2: CREATE A "LOADING" SCREEN ---
// This shows while the new page is downloading
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <p className="text-xl">Loading...</p>
  </div>
);

function App() {
  // Supabase connection check (kept from your original code)
  useEffect(() => {
    supabase.from('products').select('count').limit(1)
      .then(({ error }) => {
        if (!error) console.log('Supabase connected!');
      });
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <AuthModal />
          
          {/* --- STEP 3: WRAP ROUTES IN SUSPENSE --- */}
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route element={<MainLayout />}>
                
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/cart" element={<Cart />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/admin" element={<Admin />} />
                </Route>

                <Route path="*" element={<div>Page Not Found</div>} />
              
              </Route>
            </Routes>
          </Suspense>

        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;