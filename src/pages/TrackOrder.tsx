import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { 
  Search, 
  Truck, 
  Clock, 
  PackageCheck, 
  User, 
  MapPin, 
  DollarSign, 
  ShoppingBag, 
  Info,
  ChevronRight,
  ClipboardList
} from 'lucide-react';

export const TrackOrder: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trackingIdInput, setTrackingIdInput] = useState(searchParams.get('id') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('id') || '');

  const [orderData, setOrderData] = useState<any>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Local storage orders history to show as suggestions for easier testing!
  const [suggestedOrders, setSuggestedOrders] = useState<any[]>([]);

  useEffect(() => {
    const rawLocalHistory = localStorage.getItem('KIYOMI_local_orders') || localStorage.getItem('dorax_local_orders');
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

    // 1. Setup a real-time Firestore listener on this specific invoice document
    const orderDocRef = doc(db, 'orders', searchQuery.trim());
    const unsub = onSnapshot(orderDocRef, (snap) => {
      if (snap.exists()) {
        setOrderData(snap.data());
        setSearchError(null);
        setLoading(false);
      } else {
        // 2. Check local backup orders fallback memory trace
        const matchLocal = suggestedOrders.find(ord => ord.id.toUpperCase() === searchQuery.trim().toUpperCase());
        if (matchLocal) {
          setOrderData(matchLocal);
          setSearchError(null);
        } else {
          setOrderData(null);
          setSearchError("INVOICE VOUCHER TRACKING ID NOT RECISTERED IN SYSTEMS");
        }
        setLoading(false);
      }
    }, (err) => {
      // Offline/Permissions Firestore error -> search local suggestions directly
      const matchLocal = suggestedOrders.find(ord => ord.id.toUpperCase() === searchQuery.trim().toUpperCase());
      if (matchLocal) {
        setOrderData(matchLocal);
        setSearchError(null);
      } else {
        setOrderData(null);
        setSearchError("INVOICE VOUCHER TRACKING ID NOT REGISTERED IN SYSTEMS (OFFLINE)");
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
    playCinematicIntroSound(`Inquiring delivery phase for tracking ID ${cleanId}`);
  };

  const handleSelectSuggestion = (idStr: string) => {
    setTrackingIdInput(idStr);
    setSearchParams({ id: idStr });
    setSearchQuery(idStr);
  };

  // Phases of shipment
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
    <div id="tracking-engine-view" className="bg-[#fbf9f5] min-h-screen py-16 selection:bg-emerald-800 selection:text-white font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Title center */}
        <div className="text-center mb-12 space-y-3">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#005840] uppercase font-bold">KIYOMI COMMUNION PORTAL</span>
          <h2 className="text-xl sm:text-2xl font-serif tracking-[0.2em] font-bold text-[#0f2c2e] uppercase">SHIPPING INVOICE TRACKING</h2>
          <div className="w-12 h-1 bg-[#2d728f]/30 mx-auto rounded" />
        </div>

        {/* Tracking Code input box */}
        <div className="bg-white border border-stone-200 p-6 sm:p-8 rounded-lg shadow-sm space-y-6">
          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                required
                value={trackingIdInput}
                onChange={(e) => setTrackingIdInput(e.target.value)}
                placeholder="ENTER INVOICE TRACKING ID, E.C., DRX-2026-57112"
                className="w-full bg-[#fbf9f5] border border-stone-300 pl-10 pr-4 py-3 rounded text-xs font-mono tracking-widest uppercase focus:outline-none focus:border-[#0f2c2e]"
              />
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
            </div>
            <button
              type="submit"
              className="bg-[#0f2c2e] hover:bg-[#1a4a4d] text-[#fbf9f5] hover:scale-[1.01] transition-all text-xs font-mono tracking-widest uppercase font-bold py-3 px-8 rounded shrink-0 cursor-pointer"
            >
              INQUIRE DISPATCH
            </button>
          </form>

          {/* Quick recommendations local storage links if there's orders */}
          {suggestedOrders.length > 0 && (
            <div className="space-y-2 border-t border-stone-100 pt-4">
              <span className="block text-[10px] font-mono uppercase tracking-widest text-stone-400">YOUR RECENT BILLING HISTORY INVOICES:</span>
              <div className="flex flex-wrap gap-2">
                {suggestedOrders.map((ord) => (
                  <button
                    key={ord.id}
                    onClick={() => handleSelectSuggestion(ord.id)}
                    className="bg-stone-100 hover:bg-[#eae5db]/40 text-[#0f2c2e] text-[9.5px] font-mono border border-stone-350 px-3 py-1.5 rounded transition-transform cursor-pointer hover:scale-[1.02]"
                  >
                    🚀 {ord.id} (BDT {ord.totalPrice})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Load indicators */}
        {loading && (
          <div className="py-12 text-center text-xs font-mono tracking-widest text-[#0f2c2e] uppercase animate-pulse">
            CONNECTING DISPATCH REGISTRY SECTOR...
          </div>
        )}

        {/* Errors display */}
        {searchError && !loading && (
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-6 mt-8 space-y-2 text-center">
            <Info className="w-8 h-8 text-amber-700 mx-auto" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-900">{searchError}</h4>
            <p className="text-stone-500 font-sans text-xs max-w-sm mx-auto">
              Make sure typing matches characters exactly. If you placed a test order earlier, click its suggested ID button above.
            </p>
          </div>
        )}

        {/* Realtime Delivery Phase display cards */}
        {orderData && !loading && (
          <div className="mt-8 space-y-6">
            
            {/* Visual Tracking Progress Indicator */}
            <div className="bg-white border border-stone-200 p-6 sm:p-8 rounded-lg shadow-sm space-y-6">
              <h3 className="text-xs font-mono tracking-widest uppercase font-extrabold text-stone-500 flex items-center gap-1.5">
                <Clock className="w-4.5 h-4.5 text-[#2d728f]" /> COURIER DISPATCH TIMELINE STATUS
              </h3>

              {/* Graphical Progress Track */}
              <div className="relative pt-6 pb-2">
                {/* Horizontal progress bar */}
                <div className="absolute top-[42px] left-6 right-6 h-1 bg-stone-200 -z-0 hidden md:block" />
                <div 
                  className="absolute top-[42px] left-6 h-1 bg-emerald-800 -z-0 transition-all duration-700 hidden md:block" 
                  style={{ width: `${(currentPhaseIdx / (PHASES.length - 1)) * 94}%` }}
                />

                {/* Nodes layout Grid */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-2 relative z-10">
                  {PHASES.map((phase, idx) => {
                    const isCompleted = idx < currentPhaseIdx;
                    const isActive = idx === currentPhaseIdx;
                    return (
                      <div key={phase} className="flex md:flex-col items-center text-left md:text-center space-y-0 md:space-y-3.5 space-x-4 md:space-x-0">
                        {/* Dot */}
                        <div 
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-[11px] font-bold border transition-all duration-500 ${isCompleted ? 'bg-emerald-850 text-white border-transparent' : isActive ? 'bg-yellow-600 text-white border-transparent animate-bounce' : 'bg-white text-stone-400 border-stone-250'}`}
                        >
                          {isCompleted ? "✓" : idx + 1}
                        </div>

                        {/* Text */}
                        <div>
                          <span className={`block text-xs font-mono tracking-wider uppercase font-bold ${isActive ? 'text-yellow-600 font-extrabold' : isCompleted ? 'text-emerald-900' : 'text-stone-400'}`}>
                            {phase}
                          </span>
                          <span className="block text-[9px] font-sans text-stone-400 uppercase leading-none mt-0.5">
                            {idx === 0 ? "LEDGER CAPTURED" : 
                             idx === 1 ? "PACKAGING LABELS" :
                             idx === 2 ? "COURIER HANDED" :
                             idx === 3 ? "DELIVERY AGENT" : "CONSIGNED"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Invoiced Shipment details cards */}
            <div className="bg-white border border-stone-200 p-6 sm:p-8 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              {/* Delivery Consignee address info parameters */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono tracking-widest uppercase font-extrabold text-stone-550 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#2d728f]" /> DISPATCH DETAILS
                </h3>
                <ul className="space-y-2.5 text-xs text-[#0f2c2e]">
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-stone-500 font-mono uppercase text-[10px]">CLIENT CONSIGNEE:</span>
                    <strong className="uppercase">{orderData.fullName}</strong>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-stone-500 font-mono uppercase text-[10px]">COURIER PHONE:</span>
                    <span>{orderData.phone}</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-stone-500 font-mono uppercase text-[10px]">PAYMENT METHOD:</span>
                    <span className="uppercase font-semibold text-emerald-800">{orderData.paymentMethod}</span>
                  </li>
                  <li className="flex flex-col space-y-1">
                    <span className="text-stone-500 font-mono uppercase text-[10px] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> SHIPPING WAREHOUSE ADDRESS:
                    </span>
                    <span className="font-sans text-xs italic bg-stone-100 p-2.5 rounded border leading-relaxed capitalize">
                      {orderData.address}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Item checklist invoice summary */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono tracking-widest uppercase font-extrabold text-stone-550 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-[#2d728f]" /> CUSTOMER CART ITEMS
                </h3>
                
                <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-2">
                  {orderData.items ? orderData.items.map((item: any, id: number) => (
                    <div key={id} className="flex gap-2 justify-between items-center text-xs text-[#0f2c2e] border-b border-stone-100 pb-2">
                      <div className="flex items-center gap-2">
                        {item.image && <img src={item.image} className="w-6 h-8 object-cover rounded border" alt="thumbnail" />}
                        <span>{item.title} <strong className="font-mono text-[9px] bg-stone-100 text-stone-600 px-1">{item.variant}</strong> (x{item.quantity})</span>
                      </div>
                      <span className="font-mono font-bold">BDT {item.price * item.quantity}</span>
                    </div>
                  )) : (
                    <p className="text-xs text-stone-500 italic">No package details retrieved</p>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2 font-mono font-bold text-[#0f2c2e] border-t border-stone-200">
                  <span className="text-[10px] tracking-wider">TOTAL INVOICE CHARGE:</span>
                  <span className="text-sm">BDT {orderData.totalPrice}</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
