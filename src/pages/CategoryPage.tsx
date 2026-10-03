import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { RAW_PRODUCTS } from '../data/products';
import { Product } from '../types';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { CATEGORY_SLUG_MAP, slugify, getProductUrl } from '../utils/slugUtils';
import { updatePageSEO } from '../utils/seoUtils';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  ArrowLeft, 
  SlidersHorizontal,
  ChevronRight,
  PackageX,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Baggy & Cargo Pants": "Heavy-twill utility trousers, 6-pocket cargo fits, and relaxed skater denim designed for modern urban streetwear.",
  "Oversized Tees & Polos": "260 GSM combed cotton drop-shoulder tees, boxy silhouettes, and knit streetwear polos.",
  "Hoodies & Sweatshirts": "Heavyweight French terry fleece hoodies with double-lined hoods and contemporary relaxed drape.",
  "Women's Collection": "Elevated streetwear essentials crafted for women, featuring wide-leg trousers, cropped boxy cuts, and tailored fleece.",
  "Accessories & Lifestyle": "Premium tactical crossbodies, vintage washed headwear, and curated streetwear lifestyle essentials."
};

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { t } = useLanguage();
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [dbProducts, setDbProducts] = useState<Product[]>(() => {
    const cached = localStorage.getItem('patowary_local_products');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    return RAW_PRODUCTS;
  });

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [filterStock, setFilterStock] = useState<boolean>(false);

  // Firestore sync for real-time products
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
      }
    }, () => {});
    return () => unsub();
  }, []);

  // Resolve Category Name from Slug
  const categoryName = useMemo(() => {
    if (!categorySlug) return 'All';
    const cleanSlug = categorySlug.toLowerCase().trim();
    
    // Check known map first
    if (CATEGORY_SLUG_MAP[cleanSlug]) {
      return CATEGORY_SLUG_MAP[cleanSlug];
    }
    
    // Match against products categories
    const allCategories: string[] = Array.from(new Set(dbProducts.map(p => p.category)));
    const match = allCategories.find(c => slugify(c) === cleanSlug);
    if (match) return match;

    // Convert slug hyphens to title case
    return cleanSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, [categorySlug, dbProducts]);

  // Update SEO
  useEffect(() => {
    const title = `${categoryName} Collection`;
    const desc = CATEGORY_DESCRIPTIONS[categoryName] || `Shop ${categoryName} from Patowary Fashion. Authentic streetwear in Bangladesh.`;
    updatePageSEO(title, desc);
  }, [categoryName]);

  // Filter products by category
  const filteredProducts = useMemo(() => {
    let list = dbProducts.filter(p => {
      if (!categorySlug) return true;
      const cleanSlug = categorySlug.toLowerCase().trim();
      return p.category.toLowerCase() === categoryName.toLowerCase() || slugify(p.category) === cleanSlug;
    });

    if (filterStock) {
      list = list.filter(p => p.stock === undefined || p.stock > 0);
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    return list;
  }, [dbProducts, categoryName, categorySlug, sortBy, filterStock]);

  const allAvailableCategories = [
    { name: "Baggy & Cargo Pants", slug: "baggy-cargo-pants" },
    { name: "Oversized Tees & Polos", slug: "oversized-tees-polos" },
    { name: "Hoodies & Sweatshirts", slug: "hoodies-sweatshirts" },
    { name: "Women's Collection", slug: "womens-collection" },
    { name: "Accessories & Lifestyle", slug: "accessories-lifestyle" }
  ];

  return (
    <div className="min-h-screen bg-[#F8F3EA] text-[#111827] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-500">
          <Link to="/" className="hover:text-[#0A1E54] transition-colors">{t("Home")}</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link to="/products" className="hover:text-[#0A1E54] transition-colors">{t("Products")}</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-[#0A1E54] font-bold">{categoryName}</span>
        </nav>

        {/* Category Hero Banner */}
        <div className="bg-[#0A1E54] text-[#F8F3EA] rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl border border-[#C9A66B]/20">
          <div className="relative z-10 max-w-2xl text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A66B] text-[10px] font-mono tracking-widest uppercase font-bold border border-white/10">
              <Sparkles className="w-3 h-3 text-[#C9A66B]" />
              <span>{t("CURATED STREETWEAR DROP")}</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white">
              {categoryName}
            </h1>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans max-w-xl">
              {CATEGORY_DESCRIPTIONS[categoryName] || t("Discover our handcrafted premium fits designed for everyday luxury and effortless style.")}
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-[#C9A66B]">
              <span>{filteredProducts.length} {t("Products Available")}</span>
              <span>•</span>
              <span>100% {t("Authentic Fabrics")}</span>
            </div>
          </div>

          {/* Decorative background flare */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#C9A66B]/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Category Pills Bar for Quick Switching */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Link
            to="/products"
            className="px-4 py-2 rounded-full text-xs font-mono tracking-wider whitespace-nowrap bg-white/80 hover:bg-white text-[#0A1E54] border border-[#0A1E54]/10 transition-all shadow-xs"
          >
            {t("All Products")}
          </Link>
          {allAvailableCategories.map((cat) => {
            const isActive = cat.slug === categorySlug || cat.name === categoryName;
            return (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider whitespace-nowrap transition-all shadow-xs ${
                  isActive
                    ? 'bg-[#0A1E54] text-[#C9A66B] font-bold border border-[#C9A66B]/40'
                    : 'bg-white/80 hover:bg-white text-[#0A1E54] border border-[#0A1E54]/10'
                }`}
              >
                {t(cat.name)}
              </Link>
            );
          })}
        </div>

        {/* Toolbar: Filters & Sorting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-[#0A1E54]/10 shadow-xs">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono tracking-wider text-stone-500 uppercase">
              {t("Showing")}: <strong className="text-[#0A1E54]">{filteredProducts.length}</strong> {t("items")}
            </span>
            <label className="flex items-center gap-2 text-xs font-mono text-[#0A1E54] cursor-pointer">
              <input
                type="checkbox"
                checked={filterStock}
                onChange={(e) => setFilterStock(e.target.checked)}
                className="rounded text-[#0A1E54] focus:ring-[#C9A66B]"
              />
              <span>{t("In Stock Only")}</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-xs font-mono text-stone-500 uppercase">{t("Sort By")}:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-stone-200 text-[#0A1E54] text-xs font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#0A1E54]"
            >
              <option value="featured">{t("Featured")}</option>
              <option value="price-asc">{t("Price: Low to High")}</option>
              <option value="price-desc">{t("Price: High to Low")}</option>
              <option value="rating">{t("Highest Rated")}</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#0A1E54]/10 space-y-4 shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
              <PackageX className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#0A1E54]">
              {t("No products found in this category")}
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              {t("We are currently restocking this collection. Check back shortly or browse our full catalogue.")}
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0A1E54] text-[#F8F3EA] text-xs font-mono uppercase tracking-wider hover:bg-[#1A3070] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t("Browse All Products")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => {
              const isWishlisted = isInWishlist(product.id);
              const isOut = product.stock === 0 || (product.outOfStock && product.variants && product.outOfStock.length >= product.variants.length);

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-2xl overflow-hidden border border-[#0A1E54]/10 hover:border-[#C9A66B]/50 hover:shadow-lg transition-all duration-300 flex flex-col group relative"
                >
                  {/* Image container (4:4 Aspect Ratio) */}
                  <Link
                    to={getProductUrl(product.id, product.title)}
                    className="relative aspect-square overflow-hidden bg-stone-100 block"
                  >
                    <img
                      src={product.assets[0] || 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600'}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Stock badge */}
                    {isOut ? (
                      <span className="absolute top-2.5 left-2.5 bg-red-600/90 text-white text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-md font-bold shadow-xs">
                        {t("SOLD OUT")}
                      </span>
                    ) : product.discountPercent ? (
                      <span className="absolute top-2.5 left-2.5 bg-[#C9A66B] text-white text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-md font-bold shadow-xs">
                        {product.discountPercent}% OFF
                      </span>
                    ) : null}

                    {/* Wishlist toggle */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product.id);
                      }}
                      className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                        isWishlisted
                          ? 'bg-rose-50 text-rose-600'
                          : 'bg-white/80 hover:bg-white text-stone-600 hover:text-rose-600'
                      }`}
                      aria-label="Wishlist toggle"
                    >
                      <Heart className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} />
                    </button>
                  </Link>

                  {/* Product Details */}
                  <div className="p-4 flex flex-col flex-1 text-left justify-between">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest uppercase text-stone-400 block mb-1">
                        {product.category}
                      </span>
                      <Link
                        to={getProductUrl(product.id, product.title)}
                        className="text-sm font-serif font-bold text-[#0A1E54] hover:text-[#C9A66B] line-clamp-2 transition-colors"
                        title={product.title}
                      >
                        {product.title}
                      </Link>
                    </div>

                    <div className="pt-3 border-t border-stone-100 mt-3 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-bold text-[#0A1E54] font-mono">
                            ৳{product.price.toLocaleString()}
                          </span>
                          {product.regularPrice && product.regularPrice > product.price && (
                            <span className="text-[11px] text-stone-400 line-through font-mono">
                              ৳{product.regularPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Add to Cart */}
                      <button
                        disabled={isOut}
                        onClick={() => {
                          const firstAvailable = product.variants.find(v => !product.outOfStock.includes(v)) || product.variants[0] || 'Standard';
                          addToCart(product, firstAvailable);
                        }}
                        className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                          isOut
                            ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                            : 'bg-[#0A1E54] hover:bg-[#1A3070] text-[#F8F3EA] shadow-xs active:scale-95'
                        }`}
                        aria-label="Add to bag"
                        title={isOut ? t("Out of stock") : t("Add to Bag")}
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
