import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, PromoCode } from '../types';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

interface CartContextType {
  cartItems: CartItem[];
  isOpen: boolean;
  promoCode: string;
  discountPercentage: number;
  discountAmount: number;
  deliveryCharge: number;
  totalBeforeDiscount: number;
  totalPrice: number;
  promoError: string | null;
  addToCart: (product: Product, variant: string, quantity?: number) => void;
  removeFromCart: (productId: number, variant: string) => void;
  updateQuantity: (productId: number, variant: string, quantity: number) => void;
  applyPromo: (code: string) => Promise<boolean>;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    const storedCart = localStorage.getItem('patowary_cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (err) {
        console.error("Failed to parse cart local storage", err);
      }
    }
  }, []);

  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('patowary_cart', JSON.stringify(items));
  };

  const addToCart = (product: Product, variant: string, quantity = 1) => {
    if (product.outOfStock && product.outOfStock.includes(variant)) {
      alert(`Variant ${variant} is currently out of stock`);
      return;
    }

    const existingIndex = cartItems.findIndex(
      item => item.product.id === product.id && item.selectedVariant === variant
    );

    let updatedCart = [...cartItems];
    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart.push({ product, selectedVariant: variant, quantity });
    }
    saveCart(updatedCart);
  };

  const removeFromCart = (productId: number, variant: string) => {
    const updatedCart = cartItems.filter(
      item => !(item.product.id === productId && item.selectedVariant === variant)
    );
    saveCart(updatedCart);
  };

  const updateQuantity = (productId: number, variant: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    const updatedCart = cartItems.map(item => {
      if (item.product.id === productId && item.selectedVariant === variant) {
        return { ...item, quantity };
      }
      return item;
    });
    saveCart(updatedCart);
  };

  const totalBeforeDiscount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 0
  );

  const applyPromo = async (code: string): Promise<boolean> => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setPromoError('Please enter a coupon code / কুপন কোড লিখুন');
      return false;
    }

    // 1. Check against real Firestore 'promocodes' collection
    try {
      const docRef = doc(db, 'promocodes', trimmed);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const promo = snap.data() as PromoCode;

        // Check if inactive
        if (promo.status === 'inactive') {
          setPromoError('This promo code is currently disabled / এই কুপন কোডটি নিষ্ক্রিয় রয়েছে');
          setPromoCode('');
          setDiscountPercentage(0);
          setDiscountAmount(0);
          return false;
        }

        // Check expiration
        if (promo.endDate) {
          const deadline = new Date(promo.endDate);
          // Compare with end of day
          deadline.setHours(23, 59, 59, 999);
          if (Date.now() > deadline.getTime()) {
            setPromoError('This promo code has expired / এই কুপন কোডটির মেয়াদ উত্তীর্ণ হয়েছে');
            setPromoCode('');
            setDiscountPercentage(0);
            setDiscountAmount(0);
            return false;
          }
        }

        // Check minimum order amount
        if (promo.minOrderAmount && totalBeforeDiscount < promo.minOrderAmount) {
          setPromoError(`Minimum order amount of ৳${promo.minOrderAmount} required / নূন্যতম ৳${promo.minOrderAmount} টাকার অর্ডার প্রয়োজন`);
          setPromoCode('');
          setDiscountPercentage(0);
          setDiscountAmount(0);
          return false;
        }

        // Apply discount
        setPromoCode(trimmed);
        setPromoError(null);

        if (promo.discountType === 'percentage') {
          setDiscountPercentage(promo.discountValue);
          setDiscountAmount(0);
        } else {
          setDiscountAmount(promo.discountValue);
          setDiscountPercentage(0);
        }
        return true;
      }
    } catch (err) {
      console.warn("Firestore promo check fallback:", err);
    }

    // 2. Default fallback promo codes
    if (trimmed === 'PATOWARY10' || trimmed === 'WELCOME10') {
      setPromoCode(trimmed);
      setDiscountPercentage(10);
      setDiscountAmount(0);
      setPromoError(null);
      return true;
    } else if (trimmed === 'PATOWARYVIP' || trimmed === 'PATOWARY20') {
      setPromoCode(trimmed);
      setDiscountPercentage(20);
      setDiscountAmount(0);
      setPromoError(null);
      return true;
    } else if (trimmed === 'STREET15') {
      setPromoCode(trimmed);
      setDiscountPercentage(15);
      setDiscountAmount(0);
      setPromoError(null);
      return true;
    } else {
      setPromoError('Invalid or expired promo code / কুপন কোডটি সঠিক নয় বা মেয়াদ উত্তীর্ণ');
      setDiscountPercentage(0);
      setDiscountAmount(0);
      setPromoCode('');
      return false;
    }
  };

  const clearCart = () => {
    saveCart([]);
    setPromoCode('');
    setDiscountPercentage(0);
    setDiscountAmount(0);
  };

  const toggleCart = () => {
    setIsOpen(prev => !prev);
  };
  
  // Free delivery threshold: 3500 BDT
  const deliveryCharge = totalBeforeDiscount === 0 ? 0 : totalBeforeDiscount >= 3500 ? 0 : 100;

  // Calculate final discounted amount
  let calculatedDiscount = 0;
  if (discountPercentage > 0) {
    calculatedDiscount = Math.round(totalBeforeDiscount * (discountPercentage / 100));
  } else if (discountAmount > 0) {
    calculatedDiscount = Math.min(totalBeforeDiscount, discountAmount);
  }

  const totalPrice = Math.max(
    0,
    totalBeforeDiscount - calculatedDiscount + deliveryCharge
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isOpen,
        promoCode,
        discountPercentage,
        discountAmount,
        deliveryCharge,
        totalBeforeDiscount,
        totalPrice,
        promoError,
        addToCart,
        removeFromCart,
        updateQuantity,
        applyPromo,
        clearCart,
        setIsOpen,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
