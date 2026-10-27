import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AQUARAM | Luxury Aquatics, Rare Marine Fish & Living Reefs',
  description:
    "India's premier high-end aquarium e-commerce destination. Featuring rare captive-bred marine fish, Japanese low-iron rimless tanks, tissue-culture plants, and living coral reefs with 100% Live Arrival Guarantee.",
  keywords: [
    'Aquarium',
    'Marine Fish India',
    'Discus Fish',
    'Clownfish',
    'Betta Fish',
    'Planted Aquarium',
    'Rimless Tank',
    'Aquarium Filter',
    'Chihiros WRGB',
    'Live Coral Frags',
  ],
  authors: [{ name: 'Aquaram Marine Co.' }],
  openGraph: {
    title: 'AQUARAM | Luxury Aquatics & Living Reefs',
    description:
      'Explore bioluminescent living reef ecosystems, exotic species, and designer aquariums delivered across India.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#020b14] text-[#e2f1f8] selection:bg-cyan-400 selection:text-black">
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Navbar />
              <div className="flex-1 flex flex-col">{children}</div>
              <Footer />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
