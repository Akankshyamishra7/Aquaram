'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  ArrowLeft,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    shippingFee,
    total,
    couponCode,
    couponMessage,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setLoadingCoupon(true);
    await applyCoupon(couponInput);
    setLoadingCoupon(false);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Exploring Catalog
        </Link>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-8">
        Your Aquarium Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <div className="p-16 rounded-3xl glass-panel border border-cyan-500/20 text-center max-w-lg mx-auto space-y-4">
          <span className="text-5xl block">🐠</span>
          <h2 className="text-2xl font-bold text-white">Your cart is currently empty</h2>
          <p className="text-sm text-gray-400">
            Looks like you haven&apos;t added any marine fish, aquariums, or plants yet.
          </p>
          <Link
            href="/shop"
            className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-bold text-sm shadow-lg shadow-cyan-500/25"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center text-xs text-gray-400 px-2 pb-2 border-b border-cyan-500/20">
              <span>{cart.length} unique items in cart</span>
              <button
                onClick={clearCart}
                className="text-rose-400 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            </div>

            {cart.map((item) => (
              <div
                key={item.product.id}
                className="p-4 rounded-2xl glass-panel border border-cyan-500/20 flex flex-col sm:flex-row items-center gap-4 transition-all hover:border-cyan-400/40"
              >
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-black/40 flex-shrink-0">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <span className="text-[10px] font-mono uppercase text-cyan-400">
                    {item.product.category.replace(/-/g, ' ')}
                  </span>
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="block text-base font-bold text-white hover:text-cyan-300 transition-colors"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-xs font-mono text-gray-400">
                    ₹{item.product.price.toLocaleString('en-IN')} each
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-xl border border-cyan-500/30 bg-black/40">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-2 text-gray-300 hover:text-white"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 text-sm font-mono font-bold text-cyan-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-2 text-gray-300 hover:text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-base font-mono font-bold text-cyan-300 min-w-[90px] text-right">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-gray-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Box */}
          <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 space-y-6">
            <h3 className="text-lg font-bold text-white">Order Summary</h3>

            {/* Coupon Code Input */}
            <form onSubmit={handleApply} className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-2.5 w-4 h-4 text-cyan-400/60" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter code (AQUA10)"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 outline-none uppercase font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loadingCoupon}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/30 transition-colors"
                >
                  Apply
                </button>
              </div>

              {couponCode && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300">
                  <span>✓ {couponCode} active</span>
                  <button onClick={removeCoupon} className="text-rose-400 text-[11px] hover:underline">
                    Remove
                  </button>
                </div>
              )}

              {couponMessage && !couponCode && (
                <p className="text-xs text-rose-300">{couponMessage}</p>
              )}
            </form>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs text-gray-300 pt-4 border-t border-cyan-500/20">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-white text-sm">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span className="font-mono">
                    -₹{discount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Live Stock Oxygen & Thermal Shipping</span>
                <span className="font-mono text-white">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-400 uppercase font-bold text-[11px]">
                      FREE
                    </span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>

              {subtotal < 2999 && (
                <p className="text-[11px] text-cyan-300/80">
                  Add ₹{(2999 - subtotal).toLocaleString('en-IN')} more to qualify for Free Shipping!
                </p>
              )}

              <div className="flex justify-between text-lg font-bold text-white pt-4 border-t border-cyan-500/20">
                <span>Total Amount</span>
                <span className="font-mono text-cyan-400">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-black font-bold text-sm tracking-wide hover:brightness-110 shadow-lg shadow-cyan-500/30 transition-all group"
            >
              Proceed to Secure Checkout
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="flex items-center gap-2 text-[11px] text-gray-400 pt-2 border-t border-cyan-500/15">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Full Live Arrival Guarantee & Insulated Transit Packaging</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
