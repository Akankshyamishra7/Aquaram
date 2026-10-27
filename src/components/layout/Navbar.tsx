'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  Menu,
  X,
  Shield,
  Heart,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import SearchModal from '../ui/SearchModal';
import CartDrawer from '../cart/CartDrawer';

export interface NavLinkItem {
  label: string;
  href: string;
  category: string | string[] | null;
}

export const NAV_LINKS: NavLinkItem[] = [
  { label: 'Home', href: '/', category: null },
  { label: 'All Products', href: '/shop', category: null },
  {
    label: 'Live Fish',
    href: '/shop?category=freshwater-fish',
    category: ['freshwater-fish', 'marine-fish', 'betta-fish'],
  },
  {
    label: 'Aquariums',
    href: '/shop?category=aquariums-and-fish-tanks',
    category: 'aquariums-and-fish-tanks',
  },
  {
    label: 'Aquatic Plants',
    href: '/shop?category=aquatic-plants',
    category: 'aquatic-plants',
  },
  {
    label: 'Coral & Rocks',
    href: '/shop?category=coral-and-aquarium-rocks',
    category: 'coral-and-aquarium-rocks',
  },
  {
    label: 'Equipment',
    href: '/shop?category=aquarium-filters-and-pumps',
    category: ['aquarium-filters-and-pumps', 'aquarium-lighting'],
  },
];

const ACTIVE_TAB_STYLE =
  'text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 shadow-sm shadow-cyan-500/20';
const INACTIVE_DESKTOP_STYLE =
  'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent';
const INACTIVE_MOBILE_STYLE =
  'text-gray-200 hover:bg-cyan-950/60 hover:text-cyan-300 border border-transparent';

function checkIsActive(
  link: NavLinkItem,
  pathname: string,
  currentCategory: string | null
): boolean {
  if (link.href === '/') {
    return pathname === '/';
  }
  if (pathname.startsWith('/shop')) {
    if (!link.category) {
      // "All Products" is active only when on /shop and no specific category is selected
      return !currentCategory || currentCategory === 'all';
    }
    if (Array.isArray(link.category)) {
      return link.category.includes(currentCategory || '');
    }
    return currentCategory === link.category;
  }
  return false;
}

function NavCategoryLinks({
  isMobile = false,
  onItemClick,
}: {
  isMobile?: boolean;
  onItemClick?: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  if (isMobile) {
    return (
      <div className="space-y-1">
        {NAV_LINKS.map((link) => {
          const isActive = checkIsActive(link, pathname, currentCategory);
          return (
            <Link
              key={link.label}
              href={link.href}
              onClick={onItemClick}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive ? ACTIVE_TAB_STYLE : INACTIVE_MOBILE_STYLE
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
      {NAV_LINKS.map((link) => {
        const isActive = checkIsActive(link, pathname, currentCategory);
        return (
          <Link
            key={link.label}
            href={link.href}
            onClick={onItemClick}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive ? ACTIVE_TAB_STYLE : INACTIVE_DESKTOP_STYLE
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

function NavCategoryLinksFallback({
  isMobile = false,
  onItemClick,
}: {
  isMobile?: boolean;
  onItemClick?: () => void;
}) {
  const pathname = usePathname();

  if (isMobile) {
    return (
      <div className="space-y-1">
        {NAV_LINKS.map((link) => {
          const isActive =
            link.href === '/'
              ? pathname === '/'
              : link.href === '/shop'
              ? pathname === '/shop'
              : false;
          return (
            <Link
              key={link.label}
              href={link.href}
              onClick={onItemClick}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive ? ACTIVE_TAB_STYLE : INACTIVE_MOBILE_STYLE
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
      {NAV_LINKS.map((link) => {
        const isActive =
          link.href === '/'
            ? pathname === '/'
            : link.href === '/shop'
            ? pathname === '/shop'
            : false;
        return (
          <Link
            key={link.label}
            href={link.href}
            onClick={onItemClick}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive ? ACTIVE_TAB_STYLE : INACTIVE_DESKTOP_STYLE
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin, toggleRole } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav py-3 shadow-lg shadow-black/40'
            : 'bg-gradient-to-b from-[#020b14]/90 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform duration-300">
                <span className="text-xl">🪼</span>
                <span className="absolute inset-0 rounded-full border border-cyan-300/60 animate-ping opacity-25" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-wider text-white font-mono flex items-center gap-1">
                  AQUARAM
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block animate-pulse" />
                </span>
                <span className="text-[10px] uppercase tracking-widest text-cyan-300/80 -mt-1 font-semibold">
                  Luxury Aquatics & Reef
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Category Tabs */}
            <Suspense fallback={<NavCategoryLinksFallback />}>
              <NavCategoryLinks />
            </Suspense>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search aquarium products"
                className="p-2 rounded-lg text-gray-300 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                href="/shop?tab=wishlist"
                aria-label="View wishlist"
                className="relative p-2 rounded-lg text-gray-300 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors hidden sm:flex items-center"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* User Account / Role Switcher */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-label="User profile and role menu"
                  className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium border border-cyan-500/20 bg-cyan-950/30 text-cyan-200 hover:border-cyan-400/40 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-cyan-400" />
                  <span className="hidden md:inline">
                    {isAdmin ? 'Admin Mode' : 'Customer'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-cyan-400/70" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-64 rounded-xl glass-panel p-3 border border-cyan-500/30 shadow-2xl z-50 text-xs animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="pb-2 mb-2 border-b border-cyan-500/20">
                      <p className="font-semibold text-white">{user?.name}</p>
                      <p className="text-gray-400 text-[11px] truncate">{user?.email}</p>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-full bg-cyan-500/10 text-cyan-300 font-mono text-[10px] border border-cyan-500/30">
                        {isAdmin ? '🛡️ Administrator' : '👤 Customer'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-gray-200 hover:bg-cyan-500/20 hover:text-cyan-200 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-cyan-400" />
                        Admin Dashboard
                      </Link>

                      <Link
                        href="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-gray-200 hover:bg-cyan-500/20 hover:text-cyan-200 transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4 text-emerald-400" />
                        Order History
                      </Link>

                      <button
                        onClick={() => {
                          toggleRole();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-cyan-300 hover:bg-cyan-500/20 transition-colors font-medium border border-cyan-500/20 mt-1"
                      >
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          Switch to {isAdmin ? 'Customer' : 'Admin'} Mode
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Shopping Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label="Shopping Cart"
                className="relative p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-400/40 text-cyan-200 hover:text-white hover:border-cyan-400 transition-all shadow-md shadow-cyan-950"
              >
                <ShoppingBag className="w-5 h-5 text-cyan-300" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-gradient-to-r from-cyan-400 to-teal-300 text-black text-xs font-bold flex items-center justify-center shadow-lg shadow-cyan-500/40">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
                className="p-2 rounded-lg text-gray-300 hover:text-cyan-300 hover:bg-white/5 lg:hidden"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass-panel border-t border-cyan-500/20 px-4 pt-3 pb-6 mt-3 space-y-2 animate-in slide-in-from-top-4">
            <Suspense
              fallback={
                <NavCategoryLinksFallback
                  isMobile
                  onItemClick={() => setMobileMenuOpen(false)}
                />
              }
            >
              <NavCategoryLinks
                isMobile
                onItemClick={() => setMobileMenuOpen(false)}
              />
            </Suspense>

            <div className="pt-2 border-t border-cyan-500/20 flex gap-2">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 text-center rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-xs font-semibold text-cyan-300"
              >
                Admin Panel
              </Link>
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 text-center rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-xs font-semibold text-cyan-300"
              >
                My Orders
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Interactive Modals */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer />
    </>
  );
}
