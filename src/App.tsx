import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

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
import { Facebook } from 'lucide-react';

// Import Page Views
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Checkout } from './pages/Checkout';
import { TrackOrder } from './pages/TrackOrder';
import { Auth } from './pages/Auth';
import { AdminDashboard } from './pages/AdminDashboard';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';
import { Profile } from './pages/Profile';
import { Search } from './pages/Search';
import { BrandPortfolio } from './pages/BrandPortfolio';
import { useLanguage } from './contexts/LanguageContext';

const FloatingButtons: React.FC = () => {
  const { t } = useLanguage();
  return (
    <>
      {/* Global Floating Facebook Bubble Button */}
      <a
        href="https://www.facebook.com/share/19JHtW2Eft/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-[92px] right-6 z-50 bg-[#1877F2] hover:bg-[#166fe5] text-white p-4 rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 group animate-bounce"
        aria-label="Connect with Kiyomi Facebook page"
        title="Connect via Facebook"
      >
        <Facebook className="w-5 h-5 text-white" />
        <span className="absolute right-14 bg-[#0C1E1F] text-[#CBF23D] text-[9px] font-mono font-extrabold uppercase px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-[#D1F843]/20">
          {t("FACEBOOK PAGE / ফেসবুক পেজ")}
        </span>
      </a>

      {/* Global Floating WhatsApp Bubble Button */}
      <a
        href="https://wa.me/8801633701001"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#1ebd54] text-white p-4 rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 group"
        aria-label="Connect with Kiyomi WhatsApp support"
        title="Connect via WhatsApp"
      >
        <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
           <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.324 5.328 0 11.81 0c3.142.001 6.098 1.222 8.322 3.448 2.224 2.225 3.443 5.18 3.443 8.322-.002 6.486-5.328 11.812-11.81 11.812-2.001-.001-3.97-.513-5.727-1.488L0 24zm6.49-4.22c1.54.916 3.51 1.455 5.253 1.456 5.378 0 9.754-4.373 9.756-9.75c.002-2.603-1.01-5.051-2.85-6.892C16.806 2.753 14.36 1.74 11.81 1.74c-5.38 0-9.755 4.375-9.757 9.75-.001 1.84.482 3.633 1.398 5.197L2.483 20.82l4.064-1.04zm11.395-5.36c-.295-.148-1.745-.862-2.013-.96-.268-.099-.463-.148-.658.148-.195.297-.756.96-.926 1.157-.17.198-.34.222-.636.074-.296-.148-1.25-.46-2.38-1.47-.88-.784-1.474-1.751-1.647-2.047-.172-.296-.018-.456.13-.603.133-.133.296-.34.444-.51.148-.17.197-.29.295-.49.099-.199.05-.373-.025-.52-.075-.148-.658-1.587-.902-2.172-.237-.57-.48-.492-.66-.502-.17-.008-.364-.01-.559-.01-.195 0-.511.073-.778.362-.268.29-.988.966-.988 2.355 0 1.39 1.012 2.73 1.157 2.928.145.197 1.992 3.042 4.825 4.26.674.29 1.2.463 1.61.593.678.215 1.294.185 1.782.112.543-.081 1.744-.713 1.992-1.401.248-.69.248-1.282.173-1.402-.073-.12-.268-.19-.564-.34z"/>
        </svg>
        <span className="absolute right-14 bg-[#0C1E1F] text-[#CBF23D] text-[9px] font-mono font-extrabold uppercase px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-[#D1F843]/20">
          {t("MESSAGE SUPPORT / হোয়াটসঅ্যাপ")}
        </span>
      </a>
    </>
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
            <HashRouter>
              <div className="flex flex-col min-h-screen bg-soft-mint relative selection:bg-deep-emerald selection:text-lime-neon">
                
                {/* Central Premium Header */}
                <Header />
  
                {/* Automatic scroll alignment */}
                <ScrollToTop />
  
                {/* Main Routing Stage */}
                <main className="flex-grow pt-20">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/track-order" element={<TrackOrder />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/brand" element={<BrandPortfolio />} />
                    <Route path="/portfolio" element={<BrandPortfolio />} />
                  </Routes>
                </main>
  
                {/* Luxury Footer */}
                <Footer />
  
                {/* Dynamic Contact Actions */}
                <FloatingButtons />

  
              </div>
            </HashRouter>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
