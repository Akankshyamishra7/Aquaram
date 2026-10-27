'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setResults([]);
      return;
    }

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchTerm)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.products || []);
        }
      } catch {
        // Error handling
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl glass-panel border border-cyan-500/40 shadow-2xl p-6 text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-cyan-400" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search fish, coral frags, tanks, LED lights..."
              className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400 text-base font-medium"
            />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        {!searchTerm && (
          <div className="pt-4">
            <p className="text-xs uppercase tracking-wider text-cyan-400/80 font-semibold mb-2">
              Popular Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {['Discus', 'Clownfish', 'Rimless 90P', 'Betta', 'BioMaster', 'Chihiros WRGB'].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() => setSearchTerm(term)}
                    className="px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs text-cyan-200 hover:border-cyan-400 hover:bg-cyan-900/50 transition-colors"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-2 pr-1">
          {loading && (
            <div className="py-8 text-center text-gray-400 text-sm">
              <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Searching deep ocean catalog...
            </div>
          )}

          {!loading && searchTerm && results.length === 0 && (
            <div className="py-8 text-center text-gray-400 text-sm">
              No aquatic species or products found for &quot;{searchTerm}&quot;.
            </div>
          )}

          {!loading &&
            results.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-cyan-950/40 border border-transparent hover:border-cyan-500/30 transition-all group"
              >
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-black/40 flex-shrink-0">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-400 truncate">
                    {product.scientificName || product.category.replace(/-/g, ' ')}
                  </p>
                  <p className="text-xs font-mono font-bold text-cyan-400 mt-0.5">
                    ₹{product.price.toLocaleString('en-IN')}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
