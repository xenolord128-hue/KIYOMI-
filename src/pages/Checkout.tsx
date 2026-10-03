import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { db, storage } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion, AnimatePresence } from 'motion/react';
import { sendFormViaEmailJS } from '../lib/emailjs';
import {
  PAYMENT_CONFIG,
  DELIVERY_CONFIG,
  isValidBangladeshPhone,
  generateOrderId,
} from '../config/checkoutConfig';
import { Order, OrderItem, PaymentMethodType } from '../types';
import {
  MapPin,
  Truck,
  Phone,
  Mail,
  User,
  CheckCircle,
  FileText,
  ArrowLeft,
  Coins,
  ShieldCheck,
  Check,
  Copy,
  Landmark,
  Upload,
  AlertCircle,
  Sparkles,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  ExternalLink,
  Info,
  Clock,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const Checkout: React.FC = () => {
  const {
    cartItems,
    totalBeforeDiscount,
    discountPercentage,
    discountAmount,
    promoCode,
    applyPromo,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Current step state for progress indicator (1: Information, 2: Delivery, 3: Payment, 4: Confirmation)
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Form Field States
  const [fullName, setFullName] = useState(() => {
    try {
      const autofillStr = localStorage.getItem('patowary_profile_autofill');
      if (autofillStr) {
        const data = JSON.parse(autofillStr);
        if (data.fullName) return data.fullName;
      }
    } catch (e) {}
    return user?.displayName || '';
  });

  const [phoneNumber, setPhoneNumber] = useState(() => {
    try {
      const autofillStr = localStorage.getItem('patowary_profile_autofill');
      if (autofillStr) {
        const data = JSON.parse(autofillStr);
        if (data.phoneNumber) return data.phoneNumber;
      }
    } catch (e) {}
    return '';
  });

  const [email, setEmail] = useState(() => {
    try {
      const autofillStr = localStorage.getItem('patowary_profile_autofill');
      if (autofillStr) {
        const data = JSON.parse(autofillStr);
        if (data.email) return data.email;
      }
    } catch (e) {}
    return user?.email || '';
  });

  const [shippingAddress, setShippingAddress] = useState(() => {
    try {
      const autofillStr = localStorage.getItem('patowary_profile_autofill');
      if (autofillStr) {
        const data = JSON.parse(autofillStr);
        if (data.shippingAddress) return data.shippingAddress;
      }
    } catch (e) {}
    return '';
  });

  const [city, setCity] = useState('Dhaka');
  const [area, setArea] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [deliveryZone, setDeliveryZone] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('bKash');
  const [trxId, setTrxId] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Coupon promo input inside checkout
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // UI & Submission States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isOrdering, setIsOrdering] = useState(false);
  const [numberCopied, setNumberCopied] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  // Auto-sync delivery zone with city change
  useEffect(() => {
    if (city.toLowerCase().trim() === 'dhaka') {
      setDeliveryZone('inside_dhaka');
    } else {
      setDeliveryZone('outside_dhaka');
    }
  }, [city]);

  // Delivery charge calculation
  const isFreeDelivery =
    DELIVERY_CONFIG.freeDeliveryThreshold > 0 &&
    totalBeforeDiscount >= DELIVERY_CONFIG.freeDeliveryThreshold;

  const currentDeliveryCharge = isFreeDelivery
    ? 0
    : deliveryZone === 'inside_dhaka'
    ? DELIVERY_CONFIG.insideDhaka.charge
    : DELIVERY_CONFIG.outsideDhaka.charge;

  // Discount calculation
  let calculatedDiscount = 0;
  if (discountPercentage > 0) {
    calculatedDiscount = Math.round(totalBeforeDiscount * (discountPercentage / 100));
  } else if (discountAmount > 0) {
    calculatedDiscount = Math.min(totalBeforeDiscount, discountAmount);
  }

  // Grand Total calculation (dynamic, never hard-coded)
  const grandTotal = Math.max(0, totalBeforeDiscount - calculatedDiscount + currentDeliveryCharge);

  // Copy payment number helper
  const handleCopyPaymentNumber = () => {
    const targetNumber =
      paymentMethod === 'bKash'
        ? PAYMENT_CONFIG.bkash
        : paymentMethod === 'Nagad'
        ? PAYMENT_CONFIG.nagad
        : paymentMethod === 'Upay'
        ? PAYMENT_CONFIG.upay
        : PAYMENT_CONFIG.bkash;

    navigator.clipboard.writeText(targetNumber);
    setNumberCopied(true);
    playCinematicIntroSound(`Payment number ${targetNumber} copied.`);
    setTimeout(() => setNumberCopied(false), 2000);
  };

  // Copy Order ID in confirmation view
  const handleCopyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedOrderId(true);
    playCinematicIntroSound('Order ID copied to clipboard.');
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  // Screenshot File Selector
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({
        ...prev,
        screenshot: 'Only image files (JPG, PNG, WEBP) are allowed.',
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        screenshot: 'File size must be under 5MB.',
      }));
      return;
    }

    setErrors((prev) => {
      const next = { ...prev };
      delete next.screenshot;
      return next;
    });

    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveScreenshot = () => {
    setScreenshotFile(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle promo code application
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError(null);
    setCouponSuccess(null);
    const success = await applyPromo(couponInput.trim());
    setIsApplyingCoupon(false);
    if (success) {
      setCouponSuccess(`Coupon "${couponInput.trim().toUpperCase()}" applied successfully!`);
      setCouponInput('');
    } else {
      setCouponError('Invalid or expired coupon code. Try PATOWARY10 or STREET15.');
    }
  };

  // Validation
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = 'Please enter your full name (minimum 2 characters).';
    }

    if (!phoneNumber.trim()) {
      errs.phoneNumber = 'Phone number is required.';
    } else if (!isValidBangladeshPhone(phoneNumber)) {
      errs.phoneNumber =
        'Please enter a valid Bangladesh phone number (e.g. 01712345678 or +8801712345678).';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!shippingAddress.trim() || shippingAddress.trim().length < 5) {
      errs.shippingAddress =
        'Please enter your full detailed delivery address (House, Road, Area).';
    }

    if (!city.trim()) {
      errs.city = 'Please enter or select your City.';
    }

    if (!area.trim()) {
      errs.area = 'Please enter your Area or Thana (e.g. Dhanmondi, Mirpur).';
    }

    // Payment validation
    const isOnline =
      paymentMethod === 'bKash' || paymentMethod === 'Nagad' || paymentMethod === 'Upay';

    if (isOnline) {
      if (!senderNumber.trim()) {
        errs.senderNumber = `Sender ${paymentMethod} mobile number is required.`;
      } else if (!isValidBangladeshPhone(senderNumber)) {
        errs.senderNumber =
          'Please enter a valid Bangladesh mobile number used to send the payment.';
      }

      if (!trxId.trim()) {
        errs.trxId = `Please enter the ${paymentMethod} Transaction ID (TrxID).`;
      } else if (trxId.trim().length < 4) {
        errs.trxId = 'Transaction ID is too short. Please verify your payment SMS.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Final Order Submission Handler
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError(null);

    if (cartItems.length === 0) {
      setOrderError('Your cart is empty. Please add items before checking out.');
      return;
    }

    if (!validateForm()) {
      playCinematicIntroSound('Please review the required fields highlighted in red.');
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.getElementById(`field-${firstErrorKey}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsOrdering(true);
    const orderId = generateOrderId();
    const isOnline =
      paymentMethod === 'bKash' || paymentMethod === 'Nagad' || paymentMethod === 'Upay';

    // 1. Upload payment screenshot if provided
    let screenshotUrl = '';
    if (screenshotFile && isOnline) {
      try {
        setUploadProgress(true);
        const fileExt = screenshotFile.name.split('.').pop() || 'jpg';
        const storagePath = `payment_screenshots/${orderId}_${Date.now()}.${fileExt}`;
        const screenshotRef = ref(storage, storagePath);
        const snapshot = await uploadBytes(screenshotRef, screenshotFile);
        screenshotUrl = await getDownloadURL(snapshot.ref);
      } catch (uploadErr) {
        console.warn(
          'Screenshot upload skipped (Storage rule or network offline). Proceeding with TrxID.',
          uploadErr
        );
      } finally {
        setUploadProgress(false);
      }
    }

    // 2. Prepare standardized order items
    const orderItems: OrderItem[] = cartItems.map((item) => ({
      productId: item.product.id,
      title: item.product.title,
      productName: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      variant: item.selectedVariant || 'Standard',
      size: item.selectedVariant || 'Standard',
      color: 'Standard',
      image: item.product.assets[0] || '',
    }));

    // 3. Assemble complete order document
    const fullDestinationAddress = `${shippingAddress.trim()}, ${area.trim()}, ${city.trim()}`;
    const initialPaymentStatus = isOnline
      ? 'Pending Verification'
      : paymentMethod === 'Cash on Delivery'
      ? 'Cash on Delivery'
      : 'Pending (Bank Transfer)';

    const orderPayload: Order = {
      id: orderId,
      orderId: orderId,
      fullName: fullName.trim(),
      phone: phoneNumber.trim(),
      email: email.trim() || undefined,
      address: fullDestinationAddress,
      city: city.trim(),
      area: area.trim(),
      note: deliveryNote.trim() || undefined,
      customer: {
        name: fullName.trim(),
        phone: phoneNumber.trim(),
        email: email.trim() || undefined,
        address: shippingAddress.trim(),
        city: city.trim(),
        area: area.trim(),
        note: deliveryNote.trim() || undefined,
      },
      items: orderItems,
      totalPrice: grandTotal,
      pricing: {
        subtotal: totalBeforeDiscount,
        discount: calculatedDiscount,
        deliveryCharge: currentDeliveryCharge,
        total: grandTotal,
      },
      paymentMethod,
      paymentStatus: initialPaymentStatus,
      payment: {
        method: paymentMethod,
        transactionId: isOnline ? trxId.trim().toUpperCase() : undefined,
        senderNumber: isOnline ? senderNumber.trim() : undefined,
        screenshotUrl: screenshotUrl || undefined,
        status: initialPaymentStatus,
      },
      status: 'Pending',
      orderStatus: 'Pending',
      createdAt: new Date().toISOString(),
    };

    // 4. Save to Firestore orders collection
    try {
      const orderRef = doc(db, 'orders', orderId);
      await setDoc(orderRef, orderPayload);

      // Save to local storage backup for offline or client lookup
      try {
        const existingStr = localStorage.getItem('patowary_local_orders') || '[]';
        const localOrders = JSON.parse(existingStr);
        localOrders.unshift(orderPayload);
        localStorage.setItem('patowary_local_orders', JSON.stringify(localOrders.slice(0, 30)));

        // Save profile autofill for future orders
        localStorage.setItem(
          'patowary_profile_autofill',
          JSON.stringify({
            fullName: fullName.trim(),
            phoneNumber: phoneNumber.trim(),
            email: email.trim(),
            shippingAddress: shippingAddress.trim(),
          })
        );
      } catch (localErr) {
        console.warn('Local storage order backup warning:', localErr);
      }

      // 5. Send order notification email via EmailJS (asynchronous background transmission)
      const itemsSummary = cartItems
        .map(
          (it, idx) =>
            `${idx + 1}. ${it.product.title} [Size: ${it.selectedVariant || 'Standard'}] x ${
              it.quantity
            } - BDT ${it.product.price * it.quantity}`
        )
        .join('\n');

      sendFormViaEmailJS({
        formType: `New Order (${paymentMethod})`,
        name: fullName.trim(),
        phone: phoneNumber.trim(),
        email: email.trim() || 'fashionpatowary@gmail.com',
        address: fullDestinationAddress,
        deliveryAddress: fullDestinationAddress,
        paymentMethod: `${paymentMethod} (${initialPaymentStatus})`,
        transactionId: isOnline ? trxId.trim().toUpperCase() : 'COD',
        orderId: orderId,
        productOrService: cartItems.map((i) => i.product.title).join(', '),
        productId: cartItems.map((i) => i.product.id).join(', '),
        package: cartItems
          .map((i) => `${i.product.title} [${i.selectedVariant || 'Standard'}]`)
          .join(', '),
        quantity: cartItems.reduce((acc, curr) => acc + curr.quantity, 0),
        price: `BDT ${totalBeforeDiscount}`,
        total: `BDT ${grandTotal}`,
        deliveryCharge: currentDeliveryCharge === 0 ? 'FREE' : `BDT ${currentDeliveryCharge}`,
        notes: deliveryNote.trim(),
        message: `Order ID: ${orderId} | Method: ${paymentMethod} | Status: ${initialPaymentStatus} | TrxID: ${
          isOnline ? trxId.trim() : 'N/A'
        } | Sender: ${isOnline ? senderNumber.trim() : 'N/A'}`,
        customFields: {
          'Order ID': orderId,
          'Ordered Items': itemsSummary,
          'Subtotal Amount': `BDT ${totalBeforeDiscount}`,
          'Discount Applied': calculatedDiscount > 0 ? `BDT ${calculatedDiscount}` : 'None',
          'Delivery Zone': deliveryZone === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka',
          'Delivery Fee': currentDeliveryCharge === 0 ? 'FREE' : `BDT ${currentDeliveryCharge}`,
          'Grand Total': `BDT ${grandTotal}`,
          'Payment Status': initialPaymentStatus,
          'Sender Number': isOnline ? senderNumber.trim() : 'N/A',
          'Transaction ID': isOnline ? trxId.trim().toUpperCase() : 'N/A',
        },
      }).catch((emailErr) => {
        console.warn('[EmailJS] Order email background dispatch warning:', emailErr);
      });

      // 6. Complete and clean up
      setSuccessOrder(orderPayload);
      clearCart();
      setIsOrdering(false);
      playCinematicIntroSound(`Order placed successfully! Your Order ID is ${orderId}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (dbError: any) {
      console.error('Failed to create order in Firestore:', dbError);
      // Fallback save in local storage if firestore had network error
      try {
        const existingStr = localStorage.getItem('patowary_local_orders') || '[]';
        const localOrders = JSON.parse(existingStr);
        localOrders.unshift(orderPayload);
        localStorage.setItem('patowary_local_orders', JSON.stringify(localOrders));
        setSuccessOrder(orderPayload);
        clearCart();
        setIsOrdering(false);
        playCinematicIntroSound(`Order saved! Your Order ID is ${orderId}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (fallbackErr) {
        setOrderError('Unable to place order due to a network error. Please try again.');
        setIsOrdering(false);
      }
    }
  };

  // =========================================================================
  // VIEW: ORDER CONFIRMATION PAGE (SUCCESS VIEW)
  // =========================================================================
  if (successOrder) {
    const isOnline =
      successOrder.paymentMethod === 'bKash' ||
      successOrder.paymentMethod === 'Nagad' ||
      successOrder.paymentMethod === 'Upay';

    return (
      <div
        id="order-confirmation-container"
        className="bg-[#F8F3EA] min-h-screen py-10 sm:py-16 px-4 font-sans text-[#111827]"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-[#0A1E54]/10 shadow-2xl p-6 sm:p-10 text-center space-y-6 relative overflow-hidden"
          >
            {/* Top Accent Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0A1E54] via-[#C9A66B] to-[#1A3070]" />

            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/20 shadow-inner">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C9A66B] font-extrabold block">
                PATOWARY FASHION • OFFICIAL INVOICE
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#0A1E54] tracking-tight">
                Order Placed Successfully!
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
                Thank you, <strong className="text-[#0A1E54]">{successOrder.fullName}</strong>.
                Your luxury streetwear order has been confirmed in our dispatch queue.
              </p>
            </div>

            {/* Order ID Banner with Copy */}
            <div className="p-4 sm:p-5 bg-[#F8F3EA] rounded-2xl border border-[#C9A66B]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">
                  UNIQUE ORDER TRACKING ID
                </span>
                <span className="text-lg sm:text-xl font-mono font-black text-[#0A1E54] tracking-wider">
                  {successOrder.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyOrderId(successOrder.id)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0A1E54] hover:bg-[#1A3070] text-[#F8F3EA] rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow cursor-pointer active:scale-95"
              >
                {copiedOrderId ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-[#C9A66B]" />
                )}
                <span>{copiedOrderId ? 'COPIED!' : 'COPY ORDER ID'}</span>
              </button>
            </div>

            {/* Payment & Delivery Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {/* Payment Status Card */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block">
                  PAYMENT INFORMATION
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0A1E54]">Method:</span>
                  <span className="text-xs font-mono font-bold text-stone-700">
                    {successOrder.paymentMethod}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0A1E54]">Payment Status:</span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      isOnline
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {isOnline ? 'Payment verification pending' : 'Cash on Delivery'}
                  </span>
                </div>
                {successOrder.payment?.transactionId && (
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
                    <span className="text-stone-500 font-mono text-[10px]">TrxID:</span>
                    <span className="font-mono font-bold text-[#0A1E54]">
                      {successOrder.payment.transactionId}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
                  <span className="font-bold text-[#0A1E54]">Total Amount:</span>
                  <span className="font-mono font-black text-sm text-[#0A1E54]">
                    ৳{successOrder.totalPrice}
                  </span>
                </div>
              </div>

              {/* Delivery Info Card */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block">
                  DELIVERY DESTINATION
                </span>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Consignee:</span>
                    <strong className="text-[#0A1E54]">{successOrder.fullName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Phone:</span>
                    <span className="font-mono text-stone-700">{successOrder.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Address:</span>
                    <span className="text-right text-stone-700 max-w-[180px] truncate">
                      {successOrder.address}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-stone-100 text-[11px] text-stone-500">
                    <span>Estimated Timeline:</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {deliveryZone === 'inside_dhaka'
                        ? DELIVERY_CONFIG.insideDhaka.estimatedDays
                        : DELIVERY_CONFIG.outsideDhaka.estimatedDays}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Purchased Breakdown */}
            <div className="text-left space-y-3 pt-2 border-t border-stone-200">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block">
                ORDERED ITEMS ({successOrder.items.length})
              </span>
              <div className="divide-y divide-stone-100 max-h-48 overflow-y-auto pr-1">
                {successOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100'}
                        alt={item.title}
                        className="w-10 h-10 object-cover rounded-lg border border-stone-200"
                      />
                      <div>
                        <p className="font-bold text-[#0A1E54] line-clamp-1">{item.title}</p>
                        <p className="text-[10px] font-mono text-stone-500">
                          Size: {item.variant} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[#0A1E54] shrink-0">
                      ৳{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons: Track, Continue, Support */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <Link
                to={`/track-order?id=${successOrder.id}`}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-[#0A1E54] hover:bg-[#1A3070] text-[#F8F3EA] text-xs font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.01] active:scale-95"
              >
                <Truck className="w-4 h-4 text-[#C9A66B]" />
                <span>Track Order</span>
              </Link>

              <Link
                to="/products"
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-white hover:bg-stone-50 border-2 border-[#0A1E54] text-[#0A1E54] text-xs font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01] active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>

              <a
                href={`https://wa.me/8801730943993?text=${encodeURIComponent(
                  `Hello Patowary Fashion, I just placed Order #${successOrder.id}. Please confirm my parcel tracking status.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.01] active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Contact Support</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: CHECKOUT WORKFLOW (EMPTY CART OR FORM)
  // =========================================================================
  if (cartItems.length === 0) {
    return (
      <div className="bg-[#F8F3EA] min-h-screen py-16 px-4 font-sans text-[#111827] flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 sm:p-12 rounded-3xl border border-[#0A1E54]/10 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-[#0A1E54]/5 rounded-full flex items-center justify-center mx-auto text-[#0A1E54]">
            <ShoppingBag className="w-8 h-8 text-[#C9A66B]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-serif font-black text-[#0A1E54]">Your Bag is Empty</h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              Explore our contemporary streetwear collections to add pieces before checking out.
            </p>
          </div>
          <Link
            to="/products"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#0A1E54] hover:bg-[#1A3070] text-[#F8F3EA] text-xs font-mono uppercase tracking-widest font-bold shadow-md transition-all active:scale-95"
          >
            <span>Explore Collections</span>
            <ChevronRight className="w-4 h-4 text-[#C9A66B]" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      id="checkout-page-root"
      className="bg-[#F8F3EA] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#111827]"
    >
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#0A1E54]/10 pb-4">
          <div>
            <Link
              to="/cart"
              className="inline-flex items-center gap-1.5 text-stone-500 hover:text-[#0A1E54] text-xs font-mono uppercase tracking-wider font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Shopping Bag</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#0A1E54] mt-2 tracking-tight">
              Express Secure Checkout
            </h1>
          </div>

          {/* Checkout Steps Progress Bar */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span
              className={`px-3 py-1 rounded-full font-bold flex items-center gap-1.5 transition-all ${
                activeStep === 1
                  ? 'bg-[#0A1E54] text-[#F8F3EA] shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-[#C9A66B] text-[#0A1E54] text-[10px] flex items-center justify-center font-black">
                1
              </span>
              <span>Info</span>
            </span>

            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />

            <span
              className={`px-3 py-1 rounded-full font-bold flex items-center gap-1.5 transition-all ${
                activeStep === 2
                  ? 'bg-[#0A1E54] text-[#F8F3EA] shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-[#C9A66B] text-[#0A1E54] text-[10px] flex items-center justify-center font-black">
                2
              </span>
              <span>Delivery</span>
            </span>

            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />

            <span
              className={`px-3 py-1 rounded-full font-bold flex items-center gap-1.5 transition-all ${
                activeStep === 3
                  ? 'bg-[#0A1E54] text-[#F8F3EA] shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-[#C9A66B] text-[#0A1E54] text-[10px] flex items-center justify-center font-black">
                3
              </span>
              <span>Payment</span>
            </span>
          </div>
        </div>

        {/* Global Error Banner if any */}
        {orderError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-3 shadow-sm">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Checkout Notice:</strong>
              <span>{orderError}</span>
            </div>
          </div>
        )}

        {/* 2-Column Responsive Layout: Left (Form) + Right (Sticky Order Summary) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* =============================================================== */}
          {/* LEFT COLUMN: Customer + Delivery + Payment Forms (7-Cols)      */}
          {/* =============================================================== */}
          <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6">
            {/* 1. CUSTOMER INFORMATION CARD */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xl shadow-stone-200/40 space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-150">
                <div className="w-8 h-8 rounded-xl bg-[#0A1E54]/10 text-[#0A1E54] flex items-center justify-center font-bold">
                  <User className="w-4 h-4 text-[#0A1E54]" />
                </div>
                <div>
                  <h2 className="text-base font-serif font-black text-[#0A1E54] uppercase tracking-wider">
                    1. Customer Information
                  </h2>
                  <p className="text-[11px] text-stone-500 font-sans">
                    Enter your official consignee credentials for dispatch delivery.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div id="field-fullName" className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-700 font-bold">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) {
                        setErrors((prev) => {
                          const n = { ...prev };
                          delete n.fullName;
                          return n;
                        });
                      }
                    }}
                    placeholder="e.g. Shahriar Kabir"
                    className={`w-full bg-[#F8F3EA]/50 border ${
                      errors.fullName ? 'border-rose-500 bg-rose-50/20' : 'border-stone-200'
                    } focus:border-[#0A1E54] focus:bg-white focus:ring-1 focus:ring-[#0A1E54]/10 py-3 px-4 rounded-xl text-xs font-sans focus:outline-none transition-all`}
                  />
                  {errors.fullName && (
                    <p className="text-[11px] text-rose-600 font-sans flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div id="field-phoneNumber" className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-700 font-bold">
                    Phone Number (BD) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        if (errors.phoneNumber) {
                          setErrors((prev) => {
                            const n = { ...prev };
                            delete n.phoneNumber;
                            return n;
                          });
                        }
                      }}
                      placeholder="017XXXXXXXX"
                      className={`w-full bg-[#F8F3EA]/50 border ${
                        errors.phoneNumber ? 'border-rose-500 bg-rose-50/20' : 'border-stone-200'
                      } focus:border-[#0A1E54] focus:bg-white focus:ring-1 focus:ring-[#0A1E54]/10 pl-10 pr-4 py-3 rounded-xl text-xs font-mono focus:outline-none transition-all`}
                    />
                    <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-[11px] text-rose-600 font-sans flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.phoneNumber}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Email Address */}
              <div id="field-email" className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-700 font-bold">
                  Email Address (Optional for Invoice & Tracking)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors((prev) => {
                          const n = { ...prev };
                          delete n.email;
                          return n;
                        });
                      }
                    }}
                    placeholder="fashionpatowary@gmail.com"
                    className={`w-full bg-[#F8F3EA]/50 border ${
                      errors.email ? 'border-rose-500 bg-rose-50/20' : 'border-stone-200'
                    } focus:border-[#0A1E54] focus:bg-white focus:ring-1 focus:ring-[#0A1E54]/10 pl-10 pr-4 py-3 rounded-xl text-xs font-sans focus:outline-none transition-all`}
                  />
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-rose-600 font-sans flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>
            </div>

            {/* 2. DELIVERY INFORMATION CARD */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xl shadow-stone-200/40 space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-150">
                <div className="w-8 h-8 rounded-xl bg-[#0A1E54]/10 text-[#0A1E54] flex items-center justify-center font-bold">
                  <Truck className="w-4 h-4 text-[#0A1E54]" />
                </div>
                <div>
                  <h2 className="text-base font-serif font-black text-[#0A1E54] uppercase tracking-wider">
                    2. Delivery Information
                  </h2>
                  <p className="text-[11px] text-stone-500 font-sans">
                    Select your delivery zone and provide complete shipping address.
                  </p>
                </div>
              </div>

              {/* Delivery Zone Selector Cards (Inside Dhaka ৳60 vs Outside Dhaka ৳120) */}
              <div className="space-y-2">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-700 font-bold">
                  Delivery Zone & Courier Charge
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Inside Dhaka */}
                  <div
                    onClick={() => {
                      setDeliveryZone('inside_dhaka');
                      setCity('Dhaka');
                      playCinematicIntroSound('Inside Dhaka selected. Courier charge BDT 60.');
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      deliveryZone === 'inside_dhaka'
                        ? 'border-[#0A1E54] bg-[#0A1E54]/5 ring-1 ring-[#0A1E54]/30 shadow-md'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-black uppercase text-[#0A1E54]">
                        {DELIVERY_CONFIG.insideDhaka.label}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#C9A66B]">
                        {isFreeDelivery ? 'FREE' : `৳${DELIVERY_CONFIG.insideDhaka.charge}`}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 font-sans">
                      Estimated: {DELIVERY_CONFIG.insideDhaka.estimatedDays} • Doorstep Delivery
                    </p>
                  </div>

                  {/* Outside Dhaka */}
                  <div
                    onClick={() => {
                      setDeliveryZone('outside_dhaka');
                      if (city === 'Dhaka') setCity('Chittagong');
                      playCinematicIntroSound('Outside Dhaka selected. Courier charge BDT 120.');
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      deliveryZone === 'outside_dhaka'
                        ? 'border-[#0A1E54] bg-[#0A1E54]/5 ring-1 ring-[#0A1E54]/30 shadow-md'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-black uppercase text-[#0A1E54]">
                        {DELIVERY_CONFIG.outsideDhaka.label}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#C9A66B]">
                        {isFreeDelivery ? 'FREE' : `৳${DELIVERY_CONFIG.outsideDhaka.charge}`}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 font-sans">
                      Estimated: {DELIVERY_CONFIG.outsideDhaka.estimatedDays} • All 64 Districts
                    </p>
                  </div>
                </div>
              </div>

              {/* City and Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div id="field-city" className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-700 font-bold">
                    City / District <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (errors.city) {
                        setErrors((prev) => {
                          const n = { ...prev };
                          delete n.city;
                          return n;
                        });
                      }
                    }}
                    placeholder="e.g. Dhaka, Chittagong, Sylhet"
                    className={`w-full bg-[#F8F3EA]/50 border ${
                      errors.city ? 'border-rose-500 bg-rose-50/20' : 'border-stone-200'
                    } focus:border-[#0A1E54] focus:bg-white focus:ring-1 focus:ring-[#0A1E54]/10 py-3 px-4 rounded-xl text-xs font-sans focus:outline-none transition-all`}
                  />
                  {errors.city && (
                    <p className="text-[11px] text-rose-600 font-sans flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.city}</span>
                    </p>
                  )}
                </div>

                <div id="field-area" className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-700 font-bold">
                    Area / Thana <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => {
                      setArea(e.target.value);
                      if (errors.area) {
                        setErrors((prev) => {
                          const n = { ...prev };
                          delete n.area;
                          return n;
                        });
                      }
                    }}
                    placeholder="e.g. Dhanmondi, Gulshan, Mirpur"
                    className={`w-full bg-[#F8F3EA]/50 border ${
                      errors.area ? 'border-rose-500 bg-rose-50/20' : 'border-stone-200'
                    } focus:border-[#0A1E54] focus:bg-white focus:ring-1 focus:ring-[#0A1E54]/10 py-3 px-4 rounded-xl text-xs font-sans focus:outline-none transition-all`}
                  />
                  {errors.area && (
                    <p className="text-[11px] text-rose-600 font-sans flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.area}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Full Delivery Address */}
              <div id="field-shippingAddress" className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-700 font-bold">
                  Full Delivery Address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={shippingAddress}
                  onChange={(e) => {
                    setShippingAddress(e.target.value);
                    if (errors.shippingAddress) {
                      setErrors((prev) => {
                        const n = { ...prev };
                        delete n.shippingAddress;
                        return n;
                      });
                    }
                  }}
                  placeholder="House #, Road #, Flat/Apartment, Landmark"
                  className={`w-full bg-[#F8F3EA]/50 border ${
                    errors.shippingAddress ? 'border-rose-500 bg-rose-50/20' : 'border-stone-200'
                  } focus:border-[#0A1E54] focus:bg-white focus:ring-1 focus:ring-[#0A1E54]/10 p-3.5 rounded-xl text-xs font-sans focus:outline-none transition-all resize-none`}
                />
                {errors.shippingAddress && (
                  <p className="text-[11px] text-rose-600 font-sans flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.shippingAddress}</span>
                  </p>
                )}
              </div>

              {/* Optional Delivery Note */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-600 font-bold">
                  Optional Delivery Note / Instructions
                </label>
                <input
                  type="text"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="e.g. Call before delivery, deliver after 4 PM"
                  className="w-full bg-[#F8F3EA]/50 border border-stone-200 focus:border-[#0A1E54] focus:bg-white py-2.5 px-4 rounded-xl text-xs font-sans focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* 3. PAYMENT METHOD SELECTION CARD */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xl shadow-stone-200/40 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-150">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#0A1E54]/10 text-[#0A1E54] flex items-center justify-center font-bold">
                    <Coins className="w-4 h-4 text-[#0A1E54]" />
                  </div>
                  <div>
                    <h2 className="text-base font-serif font-black text-[#0A1E54] uppercase tracking-wider">
                      3. Payment Method
                    </h2>
                    <p className="text-[11px] text-stone-500 font-sans">
                      Select your preferred payment method.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-[#C9A66B]/15 text-[#0A1E54] px-2.5 py-1 rounded-full uppercase tracking-wider">
                  SECURE SSL
                </span>
              </div>

              {/* 4 Distinct Payment Cards (bKash, Nagad, Upay, Cash on Delivery) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. bKash Card */}
                <div
                  onClick={() => {
                    setPaymentMethod('bKash');
                    playCinematicIntroSound('bKash payment selected.');
                  }}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all relative overflow-hidden group ${
                    paymentMethod === 'bKash'
                      ? 'border-pink-600 bg-pink-500/[0.05] ring-2 ring-pink-600/30 shadow-md'
                      : 'border-stone-200 hover:border-pink-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-black uppercase text-pink-700 tracking-wider">
                      bKash
                    </span>
                    <span className="text-[10px] font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded font-mono">
                      বিকাশ
                    </span>
                  </div>
                  <span className="block text-[11px] text-stone-600 font-sans leading-relaxed">
                    Send Money to: <strong className="font-mono text-pink-700 font-bold block">{PAYMENT_CONFIG.bkash}</strong>
                  </span>
                  {paymentMethod === 'bKash' && (
                    <div className="absolute top-0 right-0 w-4 h-4 bg-pink-600 rounded-bl-lg flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>

                {/* 2. Nagad Card */}
                <div
                  onClick={() => {
                    setPaymentMethod('Nagad');
                    playCinematicIntroSound('Nagad payment selected.');
                  }}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all relative overflow-hidden group ${
                    paymentMethod === 'Nagad'
                      ? 'border-orange-600 bg-orange-500/[0.05] ring-2 ring-orange-600/30 shadow-md'
                      : 'border-stone-200 hover:border-orange-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-black uppercase text-orange-700 tracking-wider">
                      Nagad
                    </span>
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded font-mono">
                      নগদ
                    </span>
                  </div>
                  <span className="block text-[11px] text-stone-600 font-sans leading-relaxed">
                    Send Money to: <strong className="font-mono text-orange-700 font-bold block">{PAYMENT_CONFIG.nagad}</strong>
                  </span>
                  {paymentMethod === 'Nagad' && (
                    <div className="absolute top-0 right-0 w-4 h-4 bg-orange-600 rounded-bl-lg flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>

                {/* 3. Upay Card */}
                <div
                  onClick={() => {
                    setPaymentMethod('Upay');
                    playCinematicIntroSound('Upay payment selected.');
                  }}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all relative overflow-hidden group ${
                    paymentMethod === 'Upay'
                      ? 'border-amber-600 bg-amber-500/[0.05] ring-2 ring-amber-600/30 shadow-md'
                      : 'border-stone-200 hover:border-amber-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-black uppercase text-amber-800 tracking-wider">
                      Upay
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-mono">
                      উপায়
                    </span>
                  </div>
                  <span className="block text-[11px] text-stone-600 font-sans leading-relaxed">
                    Send Money to: <strong className="font-mono text-amber-800 font-bold block">{PAYMENT_CONFIG.upay}</strong>
                  </span>
                  {paymentMethod === 'Upay' && (
                    <div className="absolute top-0 right-0 w-4 h-4 bg-amber-600 rounded-bl-lg flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>

                {/* 4. Cash on Delivery Card */}
                <div
                  onClick={() => {
                    setPaymentMethod('Cash on Delivery');
                    playCinematicIntroSound('Cash on Delivery selected.');
                  }}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all relative overflow-hidden group ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-emerald-600 bg-emerald-500/[0.05] ring-2 ring-emerald-600/30 shadow-md'
                      : 'border-stone-200 hover:border-emerald-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-black uppercase text-emerald-800 tracking-wider">
                      Cash on Delivery
                    </span>
                    <Coins className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="block text-[11px] text-stone-600 font-sans leading-relaxed">
                    Pay upon doorstep delivery after inspection.
                  </span>
                  {paymentMethod === 'Cash on Delivery' && (
                    <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-600 rounded-bl-lg flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* ============================================================= */}
              {/* ONLINE PAYMENT INSTRUCTION PANEL (bKash / Nagad / Upay)       */}
              {/* ============================================================= */}
              {(paymentMethod === 'bKash' || paymentMethod === 'Nagad' || paymentMethod === 'Upay') && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 sm:p-6 rounded-2xl border space-y-5 ${
                    paymentMethod === 'bKash'
                      ? 'bg-gradient-to-br from-pink-50/70 to-rose-50/50 border-pink-200'
                      : paymentMethod === 'Nagad'
                      ? 'bg-gradient-to-br from-orange-50/70 to-amber-50/50 border-orange-200'
                      : 'bg-gradient-to-br from-amber-50/70 to-blue-50/50 border-amber-200'
                  }`}
                >
                  {/* Top Instruction Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200/60">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#0A1E54] font-black block">
                        {paymentMethod} Send Money Instruction
                      </span>
                      <p className="text-xs text-stone-700 leading-relaxed">
                        Send the exact order amount of{' '}
                        <strong className="text-sm font-mono font-black text-[#0A1E54]">
                          ৳{grandTotal}
                        </strong>{' '}
                        to our official {paymentMethod} account below:
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-xs text-stone-500 font-sans">Payment Number:</span>
                        <strong className="text-base font-mono font-black text-[#0A1E54] tracking-wider">
                          {paymentMethod === 'bKash'
                            ? PAYMENT_CONFIG.bkash
                            : paymentMethod === 'Nagad'
                            ? PAYMENT_CONFIG.nagad
                            : PAYMENT_CONFIG.upay}
                        </strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyPaymentNumber}
                      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider text-white shadow-sm transition-all active:scale-95 cursor-pointer self-start sm:self-auto ${
                        paymentMethod === 'bKash'
                          ? 'bg-pink-600 hover:bg-pink-700'
                          : paymentMethod === 'Nagad'
                          ? 'bg-orange-600 hover:bg-orange-700'
                          : 'bg-amber-600 hover:bg-amber-700'
                      }`}
                    >
                      {numberCopied ? (
                        <Check className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-white" />
                      )}
                      <span>{numberCopied ? 'COPIED!' : 'COPY NUMBER'}</span>
                    </button>
                  </div>

                  {/* Transaction Information Inputs (Sender Number + TrxID) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    <div id="field-senderNumber" className="space-y-1.5">
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-800 font-bold">
                        Sender {paymentMethod} Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={senderNumber}
                        onChange={(e) => {
                          setSenderNumber(e.target.value);
                          if (errors.senderNumber) {
                            setErrors((prev) => {
                              const n = { ...prev };
                              delete n.senderNumber;
                              return n;
                            });
                          }
                        }}
                        placeholder="e.g. 017XXXXXXXX"
                        className={`w-full bg-white border ${
                          errors.senderNumber ? 'border-rose-500' : 'border-stone-200'
                        } focus:border-[#0A1E54] py-2.5 px-3 rounded-xl text-xs font-mono focus:outline-none transition-all`}
                      />
                      {errors.senderNumber && (
                        <p className="text-[10px] text-rose-600 font-sans mt-0.5">
                          {errors.senderNumber}
                        </p>
                      )}
                    </div>

                    <div id="field-trxId" className="space-y-1.5">
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-800 font-bold">
                        Transaction ID (TrxID) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={trxId}
                        onChange={(e) => {
                          setTrxId(e.target.value.toUpperCase());
                          if (errors.trxId) {
                            setErrors((prev) => {
                              const n = { ...prev };
                              delete n.trxId;
                              return n;
                            });
                          }
                        }}
                        placeholder="e.g. BL9A8X7Y2"
                        className={`w-full bg-white border ${
                          errors.trxId ? 'border-rose-500' : 'border-stone-200'
                        } focus:border-[#0A1E54] py-2.5 px-3 rounded-xl text-xs font-mono uppercase tracking-wider focus:outline-none transition-all`}
                      />
                      {errors.trxId && (
                        <p className="text-[10px] text-rose-600 font-sans mt-0.5">{errors.trxId}</p>
                      )}
                    </div>
                  </div>

                  {/* Optional Payment Screenshot Upload */}
                  <div className="space-y-2 pt-1 border-t border-stone-200/60">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-700 font-bold">
                      Optional: Upload Payment Screenshot (Receipt)
                    </label>

                    {!screenshotPreview ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-stone-300 hover:border-[#0A1E54] bg-white/70 p-4 rounded-2xl text-center cursor-pointer transition-all hover:bg-white flex flex-col items-center justify-center gap-1.5"
                      >
                        <Upload className="w-5 h-5 text-stone-400" />
                        <span className="text-xs font-sans text-stone-600 font-medium">
                          Click to attach payment screenshot (JPG, PNG, max 5MB)
                        </span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-stone-200">
                        <img
                          src={screenshotPreview}
                          alt="Payment Screenshot Preview"
                          className="w-14 h-14 object-cover rounded-xl border border-stone-200"
                        />
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-xs font-bold text-stone-800 truncate">
                            {screenshotFile?.name || 'Payment_Screenshot.jpg'}
                          </p>
                          <p className="text-[10px] text-stone-500 font-mono">
                            {(screenshotFile?.size ? screenshotFile.size / 1024 : 0).toFixed(1)} KB • Image Attached
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveScreenshot}
                          className="text-xs text-rose-600 hover:text-rose-700 font-mono uppercase p-2 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    {errors.screenshot && (
                      <p className="text-[10px] text-rose-600 font-sans">{errors.screenshot}</p>
                    )}
                  </div>

                  {/* Submission Confirmation Reassurance Message */}
                  <div className="p-3 bg-white/80 rounded-xl border border-[#0A1E54]/10 flex items-start gap-2.5 text-xs text-stone-700">
                    <Info className="w-4 h-4 text-[#0A1E54] shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      You have entered your transaction details. Your payment will be verified by
                      our team before the order is marked as paid. Status will initially display as{' '}
                      <strong className="text-[#0A1E54]">"Pending Verification"</strong>.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ============================================================= */}
              {/* CASH ON DELIVERY PANEL                                        */}
              {/* ============================================================= */}
              {paymentMethod === 'Cash on Delivery' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Coins className="w-4 h-4" />
                    </div>
                    <div className="space-y-1 text-xs">
                      <strong className="text-sm font-bold text-emerald-950 block">
                        Cash on Delivery (COD) Selected
                      </strong>
                      <p className="text-stone-700 leading-relaxed">
                        You will pay the delivery/order amount of{' '}
                        <strong className="text-[#0A1E54] font-black font-mono">
                          ৳{grandTotal}
                        </strong>{' '}
                        when your order is delivered to your doorstep. You can inspect the items
                        before paying the courier rider.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* FINAL SUBMIT BUTTON */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isOrdering}
                className={`w-full py-4 px-8 rounded-2xl text-xs sm:text-sm font-mono tracking-widest font-black uppercase shadow-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.01] active:scale-95 cursor-pointer ${
                  isOrdering
                    ? 'bg-stone-400 text-white cursor-not-allowed'
                    : paymentMethod === 'bKash'
                    ? 'bg-pink-600 hover:bg-pink-700 text-white shadow-pink-600/20'
                    : paymentMethod === 'Nagad'
                    ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20'
                    : paymentMethod === 'Upay'
                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
                    : 'bg-[#0A1E54] hover:bg-[#1A3070] text-[#F8F3EA] shadow-[#0A1E54]/20'
                }`}
              >
                {isOrdering ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Placing your order...</span>
                  </span>
                ) : (
                  <span>
                    Confirm & Place Order • ৳{grandTotal}
                  </span>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500 font-mono">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C9A66B]" />
                  <span>256-Bit SSL Encrypted</span>
                </span>
                <span>•</span>
                <span>Nationwide Express Courier</span>
                <span>•</span>
                <span>7-Day Return Guarantee</span>
              </div>
            </div>
          </form>

          {/* =============================================================== */}
          {/* RIGHT COLUMN: STICKY DYNAMIC ORDER SUMMARY (5-Cols)            */}
          {/* =============================================================== */}
          <aside className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xl shadow-stone-200/40 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-150">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 font-bold block">
                    SHOPPING BAG
                  </span>
                  <h3 className="text-lg font-serif font-black text-[#0A1E54]">
                    Order Summary
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold bg-[#F8F3EA] text-[#0A1E54] px-3 py-1 rounded-full border border-stone-200">
                  {cartItems.reduce((acc, c) => acc + c.quantity, 0)} Items
                </span>
              </div>

              {/* Items List Stepper */}
              <div className="space-y-4 max-h-80 overflow-y-auto pr-1 divide-y divide-stone-100">
                {cartItems.map((item, idx) => (
                  <div key={`${item.product.id}-${item.selectedVariant}-${idx}`} className="pt-3 first:pt-0 flex gap-3">
                    <img
                      src={item.product.assets[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100'}
                      alt={item.product.title}
                      className="w-16 h-16 object-cover rounded-xl border border-stone-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-[#0A1E54] line-clamp-1">
                          {item.product.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id, item.selectedVariant)}
                          className="text-stone-400 hover:text-rose-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-mono text-stone-500">
                        <span className="bg-[#F8F3EA] px-2 py-0.5 rounded border border-stone-200">
                          Size: {item.selectedVariant || 'Standard'}
                        </span>
                        <span>৳{item.product.price} each</span>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center border border-stone-200 rounded-lg bg-white overflow-hidden">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.product.id, item.selectedVariant, item.quantity - 1)
                            }
                            className="p-1 hover:bg-stone-100 text-stone-600 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-mono font-bold text-[#0A1E54]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.product.id, item.selectedVariant, item.quantity + 1)
                            }
                            className="p-1 hover:bg-stone-100 text-stone-600 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-mono font-black text-[#0A1E54]">
                          ৳{item.product.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="pt-2 border-t border-stone-150 space-y-2">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="ENTER PROMO CODE"
                      className="w-full bg-[#F8F3EA]/60 border border-stone-200 focus:border-[#0A1E54] focus:bg-white pl-8 pr-3 py-2 text-xs font-mono uppercase tracking-wider rounded-xl focus:outline-none"
                    />
                    <Tag className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-400" />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplyingCoupon || !couponInput.trim()}
                    className="px-4 py-2 bg-[#0A1E54] hover:bg-[#1A3070] text-[#F8F3EA] rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isApplyingCoupon ? '...' : 'APPLY'}
                  </button>
                </form>

                {couponSuccess && (
                  <p className="text-[11px] text-emerald-700 font-mono">{couponSuccess}</p>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-600 font-mono">{couponError}</p>
                )}
                {promoCode && (
                  <div className="flex items-center justify-between text-xs text-emerald-700 font-mono bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <span>Applied: {promoCode}</span>
                    <span>{discountPercentage}% OFF</span>
                  </div>
                )}
              </div>

              {/* Financial Breakdown Table */}
              <div className="space-y-2.5 pt-3 border-t border-stone-150 text-xs text-stone-600 font-sans">
                <div className="flex justify-between">
                  <span>Subtotal Amount:</span>
                  <span className="font-mono font-bold text-stone-800">
                    ৳{totalBeforeDiscount}
                  </span>
                </div>

                {calculatedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Promo Discount:</span>
                    <span className="font-mono font-bold">-৳{calculatedDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <span>Delivery Charge ({deliveryZone === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}):</span>
                  </span>
                  <span className="font-mono font-bold text-stone-800">
                    {currentDeliveryCharge === 0 ? (
                      <span className="text-emerald-700 uppercase font-black">FREE</span>
                    ) : (
                      `৳${currentDeliveryCharge}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t-2 border-stone-200 text-base font-black text-[#0A1E54]">
                  <span>Grand Total:</span>
                  <span className="text-xl font-mono text-[#0A1E54]">
                    ৳{grandTotal}
                  </span>
                </div>
              </div>

              {/* Delivery Guarantee Badge */}
              <div className="p-3.5 bg-[#F8F3EA] rounded-2xl border border-[#C9A66B]/30 flex items-start gap-2.5 text-xs text-stone-600">
                <ShieldCheck className="w-4 h-4 text-[#C9A66B] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="block text-[#0A1E54] font-bold">
                    Official Patowary Fashion Guarantee
                  </strong>
                  <p className="text-[11px] leading-relaxed">
                    Open box inspection allowed at doorstep. If the size or fit isn't perfect,
                    exchange within 7 days.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
