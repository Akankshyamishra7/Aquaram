'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Waves, Sparkles, Thermometer, Droplets, ArrowRight, ShieldCheck } from 'lucide-react';

interface Biotope {
  id: string;
  name: string;
  subtitle: string;
  tagline: string;
  image: string;
  description: string;
  temperature: string;
  ph: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  keySpecies: string[];
  equipmentNeeded: string;
  categoryLink: string;
}

const BIOTOPES: Biotope[] = [
  {
    id: 'reef',
    name: 'South Pacific Living Coral Reef',
    subtitle: 'Saltwater Marine Biotope',
    tagline: 'Fluorescent LPS corals, bonded clownfish pairs & living reef rock',
    image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1200&q=80',
    description:
      'Recreate the radiant turquoise shallow reefs of the Indo-Pacific. Featuring pulsating soft corals, photosynthetic zoanthids, and active reef-safe grazing fish conditioned on marine copepods and vitamin seaweed.',
    temperature: '24°C - 26°C',
    ph: '8.1 - 8.4',
    difficulty: 'Intermediate',
    keySpecies: ['Mocha Storm Clownfish Pair', 'Pacific Blue Hippo Tang', 'Hammer Coral Frags'],
    equipmentNeeded: 'Surface Protein Skimmer, WRGB Reef Lighting & Wavemaker',
    categoryLink: '/shop?category=marine-fish',
  },
  {
    id: 'amazon',
    name: 'Rio Negro Amazonian Blackwater',
    subtitle: 'Tropical Freshwater Biotope',
    tagline: 'Regal Cobalt Discus, tannin-rich botanicals & soft warm water',
    image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=1200&q=80',
    description:
      'Inspired by the slow-moving tea-colored tributaries of the Rio Negro. Acidic, ultra-soft water shaded by floating botanicals and submerged roots where Discus display supreme metallic blue iridescence.',
    temperature: '28°C - 30°C',
    ph: '6.0 - 6.6',
    difficulty: 'Intermediate',
    keySpecies: ['Royal Blue Cobalt Discus', 'Wild Cardinal Tetras', 'Bristlenose Pleco'],
    equipmentNeeded: 'BioMaster Thermo 600 Canister & Indian Almond Leaves',
    categoryLink: '/shop?category=freshwater-fish',
  },
  {
    id: 'iwagumi',
    name: 'Japanese Iwagumi Zen Aquascape',
    subtitle: 'High-Tech Nature Aquarium',
    tagline: 'Ancient Dragon Stone, Monte Carlo carpet & pure red caridina shrimp',
    image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=1200&q=80',
    description:
      'Rooted in traditional Japanese zen rock placement (Oyaishi, Fukuishi, Soeishi). Features low-iron diamond-polished glass tanks with rolling green carpets and active crystal red bee shrimp grazing microscopic biofilms.',
    temperature: '22°C - 24°C',
    ph: '6.2 - 6.8',
    difficulty: 'Beginner',
    keySpecies: ['Pure Red Line Caridina Shrimp', 'Bucephalandra Clumps', 'Dragon Stone Formations'],
    equipmentNeeded: 'Aquaram CrystalView 90P Tank & Chihiros WRGB II Pro',
    categoryLink: '/shop?category=aquariums-and-fish-tanks',
  },
];

export default function BiotopeExplorer() {
  const [activeBiotope, setActiveBiotope] = useState<Biotope>(BIOTOPES[0]);

  return (
    <section className="py-24 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel border border-cyan-400/30 text-cyan-300 text-xs font-mono uppercase tracking-widest shadow-lg">
          <Waves className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive Underwater Habitats</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Curated Living Biotopes
        </h2>
        <p className="text-sm text-gray-400">
          Select an aquatic ecosystem to explore its water chemistry parameters, compatible species, and recommended filtration architecture.
        </p>
      </div>

      {/* Biotope Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        {BIOTOPES.map((b) => (
          <button
            key={b.id}
            onClick={() => setActiveBiotope(b)}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2.5 ${
              activeBiotope.id === b.id
                ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-black shadow-xl shadow-cyan-500/30 font-bold scale-102'
                : 'glass-panel text-gray-300 hover:text-white hover:border-cyan-400/40'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {b.name}
          </button>
        ))}
      </div>

      {/* Biotope Showcase Card */}
      <div className="rounded-3xl glass-panel-glow border border-cyan-500/30 overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl">
        {/* Left: Image with Parallax Vibe */}
        <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-[500px] overflow-hidden bg-black">
          <Image
            src={activeBiotope.image}
            alt={activeBiotope.name}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover transition-all duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#010814] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#020e1a]" />

          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-cyan-950/80 backdrop-blur-md border border-cyan-400/40 text-cyan-200 text-xs font-mono uppercase tracking-wider">
              {activeBiotope.subtitle}
            </span>
          </div>
        </div>

        {/* Right: Detailed Specifications */}
        <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6 bg-[#020e1a]/85 backdrop-blur-md">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold block mb-1">
                Natural Ecosystem Blueprint
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {activeBiotope.name}
              </h3>
              <p className="text-xs text-cyan-300 font-medium mt-1">
                {activeBiotope.tagline}
              </p>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed font-light">
              {activeBiotope.description}
            </p>

            {/* Dials / Parameters */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-black/40 border border-cyan-500/20 space-y-1">
                <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-cyan-400" /> Water Temp
                </span>
                <p className="text-base font-bold text-white font-mono">{activeBiotope.temperature}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-cyan-500/20 space-y-1">
                <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Acidity / pH
                </span>
                <p className="text-base font-bold text-white font-mono">{activeBiotope.ph}</p>
              </div>
            </div>

            {/* Recommended Species */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono text-gray-400 uppercase">Compatible Living Organisms</span>
              <div className="flex flex-wrap gap-1.5">
                {activeBiotope.keySpecies.map((sp) => (
                  <span
                    key={sp}
                    className="px-2.5 py-1 rounded-lg bg-cyan-950/50 border border-cyan-500/25 text-xs text-cyan-200"
                  >
                    ✓ {sp}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-400">
              <span className="block text-white font-semibold">Live Transit Guarantee</span>
              Oxygen double-pack included
            </div>

            <Link
              href={activeBiotope.categoryLink}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-bold text-xs hover:brightness-110 shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 group transition-all"
            >
              Shop This Biotope
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
