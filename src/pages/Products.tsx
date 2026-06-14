import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { motion } from 'motion/react';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  Compass, 
  Star,
  ArrowRight
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  // Firestore sync for real-time inventory alterations
  const [dbProducts, setDbProducts] = useState(PRODUCTS);

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
    }, (err) => {
      // Fallback is local products list
    });
    return () => unsub();
  }, []);

  const searchQuery = searchParams.get('q') || searchParams.get('search') || '';
  const showFavorites = searchParams.get('favorites') === 'true';

  // Dynamic Filtering Logic (Supports general query searches passed through search queries)
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
      // 2. Favorites constraint
      if (showFavorites && !isInWishlist(product.id)) {
        return false;
      }
      return true;
    });
  }, [dbProducts, searchQuery, showFavorites, wishlist]);

  return (
    <div id="products-catalog-view" className="bg-[#FAF9F5] min-h-screen selection:bg-black selection:text-[#D1F843] pb-24 font-sans">
      
      {/* Premium Spacious Header Banner */}
      <div className="bg-[#EFECE6] py-16 border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-12 text-center space-y-4">
          <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.4em] text-[#005840] uppercase block">
            {showFavorites ? t("YOUR CURATED WISHLIST INDEX") : t("EXCLUSIVE PREMIUM GADGET SPECIMENS")}
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif tracking-[0.1em] text-[#192D3C] uppercase font-light leading-none">
            {showFavorites ? t("SAVED ITEMS & WISHLIST") : searchQuery ? `${t("RESULTS FOR:")} "${searchQuery}"` : t("KIYOMI CATALOG")}
          </h2>
          <p className="text-stone-550 font-sans text-xs sm:text-sm max-w-xl mx-auto font-medium tracking-wide leading-relaxed">
            {showFavorites 
              ? 'Items flagged for potential delivery acquisition.' 
              : 'Explore next-generation premium smartwatches, earbuds, high-performance keyboards, fast chargers, and smart electronics.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-12 py-16">
        <div className="space-y-8">
          
          {/* Header row displaying the item counts and simple feedback */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between sm:items-center bg-white border border-stone-200/60 p-5 rounded-2xl text-xs font-mono text-stone-700 shadow-sm">
            <span className="tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#43e6a2] animate-pulse" />
              SHOWING <strong className="font-bold text-[#192D3C]">{filteredProducts.length}</strong> PREMIUM INVENTORY SPECIMENS
            </span>
            {showFavorites && (
              <Link to="/products" className="text-[#005840] font-bold hover:underline tracking-widest uppercase text-[10px] flex items-center gap-1">
                View Full Store Catalog <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
            <span className="text-stone-500 hidden md:inline text-[10px] uppercase tracking-widest">
              USE CODE <strong className="text-black bg-[#D1F843] px-1 rounded-sm font-bold">KIYOMIVIP</strong> IN BAG
            </span>
          </div>

          {/* Core products layout list (Unified clean 4-column product grid to arrange beautifully) */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-stone-200/50 rounded-3xl p-20 text-center space-y-6 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#EFECE6] flex items-center justify-center text-stone-400 mx-auto">
                <Compass className="w-8 h-8 text-[#005840]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-mono tracking-widest uppercase font-bold text-[#192D3C]">NO GADGET PRODUCTS MATCH INDEX</h3>
                <p className="text-stone-550 font-sans text-xs max-w-sm mx-auto leading-relaxed">
                  The requested search yield is currently vacant. Click below to return to the catalog.
                </p>
              </div>
              <Link
                to="/products"
                className="inline-block bg-[#192D3C] hover:bg-black text-[#D1F843] text-[10px] font-mono tracking-widest uppercase font-bold py-3.5 px-8 rounded-full transition-all hover:scale-105 active:scale-95 shadow-md"
              >
                DISMISS ACTIVE FILTER SEARCH
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-2.5 gap-y-6 sm:gap-x-4 sm:gap-y-8 md:gap-x-5 md:gap-y-10">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  whileHover={{ y: -8, scale: 1.04, rotate: -0.5, boxShadow: "0 20px 30px rgba(0, 0, 0, 0.08)" }}
                  transition={{ 
                    type: "spring",
                    stiffness: 280,
                    damping: 22
                  }}
                  style={{ willChange: "transform" }}
                  className="group flex flex-col bg-white border border-stone-200/70 relative overflow-hidden p-3 rounded-2xl border-b-2 border-b-black/[0.12] transition-all duration-300"
                >
                  {/* Image Overlay Frame */}
                  <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-[#FAF9F5] rounded-lg cursor-pointer">
                    <img
                      src={product.assets[0]}
                      alt={product.title}
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-104 animate-fade-in"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Compact stock warnings */}
                    {product.stock && product.stock <= 5 ? (
                      <span className="absolute top-2 left-2 bg-deep-emerald text-lime-neon font-mono text-[6.5px] uppercase px-1.5 py-0.5 tracking-wider font-extrabold rounded">
                        LTD ({product.stock})
                      </span>
                    ) : null}

                    {/* Quick view detail layer */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white/95 text-stone-900 border border-stone-200 py-1.5 px-3 text-[9px] font-mono tracking-widest uppercase scale-95 transition-all group-hover:scale-100 rounded shadow-xs">
                        {t("VIEW")}
                      </span>
                    </div>
                  </Link>

                  {/* Info block */}
                  <div className="pt-2.5 space-y-1 flex-grow flex flex-col justify-between font-sans">
                    <div>
                      <div className="flex items-center justify-between text-[8px] sm:text-[9.5px] font-mono font-bold tracking-wider uppercase text-stone-500">
                        <p className="truncate max-w-[60%]">{t(product.category)}</p>
                        <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#003E2C] shrink-0">৳ {product.price}</span>
                      </div>
                      <Link to={`/product/${product.id}`} className="block mt-0.5">
                        <h4 className="text-[11px] sm:text-[13px] font-serif italic text-stone-900 hover:text-emerald-800 tracking-wide transition-colors truncate">
                          {product.title}
                        </h4>
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-1 mt-auto">
                      {/* Left: Quick Save */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          toggleWishlist(product);
                          playCinematicIntroSound(isInWishlist(product.id) ? "Removed from targets" : "Saved to wish targets");
                        }}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer active:scale-95 flex items-center justify-center ${
                          isInWishlist(product.id) 
                            ? 'bg-[#966b26] border-[#966b26] text-white' 
                            : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                        }`}
                        title="Toggle Wishlist"
                      >
                        <Heart className="w-3 h-3 fill-current" />
                      </button>

                      {/* Right: Buy/Details */}
                      <Link 
                        to={`/product/${product.id}`}
                        className="flex-grow text-center py-1.5 px-2 bg-[#CBF23D] hover:bg-[#003E2C] hover:text-white text-[#0C1E1F] font-bold text-[9px] uppercase tracking-wider transition-all rounded-lg flex items-center justify-center gap-0.5 hover:shadow-xs cursor-pointer"
                      >
                        <span>{t("BUY")}</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
