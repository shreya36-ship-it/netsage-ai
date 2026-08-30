import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';
import { STORE_INFO } from '../data/storeInfo';

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Title */}
      <div className="bg-navy text-white p-8 md:p-12 rounded-3xl border border-navy-border shadow-xl space-y-2">
        <span className="text-brand-yellow font-semibold text-xs uppercase tracking-widest">
          Connect With Us
        </span>
        <h1 className="font-serif font-bold text-3xl md:text-5xl text-white">
          Contact & Store Location
        </h1>
        <p className="text-xs md:text-sm text-slate-300">
          Visit our store in K. K. Nagar, Chennai or reach out instantly via WhatsApp & phone.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Contact Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Hours Card */}
          <div className="bg-white p-6 rounded-3xl border border-cream-border shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-yellow/20 text-brand-yellow flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-navy">Store Operating Hours</h3>
                <p className="text-xs text-brand-green font-semibold">Open 6 Days a Week (Mon – Sat)</p>
              </div>
            </div>
            <p className="text-sm font-bold text-navy pl-13">
              Monday – Saturday: 9:30 AM – 9:30 PM
            </p>
            <p className="text-xs text-slate-300">
              We operate 6 days a week to ensure convenient browsing for school students, parents, and working readers.
            </p>
          </div>

          {/* Address Card */}
          <div className="bg-white p-6 rounded-3xl border border-cream-border shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-red/20 text-brand-red flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-navy">Store Address</h3>
                <p className="text-xs text-slate-300">K. K. Nagar, Greater Chennai</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              {STORE_INFO.address.full}
            </p>
            <a
              href={STORE_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:underline pt-1"
            >
              <span>View on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Phone & WhatsApp Card */}
          <div className="bg-white p-6 rounded-3xl border border-cream-border shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-green/20 text-brand-green flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-navy">Phone & WhatsApp</h3>
                <p className="text-xs text-slate-300">Direct helpline & stock checks</p>
              </div>
            </div>
            
            <div className="space-y-2 text-xs">
              <p className="text-sm font-bold text-navy">{STORE_INFO.formattedPhone}</p>
              <p className="text-slate-300">Email: {STORE_INFO.email}</p>
              <div className="flex items-center gap-1 text-slate-300">
                <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                <span>Instagram: {STORE_INFO.instagramHandle}</span>
              </div>
            </div>

            <a
              href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-brand-green text-white font-bold text-xs shadow-md hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Start WhatsApp Chat Now</span>
            </a>
          </div>

        </div>

        {/* Right Column: Embedded Google Maps Frame */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-4 border border-cream-border shadow-lg space-y-4 flex flex-col justify-between">
          <div className="w-full h-96 md:h-[500px] rounded-2xl overflow-hidden border border-cream-border">
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

          <div className="p-4 bg-cream/50 rounded-2xl border border-cream-border flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-green" />
              <span>Landmark: Near PSBB School, Sector 9, K. K. Nagar</span>
            </div>
            <a
              href={STORE_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-blue hover:underline flex items-center gap-1"
            >
              <span>Get Directions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
