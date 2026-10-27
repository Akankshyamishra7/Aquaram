'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Sparkles,
  Waves,
  Shield,
  Droplets,
  Thermometer,
  Clock,
  Compass,
  Star,
  ChevronRight,
  CheckCircle,
  Truck,
  Heart,
  Award,
  Zap,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { Product } from '@/types';
import { INITIAL_CATEGORIES } from '@/data/seedProducts';
import ProductCard from '@/components/product/ProductCard';
import BiotopeExplorer from '@/components/home/BiotopeExplorer';

// Lazy load 3D Jellyfish Scene
const JellyfishHeroScene = dynamic(
  () => import('@/components/3d/JellyfishHeroScene'),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[#01060e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase">
            Submerging into 3D Ocean...
          </span>
        </div>
      </div>
    ),
  }
);

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Live Flash Deal Countdown Clock
  const [timeLeft, setTimeLeft] = useState({ hours: 16, minutes: 44, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) {
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const specialDeals = products
    .filter((p) => p.isSpecialDeal || (p.discountPercentage && p.discountPercentage >= 18))
    .slice(0, 4);
  const aquariumsAndGear = products
    .filter(
      (p) =>
        p.category === 'aquariums-and-fish-tanks' ||
        p.category === 'aquarium-filters-and-pumps' ||
        p.category === 'aquarium-lighting'
    )
    .slice(0, 3);
  const plantsAndCoral = products
    .filter(
      (p) =>
        p.category === 'aquatic-plants' ||
        p.category === 'coral-and-aquarium-rocks'
    )
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-[#01060e] text-white selection:bg-cyan-400 selection:text-black water-caustics-bg">
      {/* ======================================================== */}
      {/* 1. CINEMATIC 3D JELLYFISH HERO SECTION                  */}
      {/* ======================================================== */}
      <section className="relative w-full min-h-[640px] sm:min-h-[720px] lg:h-screen lg:min-h-[760px] flex items-center justify-center overflow-hidden pt-24 pb-16 lg:py-0">
        {/* Real-time 3D Three.js Jellyfish WebGL Canvas */}
        <div className="absolute inset-0 z-0">
          <JellyfishHeroScene />
        </div>

        {/* Ambient Oceanic Glows */}
        <div className="absolute top-1/4 left-8 w-[450px] h-[450px] bg-cyan-500/12 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-16 right-8 w-[400px] h-[400px] bg-teal-500/12 rounded-full blur-[150px] pointer-events-none" />

        {/* Floating Bubble Micro-Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-12 left-[12%] w-3.5 h-3.5 rounded-full bg-cyan-300/35 blur-[1px] animate-[bubbleRise_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-24 left-[28%] w-2 h-2 rounded-full bg-cyan-300/25 blur-[1px] animate-[bubbleRise_11s_ease-in-out_2s_infinite]" />
          <div className="absolute bottom-6 left-[68%] w-4 h-4 rounded-full bg-cyan-300/35 blur-[1px] animate-[bubbleRise_9s_ease-in-out_1s_infinite]" />
          <div className="absolute bottom-20 left-[85%] w-2.5 h-2.5 rounded-full bg-teal-300/30 blur-[1px] animate-[bubbleRise_10s_ease-in-out_3s_infinite]" />
        </div>

        {/* Hero Overlay Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16">
          <div className="max-w-3xl space-y-7">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel-glow border border-cyan-400/40 text-cyan-200 text-xs font-mono uppercase tracking-widest shadow-2xl">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Bioluminescent Living Ecosystems</span>
            </div>

            {/* Headline - "Explore the Ocean at Home" */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[1.08] sm:leading-[1.04] text-white">
              Explore the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-400 text-glow-aqua">
                Ocean
              </span>{' '}
              at Home
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg lg:text-xl text-gray-300/95 leading-relaxed font-light max-w-2xl">
              India&apos;s premier sanctuary for captive-bred exotic marine species, champion Bettas, Japanese ultra-clear rimless aquariums, and turnkey coral reef ecosystems.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
              <Link
                href="/shop"
                className="px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-black font-extrabold text-sm tracking-wide hover:brightness-110 shadow-2xl shadow-cyan-500/40 transition-all flex items-center justify-center gap-2.5 group text-center"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>

              <Link
                href="/shop?category=aquariums-and-fish-tanks"
                className="px-7 py-3.5 sm:py-4 rounded-2xl glass-panel border border-cyan-400/40 text-cyan-200 font-bold text-sm hover:bg-cyan-950/70 hover:border-cyan-400 transition-all flex items-center justify-center gap-2.5 text-center"
              >
                <Waves className="w-4 h-4 text-cyan-400" />
                Living Reef Tanks
              </Link>
            </div>

            {/* Trust Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 sm:gap-6 pt-6 sm:pt-8 border-t border-cyan-500/20 max-w-xl">
              <div>
                <p className="text-xl sm:text-3xl font-mono font-extrabold text-cyan-300">100%</p>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 leading-snug">Live Arrival Guarantee</p>
              </div>
              <div>
                <p className="text-xl sm:text-3xl font-mono font-extrabold text-teal-300">500+</p>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 leading-snug">Rare Species Curated</p>
              </div>
              <div>
                <p className="text-xl sm:text-3xl font-mono font-extrabold text-emerald-300">₹0</p>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 leading-snug">Free Transit over ₹2,999</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cyan-400/70 text-xs font-mono uppercase tracking-widest pointer-events-none">
          <span>Scroll to Submerge</span>
          <div className="w-5 h-9 rounded-full border-2 border-cyan-400/40 flex items-start justify-center p-1">
            <div className="w-1.5 h-2.5 rounded-full bg-cyan-400 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. LIVE ANNOUNCEMENT TICKER                             */}
      {/* ======================================================== */}
      <div className="border-y border-cyan-500/20 bg-black/40 backdrop-blur-md py-3.5 sm:py-4 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center lg:justify-between gap-3 sm:gap-4 text-xs font-mono text-cyan-300">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Double-Bagged Pure Oxygen Packing</span>
          </div>
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-cyan-400" />
            <span>Thermal Heating & Cold Pack Climate Control</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-cyan-400" />
            <span>Priority Air Express Across All Major Indian Airports</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>100% Captive-Bred & Sustainable Quarantine</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. FEATURED CATEGORIES                                  */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-24 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-2">
              <Compass className="w-4 h-4" />
              <span>Biological Collections</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Curated Aquatic Categories
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-2 max-w-xl">
              From majestic freshwater Discus to vibrant saltwater reef colonies and high-tech Japanese planted nature aquariums.
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 mt-4 md:mt-0 transition-colors"
          >
            Explore All 16 Categories
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {INITIAL_CATEGORIES.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden glass-panel border border-cyan-500/20 aspect-[4/5] flex flex-col justify-end p-3.5 sm:p-5 md:p-6 transition-all duration-500 hover:border-cyan-400/70 hover:shadow-2xl hover:shadow-cyan-950/80 hover:-translate-y-1.5"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-112 opacity-65 group-hover:opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#010814] via-[#010814]/60 to-transparent" />

              <div className="relative z-10 space-y-1">
                <span className="text-[10px] sm:text-[11px] font-mono text-cyan-400 font-semibold block">
                  {cat.itemCount} Products
                </span>
                <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors leading-tight">
                  {cat.name}
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-400 line-clamp-1 font-light hidden sm:block">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. BEST-SELLING LIVE FISH & CORALS                       */}
      {/* ======================================================== */}
      <section className="py-20 relative bg-gradient-to-b from-[#01060e] via-[#021120] to-[#01060e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-2">
                <Star className="w-4 h-4 fill-current text-cyan-400" />
                <span>Aquarist Favorites</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                Best-Selling Live Aquatic Species
              </h2>
              <p className="text-sm text-gray-400 mt-2 max-w-xl">
                Conditioned on premium marine diets, parasite-quarantined for 30 days, and guaranteed to arrive active and vibrant.
              </p>
            </div>
            <Link
              href="/shop?category=freshwater-fish"
              className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 mt-4 md:mt-0"
            >
              Browse All Live Stock
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="h-96 rounded-3xl glass-panel animate-pulse" />
                ))
            ) : (
              bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. INTERACTIVE LIVING BIOTOPE EXPLORER                   */}
      {/* ======================================================== */}
      <BiotopeExplorer />

      {/* ======================================================== */}
      {/* 6. FLASH DEALS WITH COUNTDOWN CLOCK                      */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-20 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl sm:rounded-3xl glass-panel-glow border border-cyan-400/40 p-5 sm:p-8 lg:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-rose-500/15 rounded-full blur-[120px] pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8 mb-8 sm:mb-10 pb-6 sm:pb-8 border-b border-cyan-500/20">
            <div>
              <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] sm:text-xs font-mono uppercase tracking-wider font-semibold">
                ⚡ Limited Deep-Sea Offer
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white mt-3">
                Weekend Flash Sales & Livestock Specials
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl font-light">
                Save up to 25% on exotic show bettas, rare Bucephalandra clumps, and complete aquascaping start packs.
              </p>
            </div>

            {/* Countdown Box */}
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-rose-400 hidden sm:block" />
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-black/70 border border-cyan-500/40 font-mono text-center">
                  <span className="text-xl sm:text-2xl font-bold text-cyan-300">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="block text-[9px] sm:text-[10px] text-gray-400">HOURS</span>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-cyan-400">:</span>
                <div className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-black/70 border border-cyan-500/40 font-mono text-center">
                  <span className="text-xl sm:text-2xl font-bold text-cyan-300">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="block text-[9px] sm:text-[10px] text-gray-400">MINS</span>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-cyan-400">:</span>
                <div className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-black/70 border border-cyan-500/40 font-mono text-center">
                  <span className="text-xl sm:text-2xl font-bold text-rose-400">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="block text-[9px] sm:text-[10px] text-gray-400">SECS</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialDeals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. ARCHITECTURAL AQUARIUMS & GEAR SHOWCASE               */}
      {/* ======================================================== */}
      <section className="py-20 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-2">
              <Shield className="w-4 h-4" />
              <span>Architectural Glass & Machinery</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Low-Iron Rimless Aquariums & High-Tech Filters
            </h2>
            <p className="text-sm text-gray-400 mt-2 max-w-xl">
              Engineered with 99.2% clarity diamond-polished float glass and German thermo canister filtration.
            </p>
          </div>
          <Link
            href="/shop?category=aquariums-and-fish-tanks"
            className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 mt-4 md:mt-0"
          >
            View Hardware Collection
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {aquariumsAndGear.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. AQUATIC PLANTS & HARDSCAPE STONES                     */}
      {/* ======================================================== */}
      <section className="py-20 relative bg-[#010710]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-widest mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Botanicals & Hardscape</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                Live Plants, Corals & Ancient Stones
              </h2>
              <p className="text-sm text-gray-400 mt-2 max-w-xl">
                Sterile tissue culture plants, inert Dragon stones, and aquaculture coral frags.
              </p>
            </div>
            <Link
              href="/shop?category=aquatic-plants"
              className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 mt-4 md:mt-0"
            >
              Explore Plants & Coral
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plantsAndCoral.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. WATER PARAMETERS & CARE INSTRUCTIONS                  */}
      {/* ======================================================== */}
      <section className="py-24 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            Aquarist Masterclass
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Water Parameters & Biological Equilibrium
          </h2>
          <p className="text-sm text-gray-400 font-light">
            Maintaining stable water chemistry is the single most vital factor for living aquatic ecosystems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl glass-panel border border-cyan-500/20 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Thermometer className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Thermal Calibration</h3>
            <p className="text-sm text-gray-400 leading-relaxed font-light">
              Tropical species require steady temperatures between 24°C - 28°C (Discus at 28°C - 30°C). Always calibrate heaters with dual digital probes to prevent temperature swings.
            </p>
            <ul className="text-xs text-gray-300 space-y-2 pt-3 border-t border-cyan-500/15">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" /> Float transport bags for 20 minutes before opening
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" /> Never introduce shipping water into the main display
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl glass-panel border border-teal-500/20 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Nitrification & Cycling</h3>
            <p className="text-sm text-gray-400 leading-relaxed font-light">
              Beneficial nitrifying bacteria convert lethal Ammonia (NH3) into Nitrite (NO2), and finally harmless Nitrate (NO3). Ensure your tank registers 0 ppm Ammonia before introducing fish.
            </p>
            <ul className="text-xs text-gray-300 space-y-2 pt-3 border-t border-teal-500/15">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0" /> Perform 20% weekly partial water changes with RO water
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0" /> Seed filters with live aerobic nitrifying culture
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl glass-panel border border-emerald-500/20 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Drip Acclimation</h3>
            <p className="text-sm text-gray-400 leading-relaxed font-light">
              Sensitive Caridina shrimp and marine invertebrates require gradual siphon-drip acclimation over 60–90 minutes to adjust osmotic pressure and KH levels safely.
            </p>
            <ul className="text-xs text-gray-300 space-y-2 pt-3 border-t border-emerald-500/15">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> 2 to 3 drops per second flow rate
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Dim room and tank lighting during introduction
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 10. VERIFIED CUSTOMER REVIEWS                           */}
      {/* ======================================================== */}
      <section className="py-24 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-cyan-500/15">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            Collector Community
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Trusted by Aquarists Across India
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Dr. Vikramaditya Sen',
              city: 'Bengaluru',
              review:
                'Received my pair of Mocha Storm Clownfish in perfect health! The insulated thermal box with oxygen supply kept the water at exactly 25°C even after express air transit.',
              rating: 5,
              product: 'Designer Mocha Storm Clownfish Pair',
            },
            {
              name: 'Ananya Deshmukh',
              city: 'Mumbai',
              review:
                'The CrystalView 90P aquarium is pure art. Zero green tint, seamless silicone joints, and looks spectacular in my living room. Worth every single rupee.',
              rating: 5,
              product: 'Aquaram CrystalView 90P',
            },
            {
              name: 'Karthik Ramanathan',
              city: 'Chennai',
              review:
                'Best online live-fish experience in India. The Royal Blue Cobalt Discus started eating Hikari pellets within 3 hours of acclimation. Outstanding quality!',
              rating: 5,
              product: 'Royal Blue Cobalt Discus',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl glass-panel border border-cyan-500/20 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array(item.rating)
                    .fill(0)
                    .map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                </div>
                <p className="text-sm text-gray-300 italic leading-relaxed font-light">
                  &ldquo;{item.review}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-cyan-500/15">
                <p className="text-sm font-bold text-white">{item.name}</p>
                <p className="text-xs text-cyan-400">{item.city} • Verified Collector</p>
                <p className="text-[11px] text-gray-500 mt-1 truncate">
                  Acquired: {item.product}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
