import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Search, 
  Truck, 
  Clock, 
  PackageCheck, 
  User, 
  MapPin, 
  ShoppingBag, 
  CheckCircle2, 
  Phone, 
  ExternalLink, 
  Copy, 
  Check, 
  Share2, 
  Printer, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Box,
  Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order } from '../types';
import { OrderProgressBar } from './OrderProgressBar';

interface TrackMyOrderProps {
  initialOrderId?: string;
  compact?: boolean;
  onOrderFound?: (order: Order) => void;
  className?: string;
}

export const TrackMyOrder: React.FC<TrackMyOrderProps> = ({
  initialOrderId = '',
  compact = false,
  onOrderFound,
  className = ''
}) => {
  const { t, locale } = useLanguage();
  const [orderIdInput, setOrderIdInput] = useState(initialOrderId);
  const [phoneInput, setPhoneInput] = useState('');
  const [activeQueryId, setActiveQueryId] = useState(initialOrderId);
  const [activeQueryPhone, setActiveQueryPhone] = useState('');
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Privacy masking helpers
  const maskCustomerName = (name?: string): string => {
    if (!name) return 'Valued Customer';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].slice(0, 2) + '****';
    }
    return `${parts[0]} ${parts[parts.length - 1].slice(0, 1)}***`;
  };

  const maskCustomerPhone = (phone?: string): string => {
    if (!phone) return '017*****';
    const digits = phone.replace(/\D/g, '');
    if (digits.length >= 8) {
      return `${digits.slice(0, 3)}*****${digits.slice(-3)}`;
    }
    return '017*****';
  };

  const maskCustomerAddress = (addr?: string): string => {
    if (!addr) return 'Dhaka, Bangladesh';
    const parts = addr.split(',');
    if (parts.length > 2) {
      return `****, ${parts.slice(-2).join(',').trim()}`;
    }
    if (parts.length === 2) {
      return `****, ${parts[1].trim()}`;
    }
    return addr.length > 15 ? `**** ${addr.slice(-12)}` : addr;
  };

  // Load user's recent local invoices
  useEffect(() => {
    try {
      const local = localStorage.getItem('patowary_local_orders');
      if (local) {
        setRecentOrders(JSON.parse(local));
      }
    } catch (e) {}
  }, []);

  // Sync if initialOrderId prop changes
  useEffect(() => {
    if (initialOrderId && initialOrderId !== activeQueryId) {
      setOrderIdInput(initialOrderId);
      setActiveQueryId(initialOrderId);
    }
  }, [initialOrderId]);

  // Real-time Firestore onSnapshot listener for instant live shipping updates
  useEffect(() => {
    if (!activeQueryId.trim()) {
      setOrderData(null);
      setErrorMsg(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const cleanId = activeQueryId.trim();
    const orderDocRef = doc(db, 'orders', cleanId);

    const unsubscribe = onSnapshot(
      orderDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const liveOrder = { id: snapshot.id, ...snapshot.data() } as Order;
          // Verify phone if customer entered one
          if (activeQueryPhone.trim()) {
            const queryDigits = activeQueryPhone.replace(/\D/g, '');
            const orderDigits = (liveOrder.phone || '').replace(/\D/g, '');
            if (!orderDigits.endsWith(queryDigits) && !queryDigits.endsWith(orderDigits)) {
              setOrderData(null);
              setErrorMsg(`Order ID #${cleanId} found, but the phone number does not match our consignee records. Please verify.`);
              setLoading(false);
              return;
            }
          }
          setOrderData(liveOrder);
          setLastUpdated(new Date());
          setErrorMsg(null);
          setLoading(false);
          if (onOrderFound) onOrderFound(liveOrder);
        } else {
          // Check local cached orders
          const match = recentOrders.find(
            (o) => o.id?.toUpperCase() === cleanId.toUpperCase()
          );
          if (match) {
            if (activeQueryPhone.trim()) {
              const queryDigits = activeQueryPhone.replace(/\D/g, '');
              const orderDigits = (match.phone || '').replace(/\D/g, '');
              if (!orderDigits.endsWith(queryDigits) && !queryDigits.endsWith(orderDigits)) {
                setOrderData(null);
                setErrorMsg(`Order ID #${cleanId} found, but the phone number does not match our consignee records.`);
                setLoading(false);
                return;
              }
            }
            setOrderData(match);
            setLastUpdated(new Date());
            setErrorMsg(null);
            if (onOrderFound) onOrderFound(match);
          } else {
            setOrderData(null);
            setErrorMsg(
              `No order record found for Tracking ID "${cleanId}". Please verify your order number.`
            );
          }
          setLoading(false);
        }
      },
      (error) => {
        console.warn('Real-time order listener network check:', error);
        // Fallback to local storage
        const match = recentOrders.find(
          (o) => o.id?.toUpperCase() === cleanId.toUpperCase()
        );
        if (match) {
          setOrderData(match);
          setLastUpdated(new Date());
          setErrorMsg(null);
          if (onOrderFound) onOrderFound(match);
        } else {
          setErrorMsg(
            'Unable to connect to live tracking server. Please verify your connection.'
          );
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [activeQueryId, activeQueryPhone, recentOrders, locale, onOrderFound]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = orderIdInput.trim();
    if (!clean) return;
    setActiveQueryId(clean);
    setActiveQueryPhone(phoneInput.trim());
    playCinematicIntroSound(`Checking tracking status for order ${clean}`);
  };

  const handleSelectRecent = (id: string) => {
    setOrderIdInput(id);
    setActiveQueryId(id);
    playCinematicIntroSound(`Loading order ${id}`);
  };

  const handleCopyLink = () => {
    if (!orderData) return;
    const shareUrl = `${window.location.origin}/track-order?id=${encodeURIComponent(orderData.id)}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Shipping stages configuration
  const STAGES = [
    {
      key: 'Received',
      labelEn: 'Order Received',
      labelBn: 'Order Received',
      descEn: 'Order logged and confirmed in Patowary dispatch system',
      descBn: 'Order logged and confirmed in Patowary dispatch system',
      icon: Box
    },
    {
      key: 'Processing',
      labelEn: 'Packed & Ready',
      labelBn: 'Packed & Ready',
      descEn: 'Items quality-checked, wrapped, and sealed in Dhaka atelier',
      descBn: 'Items quality-checked, wrapped, and sealed in Dhaka atelier',
      icon: PackageCheck
    },
    {
      key: 'Shipped',
      labelEn: 'In Transit',
      labelBn: 'In Transit',
      descEn: 'Dispatched with logistics courier for city transit',
      descBn: 'Dispatched with logistics courier for city transit',
      icon: Truck
    },
    {
      key: 'Out for Delivery',
      labelEn: 'Out for Delivery',
      labelBn: 'Out for Delivery',
      descEn: 'Rider is on the way to your doorstep for handover',
      descBn: 'Rider is on the way to your doorstep for handover',
      icon: Radio
    },
    {
      key: 'Completed',
      labelEn: 'Delivered',
      labelBn: 'Delivered',
      descEn: 'Package inspected, payment collected, and handed over',
      descBn: 'Package inspected, payment collected, and handed over',
      icon: CheckCircle2
    }
  ];

  const getStageIndex = (status?: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('complete') || s.includes('deliver')) return 4;
    if (s.includes('out') || s.includes('rider')) return 3;
    if (s.includes('ship') || s.includes('transit')) return 2;
    if (s.includes('process') || s.includes('pack')) return 1;
    return 0;
  };

  const currentStageIndex = orderData ? getStageIndex(orderData.status) : 0;

  return (
    <div className={`w-full ${className}`}>
      
      {/* Search Input Box */}
      <div className="bg-white/80 backdrop-blur-md border border-[#0A1E54]/10 p-6 sm:p-8 rounded-3xl shadow-sm space-y-4 text-left">
        {!compact && (
          <div className="border-b border-stone-100 pb-4">
            <span className="text-[10px] font-mono tracking-widest text-[#C9A66B] uppercase font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A66B]" />
              REAL-TIME PARCEL RADAR
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0A1E54] mt-1">
              Track Your Consignment
            </h3>
            <p className="text-xs text-stone-500 font-sans mt-0.5">
              Enter your invoice tracking ID (e.g. PTW-... or ORD-...) to view live courier status.
            </p>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleTrackSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <div className="relative sm:col-span-6">
            <input
              type="text"
              required
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              placeholder="Order ID (e.g. PF-20261002-1234)"
              className="w-full bg-stone-50/80 border border-stone-200 focus:border-[#0A1E54] pl-10 pr-10 py-3.5 rounded-2xl text-xs sm:text-sm font-mono tracking-wider uppercase text-[#0A1E54] focus:outline-none transition-all shadow-inner font-bold placeholder-stone-400"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {orderIdInput && (
              <button
                type="button"
                onClick={() => {
                  setOrderIdInput('');
                  setActiveQueryId('');
                  setOrderData(null);
                  setErrorMsg(null);
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 text-xs cursor-pointer"
                title="Clear"
              >
                ✕
              </button>
            )}
          </div>

          <div className="relative sm:col-span-4">
            <input
              type="tel"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="Phone (Optional for verification)"
              className="w-full bg-stone-50/80 border border-stone-200 focus:border-[#0A1E54] pl-10 pr-4 py-3.5 rounded-2xl text-xs sm:text-sm font-mono tracking-wider text-[#0A1E54] focus:outline-none transition-all shadow-inner placeholder-stone-400"
            />
            <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="sm:col-span-2 px-6 py-3.5 bg-[#0A1E54] hover:bg-[#1A3070] text-[#F8F3EA] text-xs font-mono uppercase tracking-wider font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Track Live</span>
                <Truck className="w-4 h-4 text-[#C9A66B]" />
              </>
            )}
          </button>
        </form>

        {/* Recent Invoices Quick-Fill Chips */}
        {recentOrders.length > 0 && (
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
              Recent:
            </span>
            {recentOrders.slice(0, 3).map((ord) => (
              <button
                key={ord.id}
                type="button"
                onClick={() => handleSelectRecent(ord.id)}
                className={`px-3 py-1 rounded-lg border text-[11px] font-mono transition-all cursor-pointer ${
                  activeQueryId.toUpperCase() === ord.id?.toUpperCase()
                    ? 'bg-[#0A1E54] text-[#C9A66B] border-[#0A1E54] font-bold shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                #{ord.id}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error state */}
      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 sm:p-5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-start gap-3 text-left text-xs font-mono shadow-xs"
        >
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">{errorMsg}</p>
            <p className="text-[11px] text-rose-700 font-sans">
              Tip: Order IDs were provided upon placing the order and sent via SMS/WhatsApp.
            </p>
          </div>
        </motion.div>
      )}

      {/* Live Order Status Display */}
      {orderData && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-8 space-y-6 text-left"
        >
          
          {/* Top Status Header Card */}
          <div className="bg-[#0A1E54] text-[#F8F3EA] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-[#C9A66B]/30">
            <div className="relative z-10 space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-widest text-[#C9A66B] uppercase font-bold">
                      CONSIGNMENT #
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold uppercase border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      LIVE LEDGER
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-wider mt-0.5">
                    {orderData.id}
                  </h2>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 text-center">
                    <span className="text-[9px] font-mono text-[#C9A66B] uppercase block font-bold">CURRENT STATUS</span>
                    <span className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                      {t(orderData.status, STAGES[currentStageIndex]?.labelBn || orderData.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Step-by-Step Order Progress Bar Component */}
              <div className="pt-2">
                <OrderProgressBar 
                  status={orderData.status} 
                  orderId={orderData.id} 
                  createdAt={orderData.createdAt} 
                  theme="dark" 
                  showDetailsCard={true} 
                />
              </div>

            </div>

            {/* Ambient Background Glow */}
            <div className="absolute right-0 bottom-0 w-80 h-80 bg-[#C9A66B]/15 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Details & Items Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Delivery destination & logistics data */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Destination Card */}
              <div className="bg-white rounded-3xl p-6 border border-[#0A1E54]/10 shadow-sm space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0A1E54] border-b border-stone-100 pb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C9A66B]" />
                  <span>Shipping Destination</span>
                </h4>

                <div className="space-y-2 text-xs text-stone-700">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-stone-400 shrink-0" />
                    <span className="font-bold text-[#0A1E54] text-sm">
                      {activeQueryPhone.trim() ? orderData.fullName : maskCustomerName(orderData.fullName)}
                    </span>
                    {!activeQueryPhone.trim() && (
                      <span className="text-[10px] text-stone-400 font-mono">(Privacy Protected)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                    <span className="font-mono">
                      {activeQueryPhone.trim() ? orderData.phone : maskCustomerPhone(orderData.phone)}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      {activeQueryPhone.trim() ? orderData.address : maskCustomerAddress(orderData.address)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-mono text-stone-500">
                    <span>Date Placed:</span>
                    <span>{orderData.createdAt ? new Date(orderData.createdAt).toLocaleDateString() : 'Recent'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-500">
                    <span>Payment Mode:</span>
                    <span className="font-bold text-[#0A1E54]">{orderData.paymentMethod || 'Cash On Delivery'}</span>
                  </div>
                </div>
              </div>

              {/* Courier Partner Card */}
              <div className="bg-white rounded-3xl p-6 border border-[#0A1E54]/10 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#0A1E54]/5 text-[#0A1E54] flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5 text-[#C9A66B]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-stone-400 font-bold">DISPATCH CARRIER</span>
                    <h4 className="text-sm font-serif font-bold text-[#0A1E54]">Patowary Express Nationwide Courier</h4>
                  </div>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  Doorstep courier transit across 64 districts in Bangladesh. Verified package inspection supported prior to payment.
                </p>
                <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-2 text-[11px] font-mono text-emerald-700">
                  <span className="inline-flex items-center gap-1 font-bold">
                    <Check className="w-3.5 h-3.5" /> Parcel Inspection Permitted
                  </span>
                  <span>•</span>
                  <span>Doorstep Tracking</span>
                </div>
              </div>

            </div>

            {/* Right Column: Ordered Items & Billing summary */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="bg-white rounded-3xl p-6 border border-[#0A1E54]/10 shadow-sm space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0A1E54] border-b border-stone-100 pb-2 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#C9A66B]" />
                  <span>Ordered Items ({orderData.items?.length || 0})</span>
                </h4>

                <div className="divide-y divide-stone-100 max-h-64 overflow-y-auto pr-1">
                  {(orderData.items || []).map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200'}
                          alt={item.title}
                          className="w-12 h-14 object-cover rounded-xl border border-stone-200 shrink-0 bg-stone-50"
                        />
                        <div>
                          <p className="text-xs font-serif font-bold text-[#0A1E54] line-clamp-1">{item.title}</p>
                          <p className="text-[10px] font-mono text-stone-500 mt-0.5">
                            Size: <strong>{item.variant}</strong> • Qty: <strong>{item.quantity}</strong>
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#0A1E54] shrink-0">
                        BDT {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total Billing */}
                <div className="pt-3 border-t border-stone-200 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span>BDT {orderData.totalPrice?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Doorstep Delivery Fee</span>
                    <span className="text-emerald-600 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#0A1E54] pt-2 border-t border-stone-200">
                    <span>Total Amount</span>
                    <span>BDT {orderData.totalPrice?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="py-2.5 px-3 rounded-xl bg-white border border-[#0A1E54]/15 hover:border-[#0A1E54] text-[#0A1E54] text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
                  title="Copy Tracking Link"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[11px] font-bold">{copiedLink ? 'Copied' : 'Share'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="py-2.5 px-3 rounded-xl bg-white border border-[#0A1E54]/15 hover:border-[#0A1E54] text-[#0A1E54] text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
                  title="Print Consignment Sheet"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold">Print</span>
                </button>

                <a
                  href={`https://wa.me/8801730943993?text=${encodeURIComponent(
                    `Hello Patowary Fashion, regarding my order tracking #${orderData.id}:`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#1ebd54] text-white text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
                  title="WhatsApp Helpdesk"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold">Care</span>
                </a>
              </div>

            </div>

          </div>

        </motion.div>
      )}

    </div>
  );
};
