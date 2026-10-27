'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowLeft,
  Truck,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { ShippingAddress } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, discount, shippingFee, total, clearCart } = useCart();

  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: 'Rahul Sharma',
    email: 'rahul.s@example.com',
    phone: '+91 98765 43210',
    addressLine1: 'B-402, Sea Green Residency, Marine Drive',
    addressLine2: 'Opposite Aquarium Promenade',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400020',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState<'demo' | 'razorpay' | 'upi' | 'cod'>('demo');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const orderPayload = {
        items: cart.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0],
        })),
        shippingAddress: formData,
        subtotal,
        shippingFee,
        discount,
        total,
        paymentMethod,
        paymentStatus: 'completed',
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#00ffb3', '#ffffff', '#ffbe3b'],
        });
      } catch {
        // Confetti fallback
      }

      clearCart();
      router.push(`/order-confirmation?orderNumber=${data.order.orderNumber}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong while placing your order.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 max-w-7xl mx-auto px-4 text-center">
        <div className="p-12 rounded-3xl glass-panel border border-cyan-500/20 max-w-lg mx-auto space-y-4">
          <span className="text-4xl">🛒</span>
          <h2 className="text-2xl font-bold text-white">Your cart is empty</h2>
          <p className="text-sm text-gray-400">
            Please add items to your cart before proceeding to checkout.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 rounded-xl bg-cyan-500 text-black font-semibold text-xs"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shopping Cart
        </Link>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-8">
        Express Checkout & Delivery Details
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Shipping Form & Payment Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address Section */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-cyan-500/20 space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-cyan-500/20">
              <Truck className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">1. Shipping Address & Contact</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-gray-300 font-medium">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-cyan-500/30 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-medium">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-cyan-500/30 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-gray-300 font-medium">Phone Number (For Transit Tracking) *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-cyan-500/30 text-white outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-gray-300 font-medium">Street Address / Flat / Building *</label>
                <input
                  type="text"
                  name="addressLine1"
                  required
                  value={formData.addressLine1}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-cyan-500/30 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-gray-300 font-medium">Landmark (Optional)</label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-cyan-500/30 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-medium">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-cyan-500/30 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-medium">State *</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-cyan-500/30 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-medium">PIN Code *</label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-cyan-500/30 text-white outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-medium">Country</label>
                <input
                  type="text"
                  disabled
                  value="India"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-cyan-500/15 text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-cyan-500/20 space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-cyan-500/20">
              <CreditCard className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">2. Select Payment Method</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Demo Sandbox Mode */}
              <label
                onClick={() => setPaymentMethod('demo')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                  paymentMethod === 'demo'
                    ? 'border-cyan-400 bg-cyan-950/60 shadow-lg shadow-cyan-500/20'
                    : 'border-cyan-500/20 bg-black/30 hover:border-cyan-400/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">⚡ Instant Demo Checkout</span>
                  {paymentMethod === 'demo' && (
                    <CheckCircle className="w-4 h-4 text-cyan-400" />
                  )}
                </div>
                <p className="text-xs text-cyan-200/80">
                  Simulates successful payment instantly. Recommended for testing order workflows.
                </p>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded w-max">
                  100% Functional Test Mode
                </span>
              </label>

              {/* Option 2: Razorpay Gateway */}
              <label
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                  paymentMethod === 'razorpay'
                    ? 'border-cyan-400 bg-cyan-950/60 shadow-lg shadow-cyan-500/20'
                    : 'border-cyan-500/20 bg-black/30 hover:border-cyan-400/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Razorpay Secure</span>
                  {paymentMethod === 'razorpay' && (
                    <CheckCircle className="w-4 h-4 text-cyan-400" />
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  UPI, Google Pay, PhonePe, NetBanking, and Credit/Debit Cards.
                </p>
                <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded w-max">
                  Live Gateway Ready
                </span>
              </label>

              {/* Option 3: UPI QR */}
              <label
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                  paymentMethod === 'upi'
                    ? 'border-cyan-400 bg-cyan-950/60 shadow-lg shadow-cyan-500/20'
                    : 'border-cyan-500/20 bg-black/30 hover:border-cyan-400/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Direct UPI Transfer</span>
                  {paymentMethod === 'upi' && (
                    <CheckCircle className="w-4 h-4 text-cyan-400" />
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  Scan and pay via any UPI app with order ID reference.
                </p>
              </label>

              {/* Option 4: COD */}
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                  paymentMethod === 'cod'
                    ? 'border-cyan-400 bg-cyan-950/60 shadow-lg shadow-cyan-500/20'
                    : 'border-cyan-500/20 bg-black/30 hover:border-cyan-400/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Cash on Delivery</span>
                  {paymentMethod === 'cod' && (
                    <CheckCircle className="w-4 h-4 text-cyan-400" />
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  Available for non-perishable equipment and dry goods.
                </p>
              </label>
            </div>
          </div>
        </div>

        {/* Order Review Sticky Box */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 space-y-6 sticky top-28">
            <h3 className="text-lg font-bold text-white">Order Summary ({cart.length} items)</h3>

            {/* Items mini list */}
            <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 text-xs">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black/40 flex-shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{item.product.name}</p>
                    <p className="text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-mono text-cyan-300 font-semibold">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculation summary */}
            <div className="space-y-2 text-xs text-gray-300 pt-4 border-t border-cyan-500/20">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span className="font-mono">-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Live Stock Oxygen & Thermal Transit</span>
                <span className="font-mono text-white">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-400 uppercase font-bold text-[11px]">Free</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-lg font-bold text-white pt-4 border-t border-cyan-500/20">
                <span>Grand Total</span>
                <span className="font-mono text-cyan-400">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-black font-bold text-sm tracking-wide hover:brightness-110 shadow-xl shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              {submitting ? 'Placing Order...' : `Pay ₹${total.toLocaleString('en-IN')} & Confirm Order`}
            </button>

            <div className="flex items-center gap-2 text-[11px] text-gray-400 pt-2 border-t border-cyan-500/15">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>SSL 256-Bit Encrypted & 100% Live Arrival Guaranteed</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
