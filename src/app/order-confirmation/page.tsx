'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle,
  Truck,
  Package,
  Calendar,
  ShieldCheck,
  ArrowRight,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { Order } from '@/types';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) {
      setLoading(false);
      return;
    }

    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderNumber}`);
        const data = await res.json();
        if (data.success && data.order) {
          setOrder(data.order);
        }
      } catch (e) {
        console.error('Failed to fetch order', e);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderNumber]);

  return (
    <div className="min-h-screen pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Celebration Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20 animate-in zoom-in">
          <CheckCircle className="w-10 h-10" />
        </div>
        <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
          Order Successfully Placed
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Thank You For Your Order!
        </h1>
        <p className="text-sm text-gray-300 max-w-lg mx-auto">
          We have received your request. Your aquatic specimens and equipment are being carefully prepared with specialized oxygen and thermal packing.
        </p>

        {orderNumber && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-sm font-bold">
            Order Reference: {orderNumber}
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center text-cyan-400">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading order details...
        </div>
      ) : order ? (
        <div className="space-y-8">
          {/* Status Tracker */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-cyan-500/30 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-bold text-white">Live Tracking Status</h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono capitalize">
                {order.orderStatus.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500 text-black font-bold flex items-center justify-center mx-auto">
                  ✓
                </div>
                <span className="font-semibold text-white block">Confirmed</span>
                <span className="text-[10px] text-gray-400 block">Payment Verified</span>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500/40 text-cyan-200 font-bold flex items-center justify-center mx-auto border border-cyan-400/40">
                  2
                </div>
                <span className="font-semibold text-white block">Oxygen Packing</span>
                <span className="text-[10px] text-gray-400 block">Thermal Isolation</span>
              </div>

              <div className="space-y-2 opacity-50">
                <div className="w-8 h-8 rounded-full bg-white/10 text-gray-400 flex items-center justify-center mx-auto">
                  3
                </div>
                <span className="font-semibold text-gray-300 block">Air Express</span>
                <span className="text-[10px] text-gray-500 block">Priority Transit</span>
              </div>

              <div className="space-y-2 opacity-50">
                <div className="w-8 h-8 rounded-full bg-white/10 text-gray-400 flex items-center justify-center mx-auto">
                  4
                </div>
                <span className="font-semibold text-gray-300 block">Delivered</span>
                <span className="text-[10px] text-gray-500 block">Acclimation Ready</span>
              </div>
            </div>

            {order.trackingNumber && (
              <div className="p-3 rounded-xl bg-black/40 border border-cyan-500/20 flex items-center justify-between text-xs">
                <span className="text-gray-400">Waybill Tracking Number:</span>
                <span className="font-mono font-bold text-cyan-300">{order.trackingNumber}</span>
              </div>
            )}
          </div>

          {/* Items & Shipping Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Items */}
            <div className="p-6 rounded-3xl glass-panel border border-cyan-500/20 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-cyan-400" /> Items in this Order
              </h3>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black/40 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{item.name}</p>
                      <p className="text-gray-400">Quantity: {item.quantity}</p>
                    </div>
                    <span className="font-mono text-cyan-300 font-bold">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-cyan-500/20 space-y-1.5 text-xs text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">₹{order.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono">-₹{order.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-mono text-white">
                    {order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-white text-sm pt-2 border-t border-cyan-500/15">
                  <span>Total Paid</span>
                  <span className="font-mono text-cyan-400">₹{order.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Destination */}
            <div className="p-6 rounded-3xl glass-panel border border-cyan-500/20 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" /> Delivery Destination
              </h3>
              <div className="text-xs text-gray-300 space-y-1">
                <p className="font-bold text-white text-sm">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                  <span className="font-mono">{order.shippingAddress.postalCode}</span>
                </p>
                <p className="pt-2 font-mono text-cyan-400">{order.shippingAddress.phone}</p>
                <p className="text-gray-400">{order.shippingAddress.email}</p>
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-[11px] text-gray-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>
                  Our logistics team monitors ambient transit temperature. Please ensure someone is available at the address upon delivery for immediate acclimation.
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-12 text-center flex flex-wrap justify-center gap-4">
        <Link
          href="/orders"
          className="px-6 py-3 rounded-xl glass-panel border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-950/60 transition-colors"
        >
          View All My Orders
        </Link>
        <Link
          href="/shop"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-bold text-xs hover:brightness-110 shadow-lg shadow-cyan-500/20 transition-all"
        >
          Return to Shop
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-cyan-400">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
