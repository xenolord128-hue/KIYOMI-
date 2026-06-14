import React from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';

export const Wishlist: React.FC = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleQuickAdd = (product: any) => {
    // Select first available variant in stock
    const availableVariant = product.variants.find((v: string) => !product.outOfStock.includes(v)) || product.variants[0];
    addToCart(product, availableVariant, 1);
  };

  return (
    <div id="wishlist-page-stage" className="min-h-screen bg-[#FDFBF7] py-12 md:py-16 selection:bg-[#0F2C2E] selection:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-12">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link 
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#2d728f] uppercase font-bold hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Explore Collection Catalog
          </Link>
        </div>

        {/* Header section */}
        <div className="border-b border-stone-200 pb-6 mb-10">
          <h1 className="text-2xl sm:text-3xl font-serif tracking-[0.25em] text-[#0f2c2e] uppercase font-light">
            YOUR CURATED WISHLIST
          </h1>
          <p className="text-[10px] sm:text-xs font-mono tracking-widest text-stone-500 uppercase mt-2">
            Items Flagged For Potential Acquisition &bull; KIYOMI GUILD MEMBER EXCLUSIVE
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="py-20 text-center space-y-6 bg-white/40 border border-stone-200/50 p-8 rounded">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-rose-300 mx-auto">
              <Heart className="w-8 h-8 fill-rose-100" />
            </div>
            <h3 className="text-xs font-mono tracking-widest uppercase font-bold text-[#0f2c2e]">YOUR WISHLIST IS COMPLETELY EMPTY</h3>
            <p className="text-stone-500 text-xs font-sans max-w-sm mx-auto leading-relaxed">
              Tag items during exploration to organize shipping and collection candidates. Start adding premium gadgets now.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="border border-[#0f2c2e] hover:bg-[#0f2c2e] hover:text-[#fbf9f5] text-[#0f2c2e] text-[10px] font-mono tracking-widest uppercase font-bold py-3 px-8 rounded transition-all transform hover:scale-[1.02]"
            >
              BROWSE DROPS CATALOG
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {wishlist.map((product) => {
              const outOfStockAny = product.variants.every((v: string) => product.outOfStock.includes(v));

              return (
                <div 
                  key={product.id} 
                  className="group bg-white border border-stone-200/60 rounded overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-stone-300 h-full"
                >
                  {/* Photo area */}
                  <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden shrink-0">
                    <img 
                      src={product.assets[0]} 
                      alt={product.title} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Remove Overlay heart */}
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-3 right-3 p-2 bg-white/85 hover:bg-rose-50 rounded-full transition-all text-rose-600 shadow-md transform hover:scale-110"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {outOfStockAny && (
                      <div className="absolute inset-0 bg-[#FDFBF7]/85 backdrop-blur-3xs flex items-center justify-center">
                        <span className="text-[9px] font-mono tracking-[0.25em] bg-[#0f2c2e] text-white py-1 px-3 text-center uppercase font-extrabold rounded-none">
                          SOLD OUT TEMPORARILY
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body content */}
                  <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="text-[9px] font-mono tracking-widest text-[#2d728f] uppercase font-bold mb-1">
                        {product.category}
                      </div>

                      <h3 className="text-xs sm:text-sm font-serif font-semibold text-[#0f2c2e] tracking-tight leading-snug line-clamp-2">
                        <Link to={`/product/${product.id}`} className="hover:text-[#2d728f] transition-colors">
                          {product.title}
                        </Link>
                      </h3>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-1.5">
                      {/* Price matrix */}
                      <div>
                        <span className="text-[8px] font-mono text-stone-400 block uppercase">PRICE</span>
                        <span className="text-xs font-mono font-extrabold text-[#0f2c2e]">
                          BDT {product.price}
                        </span>
                      </div>

                      {/* Moving direct to Cart */}
                      <button
                        onClick={() => handleQuickAdd(product)}
                        disabled={outOfStockAny}
                        className="bg-[#0f2c2e] text-white hover:bg-[#1C4E52] disabled:bg-stone-300 disabled:text-stone-500 text-[10px] items-center gap-1.5 font-mono tracking-widest px-3 py-2 rounded font-bold transition-all flex select-none uppercase cursor-pointer"
                        title="Add first size variant to bag"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" /> ADD TO BAG
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
