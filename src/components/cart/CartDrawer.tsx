'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    shippingFee,
    total,
    couponCode,
    couponMessage,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [applying, setApplying] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setApplying(true);
    await applyCoupon(inputCoupon);
    setApplying(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel border-l border-cyan-500/30 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-5 border-b border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🪸</span>
              <h3 className="text-lg font-bold text-white tracking-wide">
                Aquarium Cart ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-3xl mb-4">
                  🐠
                </div>
                <h4 className="text-lg font-semibold text-white mb-1">
                  Your aquarium cart is empty
                </h4>
                <p className="text-sm text-gray-400 max-w-xs mb-6">
                  Add exotic live fish, planted tanks, or aquascaping essentials to start building your underwater paradise.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-black font-semibold text-sm hover:brightness-110 shadow-lg shadow-cyan-500/20 transition-all"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3 rounded-xl bg-white/5 border border-cyan-500/15 hover:border-cyan-500/30 transition-all"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-black/40 flex-shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.product.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-sm font-semibold text-white hover:text-cyan-300 transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-400 hover:text-rose-400 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        ₹{item.product.price.toLocaleString('en-IN')} each
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center rounded-lg border border-cyan-500/30 bg-cyan-950/40">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="p-1 text-gray-300 hover:text-white"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-mono font-bold text-cyan-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="p-1 text-gray-300 hover:text-white"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-mono font-bold text-cyan-300">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer / Checkout summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-cyan-500/20 bg-cyan-950/40 space-y-4">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-2.5 w-4 h-4 text-cyan-400/60" />
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Enter coupon (e.g. AQUA10)"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-black/40 border border-cyan-500/30 text-white placeholder-gray-500 outline-none focus:border-cyan-400 uppercase font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={applying}
                  className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/30 transition-colors disabled:opacity-50"
                >
                  {applying ? 'Checking...' : 'Apply'}
                </button>
              </form>

              {couponCode && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300">
                  <span className="flex items-center gap-1.5 font-mono">
                    ✓ {couponCode} applied
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-rose-400 hover:underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              )}

              {couponMessage && !couponCode && (
                <p className="text-xs text-rose-300">{couponMessage}</p>
              )}

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-gray-300 pt-2 border-t border-cyan-500/15">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">
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
                  <span>Live Stock & Express Shipping</span>
                  <span className="font-mono text-white">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-400 uppercase font-bold text-[11px]">
                        Free
                      </span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>

                {subtotal < 2999 && (
                  <p className="text-[11px] text-cyan-300/80">
                    Add ₹{(2999 - subtotal).toLocaleString('en-IN')} more to unlock Free Live-Stock Shipping!
                  </p>
                )}

                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-cyan-500/20">
                  <span>Total Amount</span>
                  <span className="font-mono text-cyan-400">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Security info */}
              <div className="flex items-center gap-2 text-[11px] text-gray-400">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>100% Live Arrival Guarantee (L.A.G.) & Insulated Thermal Pack</span>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-black font-bold text-sm tracking-wide hover:brightness-110 shadow-lg shadow-cyan-500/30 transition-all group"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
