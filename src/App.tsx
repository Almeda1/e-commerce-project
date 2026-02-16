import { useEffect } from 'react'; // <--- Import useEffect
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabase'; // <--- Import your Supabase client
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { MainLayout, ScrollToTop } from './components';
import AuthModal from './components/AuthModal';
import ProtectedRoute from './components/ProtectedRoute';
import { 
  Home, 
  ProductList, 
  ProductDetails,
  Cart,
  Checkout,
  Account,
  Admin,
  About 
} from './pages'; 

function AppRoutes() {
  return (
    <Routes>
      {/* --- MAIN APP ROUTES WITH NAVBAR/LAYOUT --- */}
      <Route element={<MainLayout />}>
        
        {/* Home / Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Shop Pages */}
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        {/* About */}
        <Route path="/about" element={<About />} />

        {/* Transaction Pages */}
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
  );
}

function App() {
  // <--- Supabase Connection Test
  useEffect(() => {
    console.log('Testing Supabase Connection...');
    console.log('Supabase Client:', supabase);
    
    // Optional: Quick connectivity check
    supabase.from('products').select('count').limit(1)
      .then(({ error }) => {
        if (error) console.warn('Supabase connected, but table fetch failed (likely just missing table):', error.message);
        else console.log('Supabase Connection successful!');
      });
  }, []);

  return (
    // Only keep BrowserRouter here if it is NOT in main.tsx
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