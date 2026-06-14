import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  MapPin, 
  Truck, 
  Phone, 
  CheckCircle, 
  FileText, 
  ArrowLeft, 
  Gift, 
  Coins, 
  Info,
  ShieldAlert,
  Check
} from 'lucide-react';

export const Checkout: React.FC = () => {
  const { cartItems, totalPrice, totalBeforeDiscount, discountPercentage, deliveryCharge, clearCart, promoCode } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Contact States
  const [fullName, setFullName] = useState(() => {
    try {
      const autofillStr = localStorage.getItem('KIYOMI_profile_autofill') || localStorage.getItem('dorax_profile_autofill');
      if (autofillStr) {
        const data = JSON.parse(autofillStr);
        if (data.fullName) return data.fullName;
      }
    } catch (e) {}
    return user?.displayName || '';
  });
  const [phoneNumber, setPhoneNumber] = useState(() => {
    try {
      const autofillStr = localStorage.getItem('KIYOMI_profile_autofill') || localStorage.getItem('dorax_profile_autofill');
      if (autofillStr) {
        const data = JSON.parse(autofillStr);
        if (data.phoneNumber) return data.phoneNumber;
      }
    } catch (e) {}
    return '';
  });
  const [shippingAddress, setShippingAddress] = useState(() => {
    try {
      const autofillStr = localStorage.getItem('KIYOMI_profile_autofill') || localStorage.getItem('dorax_profile_autofill');
      if (autofillStr) {
        const data = JSON.parse(autofillStr);
        if (data.shippingAddress) return data.shippingAddress;
      }
    } catch (e) {}
    return '';
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  
  // bKash Gateway states
  const [showBkashModal, setShowBkashModal] = useState(false);
  const [bkashStep, setBkashStep] = useState<'account' | 'otp' | 'pin' | 'processing' | 'success'>('account');
  const [bkashAccount, setBkashAccount] = useState('');
  const [bkashOtp, setBkashOtp] = useState('');
  const [bkashPin, setBkashPin] = useState('');
  const [mockOtpCode, setMockOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // Status indicators
  const [isOrdering, setIsOrdering] = useState(false);
  const [successOrder, setSuccessOrder] = useState<any>(null);

  // Handle generating bKash OTP
  const triggerSendBkashOtp = (isResend = false) => {
    setOtpSent(false);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setMockOtpCode(code);
    setTimeout(() => {
      setOtpSent(true);
      if (isResend) {
        playCinematicIntroSound("SMS verification code resent to your bKash mobile number.");
      } else {
        playCinematicIntroSound("Verification code sent to your mobile. Please verify.");
      }
    }, 900);
  };

  const handleCloseBkashModal = () => {
    setShowBkashModal(false);
    setBkashStep('account');
    setBkashAccount('');
    setBkashOtp('');
    setBkashPin('');
    setOtpSent(false);
    setOtpVerified(false);
  };

  const handleProceedBkashGate = () => {
    if (bkashStep === 'account') {
      if (bkashAccount.length < 11) return;
      setBkashStep('processing');
      setTimeout(() => {
        setBkashStep('otp');
        triggerSendBkashOtp(false);
      }, 1000);
    } else if (bkashStep === 'otp') {
      if (bkashOtp.length < 6) return;
      setBkashStep('processing');
      setTimeout(() => {
        setBkashStep('pin');
      }, 1200);
    } else if (bkashStep === 'pin') {
      if (bkashPin.length < 5) return;
      setBkashStep('processing');
      setTimeout(() => {
        setBkashStep('success');
        setOtpVerified(true);
        // Play success tone
        playCinematicIntroSound("bKash payment verification successful. Recording order invoice.");
        
        // Complete the order automatically after short delay
        setTimeout(() => {
          setShowBkashModal(false);
          executeOrderSubmission("Paid via bKash (" + bkashAccount + ")");
        }, 2200);
      }, 1800);
    }
  };

  const executeOrderSubmission = async (paymentDetails: string) => {
    setIsOrdering(true);
    const trackingNo = `DRX-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const orderPayload = {
      id: trackingNo,
      fullName: fullName.trim(),
      phone: phoneNumber.trim(),
      address: shippingAddress.trim(),
      paymentMethod: paymentDetails,
      items: cartItems.map(item => ({
        productId: item.product.id,
        title: item.product.title,
        price: item.product.price,
        variant: item.selectedVariant,
        quantity: item.quantity,
        image: item.product.assets[0]
      })),
      totalPrice,
      status: 'Received',
      paymentStatus: 'Paid',
      createdAt: new Date().toISOString()
    };

    try {
      const orderRef = doc(db, 'orders', trackingNo);
      await setDoc(orderRef, orderPayload);
      
      const existingStr = localStorage.getItem('KIYOMI_local_orders') || localStorage.getItem('dorax_local_orders') || '[]';
      const localOrders = JSON.parse(existingStr);
      localOrders.push(orderPayload);
      localStorage.setItem('KIYOMI_local_orders', JSON.stringify(localOrders));
    } catch (err) {
      console.warn("Firestore order submission skipped or offline. Writing to backup local storage.", err);
      const existingStr = localStorage.getItem('KIYOMI_local_orders') || localStorage.getItem('dorax_local_orders') || '[]';
      const localOrders = JSON.parse(existingStr);
      localOrders.push(orderPayload);
      localStorage.setItem('KIYOMI_local_orders', JSON.stringify(localOrders));
    }

    setSuccessOrder(orderPayload);
    clearCart();
    setIsOrdering(false);
    playCinematicIntroSound(`Order recorded successfully. Copy your Tracking Voucher ID: ${trackingNo}`);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!fullName || !phoneNumber || !shippingAddress) {
      alert("Please complete shipping profile fields");
      return;
    }

    if (paymentMethod === 'bKash') {
      // Prompt bkash modal verification first
      setBkashAccount(phoneNumber || '');
      setBkashStep('account');
      setBkashOtp('');
      setBkashPin('');
      setOtpSent(false);
      setShowBkashModal(true);
      playCinematicIntroSound("Starting secure bKash checkout verification.");
      return;
    }

    // Cash on Delivery
    setIsOrdering(true);
    playCinematicIntroSound("Processing Cash on delivery invoice. Dispatching courier line.");

    const trackingNo = `DRX-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const orderPayload = {
      id: trackingNo,
      fullName: fullName.trim(),
      phone: phoneNumber.trim(),
      address: shippingAddress.trim(),
      paymentMethod: 'Cash on Delivery',
      items: cartItems.map(item => ({
        productId: item.product.id,
        title: item.product.title,
        price: item.product.price,
        variant: item.selectedVariant,
        quantity: item.quantity,
        image: item.product.assets[0]
      })),
      totalPrice,
      status: 'Received',
      paymentStatus: 'Unpaid',
      createdAt: new Date().toISOString()
    };

    try {
      const orderRef = doc(db, 'orders', trackingNo);
      await setDoc(orderRef, orderPayload);
      
      const existingStr = localStorage.getItem('KIYOMI_local_orders') || localStorage.getItem('dorax_local_orders') || '[]';
      const localOrders = JSON.parse(existingStr);
      localOrders.push(orderPayload);
      localStorage.setItem('KIYOMI_local_orders', JSON.stringify(localOrders));
    } catch (err) {
      console.warn("Firestore order submission skipped or offline. Writing to backup local storage.", err);
      const existingStr = localStorage.getItem('KIYOMI_local_orders') || localStorage.getItem('dorax_local_orders') || '[]';
      const localOrders = JSON.parse(existingStr);
      localOrders.push(orderPayload);
      localStorage.setItem('KIYOMI_local_orders', JSON.stringify(localOrders));
    }

    setTimeout(() => {
      setSuccessOrder(orderPayload);
      clearCart();
      setIsOrdering(false);
      playCinematicIntroSound(`Order recorded successfully. Copy your Tracking Voucher ID: ${trackingNo}`);
    }, 1800);
  };

  if (successOrder) {
    return (
      <div id="checkout-success-view" className="bg-[#fbf9f5] min-h-screen py-16 selection:bg-emerald-800 selection:text-white flex items-center justify-center font-sans">
        <div className="max-w-xl w-full mx-4 bg-white border border-stone-200 p-8 rounded-lg shadow-xl text-center space-y-6 relative overflow-hidden">
          
          {/* Aesthetic success ribbon */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-800" />
          
          <CheckCircle className="w-16 h-16 text-emerald-800 mx-auto" />
          
          <div className="space-y-1">
            <h2 className="text-xl font-serif font-extrabold text-[#0f2c2e] uppercase tracking-wider">ORDER SECURED UNDER DIVISION</h2>
            <p className="text-stone-500 font-sans text-xs">A copy of the digital ledger invoice ticket is displayed below.</p>
          </div>

          {/* Ticket voucher */}
          <div className="border border-dashed border-stone-300 bg-[#fbf9f5] p-5 rounded-lg text-left space-y-4">
            <div className="flex justify-between border-b border-stone-200 pb-2 text-[10px] font-mono uppercase tracking-wider text-stone-500">
              <span>LEDGER TICKET</span>
              <span>DATE: {new Date(successOrder.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="space-y-1">
              <span className="block text-[8px] font-mono tracking-widest text-stone-400 uppercase">UNIQUE TRACKING ID</span>
              <span className="block text-sm font-mono tracking-widest font-extrabold text-[#0f2c2e] select-all bg-stone-100 p-2.5 rounded text-center border">
                {successOrder.id}
              </span>
              <span className="block text-[7px] font-sans text-stone-400 text-center uppercase pt-1">
                (Triple click to copy tracking ID. You can paste this on the Track Shipping page)
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-stone-700">
              <div className="flex justify-between">
                <span>CONSIGNEE CLIENT:</span>
                <strong className="text-[#0f2c2e] uppercase">{successOrder.fullName}</strong>
              </div>
              <div className="flex justify-between">
                <span>MOBILE LINE:</span>
                <span>{successOrder.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>SHIPPING WAREHOUSE:</span>
                <span className="max-w-[200px] text-right truncate">{successOrder.address}</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-2 font-mono font-bold text-[#0f2c2e]">
                <span>TOTAL INVOICE COST:</span>
                <span>BDT {successOrder.totalPrice}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/track-order"
              className="flex-1 bg-[#0f2c2e] hover:bg-[#1a4a4d] text-white text-xs font-mono tracking-widest uppercase font-bold py-3.5 rounded transition-transform hover:scale-[1.01] flex items-center justify-center gap-1"
            >
              <Truck className="w-4 h-4" /> TRACK DISPATCHES
            </Link>
            <Link
              to="/products"
              className="flex-1 border border-[#0f2c2e] hover:bg-[#0f2c2e] text-[#0f2c2e] hover:text-white text-xs font-mono tracking-widest uppercase font-bold py-3.5 rounded transition-colors flex items-center justify-center"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="checkout-form-view" className="bg-[#fbf9f5] min-h-screen py-12 selection:bg-emerald-800 selection:text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Return */}
        <div className="mb-6">
          <Link to="/products" className="text-stone-500 hover:text-[#0f2c2e] text-xs font-mono uppercase tracking-widest flex items-center gap-1.5 hover:underline">
            <ArrowLeft className="w-4 h-4" /> DISMISS CHECKOUT
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white border rounded-lg p-16 text-center space-y-6 max-w-xl mx-auto">
            <ShieldAlert className="w-12 h-12 text-rose-800 mx-auto" />
            <h3 className="text-sm font-mono tracking-widest uppercase font-bold text-[#0f2c2e]">CHECKOUT DENIED</h3>
            <p className="text-stone-500 text-xs">
              Your cart is empty. You must populate products from collections before invoking the transaction gateway.
            </p>
            <Link to="/products" className="inline-block bg-[#0f2c2e] text-white text-xs font-mono tracking-widest uppercase py-3.5 px-8 rounded">
              EXPLORE COLLECTION ALL
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Side: Dispatch shipping parameters (7-cols) */}
            <form onSubmit={handleSubmitOrder} className="lg:col-span-7 bg-white border border-stone-200/80 p-8 sm:p-10 rounded-[2rem] shadow-xl shadow-stone-100 space-y-8">
              <div>
                <span className="text-[10px] bg-emerald-550/10 text-emerald-800 font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">STEP 1 OF 2</span>
                <h2 className="text-xl font-serif text-[#0c1e1f] mt-3 pb-3 border-b border-stone-150 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-emerald-800" /> COURIER DISPATCH REGISTRATION
                </h2>
                <p className="text-xs text-stone-500 mt-2">Enter your verified consignee parameters below to queue high-priority courier routing.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-600 font-black">CONSIGNEE FULL NAME</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="E.G., SHAHRIAR KABIR"
                    className="w-full bg-[#fbf9f5] border border-stone-200 focus:border-[#0f2c2e] focus:bg-white focus:ring-1 focus:ring-[#0f2c2e]/10 py-3.5 px-4 rounded-xl text-xs focus:outline-none font-mono tracking-wider uppercase transition-all duration-300 shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-600 font-black">ACTIVE MOBILE LINE</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 017XXXXXXXX"
                      className="w-full bg-[#fbf9f5] border border-stone-200 focus:border-[#0f2c2e] focus:bg-white focus:ring-1 focus:ring-[#0f2c2e]/10 pl-11 pr-4 py-3.5 rounded-xl text-xs focus:outline-none font-mono tracking-wider transition-all duration-300 shadow-sm"
                    />
                    <Phone className="w-4 h-4 absolute left-4 top-3.5 text-stone-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-600 font-black">COURIER DELIVER WAREHOUSE ADDRESS</label>
                <textarea
                  required
                  rows={3}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="E.G., HOUSE 12, ROAD 5, GULSHAN 2, DHAKA-1212"
                  className="w-full bg-[#fbf9f5] border border-stone-200 focus:border-[#0f2c2e] focus:bg-white focus:ring-1 focus:ring-[#0f2c2e]/10 p-4 rounded-xl text-xs focus:outline-none font-sans transition-all duration-300 shadow-sm resize-none"
                />
              </div>

              {/* Secure Payment details selection */}
              <div className="space-y-5 pt-4 border-t border-stone-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-mono tracking-widest uppercase font-black text-stone-600">CHOOSE PREFERRED PAYMENT METHOD</h3>
                  <span className="text-[9px] bg-pink-100 text-pink-700 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">SECURED SSL</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Cash on Delivery Button */}
                  <div
                    onClick={() => {
                      setPaymentMethod('Cash on Delivery');
                      playCinematicIntroSound("Cash on Delivery selected. Pay courier directly.");
                    }}
                    className={`p-6 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                      paymentMethod === 'Cash on Delivery' 
                        ? 'border-emerald-700 bg-emerald-500/[0.03] shadow-lg shadow-emerald-950/5 ring-1 ring-emerald-700/20' 
                        : 'border-stone-200 hover:border-emerald-600 hover:bg-emerald-500/[0.01] bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold uppercase text-emerald-900 tracking-wider">CASH ON DELIVERY</span>
                      <Coins className={`w-5 h-5 transition-transform duration-300 ${paymentMethod === 'Cash on Delivery' ? 'scale-110 text-emerald-800' : 'text-stone-400'}`} />
                    </div>
                    <span className="block text-[11px] text-stone-500 font-sans leading-relaxed">Pay with cash to our courier driver upon delivery after product quality verification.</span>
                    {paymentMethod === 'Cash on Delivery' && (
                      <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-600 rounded-bl-lg flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* bKash Payment Button */}
                  <div
                    onClick={() => {
                      setPaymentMethod('bKash');
                      playCinematicIntroSound("bKash payment selected. Secure live checkout will trigger.");
                    }}
                    className={`p-6 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                      paymentMethod === 'bKash' 
                        ? 'border-pink-600 bg-pink-500/[0.03] shadow-lg shadow-pink-950/5 ring-1 ring-pink-600/20' 
                        : 'border-stone-200 hover:border-pink-500 hover:bg-pink-500/[0.01] bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold uppercase text-pink-700 tracking-wider">bKash (বিকাশ)</span>
                      <span className="font-serif text-xs font-black italic text-pink-600 select-none bg-pink-50 px-2 py-0.5 rounded">bKash</span>
                    </div>
                    <span className="block text-[11px] text-stone-500 font-sans leading-relaxed">Simulated Live Send Money verification with dynamic OTP text receipt in real time.</span>
                    {paymentMethod === 'bKash' && (
                      <div className="absolute top-0 right-0 w-4 h-4 bg-pink-600 rounded-bl-lg flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>

                </div>

                {/* Simulated Payment Instructions for bKash */}
                {paymentMethod === 'bKash' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl border border-pink-100 space-y-2"
                  >
                    <div className="flex items-start gap-3 text-xs text-pink-950 font-sans leading-relaxed">
                      <div className="w-2.5 h-2.5 rounded-full bg-pink-600 mt-1 shrink-0 animate-pulse" />
                      <div>
                        <strong>Instant bKash Gateway Service:</strong> Click the button below to launch our interactive secure checkout simulator. Send-money OTP code will be sent to Merchant <strong className="font-mono text-sm underline bg-white/60 px-1 rounded">01633704001</strong>.
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Order Submit */}
              <button
                type="submit"
                disabled={isOrdering}
                className={`w-full text-xs font-mono tracking-[0.25em] font-black uppercase h-14 rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:scale-[1.01] md:active:scale-95 ${
                  paymentMethod === 'bKash' 
                    ? 'bg-pink-600 hover:bg-pink-700 hover:shadow-pink-500/15 text-white' 
                    : 'bg-[#0f2c2e] hover:bg-[#153e41] hover:shadow-emerald-950/20 text-white'
                } ${isOrdering ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                {isOrdering ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    GENERATING SECURE INVOICE...
                  </span>
                ) : (
                  paymentMethod === 'bKash' 
                    ? t("PROCEED WITH bKash PAYMENT / বিকাশ পেমেন্ট সম্পন্ন করুন") 
                    : t("PROCEED WITH CASH ON DELIVERY / ক্যাশ অন ডেলিভারি নিশ্চিত করুন")
                )}
              </button>

            </form>

            {/* Right Side: Ledger totals invoice details (5-cols) */}
            <aside className="lg:col-span-5 bg-[#eae5db]/30 border border-stone-200 p-8 rounded-[2rem] space-y-8 shadow-sm">
              <div className="border-b border-stone-200 pb-4">
                <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#0f2c2e]/70 font-bold">CART STATEMENT</span>
                <h2 className="text-lg font-serif text-[#0f2c2e] mt-1 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-stone-500" /> ORDER SUMMARY
                </h2>
              </div>

              {/* Items List */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item, id) => (
                  <div key={`${item.product.id}-${item.selectedVariant}`} className="flex gap-4 justify-between items-center text-xs pb-3 border-b border-stone-150 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={item.product.assets[0]} alt={item.product.title} className="w-12 h-16 object-cover object-center rounded-xl bg-stone-100 border border-stone-200/50" />
                        <span className="absolute -top-1.5 -right-1.5 bg-[#0f2c2e] text-white text-[9px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-[#0f2c2e] mb-0.5 line-clamp-1 max-w-[180px]">{item.product.title}</h4>
                        <span className="block text-[8px] font-mono uppercase text-stone-500 tracking-wider">SIZE: {item.selectedVariant}</span>
                      </div>
                    </div>
                    <span className="font-mono text-[#0f2c2e] font-bold text-right">BDT {item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Promotional application tracking indicators */}
              <div className="border-t border-b border-stone-200/80 py-5 space-y-3.5 text-xs font-mono text-[#0f2c2e]">
                <div className="flex justify-between text-stone-600">
                  <span>CART SUBTOTAL</span>
                  <span className="font-bold">BDT {totalBeforeDiscount}</span>
                </div>
                {discountPercentage > 0 && (
                  <div className="flex justify-between text-emerald-800 font-black items-center bg-emerald-500/10 px-3 py-1.5 rounded-xl">
                    <span className="flex items-center gap-1.5"><Gift className="w-4 h-4" /> COUPON DISCOUNT</span>
                    <span>- BDT {Math.round(totalBeforeDiscount * (discountPercentage / 100))}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>COURIER DELIVERY</span>
                  <span className="font-bold">{deliveryCharge === 0 ? "FREE" : `BDT ${deliveryCharge}`}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200/60 flex justify-between items-center text-[#0f2c2e] shadow-sm">
                <span className="text-[10px] font-mono tracking-widest uppercase font-black">PAYABLE TOTAL</span>
                <span className="text-xl font-mono font-black text-[#0f2c2e]">BDT {totalPrice}</span>
              </div>

              {/* Trust badges */}
              <div className="p-4 border border-dashed border-stone-300 rounded-2xl text-[9px] text-[#0f2c2e]/60 font-mono tracking-widest leading-relaxed text-center uppercase space-y-1 bg-white/40">
                <div>🔒 SSL CONNECT SECURE PORTAL 256-BIT API</div>
                <div>KIYOMI PREMIUM LUXURY ASSURANCE APPROVED</div>
              </div>
            </aside>

          </div>
        )}

        {/* bKash Payment Gateway Modal */}
        <AnimatePresence>
          {showBkashModal && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
              <motion.div
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 50, opacity: 0 }}
                className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#e2125d] text-white shadow-2xl flex flex-col font-sans"
              >
                {/* Mock SMS OTP Notification Toast */}
                {otpSent && bkashStep === 'otp' && (
                  <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 20, opacity: 1 }}
                    className="absolute top-0 left-4 right-4 z-[160] bg-zinc-900 border border-zinc-700 p-3 rounded-2xl shadow-2xl text-xs flex gap-3 items-center text-left"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse shrink-0" />
                    <div className="flex-1">
                      <span className="font-bold text-pink-400 block font-mono text-[8px] uppercase tracking-wider">SMS - bKash</span>
                      <p className="font-mono text-[10px] text-stone-100">Your bKash OTP is: <strong className="text-pink-300 font-extrabold tracking-widest">{mockOtpCode}</strong></p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setBkashOtp(mockOtpCode)}
                      className="px-2.5 py-1 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-[9px] font-bold uppercase transition scale-95"
                    >
                      Autofill
                    </button>
                  </motion.div>
                )}

                {/* Modal Header */}
                <div className="bg-[#de1258] p-6 border-b border-white/5 flex flex-col items-center">
                  <div className="flex items-center gap-3 mb-2 pt-2">
                    <span className="text-2xl font-black italic tracking-tighter">bKash</span>
                    <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full uppercase font-bold tracking-widest text-[#CBF23D]">GATEWAY</span>
                  </div>
                  <div className="text-center mt-3 bg-black/10 px-4 py-1.5 rounded-2xl border border-white/5">
                    <span className="block text-[8px] text-white/60 tracking-widest uppercase mb-0.5 font-mono">MERCHANT MERCHANT</span>
                    <strong className="text-sm font-mono tracking-widest text-white">01633704001</strong>
                  </div>
                  <div className="mt-3.5 text-center">
                    <span className="text-[10px] uppercase font-mono text-white/50 block">PAYABLE AMOUNT</span>
                    <strong className="text-2xl font-mono text-[#CBF23D] font-black">{totalPrice} BDT</strong>
                  </div>
                </div>

                {/* Gateway Body */}
                <div className="p-6 bg-[#e2125d] text-white min-h-[220px] flex flex-col justify-center space-y-5">
                  {bkashStep === 'account' && (
                    <div className="space-y-4 text-center">
                      <div className="text-xs text-white/90 leading-relaxed">
                        বিকাশ অ্যাকাউন্ট নম্বর প্রদান করুন।
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[8px] font-mono tracking-widest text-white/50 uppercase">BKASH ACCOUNT NUMBER</label>
                        <input
                          type="text"
                          maxLength={11}
                          value={bkashAccount}
                          onChange={(e) => setBkashAccount(e.target.value.replace(/\D/g, '').slice(0, 11))}
                          placeholder="e.g. 016XXXXXXXX"
                          className="w-full bg-[#de1258] border border-white/10 py-3.5 px-4 rounded-xl text-center text-lg font-mono font-bold tracking-wider focus:outline-none focus:border-white shadow-inner placeholder:text-white/30"
                        />
                      </div>
                      <div className="flex gap-2 items-start text-[9px] text-white/70 text-left leading-normal pt-1.5">
                        <input type="checkbox" defaultChecked className="mt-0.5" />
                        <span>বিকাশ-এর শর্তাবলী মেনে আপনি এই পোর্টাল ব্যবহারে সম্মতি প্রদান করছেন।</span>
                      </div>
                    </div>
                  )}

                  {bkashStep === 'otp' && (
                    <div className="space-y-4 text-center">
                      <div className="text-xs text-white/90 leading-relaxed">
                        আপনার মোবাইল নম্বরে পাঠানো ৬ ডিজিটের ওটিপি (OTP) দিন।
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[8px] font-mono tracking-widest text-white/50 uppercase">6-DIGIT VERIFICATION CODE</label>
                        <input
                          type="text"
                          maxLength={6}
                          value={bkashOtp}
                          onChange={(e) => setBkashOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="------"
                          className="w-full bg-[#de1258] border border-white/10 py-3.5 px-4 rounded-xl text-center text-xl font-mono font-bold tracking-[0.3em] focus:outline-none focus:border-white shadow-inner placeholder:text-white/30"
                        />
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => triggerSendBkashOtp(true)}
                          className="text-[9px] font-mono hover:underline text-[#CBF23D]"
                        >
                          Didn't receive code? Resend SMS OTP
                        </button>
                      </div>
                    </div>
                  )}

                  {bkashStep === 'pin' && (
                    <div className="space-y-4 text-center">
                      <div className="text-xs text-white/90 leading-relaxed">
                        আপনার বিকাশ অ্যাকাউন্টের ৫ ডিজিটের গোপন পিন (PIN) দিন।
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[8px] font-mono tracking-widest text-white/50 uppercase">ENTER ACCOUNT PIN</label>
                        <input
                          type="password"
                          maxLength={5}
                          value={bkashPin}
                          onChange={(e) => setBkashPin(e.target.value.replace(/\D/g, '').slice(0, 5))}
                          placeholder="•••••"
                          className="w-full bg-[#de1258] border border-white/10 py-3.5 px-4 rounded-xl text-center text-xl font-mono font-bold tracking-[0.5em] focus:outline-none focus:border-white shadow-inner placeholder:text-white/30 font-black"
                        />
                      </div>
                    </div>
                  )}

                  {bkashStep === 'processing' && (
                    <div className="py-8 flex flex-col items-center justify-center space-y-4 text-center">
                      <div className="w-10 h-10 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold tracking-widest uppercase">TRANSACTION SECURING...</h4>
                        <p className="text-[9px] text-white/60">Verifying ledger clearance with bKash API gateways...</p>
                      </div>
                    </div>
                  )}

                  {bkashStep === 'success' && (
                    <div className="py-6 flex flex-col items-center justify-center space-y-4 text-center">
                      <div className="w-14 h-14 bg-white text-[#e2125d] rounded-full flex items-center justify-center shadow-lg relative">
                        <CheckCircle className="w-8 h-8" />
                        <div className="absolute inset-0 bg-[#CBF23D] rounded-full animate-ping opacity-10" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-black tracking-wide uppercase text-[#CBF23D]">BDT {totalPrice} SUCCESS</h4>
                        <p className="text-[10px] text-white/70">Securely logged to: 01633704001</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Buttons */}
                {bkashStep !== 'processing' && bkashStep !== 'success' && (
                  <div className="bg-[#9c0d40] p-4 flex gap-3 border-t border-white/5">
                    <button
                      type="button"
                      onClick={handleCloseBkashModal}
                      className="flex-1 bg-white/5 hover:bg-white/15 text-white/80 px-4 py-3 rounded-2xl text-[9px] font-mono uppercase tracking-widest transition active:scale-95"
                    >
                      {t("CLOSE / বাতিল")}
                    </button>
                    <button
                      type="button"
                      onClick={handleProceedBkashGate}
                      disabled={
                        (bkashStep === 'account' && bkashAccount.length < 11) ||
                        (bkashStep === 'otp' && bkashOtp.length < 6) ||
                        (bkashStep === 'pin' && bkashPin.length < 5)
                      }
                      className="flex-1 bg-[#CBF23D] text-slate-900 font-extrabold hover:bg-[#bce02b] disabled:opacity-30 disabled:pointer-events-none px-4 py-3 rounded-2xl text-[9px] font-mono uppercase tracking-widest transition active:scale-95 shadow-lg"
                    >
                      {t("PROCEED / নিশ্চিত")}
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
