import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Sparkles, Clock, MapPin, Phone, MessageSquare, Star, 
  ChevronRight, ArrowRight, ShieldCheck, Award, Heart, CheckCircle2,
  GraduationCap, Tag, Flame, Backpack, PenTool, HeartHandshake, HelpCircle
} from 'lucide-react';
import Hero3DCanvas from '../components/3d/Hero3DCanvas';
import BookCard from '../components/shop/BookCard';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { STORE_INFO } from '../data/storeInfo';
import { REVIEWS } from '../data/reviews';
import { FAQS } from '../data/faqs';

export default function HomePage() {
  const featuredProducts = PRODUCTS.filter(p => p.featured);
  const babyEssentials = PRODUCTS.filter(p => p.tags.includes('Baby Essentials'));
  const recentArrivals = PRODUCTS.slice(0, 4);

  const [activeFaq, setActiveFaq] = useState(null);

  // Mapping highlight icons dynamically
  const getHighlightIcon = (iconName) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="w-6 h-6 text-brand-yellow" />;
      case 'GraduationCap': return <GraduationCap className="w-6 h-6 text-brand-green" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-brand-red" />;
      case 'HeartHandshake': return <HeartHandshake className="w-6 h-6 text-brand-blue" />;
      case 'Tag': return <Tag className="w-6 h-6 text-brand-yellow" />;
      case 'Flame': return <Flame className="w-6 h-6 text-brand-green" />;
      case 'Backpack': return <Backpack className="w-6 h-6 text-brand-red" />;
      case 'PenTool': return <PenTool className="w-6 h-6 text-brand-blue" />;
      case 'MessageSquare': return <MessageSquare className="w-6 h-6 text-brand-green" />;
      default: return <MapPin className="w-6 h-6 text-brand-red" />;
    }
  };

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      
      {/* HERO SECTION WITH 3D CANVAS */}
      <section className="relative bg-navy text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8 border-b border-navy-border overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column: Hero Copy & CTA */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Store Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-light/80 border border-navy-border text-xs font-semibold text-slate-200 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-ping"></span>
              <span>Independent Neighborhood Bookstore • K. K. Nagar, Chennai</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight text-white">
              Where Stories, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow via-brand-red to-brand-blue">
                Creativity & Learning
              </span> Come Alive.
            </h1>

            {/* Sub-tagline & Story Snippet */}
            <p className="font-sans text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {STORE_INFO.story}
            </p>

            {/* Store Hours Highlight Pill */}
            <div className="inline-flex items-center gap-3 p-3 rounded-2xl bg-navy-dark/90 border border-navy-border text-xs text-slate-200">
              <Clock className="w-5 h-5 text-brand-yellow shrink-0" />
              <div>
                <p className="font-bold text-white">{STORE_INFO.hours.days}: {STORE_INFO.hours.time}</p>
                <p className="text-[11px] text-brand-green font-medium">Open 6 Days a Week • Friendly In-Store Assistance</p>
              </div>
            </div>

            {/* Primary Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/shop"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-base shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 group active:scale-98"
              >
                <span>Browse Full Catalog</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-brand-green/20 hover:bg-brand-green text-brand-green hover:text-white border border-brand-green/40 font-bold text-base transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageSquare className="w-5 h-5 fill-current" />
                <span>WhatsApp Enquiry</span>
              </a>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-yellow" />
                <span>100% Genuine Books</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-brand-yellow fill-current" />
                <span>4.9★ Rated in Chennai</span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Interactive Hero Canvas */}
          <div className="lg:col-span-6">
            <Hero3DCanvas />
          </div>

        </div>
      </section>


      {/* BUSINESS HIGHLIGHTS STRIP (10 TRUST BADGES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 space-y-2">
          <span className="text-brand-blue font-semibold text-xs uppercase tracking-widest">Why Book Lovers Choose Us</span>
          <h2 className="font-serif font-bold text-2xl md:text-3xl text-navy">
            Store Highlights & Customer Commitments
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {STORE_INFO.highlights.map((h, i) => (
            <div 
              key={i}
              className="p-4 rounded-2xl bg-white border border-cream-border hover:border-brand-blue/30 shadow-sm hover:shadow-md transition-all space-y-2 text-center group"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-cream-dark/60 flex items-center justify-center group-hover:scale-110 transition-transform">
                {getHighlightIcon(h.icon)}
              </div>
              <h3 className="font-serif font-bold text-xs text-navy leading-snug">
                {h.title}
              </h3>
              <p className="text-[11px] text-slate-300 line-clamp-2 leading-tight">
                {h.desc}
              </p>
            </div>
          ))}
        </div>
      </section>


      {/* FEATURED SHELF 1: BABY & TODDLER ESSENTIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-cream-border pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-yellow uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Ages 1+ to 3+ Years</span>
            </div>
            <h2 className="font-serif font-bold text-3xl text-navy">
              Baby Essentials & Board Books
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Sound books, touch & feel textures, sensory rub & smell, and EVA bath books.
            </p>
          </div>

          <Link
            to="/shop?category=Board+Books"
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue hover:underline"
          >
            <span>View All Board Books ({babyEssentials.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {babyEssentials.slice(0, 4).map(product => (
            <BookCard key={product.id} product={product} />
          ))}
        </div>
      </section>


      {/* 4-QUADRANT BRAND CATEGORY EXPLORER */}
      <section className="bg-navy text-white py-16 px-4 sm:px-6 lg:px-8 border-y border-navy-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-light text-brand-yellow text-xs font-semibold">
              <span>Curated Collections</span>
            </div>
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-white">
              Explore Our Bookstore Departments
            </h2>
            <p className="text-xs md:text-sm text-slate-300">
              From early toddler discovery to advanced academic reference guides, stationery, and gift sets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Quadrant 1: Yellow - Children & Toddlers */}
            <Link 
              to="/shop?category=Board+Books"
              className="p-6 rounded-3xl bg-navy-dark border border-brand-yellow/30 hover:border-brand-yellow transition-all hover:scale-105 group space-y-4 shadow-xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-yellow/20 text-brand-yellow flex items-center justify-center font-bold text-xl">
                01
              </div>
              <h3 className="font-serif font-bold text-xl text-white group-hover:text-brand-yellow transition-colors">
                Children's & Board Books
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Interactive sound books, touch & feel textures, fairy tales, and early learning foam books.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-yellow">
                <span>Browse Department</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            {/* Quadrant 2: Green - Educational & School */}
            <Link 
              to="/shop?category=Educational"
              className="p-6 rounded-3xl bg-navy-dark border border-brand-green/30 hover:border-brand-green transition-all hover:scale-105 group space-y-4 shadow-xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-green/20 text-brand-green flex items-center justify-center font-bold text-xl">
                02
              </div>
              <h3 className="font-serif font-bold text-xl text-white group-hover:text-brand-green transition-colors">
                Educational & School Reference
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Workbooks, science companions, Oxford Atlases, flashcards, and student exam guides.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-green">
                <span>Browse Department</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            {/* Quadrant 3: Red - General Reading & Fiction */}
            <Link 
              to="/shop?category=Fiction"
              className="p-6 rounded-3xl bg-navy-dark border border-brand-red/30 hover:border-brand-red transition-all hover:scale-105 group space-y-4 shadow-xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-red/20 text-brand-red flex items-center justify-center font-bold text-xl">
                03
              </div>
              <h3 className="font-serif font-bold text-xl text-white group-hover:text-brand-red transition-colors">
                Fiction & Non-Fiction
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Deluxe classic novels, inspirational biographies, popular fiction, and general reader literature.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-red">
                <span>Browse Department</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            {/* Quadrant 4: Blue - Stationery & Gifts */}
            <Link 
              to="/shop?category=Stationery"
              className="p-6 rounded-3xl bg-navy-dark border border-brand-blue/30 hover:border-brand-blue transition-all hover:scale-105 group space-y-4 shadow-xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-blue/20 text-brand-blue flex items-center justify-center font-bold text-xl">
                04
              </div>
              <h3 className="font-serif font-bold text-xl text-white group-hover:text-brand-blue transition-colors">
                Stationery & Gift Items
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pastel journals, gel pen sets, handcrafted rosewood bookmarks, and artistic gift boxes.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue">
                <span>Browse Department</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

          </div>

        </div>
      </section>


      {/* FEATURED SHELF 2: BEST SELLERS & RECENT ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-cream-border pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-red uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 fill-current" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="font-serif font-bold text-3xl text-navy">
              Best Sellers & New Releases
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Hand-picked titles loved by students, parents, and serious readers across Chennai.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue hover:underline"
          >
            <span>Browse All Titles</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map(product => (
            <BookCard key={product.id} product={product} />
          ))}
        </div>
      </section>


      {/* STORE OWNER STORY & MISSION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-cream-border p-8 md:p-12 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 space-y-4 text-center lg:text-left">
            <div className="w-20 h-20 mx-auto lg:mx-0 rounded-2xl bg-navy text-brand-yellow flex items-center justify-center font-serif text-3xl font-black shadow-md">
              KP
            </div>
            <div>
              <span className="text-xs font-bold text-brand-blue uppercase tracking-widest">Our Store Founder</span>
              <h3 className="font-serif font-bold text-2xl md:text-3xl text-navy">
                K. Pugazhendhi
              </h3>
              <p className="text-xs text-slate-400 font-sans">Owner & Chief Book Curator</p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 justify-center lg:justify-start">
              <span className="px-3 py-1 rounded-full bg-cream-dark text-navy font-semibold text-xs">Knowledgeable Service</span>
              <span className="px-3 py-1 rounded-full bg-cream-dark text-navy font-semibold text-xs">Personal Recommendations</span>
              <span className="px-3 py-1 rounded-full bg-cream-dark text-navy font-semibold text-xs">Family-Oriented</span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4 border-t lg:border-t-0 lg:border-l border-cream-border pt-6 lg:pt-0 lg:pl-8">
            <h3 className="font-serif font-bold text-xl text-navy">
              "A Warm, Upscale Neighborhood Bookstore For Every Reader"
            </h3>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              "BOOK AFFAIR was built on a simple belief: every child and reader deserves a comfortable, friendly space where they can discover books that inspire creativity and lifelong learning."
            </p>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Whether you are looking for soft tactile board books for toddlers, school syllabus reference guides, activity puzzle books, or classic hardcover novels, we provide personalized guidance to ensure you leave with the perfect title.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy text-white text-xs font-semibold hover:bg-navy-light transition-colors"
              >
                <span>Read Full Store Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>


      {/* CUSTOMER REVIEWS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-brand-green font-semibold text-xs uppercase tracking-widest">Verified Google Reviews</span>
          <h2 className="font-serif font-bold text-3xl text-navy">
            What Our Readers & Parents Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.slice(0, 3).map(rev => (
            <div key={rev.id} className="p-6 rounded-2xl bg-white border border-cream-border shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-brand-yellow">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{rev.date}</span>
                </div>
                <p className="text-xs text-slate-400 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-cream-border flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-serif font-bold text-navy">{rev.name}</h4>
                  <p className="text-[11px] text-slate-300">{rev.role}</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/reviews" className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue hover:underline">
            <span>Read All Google Reviews</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>


      {/* FAQ PREVIEW ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-brand-yellow font-semibold text-xs uppercase tracking-widest">Questions & Answers</span>
          <h2 className="font-serif font-bold text-3xl text-navy">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.slice(0, 3).map((faq, idx) => (
            <div key={idx} className="rounded-2xl bg-white border border-cream-border overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left font-serif font-bold text-navy text-sm sm:text-base flex items-center justify-between gap-4 hover:bg-cream/40 transition-colors"
              >
                <span>{faq.question}</span>
                <span className="text-brand-blue text-xl">{activeFaq === idx ? '−' : '+'}</span>
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-4 text-xs text-slate-400 leading-relaxed border-t border-cream-border/50 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/faq" className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue hover:underline">
            <span>View Complete FAQ Page</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>


      {/* GOOGLE MAPS & CONTACT STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy text-white rounded-3xl p-6 md:p-8 border border-navy-border shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/20 text-brand-red text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Visit Store in K. K. Nagar</span>
            </div>
            
            <h2 className="font-serif font-bold text-2xl md:text-3xl text-white">
              Convenient Store Location & Hours
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              {STORE_INFO.address.full}
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <p className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-brand-yellow shrink-0" />
                <span>Open Mon – Sat: <strong>9:30 AM – 9:30 PM</strong> (Open 6 Days)</span>
              </p>
              <p className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-brand-green shrink-0" />
                <span>Phone / WhatsApp: <strong>+91 9500070831</strong></span>
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={STORE_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white text-xs font-semibold transition-all inline-flex items-center gap-2"
              >
                <span>Open in Google Maps</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-brand-green text-white text-xs font-semibold hover:bg-emerald-600 transition-all inline-flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>WhatsApp Store</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 h-64 md:h-80 rounded-2xl overflow-hidden border border-navy-border shadow-inner">
            <iframe
              title="BOOK AFFAIR Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.680693998246!2d80.198305!3d13.036881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52671e6ad604c5%3A0xb357492c3ff2b1ff!2sAlagirisamy%20Salai%2C%20Sector%209%2C%20K.%20K.%20Nagar%2C%20Chennai%2C%20Tamil%20Nadu%20600078!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>
      </section>

    </div>
  );
}
