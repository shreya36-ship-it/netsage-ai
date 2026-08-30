import React, { useState } from 'react';
import { Star, CheckCircle2, MessageSquarePlus, X, ExternalLink, Heart } from 'lucide-react';
import { REVIEWS } from '../data/reviews';

export default function ReviewsPage() {
  const [reviewsList, setReviewsList] = useState(REVIEWS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const googleReviewLink = "https://maps.app.goo.gl/XWLUehxfjwA2EyR47";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !comment) return;

    const newRev = {
      id: Date.now(),
      name,
      role: role || 'Book Reader',
      location: location || 'Chennai',
      rating: Number(rating),
      date: 'Just Now',
      comment,
      verified: true,
      source: 'Website Submission'
    };

    setReviewsList([newRev, ...reviewsList]);
    setIsModalOpen(false);
    setName('');
    setRole('');
    setLocation('');
    setComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="bg-navy text-white p-8 rounded-3xl border border-navy-border shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/20 text-brand-yellow text-xs font-semibold mb-2">
            <span>Verified Google Maps Reviews</span>
          </div>
          <h1 className="font-serif font-bold text-3xl md:text-4xl text-white">
            Real Customer Reviews & Ratings
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Real reviews from readers, parents, and local guides visiting BOOK AFFAIR in K. K. Nagar, Chennai!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={googleReviewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-brand-green hover:bg-emerald-600 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <span>View on Google Maps</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviewsList.map((rev) => (
          <div key={rev.id} className="bg-white p-6 rounded-3xl border border-cream-border shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-brand-yellow">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] font-mono text-slate-400">{rev.date}</span>
              </div>

              <p className="text-xs md:text-sm text-navy leading-relaxed font-sans">
                "{rev.comment}"
              </p>

              {rev.likes && (
                <div className="flex items-center gap-1 text-xs text-brand-red font-medium pt-1">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>{rev.likes} helpful reaction{rev.likes > 1 ? 's' : ''} on Google Maps</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-cream-border flex items-center justify-between text-xs">
              <div>
                <a 
                  href={rev.profileUrl || googleReviewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-serif font-bold text-navy text-sm hover:text-brand-blue transition-colors flex items-center gap-1"
                >
                  <span>{rev.name}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
                <p className="text-slate-400 text-[11px]">{rev.role}</p>
              </div>

              <div className="flex items-center gap-1 text-brand-green font-semibold text-[11px] bg-brand-green/10 px-2.5 py-1 rounded-lg">
                <CheckCircle2 className="w-4 h-4" />
                <span>Google Verified</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Write a Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy/80 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-navy"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif font-bold text-xl text-navy">Write a Customer Review</h3>
            
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-navy block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Sundaram"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border text-xs focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-navy block mb-1">Role / Profession</label>
                  <input
                    type="text"
                    placeholder="e.g. Parent / Teacher"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border text-xs focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy block mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. K. K. Nagar"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border text-xs focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-navy block mb-1">Rating (1 to 5 Stars)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border text-xs focus:outline-none focus:border-brand-blue bg-white"
                >
                  <option value="5">5 Stars — Excellent Experience</option>
                  <option value="4">4 Stars — Very Good</option>
                  <option value="3">3 Stars — Average</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-navy block mb-1">Your Feedback / Review *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share your store or book experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border text-xs focus:outline-none focus:border-brand-blue"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-navy text-white font-bold text-xs rounded-xl hover:bg-navy-light transition-colors"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
