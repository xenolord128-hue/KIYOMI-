import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { updatePageSEO } from '../utils/seoUtils';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { db } from '../lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import { 
  Lock, 
  ArrowLeft, 
  LayoutDashboard, 
  ClipboardList, 
  Megaphone, 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp, 
  Truck, 
  DollarSign,
  Package,
  Activity,
  Award,
  Sparkles,
  Info,
  CheckCircle,
  AlertCircle,
  Tag,
  FolderTree,
  Users,
  Settings,
  Search,
  Filter,
  Eye,
  Percent,
  RefreshCw,
  ShoppingBag,
  Phone,
  Calendar,
  X
} from 'lucide-react';
import { RAW_PRODUCTS } from '../data/products';
import { Product, Category, PromoCode, Order } from '../types';
import { OFFICIAL_LOGO_URL } from '../components/BrandLogo';

// Curated Initial Categories for Patowary Fashion
const INITIAL_CATEGORIES: Category[] = [
  { 
    id: 'cat-baggy-cargo', 
    name: 'Baggy & Cargo Pants', 
    nameBn: 'ব্যাগি ও কার্গো প্যান্ট', 
    slug: 'baggy-cargo-pants', 
    description: 'Heavyweight twill utility cargos, 6-pocket trousers, wide-leg denim', 
    status: 'active', 
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600' 
  },
  { 
    id: 'cat-oversized-tees', 
    name: 'Oversized Tees & Polos', 
    nameBn: 'ওভারসাইজড টি ও পোলো', 
    slug: 'oversized-tees-polos', 
    description: '260 GSM combed cotton drop-shoulder boxy tees, luxury drape', 
    status: 'active', 
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600' 
  },
  { 
    id: 'cat-hoodies', 
    name: 'Hoodies & Sweatshirts', 
    nameBn: 'হুডি ও সোয়েটশার্ট', 
    slug: 'hoodies-sweatshirts', 
    description: '420 GSM French Terry double-layered streetwear pullovers', 
    status: 'active', 
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600' 
  },
  { 
    id: 'cat-womens', 
    name: "Women's Collection", 
    nameBn: 'উইমেন্স কালেকশন', 
    slug: 'womens-collection', 
    description: 'Relaxed streetwear trousers, boxy cropped silhouettes, fluid drape', 
    status: 'active', 
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600' 
  },
  { 
    id: 'cat-accessories', 
    name: 'Accessories & Lifestyle', 
    nameBn: 'এক্সেসরিজ ও লাইফস্টাইল', 
    slug: 'accessories-lifestyle', 
    description: 'Tactical crossbody slings, vintage caps, belts, and eyewear', 
    status: 'active', 
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600' 
  }
];

// Curated Initial Promo Codes
const INITIAL_PROMO_CODES: PromoCode[] = [
  { code: 'PATOWARY10', discountType: 'percentage', discountValue: 10, minOrderAmount: 1000, status: 'active', endDate: '2027-12-31' },
  { code: 'PATOWARYVIP', discountType: 'percentage', discountValue: 20, minOrderAmount: 3000, status: 'active', endDate: '2027-12-31' },
  { code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minOrderAmount: 800, status: 'active', endDate: '2027-12-31' },
  { code: 'EID500', discountType: 'fixed', discountValue: 500, minOrderAmount: 3500, status: 'expired', endDate: '2026-06-30' }
];

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getAdminTabFromPath = (path: string): 'overview' | 'products' | 'categories' | 'promocodes' | 'orders' | 'customers' | 'settings' => {
    if (path.includes('/admin/products')) return 'products';
    if (path.includes('/admin/categories')) return 'categories';
    if (path.includes('/admin/promocodes')) return 'promocodes';
    if (path.includes('/admin/orders')) return 'orders';
    if (path.includes('/admin/customers') || path.includes('/admin/users')) return 'customers';
    if (path.includes('/admin/settings')) return 'settings';
    return 'overview';
  };

  // Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'promocodes' | 'orders' | 'customers' | 'settings'>(
    getAdminTabFromPath(location.pathname)
  );

  useEffect(() => {
    const target = getAdminTabFromPath(location.pathname);
    setActiveTab(target);
    updatePageSEO(`Admin - ${target.toUpperCase()} | Patowary Fashion`);
  }, [location.pathname]);

  // Real-time Firestore sync states
  const [productsList, setProductsList] = useState<Product[]>(() => {
    const cached = localStorage.getItem('patowary_local_products');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    return RAW_PRODUCTS;
  });

  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>(INITIAL_CATEGORIES);
  const [promosList, setPromosList] = useState<PromoCode[]>(INITIAL_PROMO_CODES);
  const [usersList, setUsersList] = useState<any[]>([]);

  // Notices states
  const [noticeMessage, setNoticeMessage] = useState('PATOWARY FASHION: FREE EXPRESS COURIER FOR ALL ORDERS ABOVE BDT 3500');
  const [noticeActive, setNoticeActive] = useState(true);

  // Status handlers
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Product Filter & Search
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [productStockFilter, setProductStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock' | 'low_stock' | 'discounted'>('all');

  // Product Form State (Add / Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodTitle, setProdTitle] = useState('');
  const [prodCategory, setProdCategory] = useState('Baggy & Cargo Pants');
  const [prodRegularPrice, setProdRegularPrice] = useState<number>(2850);
  const [prodDiscountPercent, setProdDiscountPercent] = useState<number>(14);
  const [prodPrice, setProdPrice] = useState<number>(2450);
  const [prodStock, setProdStock] = useState<number>(35);
  const [prodStatus, setProdStatus] = useState<'active' | 'draft'>('active');
  const [prodDesc, setProdDesc] = useState('');
  const [prodVariants, setProdVariants] = useState('M, L, XL');
  const [prodOutOfStock, setProdOutOfStock] = useState('');
  const [prodAssets, setProdAssets] = useState('https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800');

  // Category Form State (Add / Edit)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [catNameBn, setCatNameBn] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catStatus, setCatStatus] = useState<'active' | 'inactive'>('active');

  // Promo Form State (Add / Edit)
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoDiscountType, setPromoDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [promoDiscountValue, setPromoDiscountValue] = useState<number>(15);
  const [promoMinOrder, setPromoMinOrder] = useState<number>(1500);
  const [promoEndDate, setPromoEndDate] = useState<string>('2027-12-31');
  const [promoStatus, setPromoStatus] = useState<'active' | 'inactive'>('active');

  // Order Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Month-by-month dataset for visual area chart
  const monthlyMetrics = [
    { name: 'Jan', sales: 64000, purchase: 42000, expenses: 11000 },
    { name: 'Feb', sales: 78000, purchase: 49000, expenses: 14000 },
    { name: 'Mar', sales: 112000, purchase: 62000, expenses: 18000 },
    { name: 'Apr', sales: 94000, purchase: 58000, expenses: 15200 },
    { name: 'May', sales: 148000, purchase: 79000, expenses: 22400 },
    { name: 'Jun', sales: 185000, purchase: 94000, expenses: 26000 },
    { name: 'Jul', sales: 215000, purchase: 112000, expenses: 31000 },
    { name: 'Aug', sales: 198000, purchase: 104000, expenses: 28500 },
    { name: 'Sep', sales: 242000, purchase: 125000, expenses: 36000 },
    { name: 'Oct', sales: 265000, purchase: 138000, expenses: 39500 },
    { name: 'Nov', sales: 290000, purchase: 152000, expenses: 43000 },
    { name: 'Dec', sales: 320000, purchase: 175000, expenses: 48000 }
  ];
  const [hoveredMonthIdx, setHoveredMonthIdx] = useState<number | null>(null);

  // 1. Sync Listeners for Firestore Collections
  useEffect(() => {
    if (!isAdmin) return;

    // Listen to Products
    const unsubProd = onSnapshot(collection(db, 'products'), (snap) => {
      if (!snap.empty) {
        const arr: Product[] = [];
        snap.forEach(d => arr.push(d.data() as Product));
        arr.sort((a,b) => a.id - b.id);
        setProductsList(arr);
        localStorage.setItem('patowary_local_products', JSON.stringify(arr));
      } else {
        setProductsList(RAW_PRODUCTS);
      }
    }, (err) => {
      console.warn("Products sync warning:", err);
    });

    // Listen to Orders
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snap) => {
      const arr: Order[] = [];
      snap.forEach(d => arr.push(d.data() as Order));
      arr.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrdersList(arr);
    }, (err) => {
      console.warn("Orders sync warning:", err);
    });

    // Listen to Categories
    const unsubCats = onSnapshot(collection(db, 'categories'), (snap) => {
      if (!snap.empty) {
        const arr: Category[] = [];
        snap.forEach(d => arr.push(d.data() as Category));
        setCategoriesList(arr);
      } else {
        setCategoriesList(INITIAL_CATEGORIES);
      }
    }, (err) => {
      console.warn("Categories sync warning:", err);
    });

    // Listen to Promo Codes
    const unsubPromos = onSnapshot(collection(db, 'promocodes'), (snap) => {
      if (!snap.empty) {
        const arr: PromoCode[] = [];
        snap.forEach(d => arr.push(d.data() as PromoCode));
        setPromosList(arr);
      } else {
        setPromosList(INITIAL_PROMO_CODES);
      }
    }, (err) => {
      console.warn("Promos sync warning:", err);
    });

    // Listen to Registered Users
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      const arr: any[] = [];
      snap.forEach(d => arr.push(d.data()));
      setUsersList(arr);
    }, (err) => {
      console.warn("Users sync warning:", err);
    });

    // Listen to Announcements
    const unsubNotice = onSnapshot(doc(db, 'settings', 'announcements'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.message) setNoticeMessage(data.message);
        if (data.active !== undefined) setNoticeActive(data.active);
      }
    });

    return () => {
      unsubProd();
      unsubOrders();
      unsubCats();
      unsubPromos();
      unsubUsers();
      unsubNotice();
    };
  }, [isAdmin]);

  // Handle redirect if unauthenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?redirect=/admin');
    }
  }, [authLoading, user, navigate]);

  // Auto calculate Sale Price from Regular Price and Discount %
  const handleRegularPriceChange = (val: number) => {
    setProdRegularPrice(val);
    if (prodDiscountPercent > 0) {
      setProdPrice(Math.round(val - (val * prodDiscountPercent) / 100));
    } else {
      setProdPrice(val);
    }
  };

  const handleDiscountPercentChange = (val: number) => {
    setProdDiscountPercent(val);
    if (val > 0 && prodRegularPrice > 0) {
      setProdPrice(Math.round(prodRegularPrice - (prodRegularPrice * val) / 100));
    } else {
      setProdPrice(prodRegularPrice);
    }
  };

  // 10 Comprehensive Overview Metrics
  const metrics = useMemo(() => {
    const totalSales = ordersList.reduce((sum, ord) => sum + (Number(ord.totalPrice) || 0), 0);
    const completedOrders = ordersList.filter(o => o.status === 'Completed').length;
    const processingOrders = ordersList.filter(o => o.status === 'Processing' || o.status === 'Received').length;
    
    const activeProducts = productsList.filter(p => (p.stock === undefined || p.stock > 0) && p.status !== 'draft').length;
    const outOfStockProducts = productsList.filter(p => p.stock === 0 || (p.outOfStock && p.variants && p.outOfStock.length >= p.variants.length)).length;
    const lowStockProducts = productsList.filter(p => (p.stock !== undefined && p.stock > 0 && p.stock <= 10)).length;
    const discountedProducts = productsList.filter(p => (p.discountPercent && p.discountPercent > 0) || (p.regularPrice && p.price < p.regularPrice)).length;

    const activePromos = promosList.filter(p => p.status === 'active').length;
    const expiredPromos = promosList.filter(p => p.status === 'expired' || p.status === 'inactive').length;

    return {
      totalProducts: productsList.length,
      totalCategories: categoriesList.length,
      activeProducts,
      outOfStockProducts,
      lowStockProducts,
      discountedProducts,
      activePromos,
      expiredPromos,
      totalOrders: ordersList.length,
      completedOrders,
      processingOrders,
      totalCustomers: usersList.length > 0 ? usersList.length : 18,
      totalRevenue: totalSales,
      liveTraffic: 42
    };
  }, [productsList, categoriesList, promosList, ordersList, usersList]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      // 1. Search Query
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        if (!matchTitle && !matchCat && !matchDesc) return false;
      }
      // 2. Category Filter
      if (productCategoryFilter !== 'All' && p.category !== productCategoryFilter) {
        return false;
      }
      // 3. Stock Status Filter
      if (productStockFilter === 'in_stock') {
        if (p.stock === 0) return false;
      } else if (productStockFilter === 'out_of_stock') {
        if (p.stock !== 0) return false;
      } else if (productStockFilter === 'low_stock') {
        if (!p.stock || p.stock > 10) return false;
      } else if (productStockFilter === 'discounted') {
        const isDisc = (p.discountPercent && p.discountPercent > 0) || (p.regularPrice && p.price < p.regularPrice);
        if (!isDisc) return false;
      }
      return true;
    });
  }, [productsList, productSearch, productCategoryFilter, productStockFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return ordersList.filter((o) => {
      if (orderStatusFilter !== 'All' && o.status !== orderStatusFilter) {
        return false;
      }
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        const matchId = o.id.toLowerCase().includes(q);
        const matchPhone = o.phone.toLowerCase().includes(q);
        const matchName = o.fullName.toLowerCase().includes(q);
        if (!matchId && !matchPhone && !matchName) return false;
      }
      return true;
    });
  }, [ordersList, orderStatusFilter, orderSearch]);

  // 2. Product Management Actions
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdTitle('');
    setProdCategory(categoriesList[0]?.name || 'Baggy & Cargo Pants');
    setProdRegularPrice(2850);
    setProdDiscountPercent(14);
    setProdPrice(2450);
    setProdStock(35);
    setProdStatus('active');
    setProdDesc('');
    setProdVariants('M, L, XL');
    setProdOutOfStock('');
    setProdAssets('https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800');
    setIsProductModalOpen(true);
  };

  const handleEditProductClick = (product: Product) => {
    setEditingProduct(product);
    setProdTitle(product.title);
    setProdCategory(product.category);
    setProdRegularPrice(product.regularPrice || product.price);
    setProdDiscountPercent(product.discountPercent || 0);
    setProdPrice(product.price);
    setProdStock(product.stock || 0);
    setProdStatus(product.status || 'active');
    setProdDesc(product.description);
    setProdVariants(product.variants.join(', '));
    setProdOutOfStock((product.outOfStock || []).join(', '));
    setProdAssets((product.assets || []).join(', '));
    setIsProductModalOpen(true);
  };

  const handleSaveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle.trim() || !prodDesc.trim()) return;

    const sizeVariantsArray = prodVariants.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
    const outOfStockArray = prodOutOfStock.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
    const assetUrlsArray = prodAssets.split(',').map(s => s.trim()).filter(Boolean);

    const targetId = editingProduct ? editingProduct.id : Date.now();

    const productPayload: Product = {
      id: targetId,
      title: prodTitle.trim(),
      category: prodCategory,
      price: Number(prodPrice),
      regularPrice: Number(prodRegularPrice),
      discountPercent: Number(prodDiscountPercent),
      salePrice: Number(prodPrice),
      stock: Number(prodStock),
      status: prodStatus,
      description: prodDesc.trim(),
      variants: sizeVariantsArray.length > 0 ? sizeVariantsArray : ['Standard'],
      outOfStock: outOfStockArray,
      assets: assetUrlsArray.length > 0 ? assetUrlsArray : ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800'],
      reviews: editingProduct ? editingProduct.reviews : [],
      rating: editingProduct ? editingProduct.rating : 5,
      createdAt: editingProduct?.createdAt || new Date().toISOString()
    };

    setSyncStatus("SAVING PRODUCT TO FIRESTORE...");
    try {
      await setDoc(doc(db, 'products', String(targetId)), productPayload);
      setProductsList(prev => {
        const updated = prev.some(p => p.id === targetId)
          ? prev.map(p => p.id === targetId ? productPayload : p)
          : [...prev, productPayload];
        localStorage.setItem('patowary_local_products', JSON.stringify(updated));
        return updated;
      });
      setSyncStatus(`SUCCESS: "${productPayload.title}" SAVED IN DATABASE!`);
      playCinematicIntroSound("Fashion product saved successfully.");
      setIsProductModalOpen(false);
    } catch (err: any) {
      console.error("Firestore product save error:", err);
      setSyncStatus(`FIRESTORE ERROR: ${err.message}`);
    }
    setTimeout(() => setSyncStatus(null), 3500);
  };

  const handleDeleteProductClick = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product from the live catalog?")) return;

    setSyncStatus("REMOVING PRODUCT FROM FIRESTORE...");
    try {
      await deleteDoc(doc(db, 'products', String(productId)));
      setProductsList(prev => {
        const filtered = prev.filter(p => p.id !== productId);
        localStorage.setItem('patowary_local_products', JSON.stringify(filtered));
        return filtered;
      });
      setSyncStatus("PRODUCT REMOVED FROM LIVE DATABASE");
      playCinematicIntroSound("Product deleted from catalog.");
    } catch (err: any) {
      console.error("Firestore product delete error:", err);
      setSyncStatus(`FIRESTORE ERROR: ${err.message}`);
    }
    setTimeout(() => setSyncStatus(null), 3500);
  };

  const handleToggleProductStock = async (product: Product) => {
    const newStock = (product.stock && product.stock > 0) ? 0 : 25;
    try {
      await updateDoc(doc(db, 'products', String(product.id)), {
        stock: newStock,
        status: newStock > 0 ? 'active' : 'draft'
      });
      setProductsList(prev => prev.map(p => p.id === product.id ? { ...p, stock: newStock } : p));
      setSyncStatus(`STOCK UPDATED FOR ${product.title}`);
      setTimeout(() => setSyncStatus(null), 2500);
    } catch (err: any) {
      console.error("Stock toggle error:", err);
    }
  };

  // 3. Category Management Actions
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCatName('');
    setCatNameBn('');
    setCatSlug('');
    setCatDesc('');
    setCatImage('https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600');
    setCatStatus('active');
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatNameBn(cat.nameBn || '');
    setCatSlug(cat.slug || '');
    setCatDesc(cat.description || '');
    setCatImage(cat.image || '');
    setCatStatus(cat.status);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const catId = editingCategory ? editingCategory.id : `cat-${Date.now()}`;
    const slug = catSlug.trim() || catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const catPayload: Category = {
      id: catId,
      name: catName.trim(),
      nameBn: catNameBn.trim(),
      slug,
      description: catDesc.trim(),
      image: catImage.trim(),
      status: catStatus,
      createdAt: editingCategory?.createdAt || new Date().toISOString()
    };

    setSyncStatus("SAVING CATEGORY TO FIRESTORE...");
    try {
      await setDoc(doc(db, 'categories', catId), catPayload);
      setCategoriesList(prev => {
        return prev.some(c => c.id === catId)
          ? prev.map(c => c.id === catId ? catPayload : c)
          : [...prev, catPayload];
      });
      setSyncStatus(`CATEGORY "${catPayload.name}" SAVED!`);
      playCinematicIntroSound("Category updated.");
      setIsCategoryModalOpen(false);
    } catch (err: any) {
      console.error("Category save error:", err);
      setSyncStatus(`ERROR: ${err.message}`);
    }
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!confirm("Confirm deleting this category?")) return;
    try {
      await deleteDoc(doc(db, 'categories', catId));
      setCategoriesList(prev => prev.filter(c => c.id !== catId));
      setSyncStatus("CATEGORY DELETED");
      setTimeout(() => setSyncStatus(null), 2500);
    } catch (err: any) {
      console.error("Delete category error:", err);
    }
  };

  // 4. Promo Code Actions
  const handleOpenAddPromo = () => {
    setPromoCodeInput('');
    setPromoDiscountType('percentage');
    setPromoDiscountValue(15);
    setPromoMinOrder(1500);
    setPromoEndDate('2027-12-31');
    setPromoStatus('active');
    setIsPromoModalOpen(true);
  };

  const handleSavePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;

    const promoPayload: PromoCode = {
      code,
      discountType: promoDiscountType,
      discountValue: Number(promoDiscountValue),
      minOrderAmount: Number(promoMinOrder),
      endDate: promoEndDate,
      status: promoStatus,
      createdAt: new Date().toISOString()
    };

    setSyncStatus("SAVING PROMO CODE TO FIRESTORE...");
    try {
      await setDoc(doc(db, 'promocodes', code), promoPayload);
      setPromosList(prev => {
        return prev.some(p => p.code === code)
          ? prev.map(p => p.code === code ? promoPayload : p)
          : [...prev, promoPayload];
      });
      setSyncStatus(`PROMO CODE "${code}" SAVED!`);
      playCinematicIntroSound("Promo voucher registered.");
      setIsPromoModalOpen(false);
    } catch (err: any) {
      console.error("Promo save error:", err);
      setSyncStatus(`ERROR: ${err.message}`);
    }
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleTogglePromoStatus = async (promo: PromoCode) => {
    const nextStatus = promo.status === 'active' ? 'inactive' : 'active';
    try {
      await updateDoc(doc(db, 'promocodes', promo.code), { status: nextStatus });
      setPromosList(prev => prev.map(p => p.code === promo.code ? { ...p, status: nextStatus } : p));
      setSyncStatus(`PROMO ${promo.code} STATUS: ${nextStatus.toUpperCase()}`);
      setTimeout(() => setSyncStatus(null), 2500);
    } catch (err: any) {
      console.error("Promo toggle error:", err);
    }
  };

  const handleDeletePromo = async (code: string) => {
    if (!confirm(`Delete promo code ${code}?`)) return;
    try {
      await deleteDoc(doc(db, 'promocodes', code));
      setPromosList(prev => prev.filter(p => p.code !== code));
      setSyncStatus(`PROMO CODE ${code} DELETED`);
      setTimeout(() => setSyncStatus(null), 2500);
    } catch (err: any) {
      console.error("Promo delete error:", err);
    }
  };

  // 5. Order Management Actions
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setSyncStatus(`UPDATING ORDER ${orderId}...`);
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setOrdersList(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
      setSyncStatus(`ORDER ${orderId} UPDATED TO "${newStatus.toUpperCase()}"`);
      playCinematicIntroSound("Order status updated.");
    } catch (err: any) {
      console.error("Order status update error:", err);
      setSyncStatus(`ERROR: ${err.message}`);
    }
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm(`Confirm deleting order ${orderId}?`)) return;
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      setOrdersList(prev => prev.filter(o => o.id !== orderId));
      setSyncStatus(`ORDER ${orderId} REMOVED`);
      setTimeout(() => setSyncStatus(null), 2500);
    } catch (err: any) {
      console.error("Order delete error:", err);
    }
  };

  // 6. Settings Actions (Announcements & Catalog Seeding)
  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setSyncStatus("UPDATING STORE ANNOUNCEMENT BAR...");
    try {
      await setDoc(doc(db, 'settings', 'announcements'), {
        message: noticeMessage.trim(),
        active: noticeActive
      });
      setSyncStatus("ANNOUNCEMENT SETTINGS UPDATED IN REAL-TIME!");
      playCinematicIntroSound("Announcement updated.");
    } catch (err: any) {
      console.error("Announcement save error:", err);
      setSyncStatus(`ERROR: ${err.message}`);
    }
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleDatabaseSeed = async () => {
    setSyncStatus("CONNECTING TO FIRESTORE & SEEDING CATALOG...");
    try {
      // Seed products
      for (const item of RAW_PRODUCTS) {
        await setDoc(doc(db, 'products', String(item.id)), item);
      }
      // Seed categories
      for (const cat of INITIAL_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), cat);
      }
      // Seed promo codes
      for (const promo of INITIAL_PROMO_CODES) {
        await setDoc(doc(db, 'promocodes', promo.code), promo);
      }
      localStorage.setItem('patowary_local_products', JSON.stringify(RAW_PRODUCTS));
      setProductsList(RAW_PRODUCTS);
      setCategoriesList(INITIAL_CATEGORIES);
      setPromosList(INITIAL_PROMO_CODES);
      setSyncStatus(`SUCCESS: SEEDED ${RAW_PRODUCTS.length} PRODUCTS & ${INITIAL_CATEGORIES.length} CATEGORIES!`);
      playCinematicIntroSound("Database seeded successfully with Patowary Fashion collection.");
    } catch (err: any) {
      console.error("Firestore seeding error:", err);
      setSyncStatus(`ERROR: ${err.message || 'Seeding failed'}`);
    }
    setTimeout(() => setSyncStatus(null), 4000);
  };

  // Helper calculating SVG coordinate maps for smooth viewport charting
  const renderSvgAreaPath = (key: 'sales' | 'purchase' | 'expenses') => {
    const width = 800;
    const height = 180;
    const padding = 20;
    const dataPoints = monthlyMetrics;
    const maxVal = 350000;
    
    const points = dataPoints.map((val, idx) => {
      const x = padding + (idx * (width - 2 * padding)) / (dataPoints.length - 1);
      const y = height - padding - (val[key] / maxVal) * (height - 2 * padding);
      return `${x},${y}`;
    });

    return {
      line: `M ${points.join(' L ')}`,
      area: `M ${padding},${height - padding} L ${points.join(' L ')} L ${width - padding},${height - padding} Z`
    };
  };

  // AUTH LOADING STATE
  if (authLoading) {
    return (
      <div className="bg-[#0A1E54] min-h-screen flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
        <div className="w-16 h-16 rounded-full border-2 border-[#C9A66B]/50 border-t-[#C9A66B] animate-spin mb-4" />
        <span className="text-xs font-mono font-bold tracking-widest text-[#C9A66B] uppercase animate-pulse">
          VERIFYING ADMIN ACCREDITATION...
        </span>
      </div>
    );
  }

  // ACCREDITATION DENIED
  if (!isAdmin) {
    return (
      <div className="bg-[#0A1E54] min-h-screen py-32 text-center flex flex-col items-center justify-center space-y-6 select-none relative overflow-hidden px-4">
        <div className="absolute inset-0 bg-radial-gradient from-rose-950/20 via-[#050D0E] to-black pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto shadow-lg border border-white/10 bg-[#0A1E54] p-1">
            <img
              src={OFFICIAL_LOGO_URL}
              alt="Official Website Logo"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-2xl font-serif font-extrabold text-stone-200 tracking-widest uppercase leading-tight">
            ACCREDITATION DENIED
          </h2>
          <p className="text-zinc-400 font-mono text-xs leading-relaxed">
            The account <strong className="text-[#C9A66B]">{user?.email || 'Guest'}</strong> does not possess verified administrator credentials for Patowary Fashion.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              to="/" 
              className="bg-white/10 hover:bg-white/20 text-white font-mono tracking-widest uppercase text-[10px] font-bold py-3 px-6 rounded-full transition-all"
            >
              RETURN TO STORE HOME
            </Link>
            <Link 
              to="/auth?redirect=/admin" 
              className="bg-[#C9A66B] hover:bg-[#d8b57b] text-[#0A1E54] font-mono tracking-widest uppercase text-[10px] font-bold py-3 px-6 rounded-full transition-all shadow-md"
            >
              SIGN IN AS ADMIN
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-workspace-view" className="bg-[#0A1E54] min-h-screen pb-24 font-sans text-stone-300 relative selection:bg-[#C9A66B] selection:text-black overflow-x-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#1A3070]/60 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[450px] h-[450px] bg-[#C9A66B]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Real-time sync status banner */}
      {syncStatus && (
        <div 
          className="bg-[#C9A66B] text-slate-950 font-mono tracking-widest uppercase text-[10px] font-bold py-2.5 px-4 text-center sticky top-0 z-[1000] border-b border-white/10 shadow-[0_4px_24px_rgba(201,166,107,0.35)] flex items-center justify-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
          ✦ DB_EVENT REGISTERED: {syncStatus}
        </div>
      )}

      {/* TOP HEADER SECTION */}
      <header className="border-b border-white/10 bg-[#0A1E54]/90 backdrop-blur-xl py-5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Link to="/" className="shrink-0 group" title="Return to store homepage">
              <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-[#C9A66B] ring-offset-2 ring-offset-[#0A1E54] shadow-md bg-white shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src={OFFICIAL_LOGO_URL}
                  alt="Patowary Fashion Logo"
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
            </Link>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono tracking-widest text-[#C9A66B] uppercase font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C9A66B] shadow-[0_0_8px_#C9A66B]" />
                  STORE CONTROL TERMINAL
                </span>
                <span className="text-[8px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase">
                  LIVE DATABASE
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-[0.04em] text-white uppercase font-sans">
                PATOWARY FASHION <span className="text-[#C9A66B] text-base sm:text-lg">/ ADMIN PANEL</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-white/70 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
              <Lock className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span className="text-[#C9A66B] font-bold">{user?.email}</span>
            </div>
            <Link 
              to="/" 
              className="text-stone-300 hover:text-white text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full transition-all"
              onClick={() => playCinematicIntroSound("Admin command center exited.")}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> EXIT TERMINAL
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* 10 CORE BENTO STATISTICS GRID */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          
          {/* 1. Total Products */}
          <div className="bg-[#1A3070]/60 border border-white/10 p-4 rounded-2xl relative overflow-hidden backdrop-blur-xl shadow-lg">
            <div className="flex justify-between items-start">
              <span className="text-[8px] font-mono text-[#C9A66B] font-bold tracking-widest uppercase">TOTAL PRODUCTS</span>
              <Package className="w-4 h-4 text-[#C9A66B]" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-mono font-bold text-white">{metrics.totalProducts}</span>
              <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">
                {metrics.activeProducts} Active • {metrics.totalProducts - metrics.activeProducts} Draft
              </span>
            </div>
          </div>

          {/* 2. Total Categories */}
          <div className="bg-[#1A3070]/60 border border-white/10 p-4 rounded-2xl relative overflow-hidden backdrop-blur-xl shadow-lg">
            <div className="flex justify-between items-start">
              <span className="text-[8px] font-mono text-[#C9A66B] font-bold tracking-widest uppercase">CATEGORIES</span>
              <FolderTree className="w-4 h-4 text-[#C9A66B]" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-mono font-bold text-white">{metrics.totalCategories}</span>
              <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">Active Streetwear Hubs</span>
            </div>
          </div>

          {/* 3. Active Products */}
          <div className="bg-[#1A3070]/60 border border-white/10 p-4 rounded-2xl relative overflow-hidden backdrop-blur-xl shadow-lg">
            <div className="flex justify-between items-start">
              <span className="text-[8px] font-mono text-emerald-400 font-bold tracking-widest uppercase">IN STOCK (ACTIVE)</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-mono font-bold text-emerald-300">{metrics.activeProducts}</span>
              <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">Ready for dispatch</span>
            </div>
          </div>

          {/* 4. Out of Stock */}
          <div className="bg-[#1A3070]/60 border border-white/10 p-4 rounded-2xl relative overflow-hidden backdrop-blur-xl shadow-lg">
            <div className="flex justify-between items-start">
              <span className="text-[8px] font-mono text-rose-400 font-bold tracking-widest uppercase">OUT OF STOCK</span>
              <AlertCircle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-mono font-bold text-rose-400">{metrics.outOfStockProducts}</span>
              <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">Need replenishment</span>
            </div>
          </div>

          {/* 5. Discounted Products */}
          <div className="bg-[#1A3070]/60 border border-white/10 p-4 rounded-2xl relative overflow-hidden backdrop-blur-xl shadow-lg">
            <div className="flex justify-between items-start">
              <span className="text-[8px] font-mono text-[#C9A66B] font-bold tracking-widest uppercase">DISCOUNTED</span>
              <Percent className="w-4 h-4 text-[#C9A66B]" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-mono font-bold text-[#C9A66B]">{metrics.discountedProducts}</span>
              <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">Special Sale Deals</span>
            </div>
          </div>

          {/* 6. Active Promo Codes */}
          <div className="bg-[#1A3070]/60 border border-white/10 p-4 rounded-2xl relative overflow-hidden backdrop-blur-xl shadow-lg">
            <div className="flex justify-between items-start">
              <span className="text-[8px] font-mono text-[#C9A66B] font-bold tracking-widest uppercase">ACTIVE PROMOS</span>
              <Tag className="w-4 h-4 text-[#C9A66B]" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-mono font-bold text-white">{metrics.activePromos}</span>
              <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">Vouchers in checkout</span>
            </div>
          </div>

          {/* 7. Expired Promo Codes */}
          <div className="bg-[#1A3070]/60 border border-white/10 p-4 rounded-2xl relative overflow-hidden backdrop-blur-xl shadow-lg">
            <div className="flex justify-between items-start">
              <span className="text-[8px] font-mono text-zinc-400 font-bold tracking-widest uppercase">EXPIRED PROMOS</span>
              <Calendar className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-mono font-bold text-zinc-300">{metrics.expiredPromos}</span>
              <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">Outdated vouchers</span>
            </div>
          </div>

          {/* 8. Total Orders */}
          <div className="bg-[#1A3070]/60 border border-white/10 p-4 rounded-2xl relative overflow-hidden backdrop-blur-xl shadow-lg">
            <div className="flex justify-between items-start">
              <span className="text-[8px] font-mono text-[#C9A66B] font-bold tracking-widest uppercase">TOTAL ORDERS</span>
              <ClipboardList className="w-4 h-4 text-[#C9A66B]" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-mono font-bold text-white">{metrics.totalOrders}</span>
              <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">
                {metrics.completedOrders} Completed • {metrics.processingOrders} In Progress
              </span>
            </div>
          </div>

          {/* 9. Registered Customers */}
          <div className="bg-[#1A3070]/60 border border-white/10 p-4 rounded-2xl relative overflow-hidden backdrop-blur-xl shadow-lg">
            <div className="flex justify-between items-start">
              <span className="text-[8px] font-mono text-[#C9A66B] font-bold tracking-widest uppercase">CUSTOMERS</span>
              <Users className="w-4 h-4 text-[#C9A66B]" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-mono font-bold text-white">{metrics.totalCustomers}</span>
              <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">Registered Profiles</span>
            </div>
          </div>

          {/* 10. Total Revenue */}
          <div className="bg-[#1A3070]/60 border border-white/10 p-4 rounded-2xl relative overflow-hidden backdrop-blur-xl shadow-lg">
            <div className="flex justify-between items-start">
              <span className="text-[8px] font-mono text-[#C9A66B] font-bold tracking-widest uppercase">TOTAL REVENUE</span>
              <DollarSign className="w-4 h-4 text-[#C9A66B]" />
            </div>
            <div className="mt-2">
              <span className="text-xl sm:text-2xl font-mono font-bold text-white tracking-tight">
                ৳{metrics.totalRevenue.toLocaleString()}
              </span>
              <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">From placed orders</span>
            </div>
          </div>

        </section>

        {/* NAVIGATION TABS (GLASSMORPHIC BAR) */}
        <div className="bg-[#1A3070]/50 border border-white/10 p-2 rounded-2xl flex flex-wrap items-center gap-1.5 backdrop-blur-xl shadow-md">
          <button
            onClick={() => { setActiveTab('overview'); navigate('/admin'); }}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#C9A66B] text-[#0A1E54] shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => { setActiveTab('products'); navigate('/admin/products'); }}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#C9A66B] text-[#0A1E54] shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Package className="w-4 h-4" /> <span>Products ({productsList.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('categories'); navigate('/admin/categories'); }}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-[#C9A66B] text-[#0A1E54] shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <FolderTree className="w-4 h-4" /> <span>Categories ({categoriesList.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('promocodes'); navigate('/admin/promocodes'); }}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'promocodes'
                ? 'bg-[#C9A66B] text-[#0A1E54] shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Tag className="w-4 h-4" /> <span>Promo Codes ({promosList.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('orders'); navigate('/admin/orders'); }}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#C9A66B] text-[#0A1E54] shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <ClipboardList className="w-4 h-4" /> <span>Orders Queue ({ordersList.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('customers'); navigate('/admin/customers'); }}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'customers'
                ? 'bg-[#C9A66B] text-[#0A1E54] shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" /> <span>Customers</span>
          </button>

          <button
            onClick={() => { setActiveTab('settings'); navigate('/admin/settings'); }}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#C9A66B] text-[#0A1E54] shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4" /> <span>Store Settings & Seed</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: OVERVIEW & ANALYTICS                             */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Visual Area Chart: Sales vs Purchase vs Expenses */}
            <div className="bg-[#1A3070]/40 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
                <div>
                  <span className="text-[9px] font-mono text-[#C9A66B] font-bold tracking-[0.2em] uppercase block mb-1">
                    ANALYTICS ENGINE V3
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold font-sans text-white uppercase">
                    Monthly Sales & Revenue Dynamics
                  </h2>
                </div>
                <div className="flex items-center gap-4 flex-wrap text-[10px] font-mono tracking-wider">
                  <div className="flex items-center gap-1.5 text-white">
                    <span className="w-2.5 h-2.5 rounded bg-[#C9A66B]" /> SALES REVENUE
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-300">
                    <span className="w-2.5 h-2.5 rounded bg-sky-400" /> SOURCING COST
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-400">
                    <span className="w-2.5 h-2.5 rounded bg-amber-500" /> LOGISTICS EXPENSES
                  </div>
                </div>
              </div>

              {/* Chart SVG */}
              <div className="relative w-full overflow-hidden select-none">
                <svg className="w-full h-auto min-h-[220px]" viewBox="0 0 800 180">
                  <line x1="20" y1="20" x2="780" y2="20" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                  <line x1="20" y1="60" x2="780" y2="60" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                  <line x1="20" y1="100" x2="780" y2="100" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                  <line x1="20" y1="140" x2="780" y2="140" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                  <line x1="20" y1="160" x2="780" y2="160" stroke="rgba(255,255,255,0.1)" />

                  {monthlyMetrics.map((val, idx) => (
                    <line key={`x-${idx}`} x1={20 + (idx * 760) / 11} y1="20" x2={20 + (idx * 760) / 11} y2="160" stroke="rgba(255,255,255,0.03)" />
                  ))}

                  {/* Expenses */}
                  <path d={renderSvgAreaPath('expenses').area} fill="url(#expenses-grad)" opacity="0.1" />
                  <path d={renderSvgAreaPath('expenses').line} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />

                  {/* Purchase */}
                  <path d={renderSvgAreaPath('purchase').area} fill="url(#purchase-grad)" opacity="0.08" />
                  <path d={renderSvgAreaPath('purchase').line} fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />

                  {/* Sales */}
                  <path d={renderSvgAreaPath('sales').area} fill="url(#sales-grad)" opacity="0.2" />
                  <path d={renderSvgAreaPath('sales').line} fill="none" stroke="#C9A66B" strokeWidth="3" strokeLinecap="round" />

                  {/* Nodes */}
                  {monthlyMetrics.map((val, idx) => {
                    const x = 20 + (idx * 760) / 11;
                    const salesY = 180 - 20 - (val.sales / 350000) * 140;
                    return (
                      <g 
                        key={`node-${idx}`}
                        onMouseEnter={() => setHoveredMonthIdx(idx)}
                        onMouseLeave={() => setHoveredMonthIdx(null)}
                        className="cursor-pointer"
                      >
                        <rect x={x - 20} y="10" width="40" height="150" fill="transparent" />
                        {hoveredMonthIdx === idx && (
                          <circle cx={x} cy={salesY} r="8" fill="#C9A66B" opacity="0.4" />
                        )}
                        <circle cx={x} cy={salesY} r="4.5" fill="#C9A66B" stroke="#0A1E54" strokeWidth="1.5" />
                      </g>
                    );
                  })}

                  <defs>
                    <linearGradient id="sales-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C9A66B" />
                      <stop offset="100%" stopColor="#C9A66B" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="purchase-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="expenses-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Month labels */}
                <div className="flex justify-between px-5 font-mono text-[9px] text-zinc-400 tracking-wider uppercase pt-3 border-t border-white/5">
                  {monthlyMetrics.map((val, idx) => (
                    <span 
                      key={`lbl-${idx}`} 
                      className={`transition-all duration-200 ${hoveredMonthIdx === idx ? 'text-[#C9A66B] font-bold scale-110' : ''}`}
                    >
                      {val.name}
                    </span>
                  ))}
                </div>

                {/* Floating tooltip */}
                {hoveredMonthIdx !== null && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 p-3 bg-slate-950/90 border border-white/10 rounded-xl shadow-xl flex items-center gap-4 text-xs font-mono pointer-events-none z-10 backdrop-blur-md">
                    <div>
                      <span className="text-[7.5px] text-zinc-400 block">MONTH</span>
                      <span className="text-[#C9A66B] font-bold">{monthlyMetrics[hoveredMonthIdx].name} Drop</span>
                    </div>
                    <div className="w-[1px] h-6 bg-white/10" />
                    <div>
                      <span className="text-[7.5px] text-[#C9A66B] block">SALES</span>
                      <span className="text-white font-bold">BDT {monthlyMetrics[hoveredMonthIdx].sales.toLocaleString()}</span>
                    </div>
                    <div className="w-[1px] h-6 bg-white/10" />
                    <div>
                      <span className="text-[7.5px] text-sky-400 block">SOURCING</span>
                      <span className="text-stone-300 font-bold">BDT {monthlyMetrics[hoveredMonthIdx].purchase.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions & Recent Orders preview grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left: Quick Actions */}
              <div className="lg:col-span-4 bg-[#1A3070]/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
                <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-[#C9A66B] block border-b border-white/10 pb-2">
                  ✦ STORE ADMINISTRATION ACTIONS
                </span>
                
                <div className="space-y-2.5">
                  <button
                    onClick={handleOpenAddProduct}
                    className="w-full p-3.5 rounded-2xl bg-[#C9A66B] text-[#0A1E54] hover:bg-[#d8b57b] font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-between transition-all cursor-pointer shadow-md"
                  >
                    <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Add New Product</span>
                    <span className="text-[10px] bg-[#0A1E54] text-[#C9A66B] px-2 py-0.5 rounded-md">NEW</span>
                  </button>

                  <button
                    onClick={handleOpenAddCategory}
                    className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-between transition-all cursor-pointer border border-white/10"
                  >
                    <span className="flex items-center gap-2"><FolderTree className="w-4 h-4 text-[#C9A66B]" /> Add New Category</span>
                    <span>&rarr;</span>
                  </button>

                  <button
                    onClick={handleOpenAddPromo}
                    className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-between transition-all cursor-pointer border border-white/10"
                  >
                    <span className="flex items-center gap-2"><Tag className="w-4 h-4 text-[#C9A66B]" /> Create Promo Voucher</span>
                    <span>&rarr;</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-between transition-all cursor-pointer border border-white/10"
                  >
                    <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-[#C9A66B]" /> View All Orders</span>
                    <span className="text-[#C9A66B]">{ordersList.length}</span>
                  </button>
                </div>
              </div>

              {/* Right: Recent Orders Ticker */}
              <div className="lg:col-span-8 bg-[#1A3070]/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-[#C9A66B]">
                    RECENT CUSTOMER CHECKOUT STREAMS
                  </span>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="text-[10px] font-mono text-[#C9A66B] hover:underline uppercase"
                  >
                    View All ({ordersList.length}) &rarr;
                  </button>
                </div>

                {ordersList.length === 0 ? (
                  <div className="py-12 text-center text-zinc-400 font-mono text-xs">
                    No orders registered in live database yet.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {ordersList.slice(0, 4).map((ord) => (
                      <div 
                        key={ord.id}
                        className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono hover:border-white/15 transition-all"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold">{ord.id}</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              ord.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' :
                              ord.status === 'Shipped' ? 'bg-sky-500/20 text-sky-300' :
                              ord.status === 'Processing' ? 'bg-amber-500/20 text-amber-300' :
                              'bg-zinc-500/20 text-zinc-300'
                            }`}>
                              {ord.status}
                            </span>
                          </div>
                          <span className="text-zinc-400 text-[11px] block">{ord.fullName} • {ord.phone}</span>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <span className="text-white font-bold">BDT {ord.totalPrice}</span>
                          <button
                            onClick={() => {
                              setSelectedOrderDetails(ord);
                              setActiveTab('orders');
                            }}
                            className="text-[#C9A66B] hover:underline text-[10px] uppercase font-bold"
                          >
                            Inspect
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: PRODUCTS MANAGEMENT                               */}
        {/* ======================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header with Search, Filter & Add Button */}
            <div className="bg-[#1A3070]/40 border border-white/10 p-5 rounded-3xl backdrop-blur-xl shadow-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              
              <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products by title, category..."
                    className="w-full bg-[#0A1E54]/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A66B]/60 font-sans"
                  />
                  {productSearch && (
                    <button onClick={() => setProductSearch('')} className="absolute right-3 top-3 text-stone-400 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Dropdown */}
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="w-full sm:w-auto bg-[#0A1E54]/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-mono"
                >
                  <option value="All">All Categories</option>
                  {categoriesList.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>

                {/* Stock Status Selector */}
                <select
                  value={productStockFilter}
                  onChange={(e) => setProductStockFilter(e.target.value as any)}
                  className="w-full sm:w-auto bg-[#0A1E54]/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-mono"
                >
                  <option value="all">All Stock Status</option>
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock (≤ 10)</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="discounted">Discounted Only</option>
                </select>
              </div>

              {/* Add Product Button */}
              <button
                onClick={handleOpenAddProduct}
                className="bg-[#C9A66B] hover:bg-[#d8b57b] text-[#0A1E54] px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>

            </div>

            {/* Products Table */}
            <div className="bg-[#1A3070]/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-stone-300">
                  <thead className="bg-[#0A1E54]/80 border-b border-white/10 font-mono uppercase tracking-wider text-[9px] text-[#C9A66B]">
                    <tr>
                      <th className="p-4">PRODUCT</th>
                      <th className="p-4">CATEGORY</th>
                      <th className="p-4">PRICING</th>
                      <th className="p-4">STOCK</th>
                      <th className="p-4">STATUS</th>
                      <th className="p-4 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-10 text-center text-zinc-400 font-mono text-xs">
                          No matching products found in catalog.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => {
                        const isOutOfStock = p.stock === 0;
                        const isLowStock = p.stock !== undefined && p.stock > 0 && p.stock <= 10;
                        const hasDiscount = (p.discountPercent && p.discountPercent > 0) || (p.regularPrice && p.price < p.regularPrice);

                        return (
                          <tr key={p.id} className="hover:bg-white/5 transition-colors">
                            {/* Product Info with Thumbnail */}
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.assets?.[0] || 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200'}
                                  alt=""
                                  className="w-10 h-12 object-cover rounded-lg border border-white/10 bg-black/40 shrink-0"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200';
                                  }}
                                />
                                <div>
                                  <span className="font-bold text-white uppercase text-xs line-clamp-1 max-w-[240px]">
                                    {p.title}
                                  </span>
                                  <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">
                                    ID: #{p.id} • {p.variants?.join(', ') || 'Standard'}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="p-4 font-mono text-[11px] text-stone-300">
                              <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                                {p.category}
                              </span>
                            </td>

                            {/* Pricing */}
                            <td className="p-4 font-mono">
                              <span className="text-white font-bold text-xs">BDT {p.price}</span>
                              {hasDiscount && (
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[10px] line-through text-stone-500">
                                    BDT {p.regularPrice || p.price}
                                  </span>
                                  <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1 py-0.2 rounded font-bold">
                                    -{p.discountPercent || Math.round(((p.regularPrice! - p.price) / p.regularPrice!) * 100)}%
                                  </span>
                                </div>
                              )}
                            </td>

                            {/* Stock */}
                            <td className="p-4 font-mono">
                              {isOutOfStock ? (
                                <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase">
                                  OUT OF STOCK
                                </span>
                              ) : isLowStock ? (
                                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase">
                                  LOW STOCK ({p.stock})
                                </span>
                              ) : (
                                <span className="text-emerald-400 font-bold text-xs">
                                  {p.stock ?? 35} Units
                                </span>
                              )}
                            </td>

                            {/* Status */}
                            <td className="p-4">
                              <span className={`text-[9px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border ${
                                p.status === 'draft' 
                                  ? 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' 
                                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              }`}>
                                {p.status || 'active'}
                              </span>
                            </td>

                            {/* Action Buttons */}
                            <td className="p-4 text-right space-x-1 whitespace-nowrap">
                              <button
                                onClick={() => handleToggleProductStock(p)}
                                className="p-2 hover:bg-white/10 rounded-xl text-stone-300 hover:text-white transition-colors"
                                title={p.stock === 0 ? "Mark as in-stock" : "Mark as out-of-stock"}
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditProductClick(p)}
                                className="p-2 hover:bg-white/10 rounded-xl text-[#C9A66B] transition-colors"
                                title="Edit Product"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProductClick(p.id)}
                                className="p-2 hover:bg-white/10 rounded-xl text-rose-400 hover:text-rose-300 transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: CATEGORIES MANAGEMENT                             */}
        {/* ======================================================== */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-[#1A3070]/40 border border-white/10 p-5 rounded-3xl backdrop-blur-xl shadow-xl flex items-center justify-between gap-4">
              <div>
                <span className="text-[9px] font-mono text-[#C9A66B] font-bold tracking-widest uppercase block mb-1">
                  COLLECTION TAXONOMY
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white uppercase">
                  Category Catalog ({categoriesList.length})
                </h3>
              </div>
              <button
                onClick={handleOpenAddCategory}
                className="bg-[#C9A66B] hover:bg-[#d8b57b] text-[#0A1E54] px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categoriesList.map((cat) => {
                const assignedProducts = productsList.filter(p => p.category === cat.name);
                return (
                  <div 
                    key={cat.id}
                    className="bg-[#1A3070]/40 border border-white/10 rounded-3xl p-5 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-4 hover:border-white/20 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-black/40 border border-white/5">
                        <img 
                          src={cat.image || 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600'} 
                          alt="" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600';
                          }}
                        />
                        <span className="absolute top-2 right-2 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-[#0A1E54]/90 text-[#C9A66B] border border-[#C9A66B]/30">
                          {assignedProducts.length} PRODUCTS
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-base text-white">{cat.name}</h4>
                        {cat.nameBn && (
                          <span className="text-xs text-[#C9A66B] font-medium block">{cat.nameBn}</span>
                        )}
                        <p className="text-xs text-stone-400 font-sans mt-1 line-clamp-2">
                          {cat.description || 'No description provided.'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-500 font-bold">/{cat.slug || cat.id}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditCategory(cat)}
                          className="p-2 hover:bg-white/10 rounded-xl text-[#C9A66B] transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-2 hover:bg-white/10 rounded-xl text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: PROMO CODES MANAGEMENT                            */}
        {/* ======================================================== */}
        {activeTab === 'promocodes' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-[#1A3070]/40 border border-white/10 p-5 rounded-3xl backdrop-blur-xl shadow-xl flex items-center justify-between gap-4">
              <div>
                <span className="text-[9px] font-mono text-[#C9A66B] font-bold tracking-widest uppercase block mb-1">
                  DISCOUNT ENGINE
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white uppercase">
                  Active & Expired Promo Codes ({promosList.length})
                </h3>
              </div>
              <button
                onClick={handleOpenAddPromo}
                className="bg-[#C9A66B] hover:bg-[#d8b57b] text-[#0A1E54] px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" /> Create Promo Code
              </button>
            </div>

            {/* Promo Codes Table */}
            <div className="bg-[#1A3070]/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-stone-300">
                  <thead className="bg-[#0A1E54]/80 border-b border-white/10 font-mono uppercase tracking-wider text-[9px] text-[#C9A66B]">
                    <tr>
                      <th className="p-4">COUPON CODE</th>
                      <th className="p-4">DISCOUNT</th>
                      <th className="p-4">MIN ORDER</th>
                      <th className="p-4">EXPIRATION</th>
                      <th className="p-4">STATUS</th>
                      <th className="p-4 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {promosList.map((pr) => {
                      const isActive = pr.status === 'active';
                      return (
                        <tr key={pr.code} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-bold text-white text-sm">
                            <span className="bg-[#0A1E54] border border-[#C9A66B]/40 px-3 py-1.5 rounded-xl text-[#C9A66B]">
                              {pr.code}
                            </span>
                          </td>
                          <td className="p-4 text-xs font-bold text-emerald-400">
                            {pr.discountType === 'percentage' ? `${pr.discountValue}% OFF` : `BDT ${pr.discountValue} FLAT`}
                          </td>
                          <td className="p-4 text-stone-300">
                            BDT {pr.minOrderAmount || 0}
                          </td>
                          <td className="p-4 text-stone-400">
                            {pr.endDate || 'No Expiry'}
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleTogglePromoStatus(pr)}
                              className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase cursor-pointer border ${
                                isActive 
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                              }`}
                            >
                              {pr.status}
                            </button>
                          </td>
                          <td className="p-4 text-right space-x-1">
                            <button
                              onClick={() => handleDeletePromo(pr.code)}
                              className="p-2 hover:bg-white/10 rounded-xl text-rose-400 transition-colors"
                              title="Delete Promo Code"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: ORDERS QUEUE & TRACKING                           */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-[#1A3070]/40 border border-white/10 p-5 rounded-3xl backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by Order ID, Customer Phone, Name..."
                    className="w-full bg-[#0A1E54]/60 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-stone-400 focus:outline-none font-sans"
                  />
                </div>
                {/* Filter */}
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-[#0A1E54]/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                >
                  <option value="All">All Statuses</option>
                  <option value="Received">Received</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <span className="text-[10px] font-mono text-[#C9A66B] font-bold shrink-0">
                TOTAL: {filteredOrders.length} ORDERS
              </span>
            </div>

            {/* Orders Feed */}
            {filteredOrders.length === 0 ? (
              <div className="bg-[#1A3070]/40 border border-white/10 rounded-3xl p-12 text-center text-zinc-400 font-mono text-xs">
                No orders match your filter criteria.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((ord) => (
                  <div 
                    key={ord.id}
                    className="bg-[#1A3070]/40 border border-white/10 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3 gap-2 font-mono">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-bold text-sm">#{ord.id}</span>
                        <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          ord.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' :
                          ord.status === 'Shipped' ? 'bg-sky-500/20 text-sky-300' :
                          ord.status === 'Processing' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-zinc-500/20 text-zinc-300'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                      <span className="text-zinc-400 text-xs">
                        {new Date(ord.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Customer Info */}
                      <div className="bg-[#0A1E54]/40 border border-white/5 p-4 rounded-2xl space-y-1.5 text-xs">
                        <span className="text-[8px] font-mono text-[#C9A66B] font-bold uppercase tracking-wider block">
                          CUSTOMER DETAILS
                        </span>
                        <p className="font-bold text-white text-sm">{ord.fullName}</p>
                        <p className="text-stone-300 font-mono flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-[#C9A66B]" />
                          <span>{ord.phone}</span>
                          <a 
                            href={`https://wa.me/${ord.phone.replace(/[^0-9]/g, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#C9A66B] text-[10px] underline ml-2"
                          >
                            WhatsApp Customer
                          </a>
                        </p>
                        <p className="text-stone-400 font-sans">{ord.address}</p>
                        <p className="text-zinc-500 font-mono text-[10px] pt-1">Payment: {ord.paymentMethod}</p>
                      </div>

                      {/* Items Ordered */}
                      <div className="bg-[#0A1E54]/40 border border-white/5 p-4 rounded-2xl flex flex-col justify-between text-xs space-y-2">
                        <div>
                          <span className="text-[8px] font-mono text-[#C9A66B] font-bold uppercase tracking-wider block mb-2">
                            ORDERED ITEMS
                          </span>
                          <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                            {ord.items?.map((it, idx) => (
                              <div key={idx} className="flex justify-between items-center text-xs font-mono">
                                <span className="text-stone-300 truncate max-w-[200px]">
                                  {it.title} <strong className="text-[#C9A66B]">({it.variant})</strong>
                                </span>
                                <span className="text-white font-bold">{it.quantity}x • ৳{it.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-white/10 font-mono font-bold text-sm">
                          <span className="text-zinc-400">Total Price:</span>
                          <span className="text-[#C9A66B]">৳{ord.totalPrice}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Changer Bar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-zinc-400">Update Phase:</span>
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="bg-[#0A1E54] border border-white/20 text-white px-3 py-1.5 rounded-xl font-mono text-xs focus:outline-none"
                        >
                          <option value="Received">Received</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>

                      <button
                        onClick={() => handleDeleteOrder(ord.id)}
                        className="text-rose-400 hover:text-rose-300 text-[10px] font-mono uppercase"
                      >
                        Delete Order Record
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: CUSTOMERS DIRECTORY                               */}
        {/* ======================================================== */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-[#1A3070]/40 border border-white/10 p-5 rounded-3xl backdrop-blur-xl shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono text-[#C9A66B] font-bold tracking-widest uppercase block mb-1">
                  CLIENT REGISTRY
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white uppercase">
                  Registered Customers ({usersList.length})
                </h3>
              </div>
            </div>

            <div className="bg-[#1A3070]/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-stone-300 font-sans">
                  <thead className="bg-[#0A1E54]/80 border-b border-white/10 font-mono uppercase tracking-wider text-[9px] text-[#C9A66B]">
                    <tr>
                      <th className="p-4">CLIENT NAME</th>
                      <th className="p-4">EMAIL ADDRESS</th>
                      <th className="p-4">ROLE</th>
                      <th className="p-4">FIREBASE UID</th>
                      <th className="p-4">LAST UPDATED</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-xs">
                    {usersList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-10 text-center text-zinc-400">
                          No registered customer profiles found.
                        </td>
                      </tr>
                    ) : (
                      usersList.map((usr) => (
                        <tr key={usr.uid} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-bold text-white font-sans flex items-center gap-3">
                            <img
                              src={usr.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${usr.email || usr.uid}`}
                              alt=""
                              className="w-8 h-8 rounded-full border border-white/10 bg-black/40 shrink-0"
                            />
                            <span>{usr.displayName || 'Member'}</span>
                          </td>
                          <td className="p-4 text-stone-300">{usr.email || 'None'}</td>
                          <td className="p-4">
                            <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                              usr.role === 'admin' 
                                ? 'bg-[#C9A66B]/20 text-[#C9A66B] border border-[#C9A66B]/30' 
                                : 'bg-white/5 text-stone-300'
                            }`}>
                              {usr.role || 'customer'}
                            </span>
                          </td>
                          <td className="p-4 text-zinc-500 font-mono text-[10px]">
                            {usr.uid ? usr.uid.slice(0, 12) + '...' : '-'}
                          </td>
                          <td className="p-4 text-zinc-400 text-[10px]">
                            {usr.updatedAt ? new Date(usr.updatedAt).toLocaleDateString() : '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: SETTINGS & DATABASE SEED                          */}
        {/* ======================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            
            {/* Announcement Marquee Config */}
            <div className="bg-[#1A3070]/40 border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-xl space-y-6">
              <div>
                <span className="text-[9px] font-mono text-[#C9A66B] font-bold tracking-widest uppercase block mb-1">
                  STORE NOTICE BOARD
                </span>
                <h3 className="text-lg font-bold text-white uppercase">
                  Top Announcement Bar Configuration
                </h3>
              </div>

              <form onSubmit={handleSaveAnnouncement} className="space-y-4 font-sans text-xs">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-400 font-bold mb-1.5">
                    Announcement Message (English / Bengali)
                  </label>
                  <input
                    type="text"
                    required
                    value={noticeMessage}
                    onChange={(e) => setNoticeMessage(e.target.value)}
                    className="w-full bg-[#0A1E54]/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#C9A66B]"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="noticeActive"
                    checked={noticeActive}
                    onChange={(e) => setNoticeActive(e.target.checked)}
                    className="w-4 h-4 accent-[#C9A66B]"
                  />
                  <label htmlFor="noticeActive" className="text-stone-300 font-mono cursor-pointer">
                    Enable Notice Billboard Marquee on Website
                  </label>
                </div>

                <button
                  type="submit"
                  className="bg-[#C9A66B] hover:bg-[#d8b57b] text-[#0A1E54] px-6 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold shadow-md cursor-pointer transition-all"
                >
                  Save Announcement
                </button>
              </form>
            </div>

            {/* Database Initial Seeding */}
            <div className="bg-[#1A3070]/40 border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-xl space-y-4">
              <div>
                <span className="text-[9px] font-mono text-[#C9A66B] font-bold tracking-widest uppercase block mb-1">
                  DATABASE RE-SYNC
                </span>
                <h3 className="text-lg font-bold text-white uppercase">
                  Seed Full Patowary Fashion Catalog
                </h3>
                <p className="text-xs text-stone-400 mt-1 font-sans">
                  Click below if the Firestore database products, categories, or promo codes need to be reloaded from the official 14-piece streetwear catalog.
                </p>
              </div>

              <button
                onClick={handleDatabaseSeed}
                className="bg-[#0A1E54] hover:bg-[#1A3070] border border-[#C9A66B] text-[#C9A66B] px-6 py-3 rounded-2xl font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all hover:scale-102 active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-[#C9A66B]" />
                SEED LIVE FIRESTORE DATABASE
              </button>
            </div>

          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT PRODUCT                                */}
      {/* ======================================================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0A1E54] border border-white/20 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto text-left">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-white p-2"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base sm:text-lg font-bold text-white font-sans uppercase mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#C9A66B]" />
              {editingProduct ? 'Edit Fashion Product' : 'Add New Streetwear Product'}
            </h3>

            <form onSubmit={handleSaveProductSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={prodTitle}
                  onChange={(e) => setProdTitle(e.target.value)}
                  placeholder="e.g. Patowary Heavyweight Baggy Cargo Pants"
                  className="w-full bg-[#1A3070]/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#C9A66B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold mb-1">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full bg-[#1A3070]/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#C9A66B]"
                  >
                    {categoriesList.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold mb-1">Status</label>
                  <select
                    value={prodStatus}
                    onChange={(e) => setProdStatus(e.target.value as any)}
                    className="w-full bg-[#1A3070]/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#C9A66B]"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold mb-1">Regular Price (BDT)</label>
                  <input
                    type="number"
                    required
                    value={prodRegularPrice}
                    onChange={(e) => handleRegularPriceChange(Number(e.target.value))}
                    className="w-full bg-[#1A3070]/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold mb-1">Discount %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={prodDiscountPercent}
                    onChange={(e) => handleDiscountPercentChange(Number(e.target.value))}
                    className="w-full bg-[#1A3070]/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-[#C9A66B] uppercase font-bold mb-1">Sale Price (BDT)</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full bg-[#1A3070]/60 border border-[#C9A66B]/50 rounded-xl p-3 text-[#C9A66B] font-bold focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full bg-[#1A3070]/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold mb-1">Size Variants (Comma Separated)</label>
                  <input
                    type="text"
                    required
                    value={prodVariants}
                    onChange={(e) => setProdVariants(e.target.value)}
                    placeholder="M, L, XL"
                    className="w-full bg-[#1A3070]/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold mb-1">Out of Stock Variants (Comma Separated)</label>
                <input
                  type="text"
                  value={prodOutOfStock}
                  onChange={(e) => setProdOutOfStock(e.target.value)}
                  placeholder="e.g. XL"
                  className="w-full bg-[#1A3070]/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold mb-1">Image Asset URLs (Comma Separated)</label>
                <input
                  type="text"
                  required
                  value={prodAssets}
                  onChange={(e) => setProdAssets(e.target.value)}
                  className="w-full bg-[#1A3070]/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold mb-1">Product Description</label>
                <textarea
                  rows={3}
                  required
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full bg-[#1A3070]/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-stone-300 font-mono uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#C9A66B] hover:bg-[#d8b57b] text-[#0A1E54] font-mono uppercase text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT CATEGORY                               */}
      {/* ======================================================== */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A1E54] border border-white/20 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-left">
            <button
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-white p-2"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base sm:text-lg font-bold text-white font-sans uppercase mb-6 flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-[#C9A66B]" />
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>

            <form onSubmit={handleSaveCategorySubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold mb-1">Category Name (English)</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Baggy & Cargo Pants"
                  className="w-full bg-[#1A3070]/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#C9A66B]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold mb-1">Category Name (Bengali)</label>
                <input
                  type="text"
                  value={catNameBn}
                  onChange={(e) => setCatNameBn(e.target.value)}
                  placeholder="e.g. ব্যাগি ও কার্গো প্যান্ট"
                  className="w-full bg-[#1A3070]/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#C9A66B]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold mb-1">URL Slug</label>
                <input
                  type="text"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  placeholder="e.g. baggy-cargo-pants"
                  className="w-full bg-[#1A3070]/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={catImage}
                  onChange={(e) => setCatImage(e.target.value)}
                  className="w-full bg-[#1A3070]/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full bg-[#1A3070]/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-stone-300 font-mono uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#C9A66B] hover:bg-[#d8b57b] text-[#0A1E54] font-mono uppercase text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT PROMO CODE                             */}
      {/* ======================================================== */}
      {isPromoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A1E54] border border-white/20 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-left">
            <button
              onClick={() => setIsPromoModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-white p-2"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base sm:text-lg font-bold text-white font-sans uppercase mb-6 flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#C9A66B]" />
              Create Promo Voucher
            </h3>

            <form onSubmit={handleSavePromoSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. PATOWARY15"
                  className="w-full bg-[#1A3070]/60 border border-white/10 rounded-xl p-3 text-[#C9A66B] font-bold focus:outline-none focus:border-[#C9A66B] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold mb-1">Discount Type</label>
                  <select
                    value={promoDiscountType}
                    onChange={(e) => setPromoDiscountType(e.target.value as any)}
                    className="w-full bg-[#1A3070]/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none font-mono"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed BDT (৳)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={promoDiscountValue}
                    onChange={(e) => setPromoDiscountValue(Number(e.target.value))}
                    className="w-full bg-[#1A3070]/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold mb-1">Min Order Amount (BDT)</label>
                  <input
                    type="number"
                    value={promoMinOrder}
                    onChange={(e) => setPromoMinOrder(Number(e.target.value))}
                    className="w-full bg-[#1A3070]/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold mb-1">End Date</label>
                  <input
                    type="date"
                    value={promoEndDate}
                    onChange={(e) => setPromoEndDate(e.target.value)}
                    className="w-full bg-[#1A3070]/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPromoModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-stone-300 font-mono uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#C9A66B] hover:bg-[#d8b57b] text-[#0A1E54] font-mono uppercase text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
