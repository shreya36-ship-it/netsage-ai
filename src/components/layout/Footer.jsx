import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Heart, BookOpen, MessageSquare, ExternalLink, ShieldCheck } from 'lucide-react';
import { STORE_INFO } from '../../data/storeInfo';

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-navy text-slate-300 border-t border-navy-border/80">
      {/* 4-Color Brand Ribbon Top Bar */}
      <div className="h-1.5 w-full grid grid-cols-4">
        <div className="bg-brand-yellow"></div>
        <div className="bg-brand-green"></div>
        <div className="bg-brand-red"></div>
        <div className="bg-brand-blue"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Store Branding & Story */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/book.jpeg" 
                alt="BOOK AFFAIR Logo" 
                className="w-12 h-12 rounded-xl object-cover border border-navy-border shadow-md"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/images/logo.jpg';
                }}
              />
              <div>
                <h3 className="font-sans font-black text-xl text-white uppercase tracking-wider">BOOK AFFAIR</h3>
                <p className="font-serif italic text-xs text-brand-yellow">Love For Books</p>
              </div>
            </div>
            
            <p className="text-xs leading-relaxed text-slate-400">
              "BOOK AFFAIR is more than just a bookstore—it's a place where stories, creativity, and education come together. We offer books for toddlers, children, students, parents, teachers, and avid readers."
            </p>

            <div className="pt-2 text-xs">
              <span className="text-slate-400">Store Founder & Owner: </span>
              <strong className="text-white font-medium">{STORE_INFO.owner}</strong>
            </div>

            {/* Direct WhatsApp Callout */}
            <a
              href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-green/15 text-brand-green border border-brand-green/30 text-xs font-semibold hover:bg-brand-green hover:text-white transition-all"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>WhatsApp Us: {STORE_INFO.formattedPhone}</span>
            </a>
          </div>

          {/* Column 2: Hours & Store Highlights */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-lg text-white border-b border-navy-border pb-2 inline-block">
              Store Timings & Hours
            </h4>

            <div className="bg-navy-dark p-4 rounded-2xl border border-navy-border space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">{STORE_INFO.hours.days}</p>
                  <p className="text-sm font-semibold text-brand-yellow">{STORE_INFO.hours.time}</p>
                  <p className="text-[11px] text-brand-green font-medium mt-1">Open 6 Days a Week (Mon – Sat)</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 pt-2 border-t border-navy-border/50">
                Comfortable air-conditioned store in K. K. Nagar with personalized recommendations!
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-brand-blue" />
              <span>Verified Local Business in Greater Chennai</span>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-lg text-white border-b border-navy-border pb-2 inline-block">
              Explore Bookstore
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/shop" className="hover:text-brand-yellow transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></span>
                  <span>Board Books & Sound Books</span>
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Educational" className="hover:text-brand-green transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green"></span>
                  <span>Educational & Learning Kits</span>
                </Link>
              </li>
              <li>
                <Link to="/shop?category=School+Books" className="hover:text-brand-red transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
                  <span>School Essentials & Reference</span>
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Fiction" className="hover:text-brand-blue transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span>
                  <span>Fiction & Non-Fiction Novels</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About K. Pugazhendhi & Story</Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-white transition-colors">Customer Reviews & Ratings</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Location & Contact */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-lg text-white border-b border-navy-border pb-2 inline-block">
              Visit Us in Chennai
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                <span className="leading-relaxed">{STORE_INFO.address.full}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-green shrink-0" />
                <a href={`tel:${STORE_INFO.phone}`} className="hover:text-white transition-colors font-medium">
                  {STORE_INFO.phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-blue shrink-0" />
                <a href={`mailto:${STORE_INFO.email}`} className="hover:text-white transition-colors">
                  {STORE_INFO.email}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <InstagramIcon className="w-4 h-4 text-pink-400 shrink-0" />
                <a 
                  href={STORE_INFO.instagramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-pink-400 transition-colors flex items-center gap-1"
                >
                  <span>{STORE_INFO.instagramHandle}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <a
              href={STORE_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-navy-light text-white text-xs font-semibold hover:bg-navy-border transition-colors border border-navy-border"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-red" />
              <span>Get Directions on Google Maps</span>
            </a>
          </div>

        </div>

        {/* Bottom Bar & Rights */}
        <div className="mt-12 pt-8 border-t border-navy-border/60 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© 2026 BOOK AFFAIR. All rights reserved. Managed by K. Pugazhendhi.</p>
          <p className="flex items-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-brand-red fill-current" />
            <span>for book lovers across Greater Chennai</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
