'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types';

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  couponCode: string;
  couponMessage: string;
  isCartOpen: boolean;
  toastMessage: string | null;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('aquaram_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedCoupon = localStorage.getItem('aquaram_coupon');
      if (savedCoupon) {
        setCouponCode(savedCoupon);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aquaram_cart', JSON.stringify(cart));
    } catch {
      // Ignore
    }
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
    showToast(`Added "${product.name}" to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setDiscount(0);
    setCouponMessage('');
    localStorage.removeItem('aquaram_cart');
    localStorage.removeItem('aquaram_coupon');
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Free shipping over ₹2,999, else ₹250
  const shippingFee = cart.length === 0 ? 0 : subtotal >= 2999 ? 0 : 250;

  const total = Math.max(0, subtotal - discount + shippingFee);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const applyCoupon = async (code: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setCouponCode(code.toUpperCase());
        setDiscount(data.discount);
        setCouponMessage(data.message);
        localStorage.setItem('aquaram_coupon', code.toUpperCase());
        showToast(data.message);
        return true;
      } else {
        setCouponMessage(data.message);
        showToast(data.message);
        return false;
      }
    } catch {
      setCouponMessage('Failed to validate coupon');
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscount(0);
    setCouponMessage('');
    localStorage.removeItem('aquaram_coupon');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        discount,
        shippingFee,
        total,
        couponCode,
        couponMessage,
        isCartOpen,
        toastMessage,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        applyCoupon,
        removeCoupon,
        clearCart,
      }}
    >
      {children}
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-cyan-950/90 text-cyan-200 border border-cyan-400/30 backdrop-blur-md shadow-2xl shadow-cyan-500/20 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
