import React, { useState } from 'react';
import { HelpCircle, ChevronDown, MessageSquare } from 'lucide-react';
import { FAQS } from '../data/faqs';
import { STORE_INFO } from '../data/storeInfo';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="bg-navy text-white p-8 rounded-3xl border border-navy-border shadow-xl space-y-2">
        <span className="text-brand-yellow font-semibold text-xs uppercase tracking-widest">
          Help & Information
        </span>
        <h1 className="font-serif font-bold text-3xl md:text-4xl text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-slate-300">
          Everything you need to know about visiting our store, ordering via WhatsApp, and school bulk orders.
        </p>
      </div>

      {/* Accordions */}
      <div className="space-y-4">
        {FAQS.map((faq, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl border border-cream-border overflow-hidden shadow-sm transition-all"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full p-5 text-left font-serif font-bold text-navy text-base flex items-center justify-between gap-4 hover:bg-cream/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-cream-dark text-brand-blue flex items-center justify-center font-mono text-xs shrink-0">
                  0{index + 1}
                </span>
                <span>{faq.question}</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openIndex === index ? 'rotate-180 text-brand-blue' : ''}`} />
            </button>

            {openIndex === index && (
              <div className="px-5 pb-5 pt-2 text-xs md:text-sm text-slate-400 leading-relaxed border-t border-cream-border/50 bg-cream/20">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Direct WhatsApp Callout */}
      <div className="p-8 rounded-3xl bg-cream-dark border border-cream-border text-center space-y-4">
        <h3 className="font-serif font-bold text-xl text-navy">Have a Specific Book Enquiry?</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Need a specific title, school textbook edition, or bulk order discount? Chat directly with store owner <strong>K. Pugazhendhi</strong>!
        </p>
        <a
          href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-green text-white text-xs font-bold shadow-lg hover:bg-emerald-600 transition-colors"
        >
          <MessageSquare className="w-4 h-4 fill-current" />
          <span>Ask Us on WhatsApp (+91 9500070831)</span>
        </a>
      </div>

    </div>
  );
}
