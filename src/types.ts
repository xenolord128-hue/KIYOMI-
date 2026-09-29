export interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
}

export interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  regularPrice?: number;
  discountPercent?: number;
  salePrice?: number;
  rating: number;
  assets: string[];
  variants: string[];
  outOfStock: string[];
  description: string;
  reviews: Review[];
  stock?: number;
  status?: 'active' | 'draft';
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  nameBn?: string;
  slug?: string;
  description?: string;
  image?: string;
  status: 'active' | 'inactive';
  productCount?: number;
  createdAt?: string;
}

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  usedCount?: number;
  status: 'active' | 'inactive' | 'expired';
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  selectedVariant: string;
  quantity: number;
}

export interface Order {
  id: string; // Unique Tracking ID
  fullName: string;
  phone: string;
  address: string;
  paymentMethod: string;
  items: {
    productId: number;
    title: string;
    price: number;
    variant: string;
    quantity: number;
    image: string;
  }[];
  totalPrice: number;
  status: 'Received' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Completed';
  createdAt: string; // ISO date string
}
