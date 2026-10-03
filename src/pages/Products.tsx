import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { RAW_PRODUCTS } from '../data/products';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { motion } from 'motion/react';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  Star,
  ArrowRight,
  Filter,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';
import { Product } from '../types';

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const [dbProducts, setDbProducts] = useState<Product[]>(() => {
    const cached = localStorage.getItem('patowary_local_products');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return RAW_PRODUCTS;
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (!snapshot.empty) {
        const prodArr: Product[] = [];
        snapshot.forEach((doc) => {
          prodArr.push(doc.data() as Product);
        });
        prodArr.sort((a, b) => a.id - b.id);
        setDbProducts(prodArr);
        localStorage.setItem('patowary_local_products', JSON.stringify(prodArr));
      } else {
        setDbProducts(RAW_PRODUCTS);
      }
    }, () => {
      const cached = localStorage.getItem('patowary_local_products');
      if (cached) {
        try {
          setDbProducts(JSON.parse(cached));
        } catch (e) {}
      }
    });
    return () => unsub();
  }, []);

  const searchQuery = searchParams.get('q') || searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'All';
  const showFavorites = searchParams.get('favorites') === 'true';

  const categories = [
    "All",
    "Baggy & Cargo Pants",
    "Oversized Tees & Polos",
    "Hoodies & Sweatshirts",
    "Women's Collection",
    "Accessories & Lifestyle"
  ];

  const handleCategoryChange = (cat: string) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    setSearchParams(params);
  };

  const filteredProducts = useMemo(() => {
    return dbProducts.filter((product) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const s = searchQuery.toLowerCase();
        const matchTitle = product.title.toLowerCase().includes(s);
        const matchDesc = product.description.toLowerCase().includes(s);
        const matchCat = product.category.toLowerCase().includes(s);
        if (!matchTitle && !matchDesc && !matchCat) return false;
      }
      // 2. Category Filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      // 3. Favorites constraint
      if (showFavorites && !isInWishlist(product.id)) {
        return false;
      }
      return true;
    });
  }, [dbProducts, searchQuery, selectedCategory, showFavorites, wishlist]);

  return (
    <div id="products-catalog-view" className="bg-[#F8F3EA] min-h-screen text-[#111827] pb-24 font-sans">
      
      {/* Header Banner */}
      <div className="bg-[#0A1E54] text-[#F8F3EA] py-14 px-4 sm:px-8 border-b border-[#1A3070]">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-xs font-mono font-bold tracking-[0.3em] text-[#C9A66B] uppercase block">
            {showFavorites ? t("SAVED WISHLIST") : t("PATOWARY FASHION STREETWEAR")}
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white uppercase tracking-tight">
            {showFavorites 
              ? t("Your Saved Items") 
              : searchQuery 
                ? `${t("Search:")} "${searchQuery}"` 
                : selectedCategory !== 'All' 
                  ? t(selectedCategory) 
                  : t("Trending Fashion Catalog")}
          </h1>
          <p className="text-white/80 text-xs sm:text-sm max-w-xl mx-auto font-normal leading-relaxed">
            {showFavorites 
              ? t("Items flagged for future purchase. Add to bag anytime.")
              : t("Explore heavy-twill baggy cargo pants, wide-leg denims, 260 GSM oversized tees, and luxury accessories.")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        
        {/* Category Filter Pills & Counter Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center bg-white/80 backdrop-blur-md border border-white p-4 rounded-2xl shadow-xs mb-8">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-[#0A1E54] text-[#F8F3EA] shadow-xs' 
                    : 'bg-stone-100/80 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {cat === 'All' ? t("All Items") : t(cat)}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 text-xs font-mono text-stone-600 shrink-0">
            <span>
              SHOWING <strong className="text-[#0A1E54]">{filteredProducts.length}</strong> PRODUCTS
            </span>
            <span className="hidden lg:inline bg-[#F8F3EA] border border-[#C9A66B]/40 text-[#0A1E54] px-2 py-1 rounded-md text-[11px] font-bold">
              USE COUPON: PATOWARY10
            </span>
          </div>
        </div>

        {/* Empty Search / Filter State */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-md border border-white rounded-3xl p-16 text-center space-y-4 shadow-sm max-w-lg mx-auto">
            <h3 className="text-base font-bold text-[#0A1E54]">
              {t("No products found in this selection")}
            </h3>
            <p className="text-xs text-stone-600">
              {t("Try clearing your search query or selecting a different category.")}
            </p>
            <button
              onClick={() => {
                setSearchParams({});
              }}
              className="px-6 py-2.5 bg-[#0A1E54] hover:bg-[#1A3070] text-white text-xs font-bold uppercase rounded-xl transition-all shadow-sm cursor-pointer"
            >
              {t("Reset Filters")}
            </button>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => {
              const isWish = isInWishlist(product.id);

              return (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group cursor-pointer border border-white hover:border-[#C9A66B]/50 shadow-xs hover:shadow-md transition-all"
                >
                  {/* Image Frame (4:4 Ratio / aspect-square for luxury presentation) */}
                  <div className="relative aspect-square bg-stone-100 overflow-hidden">
                    <img
                      src={product.assets[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />

                    {/* Category Tag */}
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-md text-[#0A1E54] text-[9px] font-mono uppercase font-bold tracking-wider">
                      {product.category.split(' ')[0]}
                    </span>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                        playCinematicIntroSound(isWish ? "Removed from wishlist" : "Saved to wishlist");
                      }}
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-md shadow-xs transition-transform active:scale-90 cursor-pointer"
                      aria-label="Wishlist toggle"
                    >
                      <Heart 
                        className={`w-4 h-4 transition-colors ${isWish ? 'fill-red-500 text-red-500' : 'text-stone-700'}`} 
                      />
                    </button>

                    {/* Real Rating Badge (Only if genuine reviews exist) */}
                    {product.reviews && product.reviews.length > 0 && (
                      <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#C9A66B] text-[#C9A66B]" />
                        <span>{(product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  {/* Info Section */}
                  <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 text-left">
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-[#111827] line-clamp-2 leading-snug group-hover:text-[#0A1E54] transition-colors">
                        {product.title}
                      </h3>

                      {product.variants.length > 0 && (
                        <div className="flex items-center gap-1 mt-2 overflow-hidden">
                          {product.variants.slice(0, 3).map((v) => (
                            <span 
                              key={v}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200"
                            >
                              {v.split(' ')[0]}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-stone-200/50 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-stone-500 block uppercase font-mono tracking-wider">{t("Price")}</span>
                        <span className="text-sm sm:text-base font-bold text-[#0A1E54] font-mono">
                          ৳ {product.price.toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product, product.variants[0] || 'Standard', 1);
                          playCinematicIntroSound(`${product.title} added to bag`);
                        }}
                        className="p-2 sm:px-3 sm:py-2 bg-[#0A1E54] hover:bg-[#1A3070] text-white rounded-xl flex items-center gap-1.5 text-xs font-semibold shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                        aria-label="Add to cart"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{t("Add to Bag")}</span>
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
  );
};
