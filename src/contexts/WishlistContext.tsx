import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';

interface WishlistContextType {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Load favorites from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('KIYOMI_wishlist') || localStorage.getItem('dorax_wishlist');
    if (stored) {
      try {
        setWishlist(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse wishlist storage", err);
      }
    }
  }, []);

  const toggleWishlist = (product: Product) => {
    const isExist = wishlist.some(item => item.id === product.id);
    let updated: Product[];
    if (isExist) {
       updated = wishlist.filter(item => item.id !== product.id);
    } else {
       updated = [...wishlist, product];
    }
    setWishlist(updated);
    localStorage.setItem('KIYOMI_wishlist', JSON.stringify(updated));
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside WishlistProvider");
  return context;
};
