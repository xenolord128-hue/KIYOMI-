import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../lib/firebase';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { updatePageSEO } from '../utils/seoUtils';
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  ExternalLink,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';
import { TrackMyOrder } from '../components/TrackMyOrder';

export const Orders: React.FC = () => {
  const { orderId } = useParams<{ orderId?: string }>();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [activeOrder, setActiveOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchIdInput, setSearchIdInput] = useState('');

  // 1. Single Order View (:orderId)
  useEffect(() => {
    if (!orderId) {
      setActiveOrder(null);
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    updatePageSEO(`Order #${orderId} Details`);

    // Check Firestore
    const unsub = onSnapshot(doc(db, 'orders', orderId.trim()), (snap) => {
      if (snap.exists()) {
        setActiveOrder({ id: snap.id, ...snap.data() });
        setLoading(false);
      } else {
        // Fallback to local storage
        const local = localStorage.getItem('patowary_local_orders');
        if (local) {
          try {
            const parsed = JSON.parse(local);
            const found = parsed.find((o: any) => o.id?.toUpperCase() === orderId.trim().toUpperCase());
            if (found) {
              setActiveOrder(found);
              setLoading(false);
              return;
            }
          } catch (e) {}
        }
        setActiveOrder(null);
        setErrorMsg(`No order found matching ID #${orderId}. Please verify your tracking ID.`);
        setLoading(false);
      }
    }, (err) => {
      // Offline fallback
      const local = localStorage.getItem('patowary_local_orders');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          const found = parsed.find((o: any) => o.id?.toUpperCase() === orderId.trim().toUpperCase());
          if (found) {
            setActiveOrder(found);
            setLoading(false);
            return;
          }
        } catch (e) {}
      }
      setErrorMsg(`Could not connect to tracking server. Please check your network.`);
      setLoading(false);
    });

    return () => unsub();
  }, [orderId]);

  // 2. Orders List View
  useEffect(() => {
    if (orderId) return;

    updatePageSEO('My Orders');
    setLoading(true);

    const localList: any[] = [];
    const local = localStorage.getItem('patowary_local_orders');
    if (local) {
      try {
        localList.push(...JSON.parse(local));
      } catch (e) {}
    }

    // Query Firestore for user orders
    if (user?.email) {
      const q = query(collection(db, 'orders'), where('email', '==', user.email));
      const unsub = onSnapshot(q, (snap) => {
        const firestoreOrders: any[] = [];
        snap.forEach((d) => {
          firestoreOrders.push({ id: d.id, ...d.data() });
        });
        
        // Merge without duplicates
        const combined = [...firestoreOrders];
        localList.forEach((loc) => {
          if (!combined.some((c) => c.id === loc.id)) {
            combined.push(loc);
          }
        });
        setOrdersList(combined);
        setLoading(false);
      }, () => {
        setOrdersList(localList);
        setLoading(false);
      });
      return () => unsub();
    } else {
      setOrdersList(localList);
      setLoading(false);
    }
  }, [orderId, user]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchIdInput.trim()) {
      navigate(`/orders/${searchIdInput.trim()}`);
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status?: string) => {
    const s = (status || 'Received').toLowerCase();
    if (s.includes('deliver') || s.includes('complete')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold uppercase">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          {status || 'Delivered'}
        </span>
      );
    }
    if (s.includes('ship') || s.includes('transit')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-mono font-bold uppercase">
          <Truck className="w-3.5 h-3.5 text-blue-600" />
          {status || 'In Transit'}
        </span>
      );
    }
    if (s.includes('process')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-mono font-bold uppercase">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          {status || 'Processing'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-mono font-bold uppercase">
        <Package className="w-3.5 h-3.5 text-purple-600" />
        {status || 'Received'}
      </span>
    );
  };

  // If viewing single order detail
  if (orderId) {
    return (
      <div className="min-h-screen bg-[#F8F3EA] text-[#111827] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Back button */}
          <div className="flex items-center justify-between">
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase font-bold text-[#0A1E54] hover:text-[#C9A66B] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("Back to All Orders", "সব অর্ডার এ ফিরে যান")}
            </Link>

            <Link
              to={`/track-order?id=${encodeURIComponent(orderId)}`}
              className="text-xs font-mono text-[#0A1E54] hover:underline flex items-center gap-1"
            >
              <span>{t("Live Tracking Map", "লাইভ ট্র্যাকিং")}</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <TrackMyOrder initialOrderId={orderId} />

        </div>
      </div>
    );
  }

  // Orders List View (/orders)
  return (
    <div className="min-h-screen bg-[#F8F3EA] text-[#111827] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8 text-left">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#0A1E54]/10 pb-6">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#C9A66B] uppercase font-bold block mb-1">
              {t("PATOWARY CUSTOMER ARCHIVE", "কাস্টমার অর্ডার আর্কাইভ")}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#0A1E54]">
              {t("My Orders", "আমার অর্ডারসমূহ")}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              {t("Track your parcel dispatch status, invoices, and delivery timeline.", "আপনার পার্সেলের সার্বক্ষণিক আপডেট ও ইনভয়েস দেখুন।")}
            </p>
          </div>

          {/* Quick Track Input */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t("Track by Order ID (e.g. ORD-...)", "অর্ডার আইডি দিয়ে ট্র্যাক করুন...")}
                value={searchIdInput}
                onChange={(e) => setSearchIdInput(e.target.value)}
                className="pl-9 pr-3 py-2 text-xs bg-white border border-[#0A1E54]/10 rounded-full focus:outline-none focus:border-[#0A1E54] w-64 text-[#0A1E54] font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-[#0A1E54] hover:bg-[#1A3070] text-white text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
            >
              {t("Track", "ট্র্যাক")}
            </button>
          </form>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#0A1E54]/10 shadow-sm">
            <div className="w-10 h-10 border-3 border-[#0A1E54] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-mono text-[#0A1E54]">{t("Loading your orders...", "অর্ডার লোড হচ্ছে...")}</p>
          </div>
        ) : ordersList.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#0A1E54]/10 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#0A1E54]">
              {t("No orders placed yet", "এখনও কোনো অর্ডার করা হয়নি")}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {t("Explore our latest streetwear drop and experience contemporary luxury fashion.", "আমাদের সর্বশেষ কালেকশন ব্রাউজ করে অর্ডার করুন।")}
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0A1E54] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#1A3070] transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                {t("Start Shopping", "শপিং শুরু করুন")}
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {ordersList.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-[#0A1E54]/10 hover:border-[#C9A66B]/50 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono font-bold text-[#0A1E54]">
                      #{order.id}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-xs text-stone-500">
                    {order.items?.length || 1} {t("items", "টি আইটেম")} • {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                  </p>
                  <p className="text-xs text-stone-600 line-clamp-1 max-w-md">
                    {order.items?.map((it: any) => `${it.title} (${it.quantity})`).join(', ') || 'Custom Garment Package'}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-mono uppercase text-stone-400 block">{t("Total", "মোট")}</span>
                    <span className="text-base font-mono font-bold text-[#0A1E54]">
                      ৳{Number(order.totalPrice || order.subtotal || 0).toLocaleString()}
                    </span>
                  </div>

                  <Link
                    to={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0A1E54] text-white hover:bg-[#1A3070] text-xs font-mono uppercase tracking-wider transition-colors shrink-0 group-hover:scale-105 active:scale-95"
                  >
                    <span>{t("Details", "বিস্তারিত")}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
