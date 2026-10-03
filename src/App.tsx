import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

// Import Contexts
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';

// Import Layout Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { CinematicLoader } from './components/CinematicLoader';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { FloatingSupportWidget } from './components/FloatingSupportWidget';

// Import Page Views
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { ProductReviews } from './pages/ProductReviews';
import { CategoryPage } from './pages/CategoryPage';
import { Menu } from './pages/Menu';
import { Checkout } from './pages/Checkout';
import { Orders } from './pages/Orders';
import { TrackOrder } from './pages/TrackOrder';
import { Auth } from './pages/Auth';
import { AdminDashboard } from './pages/AdminDashboard';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';
import { Profile } from './pages/Profile';
import { Search } from './pages/Search';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { BrandPortfolio } from './pages/BrandPortfolio';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { NotFound } from './pages/NotFound';
import { useLanguage } from './contexts/LanguageContext';

const HashMigration: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (window.location.hash.startsWith('#/')) {
      const targetPath = window.location.hash.slice(1);
      navigate(targetPath, { replace: true });
    }
  }, [navigate]);
  return null;
};

const AnimatedAppRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 7 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="w-full flex-grow flex flex-col"
      >
        <Routes location={location}>
          {/* 1. Core Storefront Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/shop" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/product/:id/reviews" element={<ProductReviews />} />
          
          {/* 2. Category Dynamic Routes */}
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route path="/categories" element={<Menu />} />
          <Route path="/menu" element={<Menu />} />

          {/* 3. Catalog & Utility Routes */}
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />

          {/* 4. Checkout & Order Routes */}
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<Orders />} />
          <Route path="/track-order" element={<TrackOrder />} />

          {/* 5. Independent Authentication Routes */}
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/forgot-password" element={<Auth />} />
          <Route path="/auth" element={<Auth />} />

          {/* 6. User Account, Settings & Addresses Routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/:userId" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/account" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/addresses" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* 7. Information & Legal Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/brand" element={<BrandPortfolio />} />
          <Route path="/portfolio" element={<BrandPortfolio />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/privacy/" element={<PrivacyPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/privacy-policy/" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/terms/" element={<TermsOfService />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/terms-of-service/" element={<TermsOfService />} />

          {/* 8. Admin Control Routes (Role Protected) */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />

          {/* 9. Dedicated 404 Route & Catch-all */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  const [initLoading, setInitLoading] = useState(true);

  if (initLoading) {
    return <CinematicLoader onComplete={() => setInitLoading(false)} />;
  }

  return (
    <LanguageProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <BrowserRouter>
              <HashMigration />
              <div className="flex flex-col min-h-screen bg-[#F8F3EA] text-[#111827] relative selection:bg-[#0A1E54] selection:text-[#F8F3EA]">
                
                {/* Central Premium Header */}
                <Header />
  
                {/* Automatic scroll alignment */}
                <ScrollToTop />
  
                {/* Main Routing Stage with Smooth Route Fade-in Transitions */}
                <main className="flex-grow pt-24 sm:pt-28 md:pt-30 flex flex-col">
                  <AnimatedAppRoutes />
                </main>
  
                {/* Single Expandable Floating Support Widget with Headset Icon */}
                <FloatingSupportWidget />

                {/* Luxury Footer */}
                <Footer />
  
              </div>
            </BrowserRouter>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
