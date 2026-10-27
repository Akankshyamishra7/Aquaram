export interface Product {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  scientificName?: string;
  category: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  inStock: boolean;
  images: string[];
  description: string;
  shortDescription?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isSpecialDeal?: boolean;
  isLiveStock?: boolean;
  careLevel?: 'Beginner' | 'Intermediate' | 'Expert';
  temperament?: 'Peaceful' | 'Semi-Aggressive' | 'Aggressive';
  waterParameters?: {
    temperature?: string;
    ph?: string;
    hardness?: string;
    minTankSize?: string;
  };
  dimensions?: string;
  specifications?: Record<string, string>;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
  accentColor: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  _id?: string;
  orderNumber: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: 'razorpay' | 'cod' | 'upi' | 'card' | 'demo';
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'processing' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  avatar?: string;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrderValue: number;
  description: string;
}
