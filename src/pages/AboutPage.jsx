import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Sparkles, Clock, MapPin, Phone, MessageSquare, Heart, ShieldCheck, Award, ArrowRight } from 'lucide-react';
import { STORE_INFO } from '../data/storeInfo';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Hero Banner */}
      <div className="bg-navy text-white p-8 md:p-12 rounded-3xl border border-navy-border shadow-xl space-y-4">
        <span className="text-brand-yellow font-semibold text-xs uppercase tracking-widest">
          About BOOK AFFAIR
        </span>
        <h1 className="font-serif font-bold text-3xl md:text-5xl text-white">
          Our Story, Values & Mission
        </h1>
        <p className="font-serif italic text-lg text-slate-300">
          "Children's and General Book Store — Love For Books"
        </p>
      </div>

      {/* Main Story & Founder Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <div className="lg:col-span-6 bg-white p-8 rounded-3xl border border-cream-border shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue font-bold text-xs">
            <span>Founded & Managed by K. Pugazhendhi</span>
          </div>
          <h2 className="font-serif font-bold text-2xl md:text-3xl text-navy">
            More Than Just a Bookstore
          </h2>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
            {STORE_INFO.story}
          </p>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
            We take immense pride in fostering early childhood literacy, supporting students across Chennai schools with essential reference material, and providing avid readers with hand-curated classics and contemporary titles.
          </p>

          <div className="pt-4 flex items-center gap-4">
            <a
              href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-green text-white text-xs font-bold shadow-md hover:bg-emerald-600 transition-colors"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Connect with K. Pugazhendhi</span>
            </a>
          </div>
        </div>

        {/* Store Timings & Location Card */}
        <div className="lg:col-span-6 bg-navy text-white p-8 rounded-3xl border border-navy-border shadow-xl space-y-6">
          <h3 className="font-serif font-bold text-2xl text-white border-b border-navy-border pb-3">
            Visit Our Store in K. K. Nagar
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
              <div>
                <strong className="text-white text-sm block">Operating Hours</strong>
                <p className="text-brand-yellow font-bold text-sm">{STORE_INFO.hours.days}: {STORE_INFO.hours.time}</p>
                <p className="text-brand-green font-medium mt-0.5">Open 6 Days a Week (Mon – Sat)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
              <div>
                <strong className="text-white text-sm block">Store Address</strong>
                <p className="text-slate-300 leading-relaxed">{STORE_INFO.address.full}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-brand-blue shrink-0" />
              <div>
                <strong className="text-white text-sm block">Phone & WhatsApp</strong>
                <p className="text-slate-300">{STORE_INFO.formattedPhone}</p>
              </div>
            </div>
          </div>

          <a
            href={STORE_INFO.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl bg-navy-light text-white text-xs font-bold hover:bg-navy-border transition-colors flex items-center justify-center gap-2 border border-navy-border"
          >
            <MapPin className="w-4 h-4 text-brand-red" />
            <span>Open Location on Google Maps</span>
          </a>
        </div>

      </div>

      {/* Core Values Grid */}
      <div className="space-y-6">
        <h2 className="font-serif font-bold text-2xl text-navy text-center">
          Our Bookstore Pillars
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-cream-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-yellow/20 text-brand-yellow flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-navy">Curated Quality</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every title on our shelves is chosen with care, ensuring age-appropriate content, durable bindings, and educational value.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-cream-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-green/20 text-brand-green flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-navy">Personalized Care</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We take time to understand your child's reading level or curriculum needs to recommend the perfect book.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-cream-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/20 text-brand-blue flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-navy">Community First</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Proudly serving families, school students, and educators across K. K. Nagar and Greater Chennai.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
