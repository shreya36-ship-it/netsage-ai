import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, Menu, X, Phone, Clock, MapPin, MessageSquare, Sparkles } from 'lucide-react';
import { STORE_INFO } from '../../data/storeInfo';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems, setIsCartOpen } = useCart();
  const { totalWishlist } = useWishlist();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop Catalog', path: '/shop' },
    { name: 'About Store', path: '/about' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact & Map', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-navy text-white shadow-xl border-b border-navy-border/60">
      {/* Top Banner: Store Hours & Direct Contact */}
      <div className="bg-navy-dark text-slate-300 text-xs py-2 px-4 border-b border-navy-border/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="inline-flex items-center gap-1.5 font-medium text-brand-yellow">
              <Clock className="w-3.5 h-3.5" />
              <span>{STORE_INFO.hours.days}: <strong className="text-white">{STORE_INFO.hours.time}</strong></span>
              <span className="bg-brand-green/20 text-brand-green text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border border-brand-green/30 ml-1">Open 6 Days</span>
            </span>
            <span className="hidden md:inline-block text-slate-500">•</span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-brand-red" />
              <span>K. K. Nagar, Chennai</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href={`https://wa.me/${STORE_INFO.whatsappNumber}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-brand-green hover:underline font-medium transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp Enquiries: {STORE_INFO.formattedPhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo & Wordmark */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden shadow-lg border border-navy-border group-hover:scale-105 transition-transform duration-300">
              <img 
                src="/book.jpeg" 
                alt="BOOK AFFAIR Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/images/logo.jpg';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-sans font-black text-xl md:text-2xl tracking-wider text-white uppercase group-hover:text-brand-yellow transition-colors">
                  BOOK AFFAIR
                </h1>
                <span className="hidden lg:inline-block text-[10px] uppercase font-bold tracking-widest bg-brand-yellow text-navy px-1.5 py-0.5 rounded">
                  Est. Chennai
                </span>
              </div>
              <p className="font-serif italic text-xs md:text-sm text-slate-300 tracking-wide">
                Children's and General Book Store
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-brand-blue/20 text-brand-blue border border-brand-blue/40 font-semibold'
                    : 'text-slate-200 hover:text-white hover:bg-navy-light/60'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* User Action Buttons (Wishlist & Cart) */}
          <div className="flex items-center gap-3">
            {/* Wishlist Link */}
            <Link
              to="/shop?wishlist=true"
              className="relative p-2.5 rounded-xl bg-navy-light/60 text-slate-200 hover:text-brand-red hover:bg-navy-light transition-all border border-navy-border/50"
              title="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {totalWishlist > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-red text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-navy">
                  {totalWishlist}
                </span>
              )}
            </Link>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all border border-blue-400/30 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Enquiry Cart</span>
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {totalItems}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-navy-light text-slate-200 hover:text-white border border-navy-border"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy-dark border-t border-navy-border px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          <div className="p-3 mb-2 rounded-xl bg-navy-light/40 border border-navy-border flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-brand-green animate-ping"></div>
            <div>
              <p className="text-xs font-semibold text-white">Store Open Mon–Sat in K. K. Nagar</p>
              <p className="text-[11px] text-slate-300">Mon–Sat 9:30 AM – 9:30 PM (6 Days)</p>
            </div>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-brand-blue text-white font-semibold'
                  : 'text-slate-300 hover:bg-navy-light hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-navy-border/60">
            <a
              href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-green text-white font-semibold text-sm shadow-md"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Direct WhatsApp Enquiry</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
