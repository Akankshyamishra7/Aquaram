'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  Truck,
  Calendar,
  ChevronRight,
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { Order } from '@/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch (e) {
        console.error('Failed to load orders', e);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const getStatusBadge = (status: Order['orderStatus']) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'shipped':
      case 'out_for_delivery':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'processing':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'cancelled':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-teal-500/20 text-teal-300 border-teal-500/40';
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Your Orders & Waybills</h1>
          <p className="text-xs text-gray-400 mt-1">
            Track live dispatch status and view previous aquarium orders.
          </p>
        </div>

        <Link
          href="/shop"
          className="px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-semibold text-xs hover:brightness-110 shadow-lg shadow-cyan-500/20"
        >
          New Purchase
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-cyan-400">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="p-16 rounded-3xl glass-panel border border-cyan-500/20 text-center max-w-md mx-auto space-y-4">
          <Package className="w-12 h-12 text-cyan-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">No orders found</h2>
          <p className="text-xs text-gray-400">
            You haven&apos;t placed any orders yet. Explore our rare aquatic species!
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 rounded-xl bg-cyan-500 text-black text-xs font-bold"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id || order.orderNumber}
              className="p-6 rounded-3xl glass-panel border border-cyan-500/20 hover:border-cyan-400/40 transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cyan-500/15">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-cyan-300">
                    Order #{order.orderNumber}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span>•</span>
                    <span>{order.shippingAddress.city}, {order.shippingAddress.state}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-mono border capitalize ${getStatusBadge(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus.replace(/_/g, ' ')}
                  </span>
                  <Link
                    href={`/order-confirmation?orderNumber=${order.orderNumber}`}
                    className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    Waybill Tracker
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-black/30 border border-cyan-500/10 text-xs"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black/40 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{item.name}</p>
                      <p className="text-gray-400 text-[11px]">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer row */}
              <div className="pt-3 border-t border-cyan-500/15 flex items-center justify-between text-xs">
                <span className="text-gray-400">
                  Payment: <strong className="text-white uppercase">{order.paymentMethod}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-base font-mono font-bold text-cyan-300">
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
