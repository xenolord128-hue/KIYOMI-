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
  videoUrl?: string;
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

export type OrderStatus =
  | 'Pending'
  | 'Payment Verification'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Completed'
  | 'Cancelled'
  | 'Received';

export type PaymentMethodType = 'bKash' | 'Nagad' | 'Upay' | 'Cash on Delivery' | 'Bank Payment' | string;

export type PaymentStatusType =
  | 'Pending Verification'
  | 'Paid'
  | 'Rejected'
  | 'Cash on Delivery'
  | 'Pending (Bank Transfer)'
  | string;

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city?: string;
  area?: string;
  note?: string;
}

export interface OrderPricing {
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
}

export interface OrderPayment {
  method: PaymentMethodType;
  transactionId?: string;
  senderNumber?: string;
  screenshotUrl?: string;
  status: PaymentStatusType;
  adminVerificationNote?: string;
  verifiedAt?: string;
}

export interface OrderItem {
  productId: number;
  title: string;
  productName?: string;
  price: number;
  variant: string;
  quantity: number;
  size?: string;
  color?: string;
  image: string;
}

export interface Order {
  id: string; // Unique Tracking ID / Order ID (e.g. PF-20261002-XXXX)
  orderId?: string;
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city?: string;
  area?: string;
  note?: string;
  customer?: OrderCustomer;
  paymentMethod: PaymentMethodType;
  paymentStatus?: PaymentStatusType;
  payment?: OrderPayment;
  items: OrderItem[];
  totalPrice: number;
  pricing?: OrderPricing;
  status: OrderStatus;
  orderStatus?: OrderStatus;
  createdAt: string; // ISO date string
}
