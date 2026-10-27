'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Shield,
  Package,
  ShoppingBag,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  TrendingUp,
  AlertCircle,
  Database,
  Search,
  Filter,
  DollarSign,
  Tag,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { Product, Order } from '@/types';
import { INITIAL_CATEGORIES } from '@/data/seedProducts';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboardPage() {
  const { user, isAdmin, toggleRole } = useAuth();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Search in admin table
  const [searchFilter, setSearchFilter] = useState('');

  // Add/Edit Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'freshwater-fish',
    price: 999,
    originalPrice: 1299,
    stock: 10,
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'],
    description: '',
    scientificName: '',
    careLevel: 'Beginner',
    temperament: 'Peaceful',
    isFeatured: false,
    isBestSeller: false,
    isLiveStock: true,
  });

  const showNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
      ]);
      const prodData = await prodRes.json();
      const ordData = await ordRes.json();

      if (prodData.success) setProducts(prodData.products || []);
      if (ordData.success) setOrders(ordData.orders || []);
    } catch (e) {
      console.error('Failed to load admin data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'freshwater-fish',
      price: 1999,
      originalPrice: 2499,
      stock: 12,
      images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'],
      description: 'Hand-selected specimen with verified health condition.',
      scientificName: '',
      careLevel: 'Beginner',
      temperament: 'Peaceful',
      isFeatured: false,
      isBestSeller: false,
      isLiveStock: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Update
        const res = await fetch(`/api/products/${editingProduct.slug || editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          showNotification(`Updated "${data.product.name}" successfully!`);
        }
      } else {
        // Create
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          showNotification(`Added new product "${data.product.name}"!`);
        }
      }
      setIsModalOpen(false);
      loadData();
    } catch {
      showNotification('Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification(`Deleted product "${name}"`);
        loadData();
      }
    } catch {
      showNotification('Failed to delete product');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['orderStatus']) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Order status updated to "${status}"`);
        loadData();
      }
    } catch {
      showNotification('Failed to update status');
    }
  };

  const handleSeedDatabase = async () => {
    if (!confirm('Reset database with high-resolution demo products and realistic INR prices?')) return;
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showNotification(data.message);
        loadData();
      }
    } catch {
      showNotification('Failed to reset database');
    }
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const activeOrdersCount = orders.filter((o) => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled').length;
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Admin Role Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl glass-panel border border-cyan-500/20 mb-8">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white flex flex-wrap items-center gap-2">
              Aquaram Central Admin Console
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                {isAdmin ? 'Active SuperAdmin' : 'Viewing as Customer'}
              </span>
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage inventory, live stock health, orders, discounts, and MongoDB records.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleSeedDatabase}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:border-cyan-400 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Database className="w-3.5 h-3.5" />
            Reset Demo DB
          </button>

          <button
            onClick={toggleRole}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-400/40 text-cyan-200 text-xs font-semibold hover:brightness-110 transition-all text-center"
          >
            Switch to {isAdmin ? 'Customer' : 'Admin'} View
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-200 text-xs flex items-center gap-2 shadow-lg animate-in fade-in">
          <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 space-y-1">
          <span className="text-xs font-mono uppercase text-gray-400">Gross Sales</span>
          <p className="text-2xl sm:text-3xl font-mono font-bold text-cyan-300">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> {orders.length} total orders recorded
          </span>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-teal-500/20 space-y-1">
          <span className="text-xs font-mono uppercase text-gray-400">Total Species & Items</span>
          <p className="text-2xl sm:text-3xl font-mono font-bold text-teal-300">
            {products.length}
          </p>
          <span className="text-[11px] text-gray-400">
            Across {INITIAL_CATEGORIES.length} biological categories
          </span>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-amber-500/20 space-y-1">
          <span className="text-xs font-mono uppercase text-gray-400">Pending Live Dispatches</span>
          <p className="text-2xl sm:text-3xl font-mono font-bold text-amber-300">
            {activeOrdersCount}
          </p>
          <span className="text-[11px] text-amber-400">Active fulfillment queue</span>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-rose-500/20 space-y-1">
          <span className="text-xs font-mono uppercase text-gray-400">Stock Alerts (&le; 5 units)</span>
          <p className="text-2xl sm:text-3xl font-mono font-bold text-rose-300">
            {lowStockCount}
          </p>
          <span className="text-[11px] text-rose-400">Needs quarantine re-order</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 mb-6 border-b border-cyan-500/20 pb-4">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'products'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'text-gray-400 hover:text-white bg-white/5'
          }`}
        >
          <Package className="w-4 h-4" />
          Product Catalog ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'orders'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'text-gray-400 hover:text-white bg-white/5'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Customer Orders ({orders.length})
        </button>
      </div>

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-cyan-400/60" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search products by title or category..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-cyan-500/30 text-white placeholder-gray-500 text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <button
              onClick={openCreateModal}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-bold text-xs hover:brightness-110 shadow-lg shadow-cyan-500/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Product
            </button>
          </div>

          {/* Table */}
          <div className="rounded-2xl glass-panel border border-cyan-500/20 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[760px]">
                <thead className="bg-black/60 text-cyan-400 uppercase font-mono border-b border-cyan-500/20">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price (₹)</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Live Species</th>
                    <th className="p-4">Badges</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-500/10">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-cyan-950/20 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black/40 flex-shrink-0">
                          <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                        </div>
                        <div>
                          <Link
                            href={`/products/${p.slug}`}
                            className="font-semibold text-white hover:text-cyan-300 transition-colors line-clamp-1"
                          >
                            {p.name}
                          </Link>
                          {p.scientificName && (
                            <span className="text-[11px] text-gray-400 italic block">
                              {p.scientificName}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-gray-300 capitalize">
                        {p.category.replace(/-/g, ' ')}
                      </td>

                      <td className="p-4 font-mono font-bold text-cyan-300">
                        ₹{p.price.toLocaleString('en-IN')}
                        {p.originalPrice && (
                          <span className="text-[10px] text-gray-500 block line-through">
                            ₹{p.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>

                      <td className="p-4 font-mono">
                        {p.stock <= 5 ? (
                          <span className="text-amber-400 font-bold">{p.stock} units</span>
                        ) : (
                          <span className="text-emerald-400">{p.stock} units</span>
                        )}
                      </td>

                      <td className="p-4">
                        {p.isLiveStock ? (
                          <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px]">
                            Live Animal
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 text-[10px]">
                            Hardware
                          </span>
                        )}
                      </td>

                      <td className="p-4 space-x-1">
                        {p.isFeatured && (
                          <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px]">
                            Featured
                          </span>
                        )}
                        {p.isBestSeller && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px]">
                            Bestseller
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="rounded-2xl glass-panel border border-cyan-500/20 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[760px]">
                <thead className="bg-black/60 text-cyan-400 uppercase font-mono border-b border-cyan-500/20">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Current Status</th>
                    <th className="p-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-500/10">
                  {orders.map((o) => (
                    <tr key={o.id || o.orderNumber} className="hover:bg-cyan-950/20 transition-colors">
                      <td className="p-4 font-mono font-bold text-cyan-300">
                        #{o.orderNumber}
                        <span className="block text-[10px] text-gray-500 font-sans font-normal">
                          {new Date(o.createdAt).toLocaleDateString('en-IN')}
                        </span>
                      </td>

                      <td className="p-4">
                        <p className="font-semibold text-white">{o.shippingAddress.fullName}</p>
                        <p className="text-gray-400 text-[11px]">{o.shippingAddress.city}, {o.shippingAddress.state}</p>
                        <p className="font-mono text-gray-500 text-[10px]">{o.shippingAddress.phone}</p>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-white">{o.items.length} items</span>
                        <p className="text-gray-400 text-[11px] truncate max-w-xs">
                          {o.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                        </p>
                      </td>

                      <td className="p-4 font-mono font-bold text-cyan-300">
                        ₹{o.total.toLocaleString('en-IN')}
                        <span className="block text-[10px] text-gray-400 font-sans font-normal uppercase">
                          {o.paymentMethod}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono border capitalize bg-cyan-950 text-cyan-300 border-cyan-500/40">
                          {o.orderStatus.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <select
                          value={o.orderStatus}
                          onChange={(e) =>
                            handleUpdateOrderStatus(o.id || o.orderNumber, e.target.value as Order['orderStatus'])
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-cyan-500/30 text-white text-xs outline-none focus:border-cyan-400"
                        >
                          <option value="processing">Processing</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#020d1c] border border-cyan-400/50 p-5 sm:p-8 space-y-6 text-white my-4 sm:my-8 max-h-[92vh] overflow-y-auto shadow-2xl ring-1 ring-cyan-500/20">
            <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-cyan-400" />
                {editingProduct ? 'Edit Aquatic Product' : 'Add New Aquarium Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-gray-300 font-medium">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-cyan-500/30 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-gray-300 font-medium">Scientific / Latin Name (Optional)</label>
                  <input
                    type="text"
                    value={formData.scientificName || ''}
                    onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
                    placeholder="e.g. Symphysodon aequifasciatus"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-cyan-500/30 text-white outline-none focus:border-cyan-400 font-mono italic"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-cyan-500/30 text-white outline-none focus:border-cyan-400"
                  >
                    {INITIAL_CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Selling Price in ₹ INR *</label>
                  <input
                    type="number"
                    required
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-cyan-500/30 text-white outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Original / Strikethrough Price (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice || ''}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-cyan-500/30 text-white outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Stock Inventory Count *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock || 0}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-cyan-500/30 text-white outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-gray-300 font-medium">Product Image URL *</label>
                  <input
                    type="text"
                    required
                    value={formData.images?.[0] || ''}
                    onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-cyan-500/30 text-white outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-gray-300 font-medium">Detailed Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-cyan-500/30 text-white outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!formData.isLiveStock}
                      onChange={(e) => setFormData({ ...formData, isLiveStock: e.target.checked })}
                      className="accent-cyan-400"
                    />
                    <span>Live Species (Requires Oxygen Transit)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="accent-cyan-400"
                    />
                    <span>Feature on Homepage</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!formData.isBestSeller}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="accent-cyan-400"
                    />
                    <span>Bestseller</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-cyan-500/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-cyan-500/30 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-bold hover:brightness-110 shadow-lg shadow-cyan-500/20"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
