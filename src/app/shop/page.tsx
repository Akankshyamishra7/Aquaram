'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Filter,
  Search,
  X,
  RotateCcw,
  SlidersHorizontal,
  Heart,
  Droplets,
} from 'lucide-react';
import { Product } from '@/types';
import { INITIAL_CATEGORIES } from '@/data/seedProducts';
import ProductCard from '@/components/product/ProductCard';
import { useWishlist } from '@/context/WishlistContext';

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialTab = searchParams.get('tab') || 'all';

  const { wishlist } = useWishlist();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCareLevel, setSelectedCareLevel] = useState<string>('all');
  const [onlyLiveStock, setOnlyLiveStock] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(30000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  useEffect(() => {
    const cat = searchParams.get('category');
    setSelectedCategory(cat || 'all');

    const tab = searchParams.get('tab');
    setActiveTab(tab || 'all');
  }, [searchParams]);

  const handleCategorySelect = (catSlug: string) => {
    setSelectedCategory(catSlug);
    const params = new URLSearchParams(searchParams.toString());
    if (catSlug === 'all') {
      params.delete('category');
    } else {
      params.set('category', catSlug);
    }
    const queryString = params.toString();
    router.push(queryString ? `/shop?${queryString}` : '/shop', { scroll: false });
  };

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) {
          setProducts(data.products || []);
        }
      } catch (e) {
        console.error('Failed to load products', e);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedCareLevel('all');
    setOnlyLiveStock(false);
    setMaxPrice(30000);
    setSortBy('featured');
    setActiveTab('all');
    router.push('/shop', { scroll: false });
  };

  // Active Category metadata for dynamic title
  const activeCategoryObj = INITIAL_CATEGORIES.find((c) => c.slug === selectedCategory);

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    if (activeTab === 'wishlist') {
      return wishlist;
    }

    let list = [...products];

    // Category
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.scientificName?.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Care Level
    if (selectedCareLevel !== 'all') {
      list = list.filter((p) => p.careLevel === selectedCareLevel);
    }

    // Live Stock only
    if (onlyLiveStock) {
      list = list.filter((p) => p.isLiveStock);
    }

    // Price
    list = list.filter((p) => p.price <= maxPrice);

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Featured first
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return list;
  }, [
    products,
    wishlist,
    activeTab,
    selectedCategory,
    searchQuery,
    selectedCareLevel,
    onlyLiveStock,
    maxPrice,
    sortBy,
  ]);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="rounded-3xl glass-panel border border-cyan-500/20 p-8 mb-10 relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            Aquaram Marine Catalog
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            {activeTab === 'wishlist'
              ? 'Your Saved Wishlist'
              : activeCategoryObj
              ? activeCategoryObj.name
              : 'Explore All Aquatic Collections'}
          </h1>
          <p className="text-sm text-gray-300">
            {activeTab === 'wishlist'
              ? 'Keep track of rare fish and aquascaping products you want to add to your tank.'
              : activeCategoryObj
              ? activeCategoryObj.description
              : 'Discover pristine captive-bred fish, living coral colonies, ultra-clear low-iron aquariums, and pro filtration.'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 mb-8 border-b border-cyan-500/20 pb-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'text-gray-400 hover:text-white bg-white/5'
          }`}
        >
          All Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'wishlist'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
              : 'text-gray-400 hover:text-white bg-white/5'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          Wishlist ({wishlist.length})
        </button>
      </div>

      {/* Main Grid with Sidebar Filters */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block w-72 rounded-2xl glass-panel border border-cyan-500/20 p-6 space-y-6 flex-shrink-0 sticky top-28">
          <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Filter className="w-4 h-4 text-cyan-400" />
              <span>Filters</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Search within page */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-gray-400">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-cyan-400/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by keyword..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-black/40 border border-cyan-500/30 text-white placeholder-gray-500 outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-gray-400">Category</label>
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              <button
                onClick={() => handleCategorySelect('all')}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                All Categories
              </button>
              {INITIAL_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors truncate ${
                    selectedCategory === cat.slug
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="font-mono uppercase text-gray-400">Max Price</label>
              <span className="font-mono font-bold text-cyan-400">
                ₹{maxPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={30000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Care Level */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-gray-400">Care Level</label>
            <div className="grid grid-cols-2 gap-1.5">
              {['all', 'Beginner', 'Intermediate', 'Expert'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedCareLevel(lvl)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs text-center border capitalize transition-colors ${
                    selectedCareLevel === lvl
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 font-semibold'
                      : 'border-cyan-500/15 text-gray-400 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Live Species Toggle */}
          <div className="pt-2 border-t border-cyan-500/20">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-gray-300">
              <input
                type="checkbox"
                checked={onlyLiveStock}
                onChange={(e) => setOnlyLiveStock(e.target.checked)}
                className="w-4 h-4 rounded border-cyan-500/40 accent-cyan-400"
              />
              <span className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                Live Animals Only
              </span>
            </label>
          </div>
        </aside>

        {/* Products Results Column */}
        <div className="flex-1 w-full space-y-6">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel border border-cyan-500/20 p-4 rounded-2xl">
            <p className="text-xs text-gray-300">
              Showing <strong className="text-cyan-300">{filteredProducts.length}</strong> items
              {selectedCategory !== 'all' && (
                <span> in &ldquo;{selectedCategory.replace(/-/g, ' ')}&rdquo;</span>
              )}
            </p>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className="lg:hidden px-3.5 py-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-2"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
              </button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-black/60 border border-cyan-500/30 text-white text-xs outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name-asc">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="h-96 rounded-2xl glass-panel animate-pulse" />
                ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 rounded-2xl glass-panel border border-cyan-500/20 p-8">
              <span className="text-4xl block mb-3">🌊</span>
              <h3 className="text-lg font-bold text-white mb-1">
                No matching species or equipment found
              </h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6">
                Try widening your price range, clearing your keyword search, or exploring all aquatic categories.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 text-black font-semibold text-xs hover:brightness-110 shadow-lg shadow-cyan-500/20"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setIsFilterDrawerOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 right-0 max-w-xs w-full glass-panel border-l border-cyan-500/30 p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
              <h3 className="text-sm font-bold text-white">Filters</h3>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category selection */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-gray-400">Category</label>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    handleCategorySelect('all');
                    setIsFilterDrawerOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs ${
                    selectedCategory === 'all' ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400'
                  }`}
                >
                  All Categories
                </button>
                {INITIAL_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      handleCategorySelect(cat.slug);
                      setIsFilterDrawerOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs truncate ${
                      selectedCategory === cat.slug
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'text-gray-400'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                resetFilters();
                setIsFilterDrawerOpen(false);
              }}
              className="w-full py-2.5 rounded-xl border border-cyan-500/30 text-cyan-300 text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-cyan-400">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
