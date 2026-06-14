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
  rating: number;
  assets: string[];
  variants: string[];
  outOfStock: string[];
  description: string;
  reviews: Review[];
  stock?: number;
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
