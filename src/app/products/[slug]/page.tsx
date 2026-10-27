'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Star,
  ShieldCheck,
  Truck,
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  Droplets,
  Thermometer,
  Compass,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/product/ProductCard';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
          setSelectedImage(data.product.images[0]);

          // Fetch related
          const relRes = await fetch(`/api/products?category=${data.product.category}`);
          const relData = await relRes.json();
          if (relData.success) {
            setRelatedProducts(
              relData.products.filter((p: Product) => p.id !== data.product.id).slice(0, 4)
            );
          }
        }
      } catch (e) {
        console.error('Error loading product details:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-cyan-400">Loading species data...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-20 max-w-7xl mx-auto px-4 text-center">
        <div className="p-12 rounded-3xl glass-panel border border-cyan-500/20 max-w-lg mx-auto space-y-4">
          <span className="text-4xl">🐟</span>
          <h2 className="text-2xl font-bold text-white">Product Not Found</h2>
          <p className="text-sm text-gray-400">
            The requested aquatic species or equipment does not exist in our catalog.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 rounded-xl bg-cyan-500 text-black font-semibold text-xs"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Aquarium Collection
        </Link>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
        {/* Left: Gallery */}
        <div className="space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden glass-panel border border-cyan-500/30 bg-[#01080e] shadow-2xl">
            <Image
              src={selectedImage || product.images[0]}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
            {product.discountPercentage && product.discountPercentage > 0 ? (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-rose-500 text-white font-mono text-xs font-bold shadow-lg">
                {product.discountPercentage}% OFF
              </span>
            ) : null}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden glass-panel border transition-all ${
                    selectedImage === img
                      ? 'border-cyan-400 shadow-md shadow-cyan-500/30 scale-105'
                      : 'border-cyan-500/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info, Price, Actions */}
        <div className="space-y-6">
          <div>
            {/* Category badge */}
            <span className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider">
              {product.category.replace(/-/g, ' ')}
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
              {product.name}
            </h1>

            {product.scientificName && (
              <p className="text-sm text-cyan-400 italic mt-1 font-mono">
                {product.scientificName}
              </p>
            )}

            {/* Ratings */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1 text-amber-400">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-600'
                      }`}
                    />
                  ))}
              </div>
              <span className="text-xs text-gray-300 font-mono">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
              <span className="text-gray-600">|</span>
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Live Stock
              </span>
            </div>
          </div>

          {/* Price Block */}
          <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-mono font-bold text-cyan-300">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg font-mono text-gray-500 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">
              Tax included. Express air-cargo insulated shipping calculated at checkout.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 font-semibold">
                {product.stock > 0
                  ? `In Stock (${product.stock} units available)`
                  : 'Currently Out of Stock'}
              </span>
            </div>
          </div>

          {/* Short Description */}
          <p className="text-sm text-gray-300 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-4 border-t border-cyan-500/20">
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono uppercase text-gray-400">Quantity</span>
              <div className="flex items-center rounded-xl border border-cyan-500/30 bg-black/40">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-gray-300 hover:text-white"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-mono font-bold text-cyan-200">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="p-2 text-gray-300 hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => toggleWishlist(product)}
                aria-label="Wishlist"
                className={`p-2.5 rounded-xl border transition-all ${
                  isFavorited
                    ? 'border-rose-500 bg-rose-500/20 text-rose-400'
                    : 'border-cyan-500/30 text-gray-400 hover:text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => addToCart(product, quantity)}
                disabled={!product.inStock}
                className="flex-1 py-3.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-black font-bold text-sm tracking-wide hover:brightness-110 shadow-lg shadow-cyan-500/30 transition-all disabled:opacity-40"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="p-4 rounded-xl glass-panel border border-cyan-500/20 space-y-2 text-xs text-gray-300">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Live Arrival Guarantee (L.A.G.)</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Every live specimen is packed inside double-layered heavy poly bags with medical-grade oxygen, activated charcoal, and thermal temperature heat/ice packs.
            </p>
          </div>
        </div>
      </div>

      {/* Water Parameters & Care Instructions (For Live Stock) */}
      {product.waterParameters && (
        <div className="mb-20 p-8 rounded-3xl glass-panel border border-cyan-500/20 space-y-6">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest">
            <Droplets className="w-4 h-4" />
            <span>Optimal Water Parameters</span>
          </div>
          <h3 className="text-2xl font-bold text-white">Habitat & Environmental Requirements</h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-black/40 border border-cyan-500/20 space-y-1">
              <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-cyan-400" /> Temperature
              </span>
              <p className="text-base font-bold text-white font-mono">
                {product.waterParameters.temperature || '24°C - 28°C'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-cyan-500/20 space-y-1">
              <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" /> pH Level
              </span>
              <p className="text-base font-bold text-white font-mono">
                {product.waterParameters.ph || '6.5 - 7.5'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-cyan-500/20 space-y-1">
              <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-cyan-400" /> Water Hardness
              </span>
              <p className="text-base font-bold text-white font-mono">
                {product.waterParameters.hardness || '4 - 10 dGH'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-cyan-500/20 space-y-1">
              <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-cyan-400" /> Min. Tank Size
              </span>
              <p className="text-base font-bold text-white font-mono">
                {product.waterParameters.minTankSize || '50 Litres'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400" />
            <p className="leading-relaxed">
              <strong>Acclimation Protocol:</strong> Float the sealed oxygen bag in your tank for 20 minutes to equalize temperature. Next, slowly introduce aquarium water in 10-minute intervals over an hour before gently netting the fish into the tank. Never pour shipping water into your aquarium.
            </p>
          </div>
        </div>
      )}

      {/* Specifications Table (For Gear & Aquariums) */}
      {product.specifications && (
        <div className="mb-20 p-8 rounded-3xl glass-panel border border-cyan-500/20 space-y-4">
          <h3 className="text-xl font-bold text-white">Technical Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div
                key={key}
                className="flex justify-between p-3 rounded-lg bg-black/30 border border-cyan-500/10 text-xs"
              >
                <span className="text-gray-400">{key}</span>
                <span className="text-white font-medium">{String(val)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Related Aquatic Species & Equipment</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
