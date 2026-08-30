import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, ShoppingBag, MessageSquare, Star, ArrowLeft, Check, 
  Sparkles, ShieldCheck, Truck, Store, BookOpen, Layers, User
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import BookCard from '../components/shop/BookCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, generateSingleProductWhatsAppUrl } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const product = PRODUCTS.find(p => p.id === id || p.isbn === id);
  const isWishlisted = product ? isInWishlist(product.id) : false;

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif font-bold text-2xl text-navy">Book Not Found</h2>
        <p className="text-xs text-slate-300">The requested ISBN or product ID could not be located in our catalog.</p>
        <Link to="/shop" className="inline-block px-6 py-2.5 rounded-xl bg-navy text-white text-xs font-semibold">
          Back to Shop Catalog
        </Link>
      </div>
    );
  }

  const relatedBooks = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Back Button Breadcrumb */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-navy transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>
      </div>

      {/* PRODUCT DETAIL CARD CONTAINER */}
      <div className="bg-white rounded-3xl border border-cream-border p-6 md:p-10 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: 3D Cover Display */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative mx-auto w-full max-w-sm aspect-[3/4] bg-cream-dark/60 rounded-2xl p-8 flex items-center justify-center border border-cream-border shadow-book-3d overflow-hidden group">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-48 sm:w-56 h-auto object-cover rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/images/covers/9788131973530.jpg';
              }}
            />

            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 z-10 p-3 rounded-full shadow-lg transition-all ${
                isWishlisted ? 'bg-brand-red text-white scale-110' : 'bg-white text-slate-400 hover:text-brand-red'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            {product.featured && (
              <span className="absolute top-4 left-4 bg-brand-yellow text-navy font-bold text-xs uppercase px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Featured Pick</span>
              </span>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-cream/60 border border-cream-border text-xs space-y-2">
            <div className="flex items-center gap-2 text-brand-green font-semibold">
              <Store className="w-4 h-4" />
              <span>Available for Immediate Store Pickup in K. K. Nagar</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Address: No AP1109, 74th Street, 12th Sector, near Park. Open Mon–Sat 9:30 AM – 9:30 PM.
            </p>
          </div>
        </div>

        {/* Right Column: Title, Specs & WhatsApp Actions */}
        <div className="lg:col-span-7 space-y-6">
          
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-blue uppercase tracking-wider mb-2">
              <span>{product.category}</span>
              <span>•</span>
              <span className="text-slate-300">{product.format}</span>
              {product.ageRange && (
                <>
                  <span>•</span>
                  <span className="text-brand-red">{product.ageRange}</span>
                </>
              )}
            </div>

            <h1 className="font-serif font-bold text-3xl md:text-4xl text-navy leading-tight">
              {product.name}
            </h1>

            {product.author && (
              <p className="text-sm text-slate-300 mt-1 flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-400" />
                <span>Author / Publisher: <strong>{product.author}</strong></span>
              </p>
            )}
          </div>

          {/* Rating & Stock */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1 bg-brand-yellow/15 text-brand-yellow px-2.5 py-1 rounded-lg font-bold">
              <Star className="w-4 h-4 fill-current" />
              <span>{product.rating || '4.8'}</span>
            </div>
            <span className="text-slate-300">({product.reviewsCount || 20} customer reviews)</span>
            <span className="text-brand-green font-semibold">In Stock</span>
          </div>

          {/* Price Header */}
          <div className="p-4 rounded-2xl bg-cream-dark/40 border border-cream-border flex items-baseline gap-3">
            <span className="font-sans font-black text-3xl text-navy">
              ₹{product.price}
            </span>
            <span className="text-xs text-slate-300">Inclusive of all taxes</span>
          </div>

          {/* Book Summary */}
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-sm text-navy uppercase tracking-wider">Book Summary</h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {product.description || `High quality ${product.format} designed for ${product.ageRange} readers. Features durable child-safe pages, rich colorful artwork, and educational value.`}
            </p>
          </div>

          {/* Specifications Table */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-cream/60 border border-cream-border">
              <span className="text-slate-300 text-[11px] block">ISBN-13</span>
              <strong className="font-mono text-navy text-xs">{product.isbn}</strong>
            </div>
            <div className="p-3 rounded-xl bg-cream/60 border border-cream-border">
              <span className="text-slate-300 text-[11px] block">Binding Format</span>
              <strong className="text-navy text-xs">{product.format}</strong>
            </div>
            <div className="p-3 rounded-xl bg-cream/60 border border-cream-border">
              <span className="text-slate-300 text-[11px] block">Target Age Group</span>
              <strong className="text-navy text-xs">{product.ageRange}</strong>
            </div>
          </div>

          {/* Quantity Selector & Add to Cart */}
          <div className="space-y-4 pt-4 border-t border-cream-border">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-cream-border rounded-xl bg-white p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-navy hover:bg-cream rounded-lg font-bold"
                >
                  -
                </button>
                <span className="px-4 font-mono font-bold text-sm text-navy">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-navy hover:bg-cream rounded-lg font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md ${
                  isAdded ? 'bg-brand-green text-white' : 'bg-navy hover:bg-navy-light text-white'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart (₹{product.price * quantity})</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct WhatsApp Enquiry Button */}
            <a
              href={generateSingleProductWhatsAppUrl(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-xl bg-brand-green hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              <span>Chat & Enquire on WhatsApp (+91 9500070831)</span>
            </a>
          </div>

        </div>
      </div>

      {/* RELATED BOOKS RECOMMENDATIONS */}
      {relatedBooks.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-cream-border">
          <div className="flex justify-between items-center">
            <h2 className="font-serif font-bold text-2xl text-navy">
              Related Books in {product.category}
            </h2>
            <Link to={`/shop?category=${product.category}`} className="text-xs font-bold text-brand-blue hover:underline">
              Explore All in {product.category} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedBooks.map(rel => (
              <BookCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
