import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { 
  Search, 
  Truck, 
  Clock, 
  PackageCheck, 
  User, 
  MapPin, 
  ShoppingBag, 
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Phone
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const TrackOrder: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trackingIdInput, setTrackingIdInput] = useState(searchParams.get('id') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('id') || '');

  const [orderData, setOrderData] = useState<any>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const [suggestedOrders, setSuggestedOrders] = useState<any[]>([]);

  useEffect(() => {
    const rawLocalHistory = localStorage.getItem('patowary_local_orders');
    if (rawLocalHistory) {
      try {
        setSuggestedOrders(JSON.parse(rawLocalHistory));
      } catch (err) {}
    }
  }, []);

  // Sync / query the order tracking ID
  useEffect(() => {
    if (!searchQuery) {
      setOrderData(null);
      setSearchError(null);
      return;
    }

    setLoading(true);
    setSearchError(null);

    const orderDocRef = doc(db, 'orders', searchQuery.trim());
    const unsub = onSnapshot(orderDocRef, (snap) => {
      if (snap.exists()) {
        setOrderData(snap.data());
        setSearchError(null);
        setLoading(false);
      } else {
        const matchLocal = suggestedOrders.find(ord => ord.id?.toUpperCase() === searchQuery.trim().toUpperCase());
        if (matchLocal) {
          setOrderData(matchLocal);
          setSearchError(null);
        } else {
          setOrderData(null);
          setSearchError("No order found with this Tracking ID. Please verify and try again.");
        }
        setLoading(false);
      }
    }, () => {
      const matchLocal = suggestedOrders.find(ord => ord.id?.toUpperCase() === searchQuery.trim().toUpperCase());
      if (matchLocal) {
        setOrderData(matchLocal);
        setSearchError(null);
      } else {
        setOrderData(null);
        setSearchError("Tracking system offline. Please check connection.");
      }
      setLoading(false);
    });

    return () => unsub();
  }, [searchQuery, suggestedOrders]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = trackingIdInput.trim();
    if (!cleanId) return;

    setSearchParams({ id: cleanId });
    setSearchQuery(cleanId);
    playCinematicIntroSound(`Inquiring shipment status for ${cleanId}`);
  };

  const handleSelectSuggestion = (idStr: string) => {
    setTrackingIdInput(idStr);
    setSearchParams({ id: idStr });
    setSearchQuery(idStr);
  };

  const PHASES: ('Received' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Completed')[] = [
    'Received',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Completed'
  ];

  const getPhaseNumber = (status: string) => {
    const idx = PHASES.indexOf(status as any);
    return idx > -1 ? idx : 0;
  };

  const currentPhaseIdx = orderData ? getPhaseNumber(orderData.status) : 0;

  return (
    <div id="tracking-engine-view" className="bg-[#F8F3EA] min-h-screen text-[#111827] py-12 sm:py-16 font-sans text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Title center */}
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-mono tracking-[0.25em] text-[#C9A66B] uppercase font-bold">
            PATOWARY FASHION LOGISTICS
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#0A1E54] uppercase">
            {t("Order Tracking & Courier Status", "অর্ডার ট্র্যাকিং ও কুরিয়ার স্ট্যাটাস")}
          </h1>
          <p className="text-xs text-stone-600 max-w-md mx-auto">
            {t("Enter your unique tracking voucher code to view live delivery updates.", "আপনার ইউনিক ট্র্যাকিং কোড দিয়ে লাইভ ডেলিভারি স্ট্যাটাস চেক করুন।")}
          </p>
        </div>

        {/* Tracking Code input box */}
        <div className="glass-panel border border-white p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                required
                value={trackingIdInput}
                onChange={(e) => setTrackingIdInput(e.target.value)}
                placeholder="ENTER TRACKING ID (e.g. PTW-2026-57112)"
                className="w-full bg-white border border-stone-300 pl-10 pr-4 py-3.5 rounded-xl text-xs font-mono tracking-wider uppercase focus:outline-none focus:border-[#0A1E54] shadow-inner"
              />
              <Search className="w-4.5 h-4.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="bg-[#0A1E54] hover:bg-[#1A3070] text-[#F8F3EA] text-xs font-mono font-bold tracking-wider uppercase py-3.5 px-8 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{t("Track Order", "ট্র্যাক করুন")}</span>
              <Truck className="w-4 h-4 text-[#C9A66B]" />
            </button>
          </form>

          {/* Suggested local orders */}
          {suggestedOrders.length > 0 && (
            <div className="pt-2 border-t border-stone-200/60">
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block mb-2 font-bold">
                {t("YOUR RECENT INVOICES (CLICK TO LOAD)", "আপনার সাম্প্রতিক অর্ডারসমূহ")}
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestedOrders.map((ord) => (
                  <button
                    key={ord.id}
                    onClick={() => handleSelectSuggestion(ord.id)}
                    className="text-[11px] font-mono bg-white hover:bg-stone-100 text-[#0A1E54] border border-stone-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    {ord.id} ({ord.fullName})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="p-8 text-center text-xs font-mono text-stone-500 animate-pulse">
            Connecting to Patowary Fashion live logistics ledger...
          </div>
        )}

        {/* Error message */}
        {searchError && (
          <div className="mt-8 p-5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono rounded-2xl text-center">
            {searchError}
          </div>
        )}

        {/* Result Tracking Details View */}
        {orderData && (
          <div className="mt-10 space-y-6">
            
            {/* Live Progress Stepper */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-2">
                <div>
                  <span className="text-[10px] font-mono text-stone-500 uppercase">{t("Order Tracking ID", "অর্ডার ট্র্যাকিং আইডি")}</span>
                  <h3 className="text-base sm:text-lg font-mono font-bold text-[#0A1E54]">{orderData.id}</h3>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0A1E54]/10 text-[#0A1E54] text-xs font-mono font-bold uppercase self-start sm:self-auto">
                  <span className="w-2 h-2 rounded-full bg-[#C9A66B] animate-ping" />
                  <span>{orderData.status}</span>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="grid grid-cols-5 gap-2 relative">
                <div className="absolute top-4 left-6 right-6 h-0.5 bg-stone-200 -z-0" />
                <div 
                  className="absolute top-4 left-6 h-0.5 bg-[#0A1E54] -z-0 transition-all duration-500" 
                  style={{ width: `${(currentPhaseIdx / 4) * 100}%` }}
                />

                {PHASES.map((phase, idx) => {
                  const isDone = idx <= currentPhaseIdx;
                  const isCurrent = idx === currentPhaseIdx;

                  return (
                    <div key={phase} className="flex flex-col items-center text-center relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isCurrent 
                          ? 'bg-[#0A1E54] text-[#C9A66B] ring-4 ring-[#0A1E54]/20 scale-110 shadow-sm'
                          : isDone 
                            ? 'bg-[#0A1E54] text-white' 
                            : 'bg-stone-200 text-stone-400'
                      }`}>
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-[10px] font-bold font-mono">{idx + 1}</span>}
                      </div>
                      <span className={`text-[9px] sm:text-[10px] font-mono uppercase mt-2 font-bold leading-tight ${
                        isCurrent ? 'text-[#0A1E54]' : isDone ? 'text-stone-700' : 'text-stone-400'
                      }`}>
                        {phase}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Consignee & Items Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Shipping info */}
              <div className="glass-card p-6 rounded-2xl border border-white space-y-3">
                <h4 className="text-xs font-mono font-bold tracking-wider text-[#0A1E54] uppercase border-b border-stone-100 pb-2">
                  {t("DELIVERY INFORMATION", "ডেলিভারি তথ্য")}
                </h4>
                <div className="space-y-2 text-xs text-stone-700">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#0A1E54]" />
                    <span className="font-semibold">{orderData.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#0A1E54]" />
                    <span>{orderData.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#0A1E54] shrink-0 mt-0.5" />
                    <span>{orderData.address}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                    <Clock className="w-4 h-4 text-stone-400" />
                    <span className="text-stone-500 font-mono text-[11px]">
                      {new Date(orderData.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items in order */}
              <div className="glass-card p-6 rounded-2xl border border-white space-y-3">
                <h4 className="text-xs font-mono font-bold tracking-wider text-[#0A1E54] uppercase border-b border-stone-100 pb-2">
                  {t("PURCHASED SPECIMENS", "অর্ডারের পণ্যসমূহ")}
                </h4>
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {orderData.items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-stone-100 last:border-0">
                      <div className="flex items-center gap-2">
                        {item.image && (
                          <img src={item.image} alt={item.title} className="w-8 h-10 object-cover rounded bg-stone-100" />
                        )}
                        <div>
                          <span className="font-semibold line-clamp-1 text-[#111827]">{item.title}</span>
                          <span className="text-[10px] text-stone-500 font-mono">Size: {item.variant} &bull; Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-[#0A1E54] shrink-0">
                        ৳ {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-stone-200 font-bold text-sm font-mono text-[#0A1E54]">
                  <span>{t("Total Paid / Payable", "সর্বমোট মূল্য")}</span>
                  <span>৳ {orderData.totalPrice?.toLocaleString()}</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
