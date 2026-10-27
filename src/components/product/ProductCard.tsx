'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, Star, Droplets, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);

  return (
    <div className="group relative rounded-3xl glass-panel border border-cyan-500/20 overflow-hidden flex flex-col justify-between transition-all duration-500 hover:border-cyan-400/60 hover:shadow-2xl hover:shadow-cyan-950/80 hover:-translate-y-1.5">
      {/* Product Image Area */}
      <div className="relative w-full aspect-square bg-[#010814] overflow-hidden">
        <Link href={`/products/${product.slug}`} className="relative block w-full h-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#010a14] via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity" />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.discountPercentage && product.discountPercentage > 0 ? (
            <span className="px-2.5 py-1 rounded-full bg-rose-500/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg shadow-rose-950">
              {product.discountPercentage}% OFF
            </span>
          ) : null}

          {product.isLiveStock && (
            <span className="px-2.5 py-1 rounded-full bg-teal-500/80 text-black text-[10px] font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1 shadow-lg shadow-teal-950">
              <Droplets className="w-3 h-3 text-cyan-950 fill-cyan-950" />
              Live Species
            </span>
          )}

          {product.isBestSeller && (
            <span className="px-2.5 py-1 rounded-full bg-amber-400/90 text-black text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg shadow-amber-950">
              ★ Collector&apos;s Pick
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          aria-label="Add to Wishlist"
          className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-md transition-all ${
            isFavorited
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40'
              : 'bg-black/50 text-gray-300 hover:text-white hover:bg-black/75'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <Link
            href={`/products/${product.slug}`}
            className="w-full py-2.5 rounded-xl bg-black/85 hover:bg-cyan-950/90 text-cyan-300 text-xs font-semibold backdrop-blur-md border border-cyan-500/40 flex items-center justify-center gap-1.5 shadow-xl transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            View Specifications
          </Link>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category & Care Level */}
          <div className="flex items-center justify-between text-[11px] text-cyan-400/80 font-mono uppercase mb-1">
            <span className="truncate">{product.category.replace(/-/g, ' ')}</span>
            {product.careLevel && (
              <span className="text-gray-400 font-sans normal-case">
                Care: {product.careLevel}
              </span>
            )}
          </div>

          {/* Title */}
          <Link
            href={`/products/${product.slug}`}
            className="block text-base font-bold text-white hover:text-cyan-300 transition-colors line-clamp-1"
          >
            {product.name}
          </Link>

          {/* Scientific Name */}
          {product.scientificName && (
            <p className="text-xs text-gray-400 italic line-clamp-1 mt-0.5 font-serif">
              {product.scientificName}
            </p>
          )}

          {/* Ratings & Stock Availability */}
          <div className="flex items-center justify-between mt-2.5 text-xs">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold text-white text-[11px]">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-gray-400 text-[10px]">
                ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="text-[11px] font-medium">
              {product.stock > 0 ? (
                product.stock <= 5 ? (
                  <span className="text-amber-400 font-semibold">
                    Only {product.stock} left
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    In Stock
                  </span>
                )
              ) : (
                <span className="text-rose-400">Quarantine Reserve</span>
              )}
            </div>
          </div>
        </div>

        {/* Pricing and Cart Action */}
        <div className="pt-3.5 border-t border-cyan-500/15 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-mono font-bold text-cyan-300">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs font-mono text-gray-500 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-400 block -mt-0.5">
              Thermal Transit Ready
            </span>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={!product.inStock}
            aria-label={`Add ${product.name} to cart`}
            className="p-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-400 border border-cyan-400/40 text-cyan-300 hover:text-black transition-all shadow-md shadow-cyan-950 disabled:opacity-40 disabled:pointer-events-none group/btn"
          >
            <ShoppingBag className="w-4 h-4 group-hover/btn:scale-115 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
