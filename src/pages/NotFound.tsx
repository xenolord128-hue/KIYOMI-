import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { updatePageSEO } from '../utils/seoUtils';
import { 
  Compass, 
  Home, 
  ShoppingBag, 
  Search, 
  ArrowLeft,
  Truck,
  Sparkles
} from 'lucide-react';

export const NotFound: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    updatePageSEO('404 - Page Not Found', 'The requested page could not be located in the Patowary Fashion directory.');
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#F8F3EA] text-[#111827] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full text-center space-y-8">
        
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A1E54]/5 border border-[#0A1E54]/10 text-[#0A1E54] text-xs font-mono tracking-widest uppercase font-bold">
          <Compass className="w-4 h-4 text-[#C9A66B] animate-spin" style={{ animationDuration: '8s' }} />
          <span>ROUTE OUT OF BOUNDS</span>
        </div>

        {/* 404 Display */}
        <div className="space-y-2">
          <h1 className="text-7xl sm:text-9xl font-serif font-extrabold text-[#0A1E54] tracking-tight">
            4<span className="text-[#C9A66B]">0</span>4
          </h1>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0A1E54]">
            Page Not Found
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            The URL you followed might be broken, expired, or temporarily unavailable in our catalog directory.
          </p>
        </div>

        {/* Catalog Search Helper */}
        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search baggy pants, tees, hoodies..."
            className="w-full pl-5 pr-28 py-3 bg-white border border-[#0A1E54]/15 rounded-full text-xs text-[#0A1E54] font-medium shadow-xs focus:outline-none focus:border-[#0A1E54]"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#0A1E54] hover:bg-[#1A3070] text-[#F8F3EA] rounded-full text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </form>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0A1E54] hover:bg-[#1A3070] text-[#F8F3EA] text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-md active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-stone-50 text-[#0A1E54] border border-[#0A1E54]/20 text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-xs active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-[#C9A66B]" />
            <span>Continue Shopping</span>
          </Link>

          <Link
            to="/track-order"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-[#0A1E54] text-xs font-mono uppercase tracking-wider transition-all"
          >
            <Truck className="w-4 h-4 text-stone-500" />
            <span>Track Order</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
