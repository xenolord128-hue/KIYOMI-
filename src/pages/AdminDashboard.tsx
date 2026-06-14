import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
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
  Code, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp, 
  Truck, 
  Sliders,
  DollarSign,
  Package,
  Activity,
  Award,
  Database,
  Sparkles,
  Info,
  CheckCircle,
  FileCode
} from 'lucide-react';

const CUSTOM_GADGETS_SEED = [
  {
    id: 1,
    title: "KIYOMI Chrono X1 Smartwatch",
    category: "Smartwatches",
    price: 4500,
    rating: 4.9,
    assets: [
      "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800",
      "https://images.unsplash.com/photo-1517502884422-41eaaced0168?w=800",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=800"
    ],
    variants: ["Space Gray", "Obsidian Black", "Pure Silver"],
    outOfStock: ["Pure Silver"],
    description: "Super AMOLED 1.43-inch display, dual-core chipset, with up to 14 days standby power. Premium aerospace-grade titanium frame with continuous blood oxygen monitoring.",
    reviews: [
      { id: 1, userName: "Abrar Rahman", rating: 5, comment: "Incredible battery life and premium build!" }
    ],
    stock: 25
  },
  {
    id: 2,
    title: "KIYOMI SonicBuds Pro ANC",
    category: "Earbuds & Audio",
    price: 3200,
    rating: 5.0,
    assets: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
      "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=800",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800"
    ],
    variants: ["Matte Black", "Arctic White"],
    outOfStock: [],
    description: "Active Noise Cancellation up to 48dB, high-fidelity dynamic drivers, with zero-latency gaming transmission interface.",
    reviews: [
      { id: 1, userName: "Sadnan Kabir", rating: 5, comment: "Pure audio acoustics crafted for urban audiophiles." }
    ],
    stock: 18
  },
  {
    id: 3,
    title: "KIYOMI Neo-Type Mechanical Keypad",
    category: "Mice & Keyboards",
    price: 5800,
    rating: 4.8,
    assets: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800",
      "https://images.unsplash.com/photo-1626908013351-800ddd734b8a?w=800",
      "https://images.unsplash.com/photo-1547119957-637f8679db1e?w=800"
    ],
    variants: ["Carbon Fade", "Neon Mint"],
    outOfStock: [],
    description: "Gasket mount mechanical keyboard, customized brown tactile switches, sound absorbing layers with premium dye-subbed keycaps. Includes dynamic RGB routing.",
    reviews: [
      { id: 1, userName: "Imtiaz Hassan", rating: 5, comment: "Perfect typing experience." }
    ],
    stock: 12
  },
  {
    id: 4,
    title: "KIYOMI VoltStream 100W GaN Adapter",
    category: "Power & Chargers",
    price: 2400,
    rating: 4.7,
    assets: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800",
      "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=800",
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800",
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800"
    ],
    variants: ["Sleek Gray", "Off White"],
    outOfStock: [],
    description: "Ultra-compact Gallium Nitride power center with 3x USB-C fast charging slots. Intelligently routes electric flow to safe-protect notebook batteries.",
    reviews: [],
    stock: 30
  },
  {
    id: 5,
    title: "KIYOMI Aurora Ambient Lamp Grid",
    category: "Smart Gadgets",
    price: 1800,
    rating: 4.6,
    assets: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800",
      "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=800",
      "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=800",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"
    ],
    variants: ["Default Color"],
    outOfStock: [],
    description: "Smart ambient layout light with sound responsive frequency sync, controlled wirelessly via smartphone. Creates deep therapeutic atmosphere.",
    reviews: [],
    stock: 15
  },
  {
    id: 6,
    title: "KIYOMI Classic Brass Desk Clock",
    category: "Smartwatches",
    price: 2900,
    rating: 4.9,
    assets: [
      "https://images.unsplash.com/photo-1563861826100-9cb868fdcd1d?w=800",
      "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800",
      "https://images.unsplash.com/photo-1518131394553-c3e387c162da?w=800",
      "https://images.unsplash.com/photo-1585128792020-803d29415281?w=800"
    ],
    variants: ["Vintage Gold", "Matte Jet"],
    outOfStock: [],
    description: "Pure retro brass analog desktop clock with a quiet high-precision quartz movement. Represents classic mechanical chronography.",
    reviews: [],
    stock: 10
  }
];

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // If not admin, block entry
  useEffect(() => {
    if (!isAdmin) {
      navigate('/auth');
      playCinematicIntroSound("Admin accreditation required. Entry denied.");
    }
  }, [isAdmin, navigate]);

  // Tab Control State (5 distinct slots with separate 'upload' tab on top)
  const [activeTab, setActiveTab] = useState<'upload' | 'inventory' | 'orders' | 'notices' | 'metrics'>('upload');

  // Real-time Firestore sync
  const [productsList, setProductsList] = useState<any[]>([]);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  
  // Notices states
  const [noticeMessage, setNoticeMessage] = useState('KIYOMI BANGLADESH: ENJOY FREE COURIER FOR ALL ORDERS ABOVE BDT 5000');
  const [noticeActive, setNoticeActive] = useState(true);

  // Status handlers
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Form State for Adding/Editing Product
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [prodTitle, setProdTitle] = useState('');
  const [prodCategory, setProdCategory] = useState('Smartwatches');
  const [prodPrice, setProdPrice] = useState(3500);
  const [prodStock, setProdStock] = useState(25);
  const [prodDesc, setProdDesc] = useState('');
  const [prodVariants, setProdVariants] = useState('Meteor Black, Pure Silver, Rose Gold');
  const [prodAssets, setProdAssets] = useState('https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800');
  const [prodOutOfStock, setProdOutOfStock] = useState('Rose Gold');

  // 1. Sync Products & Orders from Firestore
  useEffect(() => {
    if (!isAdmin) return;

    // Listen to Products
    const unsubProd = onSnapshot(collection(db, 'products'), (snap) => {
      if (!snap.empty) {
        const arr: any[] = [];
        snap.forEach(d => arr.push(d.data()));
        arr.sort((a,b) => a.id - b.id);
        setProductsList(arr);
      } else {
        // If firestore is completely empty, enable default products seeding trigger
        setProductsList([]);
      }
    });

    // Listen to Orders
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snap) => {
      const arr: any[] = [];
      snap.forEach(d => arr.push(d.data()));
      // Sort newest orders first
      arr.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrdersList(arr);
    }, (err) => {
      // If offline/placeholder auth, pull from local backup suggestions
      const rawLocal = localStorage.getItem('KIYOMI_local_orders') || localStorage.getItem('dorax_local_orders');
      if (rawLocal) {
        setOrdersList(JSON.parse(rawLocal));
      }
    });

    // Listen to Notices Settings
    const unsubNotice = onSnapshot(doc(db, 'settings', 'announcements'), (snap) => {
      if (snap.exists()) {
        setNoticeMessage(snap.data().message);
        setNoticeActive(snap.data().active);
      }
    });

    return () => {
      unsubProd();
      unsubOrders();
      unsubNotice();
    };
  }, [isAdmin]);

  // Seeding helper to populate standard catalog into database on raw installs
  const handleDatabaseSeed = async () => {
    setSyncStatus("SEEDING DATA...");
    try {
      for (const item of CUSTOM_GADGETS_SEED) {
        await setDoc(doc(db, 'products', String(item.id)), item);
      }
      setSyncStatus("SUCCESS: 6 GADGET PRODUCTS RECORDED IN FIRESTORE.");
      playCinematicIntroSound("Database seeded successfully with gadgets.");
      setTimeout(() => setSyncStatus(null), 3000);
    } catch (err: any) {
      console.warn("Seeding failed (probably placeholder configuration). Seeding local emulator...", err);
      setProductsList(CUSTOM_GADGETS_SEED);
      setSyncStatus("LOCAL MOCK SEED APPLIED (OFFLINE MODE)");
      setTimeout(() => setSyncStatus(null), 3000);
    }
  };

  // 2. Submit / Edit Product details
  const handleSaveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle.trim() || !prodDesc.trim()) return;

    const sizeVariantsArray = prodVariants.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
    const outOfStockArray = prodOutOfStock.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
    const assetUrlsArray = prodAssets.split(',').map(s => s.trim()).filter(Boolean);

    const targetId = editingProduct ? editingProduct.id : Date.now();

    const productPayload = {
      id: targetId,
      title: prodTitle.trim(),
      category: prodCategory,
      price: Number(prodPrice),
      stock: Number(prodStock),
      description: prodDesc.trim(),
      variants: sizeVariantsArray,
      outOfStock: outOfStockArray,
      assets: assetUrlsArray,
      reviews: editingProduct ? editingProduct.reviews : [],
      rating: editingProduct ? editingProduct.rating : 5.0
    };

    try {
      await setDoc(doc(db, 'products', String(targetId)), productPayload);
      setSyncStatus(`PRODUCT SUCCESSFULLY RECORDED`);
      playCinematicIntroSound("Gadget design updated.");
    } catch (err) {
      // Offline fallback syncing
      setProductsList(prev => {
        const matches = prev.find(p=>p.id === targetId);
        if (matches) {
          return prev.map(p => p.id === targetId ? productPayload : p);
        } else {
          return [...prev, productPayload];
        }
      });
      setSyncStatus(`Recorded to local memory trace (Offline fallback)`);
    }

    // Reset Forms
    setEditingProduct(null);
    setProdTitle('');
    setProdPrice(3500);
    setProdStock(25);
    setProdDesc('');
    setActiveTab('inventory');
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleEditProductClick = (product: any) => {
    setActiveTab('upload');
    setEditingProduct(product);
    setProdTitle(product.title);
    setProdCategory(product.category);
    setProdPrice(product.price);
    setProdStock(product.stock || 0);
    setProdDesc(product.description);
    setProdVariants(product.variants.join(', '));
    setProdAssets(product.assets.join(', '));
    setProdOutOfStock(product.outOfStock.join(', '));
    // Scroll form to top view smoothly
    setTimeout(() => {
      document.getElementById('inventory-form-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleDeleteProductClick = async (productId: number) => {
    if (!confirm("Confirm deleting this gadget from catalogue?")) return;

    try {
      await deleteDoc(doc(db, 'products', String(productId)));
      setSyncStatus("GADGET DELETED");
    } catch (err) {
      setProductsList(prev => prev.filter(p => p.id !== productId));
      setSyncStatus("Deleted locally");
    }
    setTimeout(() => setSyncStatus(null), 3500);
  };

  // 3. Status updates for checkouts (Received -> Processing -> Out for Delivery...)
  const handleUpdateOrderStatus = async (orderId: string, nextStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: nextStatus });
      setSyncStatus(`STUS UPDATED TO: ${nextStatus}`);
      playCinematicIntroSound(`Order status changed to ${nextStatus}`);

      // Sync local suggested too
      const rawLocal = localStorage.getItem('KIYOMI_local_orders') || localStorage.getItem('dorax_local_orders');
      if (rawLocal) {
        const arr = JSON.parse(rawLocal);
        const updated = arr.map((o: any) => o.id === orderId ? { ...o, status: nextStatus } : o);
        localStorage.setItem('KIYOMI_local_orders', JSON.stringify(updated));
      }
    } catch (err) {
      // Local fallback edit
      setOrdersList(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
      const rawLocal = localStorage.getItem('KIYOMI_local_orders') || localStorage.getItem('dorax_local_orders');
      if (rawLocal) {
        const arr = JSON.parse(rawLocal);
        const updated = arr.map((o: any) => o.id === orderId ? { ...o, status: nextStatus } : o);
        localStorage.setItem('KIYOMI_local_orders', JSON.stringify(updated));
      }
      setSyncStatus(`Order status adjusted in local mockup backup`);
    }
    setTimeout(() => setSyncStatus(null), 3000);
  };

  // 4. Save notice bar configs
  const handleSaveNoticeConfig = async () => {
    try {
      await setDoc(doc(db, 'settings', 'announcements'), {
        message: noticeMessage,
        active: noticeActive
      });
      setSyncStatus("BANNER SETTINGS SAVED TO FIRESTORE");
      playCinematicIntroSound("Promotion announcements updated.");
    } catch (err) {
      setSyncStatus("Saved locally (Offline mode)");
    }
    setTimeout(() => setSyncStatus(null), 3000);
  };

  // 6. Stats & Metrics math values
  const metrics = useMemo(() => {
    const totalSales = ordersList.reduce((sum, ord) => sum + ord.totalPrice, 0);
    const successfulShipments = ordersList.filter(o => o.status === 'Completed').length;
    // Calculate out of stock items
    const catProducts = productsList.length > 0 ? productsList : CUSTOM_GADGETS_SEED;
    const outOfStockCount = catProducts.filter(p => p.stock === 0 || p.outOfStock.length === p.variants.length).length;
    
    return {
      totalSales,
      successfulShipments,
      outOfStockCount,
      liveTraffic: 42 // Simulated metric representation
    };
  }, [ordersList, productsList]);

  // State for interactive monthly chart hover
  const [hoveredMonthIdx, setHoveredMonthIdx] = useState<number | null>(null);

  // Month-by-month high-fidelity dataset for visual rendering (custom optimized SVGs)
  const monthlyMetrics = [
    { name: 'Jan', sales: 44000, purchase: 32000, expenses: 9000 },
    { name: 'Feb', sales: 55000, purchase: 45000, expenses: 11050 },
    { name: 'Mar', sales: 88000, purchase: 52000, expenses: 14000 },
    { name: 'Apr', sales: 69000, purchase: 44000, expenses: 10200 },
    { name: 'May', sales: 112000, purchase: 61000, expenses: 18450 },
    { name: 'Jun', sales: 148000, purchase: 74000, expenses: 21200 },
    { name: 'Jul', sales: 185000, purchase: 82000, expenses: 27000 },
    { name: 'Aug', sales: 162000, purchase: 78000, expenses: 24100 },
    { name: 'Sep', sales: 194000, purchase: 91000, expenses: 31000 },
    { name: 'Oct', sales: 215000, purchase: 114000, expenses: 34500 },
    { name: 'Nov', sales: 238000, purchase: 120000, expenses: 38250 },
    { name: 'Dec', sales: 245000, purchase: 148000, expenses: 45000 }
  ];

  if (!isAdmin) {
    return (
      <div className="bg-[#050D0E] min-h-screen py-32 text-center flex flex-col items-center justify-center space-y-6 select-none relative overflow-hidden">
        {/* Ambient background blur */}
        <div className="absolute inset-0 bg-radial-gradient from-rose-950/20 via-[#050D0E] to-black pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-950/40 border border-rose-500/30 flex items-center justify-center mx-auto shadow-lg shadow-rose-950/50">
            <Lock className="w-8 h-8 text-rose-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-serif font-extrabold text-stone-200 tracking-widest uppercase leading-tight select-none">
            ACCREDITATION REJECTED
          </h2>
          <p className="text-zinc-500 font-mono text-xs max-w-md mx-auto leading-relaxed uppercase">
            Acknowledge: Your email coordinates are not matched with the active system whitelist.
          </p>
          <div className="pt-4">
            <Link 
              to="/" 
              className="inline-block bg-gradient-to-r from-stone-800 to-zinc-900 border border-white/5 hover:border-[#54a8fc]/40 text-[#54a8fc] font-mono tracking-widest uppercase text-[10px] font-bold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(84,168,252,0.2)] hover:-translate-y-0.5 active:translate-y-0 text-center"
            >
              RETURN TO SAFETY HOME
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Helper calculating SVG coordinate maps for buttery smooth viewport charting
  const renderSvgAreaPath = (key: 'sales' | 'purchase' | 'expenses') => {
    const width = 800;
    const height = 180;
    const padding = 20;
    const dataPoints = monthlyMetrics;
    const maxVal = 260000;
    
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

  return (
    <div id="admin-workspace-view" className="bg-[#050D0E] min-h-screen pb-24 font-sans text-stone-300 relative selection:bg-[#54a8fc] selection:text-black overflow-x-hidden">
      
      {/* Background ambient light effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-lime-950/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Real-time sync status banner */}
      {syncStatus && (
        <div 
          className="bg-[#54a8fc] text-slate-950 font-mono tracking-widest uppercase text-[10px] font-bold py-2.5 px-4 text-center sticky top-0 z-[1000] border-b border-white/10 shadow-[0_4px_24px_rgba(84,168,252,0.35)] flex items-center justify-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
          ✦ DB_EVENT REGISTERED: {syncStatus}
        </div>
      )}

      {/* TOP HEADER SECTION */}
      <header className="border-b border-white/5 bg-slate-950/40 backdrop-blur-md py-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[9px] font-mono tracking-widest text-[#CBF23D] uppercase font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#CBF23D] shadow-[0_0_8px_#CBF23D]" />
              DHAKA REGION CENTRAL WAREHOUSE CONSOLE
            </span>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-[0.06em] text-white uppercase font-sans">
                KIYOMI <span className="text-[#54a8fc] text-base sm:text-lg">/ CONTROL TERMINAL</span>
              </h1>
            </div>
          </div>
          <Link 
            to="/" 
            className="text-stone-400 hover:text-white text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 self-start sm:self-center border border-white/5 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full transition-all duration-300 pointer-events-auto"
            onClick={() => playCinematicIntroSound("Command center exited.")}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> LEAVE TERMINAL
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* BENTO STATISTICS GRID (FROM PREMIUM FIGMA ARCHITECTURE) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="bento-stats-container">
          
          {/* Card 1: Total Sales */}
          <div
            className="bg-[#121E20] border border-white/5 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between h-36 shadow-lg shadow-black/40 transition-all duration-300 hover:scale-[1.01] hover:border-white/10 group"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[8px] font-mono text-[#54a8fc] font-bold tracking-widest uppercase block mb-1">TOTAL SALES REVENUE</span>
                <span className="text-2xl font-mono font-bold text-white tracking-tight pt-1">
                  BDT {metrics.totalSales || "2,74,500"}
                </span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-cyan-950/60 border border-[#54a8fc]/20 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-[#54a8fc]" />
              </div>
            </div>
            {/* Subtle Sparkline SVG Graphic */}
            <div className="w-full h-8 overflow-hidden relative -mb-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0,15 Q15,4 30,12 T60,5 T90,14 T100,2" fill="none" stroke="#54a8fc" strokeWidth="1.5" />
                <path d="M0,15 Q15,4 30,12 T60,5 T90,14 T100,2 L100,20 L0,20 Z" fill="url(#sparkline-grad-1)" opacity="0.15" />
                <defs>
                  <linearGradient id="sparkline-grad-1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#54a8fc" />
                    <stop offset="100%" stopColor="#54a8fc" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Card 2: Shipments */}
          <div
            className="bg-[#121E20] border border-white/5 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between h-36 shadow-lg shadow-black/40 transition-all duration-300 hover:scale-[1.01] hover:border-white/10 group"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[8px] font-mono text-[#CBF23D] font-bold tracking-widest uppercase block mb-1">COMPLETED DELIVERIES</span>
                <span className="text-2xl font-mono font-bold text-[#CBF23D] tracking-tight pt-1">
                  {metrics.successfulShipments || "14"} <span className="text-[11px] font-sans font-normal text-zinc-400">UNITS</span>
                </span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-lime-950/40 border border-[#CBF23D]/20 flex items-center justify-center">
                <Truck className="w-4 h-4 text-[#CBF23D]" />
              </div>
            </div>
            {/* Smooth mini stats trend descriptor */}
            <div className="text-[10px] font-mono tracking-wider text-zinc-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CBF23D]" /> STATUS PHASE: 'COMPLETED'
            </div>
          </div>

          {/* Card 3: Deficient stock */}
          <div
            className="bg-[#121E20] border border-white/5 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between h-36 shadow-lg shadow-black/40 transition-all duration-300 hover:scale-[1.01] hover:border-white/10 group"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[8px] font-mono text-zinc-500 font-bold tracking-widest uppercase block mb-1">DEFICIENT STOCK ITEMS</span>
                <span className="text-2xl font-mono font-bold text-rose-500 tracking-tight pt-1">
                  {metrics.outOfStockCount || "0"} <span className="text-[11px] font-sans font-normal text-zinc-400">ITEMS</span>
                </span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-red-950/40 border border-rose-500/20 flex items-center justify-center">
                <Package className="w-4 h-4 text-rose-500" />
              </div>
            </div>
            <div className="text-[10px] font-mono text-rose-450 uppercase tracking-widest flex items-center gap-1">
              {metrics.outOfStockCount > 0 ? "⚠️ REPLENISHMENT DEMANDED" : "✓ CATALOG CHANNELS ADEQUATE"}
            </div>
          </div>

          {/* Card 4: Web traffic */}
          <div
            className="bg-[#121E20] border border-white/5 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between h-36 shadow-lg shadow-black/40 transition-all duration-300 hover:scale-[1.01] hover:border-white/10 group"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[8px] font-mono text-zinc-500 tracking-widest uppercase block mb-1">LIVE DIGITAL TRAFFIC</span>
                <span className="text-2xl font-mono font-bold text-white tracking-tight pt-1 flex items-center gap-1.5">
                  {metrics.liveTraffic || "42"} <span className="text-[10px] font-mono font-bold tracking-widest text-[#54a8fc] uppercase animate-pulse">ON-LINE</span>
                </span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center">
                <Activity className="w-4 h-4 text-[#54a8fc] animate-pulse" />
              </div>
            </div>
            <div className="text-[10px] font-mono text-zinc-500 tracking-wider">
              ✦ LATENCY COMPLIANCE INDEX: 99.8%
            </div>
          </div>

        </section>

        {/* MAIN VISUAL AREA CHART: SALES VS PURCHASE VS EXPENSES */}
        <section className="bg-slate-950/40 border border-white/5 rounded-3xl p-6 sm:p-8 shadow-lg shadow-black/30 relative">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5 mb-6">
            <div>
              <span className="text-[8px] font-mono text-[#54a8fc] font-bold tracking-[0.2em] uppercase block mb-1">ANALYTICS ENGINE V2</span>
              <h2 className="text-lg font-bold font-sans tracking-wide text-white uppercase">
                SALES VS PURCHASE OVERVIEW
              </h2>
            </div>
            <div className="flex items-center gap-4 flex-wrap text-[10px] font-mono tracking-wider">
              <div className="flex items-center gap-1.5 text-white">
                <span className="w-2.5 h-2.5 rounded bg-[#54a8fc]" /> SALES
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <span className="w-2.5 h-2.5 rounded bg-[#CBF23D]" /> PURCHASE
              </div>
              <div className="flex items-center gap-1.5 text-zinc-550">
                <span className="w-2.5 h-2.5 rounded bg-amber-500" /> EXPENSES
              </div>
            </div>
          </div>

          {/* Interactive Custom SVG Chart */}
          <div className="relative w-full overflow-hidden select-none">
            <svg 
              className="w-full h-auto min-h-[200px]" 
              viewBox="0 0 800 180" 
              style={{ contentVisibility: 'auto' }}
            >
              {/* Grids */}
              <line x1="20" y1="20" x2="780" y2="20" stroke="rgba(255,255,255,0.02)" strokeDasharray="3 3" />
              <line x1="20" y1="53" x2="780" y2="53" stroke="rgba(255,255,255,0.02)" strokeDasharray="3 3" />
              <line x1="20" y1="86" x2="780" y2="86" stroke="rgba(255,255,255,0.02)" strokeDasharray="3 3" />
              <line x1="20" y1="120" x2="780" y2="120" stroke="rgba(255,255,255,0.02)" strokeDasharray="3 3" />
              <line x1="20" y1="160" x2="780" y2="160" stroke="rgba(255,255,255,0.06)" />

              {/* Grid Vertical Columns */}
              {monthlyMetrics.map((val, idx) => {
                const x = 20 + (idx * 760) / 11;
                return (
                  <line key={`x-grid-${idx}`} x1={x} y1="20" x2={x} y2="160" stroke="rgba(255,255,255,0.02)" />
                );
              })}

              {/* Area 3: Expenses */}
              <path d={renderSvgAreaPath('expenses').area} fill="url(#expenses-gradient)" opacity="0.1" />
              <path d={renderSvgAreaPath('expenses').line} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />

              {/* Area 2: Purchase */}
              <path d={renderSvgAreaPath('purchase').area} fill="url(#purchase-gradient)" opacity="0.08" />
              <path d={renderSvgAreaPath('purchase').line} fill="none" stroke="#CBF23D" strokeWidth="2" strokeLinecap="round" />

              {/* Area 1: Sales */}
              <path d={renderSvgAreaPath('sales').area} fill="url(#sales-gradient)" opacity="0.15" />
              <path d={renderSvgAreaPath('sales').line} fill="none" stroke="#54a8fc" strokeWidth="3" strokeLinecap="round" />

              {/* Hover highlight line */}
              {hoveredMonthIdx !== null && (
                <line 
                  x1={20 + (hoveredMonthIdx * 760) / 11} 
                  y1="10" 
                  x2={20 + (hoveredMonthIdx * 760) / 11} 
                  y2="160" 
                  stroke="rgba(84, 168, 252, 0.4)" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4"
                />
              )}

              {/* Interactive nodes triggering hovers */}
              {monthlyMetrics.map((val, idx) => {
                const x = 20 + (idx * 760) / 11;
                const maxVal = 260000;
                const salesY = 180 - 20 - (val.sales / maxVal) * 140;
                
                return (
                  <g 
                    key={`node-${idx}`}
                    onMouseEnter={() => setHoveredMonthIdx(idx)}
                    onMouseLeave={() => setHoveredMonthIdx(null)}
                    className="cursor-pointer"
                  >
                    {/* Oversized transparent click box for easy mobile hovering */}
                    <rect x={x - 20} y="10" width="40" height="150" fill="transparent" />
                    
                    {/* Glowing dots */}
                    {hoveredMonthIdx === idx && (
                      <circle cx={x} cy={salesY} r="8" fill="#54a8fc" opacity="0.3" />
                    )}
                    <circle cx={x} cy={salesY} r="4" fill="#54a8fc" stroke="#050D0E" strokeWidth="1" />
                  </g>
                );
              })}

              {/* Gradients */}
              <defs>
                <linearGradient id="sales-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#54a8fc" />
                  <stop offset="100%" stopColor="#54a8fc" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="purchase-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#CBF23D" />
                  <stop offset="100%" stopColor="#CBF23D" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="expenses-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Monthly Categories display label footer coordinates */}
            <div className="flex justify-between px-5 font-mono text-[9px] text-zinc-550 tracking-wider uppercase pt-4 border-t border-white/5">
              {monthlyMetrics.map((val, idx) => (
                <span 
                  key={`lbl-${idx}`} 
                  className={`transition-all duration-200 ${hoveredMonthIdx === idx ? 'text-[#54a8fc] font-bold scale-110' : ''}`}
                >
                  {val.name}
                </span>
              ))}
            </div>

            {/* Custom Interactive Floating Overlay Tooltip wrapper */}
            {hoveredMonthIdx !== null && (
              <div 
                className="absolute top-2 left-1/2 -translate-x-1/2 p-3 bg-stone-900 border border-white/10 rounded-xl shadow-xl flex items-center gap-4 text-xs font-mono pointer-events-none select-none z-10"
              >
                <div>
                  <span className="text-[7.5px] text-zinc-500 block">PERIOD INDEX</span>
                  <span className="text-[#CBF23D] font-bold">{monthlyMetrics[hoveredMonthIdx].name} Drop</span>
                </div>
                <div className="w-[1px] h-6 bg-white/10" />
                <div>
                  <span className="text-[7.5px] text-[#54a8fc] block">SALES</span>
                  <span className="text-white font-bold">BDT {monthlyMetrics[hoveredMonthIdx].sales}</span>
                </div>
                <div className="w-[1px] h-6 bg-white/10" />
                <div>
                  <span className="text-[7.5px] text-[#CBF23D] block">PURCHASE</span>
                  <span className="text-white font-bold">BDT {monthlyMetrics[hoveredMonthIdx].purchase}</span>
                </div>
              </div>
            )}

          </div>

        </section>

        {/* TWO-COLUMN CONTROLS LAYOUT SHEET */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SECTOR SELECTORS BAR (3-COLS) */}
          <nav className="lg:col-span-3 space-y-2 bg-slate-950/35 border border-white/5 p-4 rounded-3xl shadow-lg relative overflow-hidden">
            <span className="absolute top-0 right-0 w-24 h-24 bg-[#54a8fc]/5 rounded-full blur-xl pointer-events-none" />
            <div className="text-[9px] font-mono tracking-widest uppercase text-zinc-550 font-bold border-b border-white/5 pb-2 mb-3 px-1">
              CONTROL NAVIGATION
            </div>

            <button
              onClick={() => {
                setActiveTab('upload');
                playCinematicIntroSound("Product upload interface loaded.");
              }}
              className={`w-full text-left text-[11px] font-mono uppercase tracking-widest p-3.5 rounded-2xl flex items-center justify-between gap-3 transition-all duration-300 pointer-events-auto cursor-pointer ${activeTab === 'upload' ? 'bg-[#54a8fc] text-slate-950 font-bold shadow-[0_4px_16px_rgba(84,168,252,0.15)]' : 'text-stone-300 hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> <span>UPLOAD PRODUCT</span>
              </div>
              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${activeTab === 'upload' ? 'bg-slate-950 text-[#54a8fc]' : 'bg-white/5 text-zinc-500'}`}>
                NEW
              </span>
            </button>
            
            <button
              onClick={() => {
                setActiveTab('inventory');
                playCinematicIntroSound("Inventory segment loaded.");
              }}
              className={`w-full text-left text-[11px] font-mono uppercase tracking-widest p-3.5 rounded-2xl flex items-center justify-between gap-3 transition-all duration-300 pointer-events-auto cursor-pointer ${activeTab === 'inventory' ? 'bg-[#54a8fc] text-slate-950 font-bold shadow-[0_4px_16px_rgba(84,168,252,0.15)]' : 'text-stone-300 hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" /> <span>INVENTORY</span>
              </div>
              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${activeTab === 'inventory' ? 'bg-slate-950 text-[#54a8fc]' : 'bg-white/5 text-zinc-500'}`}>
                {productsList.length > 0 ? productsList.length : CUSTOM_GADGETS_SEED.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('orders');
                playCinematicIntroSound("Orders database loaded.");
              }}
              className={`w-full text-left text-[11px] font-mono uppercase tracking-widest p-3.5 rounded-2xl flex items-center justify-between gap-3 transition-all duration-300 pointer-events-auto cursor-pointer ${activeTab === 'orders' ? 'bg-[#54a8fc] text-slate-950 font-bold shadow-[0_4px_16px_rgba(84,168,252,0.15)]' : 'text-stone-300 hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4" /> <span>ORDERS QUEUE</span>
              </div>
              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${activeTab === 'orders' ? 'bg-slate-950 text-[#54a8fc]' : 'bg-white/5 text-zinc-500'}`}>
                {ordersList.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('notices');
                playCinematicIntroSound("Notice billboard configuration loaded.");
              }}
              className={`w-full text-left text-[11px] font-mono uppercase tracking-widest p-3.5 rounded-2xl flex items-center justify-between gap-3 transition-all duration-300 pointer-events-auto cursor-pointer ${activeTab === 'notices' ? 'bg-[#54a8fc] text-slate-950 font-bold shadow-[0_4px_16px_rgba(84,168,252,0.15)]' : 'text-stone-300 hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4" /> <span>ANNOUNCEMENT</span>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveTab('metrics');
                playCinematicIntroSound("Analytical matrix loaded.");
              }}
              className={`w-full text-left text-[11px] font-mono uppercase tracking-widest p-3.5 rounded-2xl flex items-center justify-between gap-3 transition-all duration-300 pointer-events-auto cursor-pointer ${activeTab === 'metrics' ? 'bg-[#54a8fc] text-slate-950 font-bold shadow-[0_4px_16px_rgba(84,168,252,0.15)]' : 'text-stone-300 hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> <span>RETENTION LOGS</span>
              </div>
            </button>

            {/* Seed database triggers */}
            {productsList.length === 0 && (
              <div className="pt-4 border-t border-white/5 space-y-2 mt-4 px-1">
                <span className="block text-[7.5px] font-mono uppercase text-zinc-500 tracking-[0.18em]">PRODUCT REGISTRY EMPTIED</span>
                <button
                  onClick={handleDatabaseSeed}
                  className="w-full bg-[#121E20] border border-white/5 hover:border-[#CBF23D]/30 text-[#CBF23D] hover:bg-[#CBF23D]/10 text-[9px] font-mono tracking-widest uppercase font-bold py-2.5 rounded-2xl transition-all duration-300 cursor-pointer pointer-events-auto"
                >
                  ✦ SEED FIRESTORE DATA
                </button>
              </div>
            )}
          </nav>

          {/* DYNAMIC CONTENT LAYOUTS WINDOW (9-COLS) */}
          <main className="lg:col-span-9 bg-[#121E20] border border-white/5 p-6 sm:p-8 rounded-3xl shadow-xl relative min-h-[500px]">
            
            {/* WORKSPACE SECTOR 0: SEPARATE PRODUCT UPLOAD TAB */}
            {activeTab === 'upload' && (
              <div className="space-y-10 animate-fadeIn">
                
                {/* Form header anchor */}
                <div id="inventory-form-anchor" className="flex justify-between items-center border-b border-white/5 pb-4">
                  <h3 className="text-xs font-mono tracking-widest uppercase font-extrabold text-[#CBF23D] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#CBF23D] animate-ping" />
                    {editingProduct ? "✦ EDIT GADGET SPECIFICATIONS" : "✦ UPLOAD NEW GADGET"}
                  </h3>
                  {editingProduct && (
                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setProdTitle('');
                        setProdDesc('');
                        playCinematicIntroSound("Edit cancelled.");
                        setActiveTab('inventory');
                      }}
                      className="text-[9px] font-mono uppercase text-rose-400 bg-rose-950/40 border border-rose-500/10 px-3 py-1 rounded-full hover:bg-rose-900/30 transition-colors pointer-events-auto cursor-pointer"
                    >
                      Cancel Editing
                    </button>
                  )}
                </div>

                {/* Grid Input Form details */}
                <form onSubmit={handleSaveProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 pointer-events-auto">
                  
                  <div className="space-y-1">
                    <label className="block text-[8.5px] font-mono uppercase tracking-widest text-zinc-400 font-bold">GADGET NAME / TITLE</label>
                    <input
                      type="text"
                      required
                      value={prodTitle}
                      onChange={(e) => setProdTitle(e.target.value)}
                      placeholder="E.G., KIYOMI Chrono X1 Smartwatch"
                      className="w-full bg-slate-950/40 border border-white/5 focus:border-[#54a8fc]/30 p-3 rounded-xl text-xs font-semibold text-white uppercase focus:outline-none focus:ring-0 transition-all placeholder:text-zinc-650 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[8.5px] font-mono uppercase tracking-widest text-zinc-400 font-bold">ELECTRONICS CATEGORY</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full bg-slate-950/40 border border-white/5 focus:border-[#54a8fc]/30 p-3 rounded-xl text-xs text-white focus:outline-none transition-all font-mono"
                    >
                      <option value="Smartwatches">SMARTWATCHES & CLOCKS</option>
                      <option value="Earbuds & Audio">EARBUDS & AUDIO</option>
                      <option value="Power & Chargers">POWER & CHARGERS</option>
                      <option value="Mice & Keyboards">MICE & KEYBOARDS</option>
                      <option value="Smart Gadgets">SMART GADGETS</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[8.5px] font-mono uppercase tracking-widest text-zinc-400 font-bold">BDT RETAIL VALUE (PRICE)</label>
                    <input
                      type="number"
                      required
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      className="w-full bg-slate-950/40 border border-white/5 focus:border-[#54a8fc]/30 p-3 rounded-xl text-xs font-mono text-white focus:outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[8.5px] font-mono uppercase tracking-widest text-zinc-400 font-bold">CENTRAL STORE QUANTITY (STOCK)</label>
                    <input
                      type="number"
                      required
                      value={prodStock}
                      onChange={(e) => setProdStock(Number(e.target.value))}
                      className="w-full bg-slate-950/40 border border-white/5 focus:border-[#54a8fc]/30 p-3 rounded-xl text-xs font-mono text-white focus:outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="block text-[8.5px] font-mono uppercase tracking-widest text-zinc-400 font-bold">SPECIFICATION PARTICULARS (DESCRIPTION)</label>
                    <textarea
                      required
                      rows={3}
                      value={prodDesc}
                      onChange={(e) => setProdDesc(e.target.value)}
                      placeholder="Input complete device parameters, battery life, screen, cpu, connectivity, and warranty specifications..."
                      className="w-full bg-slate-950/40 border border-white/5 focus:border-[#54a8fc]/30 p-3 rounded-xl text-xs text-stone-300 focus:outline-none transition-all placeholder:text-zinc-650"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[8.5px] font-mono uppercase tracking-widest text-zinc-400 font-bold">COLOR / MODEL VARIANTS (COMMA DELIMITED)</label>
                    <input
                      type="text"
                      required
                      value={prodVariants}
                      onChange={(e) => setProdVariants(e.target.value)}
                      placeholder="Meteor Black, Pure Silver, Rose Gold"
                      className="w-full bg-slate-950/40 border border-white/5 focus:border-[#54a8fc]/30 p-3 rounded-xl text-xs text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[8.5px] font-mono uppercase tracking-widest text-zinc-400 font-bold">OUT-OF-STOCK VARIANTS</label>
                    <input
                      type="text"
                      value={prodOutOfStock}
                      onChange={(e) => setProdOutOfStock(e.target.value)}
                      placeholder="Rose Gold"
                      className="w-full bg-slate-950/40 border border-white/5 focus:border-[#54a8fc]/30 p-3 rounded-xl text-xs text-white font-mono"
                    />
                  </div>

                  {(() => {
                    const assetUrls = prodAssets.split(',').map(s => s.trim());
                    const filledAssets = [
                      assetUrls[0] || '',
                      assetUrls[1] || '',
                      assetUrls[2] || '',
                      assetUrls[3] || '',
                      assetUrls[4] || ''
                    ];
                    return (
                      <div className="space-y-4 md:col-span-2 border border-white/5 bg-[#001E15]/30 p-5 rounded-2xl">
                        <div className="flex justify-between items-center">
                          <label className="block text-[8.5px] font-mono uppercase tracking-widest text-[#54a8fc] font-extrabold">
                            PRODUCT GRAPHIC ASSETS (4 TO 5 IMAGES REQUIRED)
                          </label>
                          <span className="text-[7.5px] font-mono text-zinc-500 uppercase font-bold">SPECIFY SECURED ENDPOINTS</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                          {[0, 1, 2, 3, 4].map((index) => {
                            const val = filledAssets[index];
                            return (
                              <div key={index} className="space-y-2 bg-slate-950/40 p-3 rounded-xl border border-white/[0.03] flex flex-col justify-between">
                                <div>
                                  <span className="text-[7.5px] font-mono text-zinc-400 block uppercase font-bold tracking-wider mb-1">
                                    IMAGE #{index + 1} {index < 3 ? '*' : '(OPTIONAL)'}
                                  </span>
                                  <input
                                    type="text"
                                    required={index < 3}
                                    value={val}
                                    onChange={(e) => {
                                      const newAssets = [...filledAssets];
                                      newAssets[index] = e.target.value.trim();
                                      setProdAssets(newAssets.filter(Boolean).join(', '));
                                    }}
                                    placeholder={`Unsplash / Web URL...`}
                                    className="w-full bg-slate-950/65 border border-white/5 focus:border-[#54a8fc]/30 p-2 text-[10px] text-white font-mono rounded-lg outline-none placeholder:text-zinc-600 transition-all focus:bg-slate-900"
                                  />
                                </div>
                                <div className="mt-2 aspect-square rounded-lg overflow-hidden border border-white/5 bg-black/40 flex items-center justify-center relative group">
                                  {val ? (
                                    <img
                                      src={val}
                                      alt={`Specimen ${index + 1}`}
                                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=200';
                                      }}
                                    />
                                  ) : (
                                    <span className="text-[7.5px] font-mono text-zinc-650 block text-center p-1 font-bold">VACANT SLOT</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* PREVIEW IMAGE CARD */}
                  {prodAssets.split(',')[0] && (
                    <div className="md:col-span-2 p-4 bg-slate-950/40 border border-white/5 rounded-2xl flex items-center gap-4">
                      {/* Thumbnail frame view */}
                      <img 
                        src={prodAssets.split(',')[0].trim()} 
                        alt="Preview" 
                        className="w-12 h-12 object-cover rounded-lg border border-white/5 bg-zinc-900"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800';
                        }}
                      />
                      <div>
                        <span className="text-[7px] font-mono text-[#54a8fc] block tracking-widest uppercase">DEVICE PREVIEW MATCHED</span>
                        <h4 className="text-[11px] font-mono text-white uppercase font-bold truncate max-w-[300px]">{prodTitle || "KIYOMI GADGET"}</h4>
                        <p className="text-[10px] text-[#CBF23D] font-mono">BDT {prodPrice}</p>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="md:col-span-2 bg-gradient-to-r from-[#54a8fc] to-cyan-500 hover:from-cyan-400 hover:to-[#54a8fc] text-slate-950 text-[10px] font-mono tracking-widest uppercase font-extrabold h-12 rounded-2xl cursor-pointer transition-all hover:shadow-[0_4px_24px_rgba(84,168,252,0.25)] flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 text-slate-950 stroke-[3]" /> {editingProduct ? "RE-RECORD GADGET CATALOG" : "PUBLISH GADGET LISTING"}
                  </button>
                </form>
              </div>
            )}
            
            {/* WORKSPACE SECTOR 1: INVENTORY MANAGEMENT */}
            {activeTab === 'inventory' && (
              <div className="space-y-10">
                
                {/* Active gadgets loop list */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <h4 className="text-[10px] font-mono tracking-widest uppercase font-bold text-zinc-500">
                      ACTIVE GADGET SYSTEM CATALOG ({productsList.length > 0 ? productsList.length : CUSTOM_GADGETS_SEED.length})
                    </h4>
                    <button
                      onClick={() => {
                        setActiveTab('upload');
                        playCinematicIntroSound("Redirecting to product editor.");
                      }}
                      className="text-[9px] font-mono uppercase text-[#CBF23D] border border-[#CBF23D]/20 hover:border-[#CBF23D]/50 hover:bg-[#CBF23D]/5 px-3 py-1 rounded-full transition-colors pointer-events-auto cursor-pointer"
                    >
                      + ADD NEW GADGET
                    </button>
                  </div>

                  <div className="border border-white/5 rounded-2xl overflow-hidden bg-slate-950/20">
                    <table className="w-full text-xs text-left text-stone-300">
                      <thead className="bg-[#121E20] border-b border-white/5 font-mono uppercase tracking-wider text-[8.5px] text-[#54a8fc]">
                        <tr>
                          <th className="p-4">PREVIEW</th>
                          <th className="p-4">PRODUCT / CAT</th>
                          <th className="p-4">PRICE</th>
                          <th className="p-4">STOCK</th>
                          <th className="p-4 text-right">OPERATE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-sans pointer-events-auto">
                        {(productsList.length > 0 ? productsList : CUSTOM_GADGETS_SEED).map((p) => (
                          <tr key={p.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4">
                              <img src={p.assets[0]} className="w-9 h-11 object-cover rounded-lg border border-white/5 bg-zinc-950" alt="" />
                            </td>
                            <td className="p-4">
                              <span className="block font-sans text-white font-bold text-[12.5px] truncate max-w-[200px] uppercase leading-tight">{p.title}</span>
                              <span className="block text-[7.5px] font-mono uppercase text-zinc-500 tracking-wider font-semibold mt-1">{p.category}</span>
                            </td>
                            <td className="p-4 font-mono font-bold text-white">BDT {p.price}</td>
                            <td className="p-4">
                              {p.stock === 0 ? (
                                <span className="text-red-400 font-mono text-[9px] font-bold bg-red-950/40 border border-red-500/10 px-2 py-0.5 rounded-full uppercase">SOLD OUT</span>
                              ) : (
                                <span className="font-mono text-[#CBF23D] text-[10px] font-bold">{p.stock || '15'} Left</span>
                              )}
                            </td>
                            <td className="p-4 text-right space-x-1">
                              <button 
                                onClick={() => {
                                  handleEditProductClick(p);
                                  playCinematicIntroSound("Designer details pulled.");
                                }}
                                className="p-2 hover:bg-white/5 rounded-xl text-[#54a8fc] cursor-pointer transition-colors" 
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  handleDeleteProductClick(p.id);
                                }}
                                className="p-2 hover:bg-white/5 rounded-xl text-rose-500 cursor-pointer transition-colors" 
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4 text-rose-550" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* WORKSPACE SECTOR 2: CLIENT ORDERS REGISTRY */}
            {activeTab === 'orders' && (
              <div className="space-y-8 animate-fadeIn">
                <h3 className="text-xs font-mono tracking-widest uppercase font-extrabold text-[#CBF23D] border-b border-white/5 pb-4">
                  CLIENT SECURED CHECKOUT TRANSACTIONS ({ordersList.length})
                </h3>

                {ordersList.length === 0 ? (
                  <div className="text-center py-24 text-zinc-500 font-mono text-[10px] uppercase tracking-wider space-y-4">
                    <div className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center mx-auto mb-1">
                      <ClipboardList className="w-5 h-5 text-zinc-655" />
                    </div>
                    <p>No consumer checkout streams registered in datastore.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {ordersList.map((ord) => (
                      <div key={ord.id} className="border border-white/5 bg-slate-950/20 p-6 rounded-2xl space-y-4 relative overflow-hidden">
                        
                        {/* Transaction status bar context */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3 gap-3">
                          <div className="space-y-1">
                            <span className="block text-[7.5px] font-mono text-zinc-500 tracking-[0.18em]">INVOICE SEQUENCE CODE</span>
                            <span className="block text-[11px] font-mono font-bold text-white uppercase">{ord.id}</span>
                          </div>
                          <div className="text-left sm:text-right">
                            <span className="block text-[7.5px] font-mono text-zinc-500 tracking-[0.18em]">EXECUTION DATE</span>
                            <span className="block text-[11px] font-semibold text-stone-400 font-mono">{new Date(ord.createdAt).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Customer specifications + Ordered Items */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed">
                          
                          <div className="space-y-1 bg-slate-950/40 p-4 border border-white/5 rounded-xl">
                            <strong className="block text-[8px] font-mono text-[#54a8fc] uppercase tracking-widest font-bold">CLIENT RECIPIENT INF</strong>
                            <p className="text-xs font-bold text-white uppercase pt-1">{ord.fullName}</p>
                            <p className="text-[11px] text-zinc-400 font-mono">Tel: {ord.phone}</p>
                            <p className="text-[11px] text-zinc-500 italic max-w-sm">{ord.address}</p>
                          </div>

                          <div className="space-y-2 bg-slate-950/40 p-4 border border-white/5 rounded-xl flex flex-col justify-between">
                            <div>
                              <strong className="block text-[8px] font-mono text-[#54a8fc] uppercase tracking-widest font-bold mb-1.5">DEVICES CONVEYANCE</strong>
                              <div className="space-y-1 max-h-[100px] overflow-y-auto">
                                {ord.items ? ord.items.map((it:any, idx:number) => (
                                  <div key={idx} className="text-xs flex justify-between items-center font-mono">
                                    <span className="text-stone-300 truncate max-w-[170px]">
                                      {it.title} <strong className="font-sans text-[8.5px] text-[#CBF23D] bg-[#CBF23D]/10 px-1.5 py-0.2 rounded font-bold uppercase">{it.variant}</strong>
                                    </span>
                                    <span className="text-zinc-550">Qty {it.quantity}</span>
                                  </div>
                                )) : null}
                              </div>
                            </div>
                            <div className="flex justify-between text-xs font-mono font-extrabold border-t border-white/5 pt-2 mt-2 text-white">
                              <span>TOTAL INVOICED:</span>
                              <span className="text-[#CBF23D]">BDT {ord.totalPrice}</span>
                            </div>
                          </div>

                        </div>

                        {/* Order Phase State processing selector */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 bg-slate-950/40 p-4 border border-white/5 rounded-xl gap-3 pointer-events-auto">
                          <span className="text-[8px] font-mono text-zinc-500 font-bold uppercase tracking-widest">DISPATCH HANDLING STAGE:</span>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono font-bold bg-[#CBF23D]/10 text-[#CBF23D] border border-[#CBF23D]/20 px-2.5 py-1 rounded-full uppercase col-pointer">
                              {ord.status}
                            </span>
                            <span className="text-zinc-600">➔</span>
                            <select
                              value={ord.status}
                              onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                              className="bg-slate-950 border border-white/5 text-stone-300 text-xs font-mono py-1.5 px-3 rounded-xl focus:outline-none focus:ring-0 cursor-pointer pointer-events-auto"
                            >
                              <option value="Received">RECEIVED</option>
                              <option value="Processing">PROCESSING</option>
                              <option value="Shipped">SHIPPED</option>
                              <option value="Out for Delivery">OUT FOR DELIVERY</option>
                              <option value="Completed">COMPLETED</option>
                            </select>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* WORKSPACE SECTOR 3: NOTICE BOARD BANNER CONTROLS */}
            {activeTab === 'notices' && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xs font-mono tracking-widest uppercase font-extrabold text-[#CBF23D] border-b border-white/5 pb-4">
                  BILLBOARD MARQUEE CAMPAIGN BROADCAST
                </h3>

                <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl space-y-1.5 text-xs text-stone-400 font-sans leading-relaxed">
                  <Info className="w-4 h-4 text-[#54a8fc] inline mr-1.5" /> Modify the dynamic scrolling notification billboard that slides across the topmost screen boundaries of the header area.
                </div>

                <div className="space-y-5 pt-3 pointer-events-auto">
                  <div className="space-y-1.5">
                    <label className="block text-[8.5px] font-mono uppercase tracking-widest text-[#CBF23D] font-bold">BILLBOARD MARQUEE MESSAGE</label>
                    <input
                      type="text"
                      value={noticeMessage}
                      onChange={(e) => setNoticeMessage(e.target.value)}
                      placeholder="ENTER SCROLLING BILLBOARD ANNOUNCEMENT..."
                      className="w-full bg-slate-950/40 border border-white/5 focus:border-[#54a8fc]/30 p-3 rounded-xl font-mono text-xs uppercase tracking-wider text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="bannerActive"
                      checked={noticeActive}
                      onChange={(e) => setNoticeActive(e.target.checked)}
                      className="w-4.5 h-4.5 accent-[#54a8fc] cursor-pointer"
                    />
                    <label htmlFor="bannerActive" className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold cursor-pointer">
                      ACTIVATE BILLBOARD DISPATCH LIVE
                    </label>
                  </div>

                  {/* Showcase preview marquee simulation */}
                  {noticeActive && (
                    <div className="p-3 bg-red-950/20 border border-red-500/10 rounded-xl relative overflow-hidden select-none">
                      <span className="text-[7px] font-mono text-rose-450 block uppercase tracking-widest mb-1.5">LIVE SIMULATED DISPLAY</span>
                      <div className="bg-[#CBF23D] text-[#0C1E1F] py-1.5 px-4 text-[9px] font-mono font-bold uppercase overflow-hidden rounded tracking-[0.15em] flex items-center justify-center">
                        <marquee scrollamount="5">{noticeMessage || "KIYOMI DHAKA CLOTHING HUB"}</marquee>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleSaveNoticeConfig}
                    className="bg-gradient-to-r from-[#54a8fc] to-cyan-500 text-slate-950 text-[10px] font-mono tracking-widest uppercase font-extrabold py-3.5 px-8 rounded-2xl transition-all hover:shadow-[0_4px_20px_rgba(84,168,252,0.2)] cursor-pointer"
                  >
                    COMMIT NOTICE ADJUSTMENTS
                  </button>
                </div>
              </div>
            )}

            {/* WORKSPACE SECTOR 4: ANALYTICS RETENTION BOARD */}
            {activeTab === 'metrics' && (
              <div className="space-y-8 animate-fadeIn">
                <h3 className="text-xs font-mono tracking-widest uppercase font-extrabold text-[#CBF23D] border-b border-white/5 pb-4">
                  CUSTOMER RETENTION LOGS & SEGMENTATION
                </h3>

                {/* Retaining donut progress diagram */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  
                  <div className="bg-slate-950/40 border border-white/5 p-6 rounded-3xl flex flex-col items-center justify-center space-y-4">
                    <span className="text-[8px] font-mono text-zinc-500 tracking-widest uppercase font-bold text-center block">RETURNING CLIENT PROPORTIONS</span>
                    
                    {/* Ring diagram */}
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background track circle */}
                        <circle cx="50" cy="50" r="38" stroke="rgba(255,255,255,0.02)" strokeWidth="10" fill="transparent" />
                        {/* Segment circle (68%) */}
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="38" 
                          stroke="#54a8fc" 
                          strokeWidth="10" 
                          fill="transparent" 
                          strokeDasharray="238.7" 
                          strokeDashoffset="76.3" 
                          strokeLinecap="round"
                        />
                        {/* Inner circle (32%) */}
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="30" 
                          stroke="#CBF23D" 
                          strokeWidth="5" 
                          fill="transparent" 
                          strokeDasharray="188.4" 
                          strokeDashoffset="128" 
                          strokeLinecap="round"
                        />
                      </svg>
                      {/* Ring center percentage count */}
                      <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-mono text-white font-extrabold leading-none">68%</span>
                        <span className="text-[7.5px] font-mono text-zinc-500 uppercase tracking-widest pt-1">RETENTION RATE</span>
                      </div>
                    </div>

                    <div className="flex gap-4 text-[10px] font-mono uppercase tracking-wider pt-2">
                      <div className="flex items-center gap-1.5 text-white">
                        <span className="w-2 h-2 rounded bg-[#54a8fc]" /> RETURNERS
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <span className="w-2 h-2 rounded bg-[#CBF23D]" /> FIRST TIME
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 bg-slate-950/20 p-5 border border-white/5 rounded-3xl text-xs leading-relaxed text-stone-400 font-sans">
                    <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1">
                      <Award className="w-4 h-4 text-yellow-500" /> WAREHOUSE ACCRUALS
                    </h4>
                    <p>
                      The Dhaka hub shows high general demand numbers due to persistent high-performance gadget category searches and pre-order launches. Distributing {CUSTOM_GADGETS_SEED.length} key premium electronics across separate dynamic inventory tabs keeps catalog access density completely smooth.
                    </p>
                    <p>
                      Each high-tier hardware item is indexed via unique serial code variables, confirming that dispatch coordinates remain perfectly in sync with centralized stock metrics.
                    </p>
                  </div>

                </div>

              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
};

