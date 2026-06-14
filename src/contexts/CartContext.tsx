import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  isOpen: boolean;
  promoCode: string;
  discountPercentage: number;
  deliveryCharge: number;
  totalBeforeDiscount: number;
  totalPrice: number;
  promoError: string | null;
  addToCart: (product: Product, variant: string, quantity?: number) => void;
  removeFromCart: (productId: number, variant: string) => void;
  updateQuantity: (productId: number, variant: string, quantity: number) => void;
  applyPromo: (code: string) => void;
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
  const [promoError, setPromoError] = useState<string | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('KIYOMI_premium_cart') || localStorage.getItem('dorax_premium_cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (err) {
        console.error("Failed to parse cart local storage", err);
      }
    }
  }, []);

  // Sync to local storage on changes
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('KIYOMI_premium_cart', JSON.stringify(items));
  };

  const addToCart = (product: Product, variant: string, quantity = 1) => {
    if (product.outOfStock.includes(variant)) {
      alert(`Variant ${variant} is out of stock`);
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
    setIsOpen(true); // Open the cart drawer immediately for luxury click validation
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

  const applyPromo = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === 'KIYOMIVIP' || trimmed === 'DORAXVIP') {
      setPromoCode(trimmed);
      setDiscountPercentage(20); // 20% Off for VIP elements
      setPromoError(null);
    } else if (trimmed === 'STREETWEEK') {
      setPromoCode(trimmed);
      setDiscountPercentage(15); // 15% Off
      setPromoError(null);
    } else if (trimmed === 'FREE100') {
      setPromoCode(trimmed);
      setDiscountPercentage(10); // 10% Off
      setPromoError(null);
    } else {
      setPromoError('INVALID OR EXPIRED PROMO CODE');
      setDiscountPercentage(0);
      setPromoCode('');
    }
  };

  const clearCart = () => {
    saveCart([]);
    setPromoCode('');
    setDiscountPercentage(0);
  };

  const toggleCart = () => {
    setIsOpen(prev => !prev);
  };

  // Luxury calculations
  const totalBeforeDiscount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 0
  );
  
  // Custom threshold for Free delivery (e.g. 5000 BDT)
  const deliveryCharge = totalBeforeDiscount === 0 ? 0 : totalBeforeDiscount >= 5000 ? 0 : 150;

  const totalPrice = Math.max(
    0,
    Math.round(totalBeforeDiscount * (1 - discountPercentage / 100)) + deliveryCharge
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isOpen,
        promoCode,
        discountPercentage,
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
        toggleCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};
