import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { 
  Search as SearchIcon, 
  Heart, 
  ArrowLeft,
  X,
  TrendingUp,
  ShoppingBag
} from 'lucide-react';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { useLanguage } from '../contexts/LanguageContext';

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const [dbProducts, setDbProducts] = useState(PRODUCTS);
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');

  // Firestore Sync
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (!snapshot.empty) {
        const prodArr: any[] = [];
        snapshot.forEach((doc) => {
          prodArr.push(doc.data());
        });
        prodArr.sort((a,b) => a.id - b.id);
        setDbProducts(prodArr);
      }
    }, (err) => {});
    return () => unsub();
  }, []);

  // Handle live calculation
  const filteredProducts = useMemo(() => {
    if (!searchInput.trim()) return dbProducts;
    return dbProducts.filter((product) => {
      return product.title.toUpperCase().includes(searchInput.trim().toUpperCase()) ||
             product.category.toUpperCase().includes(searchInput.trim().toUpperCase()) ||
             product.description.toUpperCase().includes(searchInput.trim().toUpperCase());
    });
  }, [dbProducts, searchInput]);

  const trendingTags = ['Heavy French Terry', 'Drop-Shoulder', 'Linen', 'Cargo', 'Tactical', 'Heritage'];

  const selectTag = (tag: string) => {
    setSearchInput(tag);
  };

  const handleQuickAdd = (product: any) => {
    const defaultVariant = product.variants.find((v: string) => !product.outOfStock.includes(v)) || product.variants[0];
    addToCart(product, defaultVariant, 1);
    playCinematicIntroSound(`Added size ${defaultVariant} to bag.`);
  };

  return (
    <div id="search-page-stage" className="min-h-screen bg-[#FAF9F5] py-12 md:py-16 selection:bg-black selection:text-[#D1F843] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-12">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#005840] uppercase font-bold hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Head back to landing
          </Link>
        </div>

        {/* Header Title Section */}
        <div className="border-b border-stone-200/60 pb-6 mb-10">
          <h1 className="text-2xl sm:text-4xl font-serif tracking-[0.2em] text-[#192D3C] uppercase font-light leading-none">
            SEARCH &amp; EXPLORE
          </h1>
          <p className="text-[10px] sm:text-xs font-mono tracking-widest mt-3.5 uppercase text-stone-500">
            DISCOVER SEASONS FABRICS &bull; REAL-TIME INVENTORY ALTERATIONS
          </p>
        </div>

        {/* Large search interaction input bar with rounded organic shape */}
        <div className="relative mb-8 bg-white border border-stone-200 rounded-2xl overflow-hidden flex items-center shadow-sm focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
          <div className="pl-5 shrink-0">
            <SearchIcon className="w-5 h-5 text-stone-500" />
          </div>
          <input 
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t("ENTER GADGET SPECIMENS OR PREMIUM KEYWORDS...")}
            className="w-full bg-transparent px-4 py-5 text-xs sm:text-sm font-sans tracking-widest uppercase focus:outline-none placeholder-stone-400 font-medium text-stone-850"
          />
          {searchInput && (
            <button 
              onClick={() => setSearchInput('')}
              className="pr-5 text-stone-400 hover:text-stone-700 font-bold p-2 text-xs font-mono transition-all"
              aria-label="Clear Search Input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Trending Tags Row */}
        <div className="flex flex-wrap items-center gap-2 mb-10 font-mono text-[9px] sm:text-[10px]">
          <span className="text-stone-400 uppercase tracking-widest flex items-center gap-1.5 font-bold mr-1">
            <TrendingUp className="w-4 h-4 text-[#005840]" /> TRENDING KEYWORDS:
          </span>
          {trendingTags.map((tag) => (
            <button
              key={tag}
              onClick={() => selectTag(tag)}
              className={`px-3.5 py-1.5 border transition-all rounded-full uppercase cursor-pointer ${
                searchInput.toUpperCase() === tag.toUpperCase()
                  ? 'bg-black text-[#D1F843] border-transparent font-bold shadow-sm'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:bg-stone-50'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          
          {/* Found elements count banner */}
          <div className="flex justify-between items-center text-[10px] sm:text-xs font-mono border-b border-stone-200/60 pb-3">
            <span className="text-stone-400 font-bold uppercase tracking-widest">FOUND SPECIMENS</span>
            <span className="text-[#005840] font-bold tracking-widest">{filteredProducts.length} SYSTEM MATCHES</span>
          </div>

          {/* Results grid container in full width, beautifully structured 4-column layout */}
          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center space-y-5 bg-white border border-stone-200/50 rounded-3xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mx-auto">
                <SearchIcon className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-mono tracking-widest uppercase text-stone-550 font-bold">
                No Specimens Match Your Search Query
              </h4>
              <p className="text-stone-500 font-sans text-xs max-w-sm mx-auto leading-relaxed">
                Refine your search parameters, adjust typography keywords, or look up alternative categories in our main directory.
              </p>
              <button
                onClick={() => setSearchInput('')}
                className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#005840] hover:underline"
              >
                Clear active search input
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => {
                const isFavorited = isInWishlist(product.id);
                const outOfStockAny = product.variants.every((v: string) => product.outOfStock.includes(v));

                return (
                  <div 
                    key={product.id} 
                    className="group bg-white border border-stone-200/40 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-[#005840]/5 h-full"
                  >
                    {/* Image frame */}
                    <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden shrink-0 rounded-t-2xl">
                      <img 
                        src={product.assets[0]} 
                        alt={product.title} 
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Wishlist Heart action button */}
                      <button
                        onClick={() => {
                          toggleWishlist(product);
                          playCinematicIntroSound(isFavorited ? "Removed from targets" : "Saved to wish targets");
                        }}
                        className="absolute top-3.5 right-3.5 p-2 bg-white/95 text-stone-500 hover:text-rose-600 transition-all shadow-md rounded-full cursor-pointer active:scale-95"
                        title="Add to wishlist"
                      >
                        <Heart className={`w-3.5 h-3.5 transition-colors ${isFavorited ? 'fill-red-650 text-red-650' : 'text-stone-500'}`} />
                      </button>

                      {outOfStockAny && (
                        <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                          <span className="text-[9px] font-mono tracking-widest bg-stone-900 text-white py-1 px-2 uppercase font-extrabold rounded-sm shadow-sm">
                            OUT OF STOCK
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info and price context */}
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                      <div>
                        <div className="text-[8.5px] font-mono tracking-widest text-[#005840] uppercase font-bold mb-1">
                          {product.category}
                        </div>
                        <h3 className="text-base font-serif italic text-[#192D3C] hover:text-[#005840] tracking-wide transition-colors leading-tight line-clamp-2">
                          <Link to={`/product/${product.id}`} className="hover:text-[#005840] transition-colors">
                            {product.title}
                          </Link>
                        </h3>
                      </div>

                      <div className="pt-3.5 border-t border-stone-100 flex items-center justify-between mt-auto">
                        <span className="text-xs sm:text-sm font-mono font-bold text-[#192D3C]">
                          BDT {product.price.toLocaleString()}
                        </span>
                        
                        <button
                          onClick={() => handleQuickAdd(product)}
                          disabled={outOfStockAny}
                          className="bg-black hover:bg-[#005840] disabled:bg-stone-200 disabled:text-stone-400 text-white hover:text-[#D1F843] text-[9.5px] font-mono tracking-widest px-3.5 py-2 rounded-xl font-bold uppercase transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed"
                        >
                          BAG +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
