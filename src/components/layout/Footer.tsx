'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  HeartHandshake,
  Award,
  Send,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
} from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  return (
    <footer className="relative bg-[#01060b] border-t border-cyan-500/20 text-gray-300 pt-16 pb-8 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-cyan-500/5 blur-[120px] pointer-events-none" />

      {/* Trust Badges Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-2xl glass-panel border border-cyan-500/20 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-sm font-semibold text-white">100% Live Arrival Guarantee</h5>
              <p className="text-xs text-gray-400">Insulated thermal box & pure oxygen packing</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-sm font-semibold text-white">Pan-India Express Transit</h5>
              <p className="text-xs text-gray-400">Free delivery on orders above ₹2,999</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-sm font-semibold text-white">Expert Aquarist Support</h5>
              <p className="text-xs text-gray-400">Personalized water testing & care consultation</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-sm font-semibold text-white">Ethically Sourced Species</h5>
              <p className="text-xs text-gray-400">Captive-bred fish & aquaculture coral frags</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-cyan-500/15">
        {/* Brand column */}
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-teal-300 flex items-center justify-center text-lg">
              🪼
            </div>
            <span className="text-xl font-bold tracking-wider text-white font-mono">
              AQUARAM
            </span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
            India&apos;s premier destination for high-end biotope aquariums, rare captive-bred marine and freshwater species, Japanese aquascaping layouts, and living coral reefs.
          </p>

          <div className="space-y-2 text-xs text-gray-400 pt-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Flagship Galleries: Mumbai (Bandra) | Bengaluru (Indiranagar)</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>Aquarium Concierge: +91 (022) 8492-7100</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>care@aquaram.in</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-mono text-cyan-400">
            Navigation
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/shop" className="hover:text-cyan-300 transition-colors">
                Full Collection
              </Link>
            </li>
            <li>
              <Link href="/shop?category=freshwater-fish" className="hover:text-cyan-300 transition-colors">
                Freshwater Species
              </Link>
            </li>
            <li>
              <Link href="/shop?category=marine-fish" className="hover:text-cyan-300 transition-colors">
                Saltwater Reef Fish
              </Link>
            </li>
            <li>
              <Link href="/shop?category=aquariums-and-fish-tanks" className="hover:text-cyan-300 transition-colors">
                Low-Iron Aquariums
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                Admin Console
              </Link>
            </li>
            <li>
              <Link href="/orders" className="hover:text-cyan-300 transition-colors">
                Order Tracking
              </Link>
            </li>
          </ul>
        </div>

        {/* Aquatic Care & Categories */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-mono text-cyan-400">
            Specialties
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/shop?category=betta-fish" className="hover:text-cyan-300 transition-colors">
                Exotic Show Bettas
              </Link>
            </li>
            <li>
              <Link href="/shop?category=aquatic-plants" className="hover:text-cyan-300 transition-colors">
                Tissue Culture Plants
              </Link>
            </li>
            <li>
              <Link href="/shop?category=coral-and-aquarium-rocks" className="hover:text-cyan-300 transition-colors">
                Dragon & Seiryu Stone
              </Link>
            </li>
            <li>
              <Link href="/shop?category=aquarium-filters-and-pumps" className="hover:text-cyan-300 transition-colors">
                Thermo Canister Filters
              </Link>
            </li>
            <li>
              <Link href="/shop?category=aquarium-lighting" className="hover:text-cyan-300 transition-colors">
                WRGB Smart Lights
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-mono text-cyan-400">
            Aquarist Club
          </h4>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">
            Join 12,000+ passionate hobbyists. Receive weekly livestock arrivals and an instant 10% discount coupon.
          </p>

          {subscribed ? (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Welcome! Use code <strong>AQUA10</strong> at checkout for 10% off.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-cyan-500/30 text-white placeholder-gray-500 text-xs outline-none focus:border-cyan-400"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-black font-semibold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                Get 10% Off Coupon
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Copyright & Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>© 2026 Aquaram Luxury Aquatics Ltd. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <span className="text-cyan-400/70 font-mono">Prices shown in ₹ INR</span>
          <span className="text-gray-600">|</span>
          <span>Responsible Live-Animal Transit Certified</span>
        </div>
      </div>
    </footer>
  );
}
