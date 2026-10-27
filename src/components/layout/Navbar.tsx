'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
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
  'text-cyan-300 bg-cyan-950/70 border border-cyan-400/50 shadow-sm shadow-cyan-500/20';
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
              className={`block px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
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
    <nav className="hidden xl:flex items-center gap-1">
      {NAV_LINKS.map((link) => {
        const isActive = checkIsActive(link, pathname, currentCategory);
        return (
          <Link
            key={link.label}
            href={link.href}
            onClick={onItemClick}
            className={`px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
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
              className={`block px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
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
    <nav className="hidden xl:flex items-center gap-1">
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
            className={`px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
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

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setUserDropdownOpen(false);
      }
    };

    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [userDropdownOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav py-2.5 sm:py-3 shadow-xl shadow-black/50'
            : 'bg-gradient-to-b from-[#020b14]/95 via-[#020b14]/80 to-transparent py-3 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform duration-300">
                <span className="text-lg sm:text-xl">🪼</span>
                <span className="absolute inset-0 rounded-full border border-cyan-300/60 animate-ping opacity-25" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold tracking-wider text-white font-mono flex items-center gap-1 leading-tight">
                  AQUARAM
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block animate-pulse" />
                </span>
                <span className="hidden sm:block text-[10px] uppercase tracking-widest text-cyan-300/80 -mt-0.5 font-semibold">
                  Luxury Aquatics & Reef
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Category Tabs (Visible on XL screens) */}
            <Suspense fallback={<NavCategoryLinksFallback />}>
              <NavCategoryLinks />
            </Suspense>

            {/* Right Action Icons */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search aquarium products"
                className="p-2 rounded-xl text-gray-300 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                href="/shop?tab=wishlist"
                aria-label="View wishlist"
                className="relative p-2 rounded-xl text-gray-300 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors hidden sm:flex items-center"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center shadow-md">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* User Account / Role Switcher with Fixed Admin Dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-label="User profile and role menu"
                  aria-expanded={userDropdownOpen}
                  className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                    userDropdownOpen
                      ? 'border-cyan-400 bg-cyan-950/90 text-cyan-200 shadow-md shadow-cyan-950/60'
                      : 'border-cyan-500/25 bg-cyan-950/40 text-cyan-200 hover:border-cyan-400/50 hover:bg-cyan-950/60'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
                  <span className="hidden md:inline font-mono">
                    {isAdmin ? 'Admin Mode' : 'Customer'}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400/80 transition-transform duration-200 shrink-0 ${
                      userDropdownOpen ? 'rotate-180 text-cyan-300' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu - Solid Background, High Z-Index, Proper Spacing */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2.5 w-72 sm:w-80 rounded-2xl bg-[#020d1c] border border-cyan-400/50 shadow-2xl shadow-black/95 p-4 z-[100] text-xs backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-cyan-500/20"
                  >
                    {/* Header info */}
                    <div className="pb-3 mb-3 border-b border-cyan-500/20 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-sm text-white truncate">
                          {user?.name || 'Akanksha (Aquaram Admin)'}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border tracking-wider uppercase shrink-0 ${
                            isAdmin
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-sm shadow-cyan-500/20'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                          }`}
                        >
                          {isAdmin ? '🛡️ Administrator' : '👤 Customer'}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs font-mono truncate select-all">
                        {user?.email || 'admin@aquaram.in'}
                      </p>
                    </div>

                    {/* Links */}
                    <div className="space-y-1">
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-200 hover:bg-cyan-500/15 hover:text-cyan-200 hover:border-cyan-500/30 border border-transparent transition-all group font-medium"
                      >
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform shrink-0">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block text-xs font-semibold text-white group-hover:text-cyan-200 truncate">
                            Admin Dashboard
                          </span>
                          <span className="block text-[10px] text-gray-400 truncate">
                            Inventory, Orders & CMS
                          </span>
                        </div>
                      </Link>

                      <Link
                        href="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-200 hover:bg-emerald-500/15 hover:text-emerald-200 hover:border-emerald-500/30 border border-transparent transition-all group font-medium"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block text-xs font-semibold text-white group-hover:text-emerald-200 truncate">
                            Order History
                          </span>
                          <span className="block text-[10px] text-gray-400 truncate">
                            Waybills & Shipments
                          </span>
                        </div>
                      </Link>

                      {/* Switch Mode Button */}
                      <div className="pt-2 mt-1 border-t border-cyan-500/15">
                        <button
                          onClick={() => {
                            toggleRole();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-100 border border-cyan-500/30 hover:border-cyan-400/60 transition-all font-semibold text-xs group"
                        >
                          <span className="flex items-center gap-2 truncate">
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform shrink-0" />
                            Switch to {isAdmin ? 'Customer' : 'Admin'} Mode
                          </span>
                          <span className="text-[10px] font-mono text-cyan-400/70 group-hover:text-cyan-300 shrink-0">
                            {isAdmin ? 'Exit ➔' : 'Enter ➔'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Shopping Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label="Shopping Cart"
                className="relative p-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-400/40 text-cyan-200 hover:text-white hover:border-cyan-400 transition-all shadow-md shadow-cyan-950"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-gradient-to-r from-cyan-400 to-teal-300 text-black text-xs font-bold flex items-center justify-center shadow-lg shadow-cyan-500/40">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile / Tablet Menu Hamburger (Visible on screens < XL) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
                aria-expanded={mobileMenuOpen}
                className="p-2 rounded-xl text-gray-300 hover:text-cyan-300 hover:bg-white/5 xl:hidden border border-cyan-500/25 bg-cyan-950/30"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-cyan-400" />
                ) : (
                  <Menu className="w-5 h-5 text-cyan-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#020d1c]/95 backdrop-blur-2xl border-t border-cyan-500/25 px-4 pt-4 pb-6 mt-2 space-y-3 rounded-b-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between px-2 text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold border-b border-cyan-500/20 pb-2">
              <span>Categories & Shop</span>
              <span className="text-gray-400 font-sans normal-case text-xs">
                {NAV_LINKS.length} Sections
              </span>
            </div>

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

            <div className="pt-3 border-t border-cyan-500/20 flex gap-2">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 text-center rounded-xl bg-cyan-950/70 border border-cyan-500/30 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 flex items-center justify-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                Admin Panel
              </Link>
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 text-center rounded-xl bg-cyan-950/70 border border-cyan-500/30 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
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
