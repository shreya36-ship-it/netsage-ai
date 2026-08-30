import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, MessageSquare, Star, Sparkles, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function BookCard({ product }) {
  const { addToCart, generateSingleProductWhatsAppUrl } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAdded, setIsAdded] = useState(false);
  
  // Mouse 3D tilt tracking state
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const isWishlisted = isInWishlist(product.id);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -8;
    const rY = ((x - centerX) / centerX) * 8;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div 
      className="perspective-1000 group h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="bg-white rounded-2xl border border-cream-border p-4 shadow-sm hover:shadow-xl transition-all duration-300 preserve-3d flex flex-col justify-between h-full relative"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: rotateX === 0 ? 'transform 0.5s ease' : 'none'
        }}
      >
        {/* Wishlist Heart Icon Top Right */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-6 right-6 z-20 p-2.5 rounded-full transition-all backdrop-blur-md ${
            isWishlisted 
              ? 'bg-brand-red text-white shadow-md scale-110' 
              : 'bg-white/80 text-slate-400 hover:text-brand-red hover:bg-white shadow'
          }`}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Top Badges (New / Bestseller / Featured) */}
        <div className="absolute top-6 left-6 z-20 flex flex-col gap-1.5 items-start">
          {product.featured && (
            <span className="bg-brand-yellow text-navy font-sans font-bold text-[10px] uppercase px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-current" />
              <span>Best Seller</span>
            </span>
          )}
          {product.ageRange && (
            <span className="bg-navy/80 backdrop-blur-md text-white font-sans text-[10px] font-semibold px-2 py-0.5 rounded-md">
              {product.ageRange}
            </span>
          )}
        </div>

        {/* Book Cover Container with 3D shadow effect */}
        <Link to={`/product/${product.id}`} className="block relative mb-4 overflow-hidden rounded-xl bg-cream-dark/50 p-4 text-center group-hover:bg-cream-dark transition-colors">
          <div className="relative mx-auto w-36 h-48 sm:w-40 sm:h-52 shadow-book-3d rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/images/covers/9788131973530.jpg';
              }}
            />
          </div>
        </Link>

        {/* Product Information */}
        <div className="space-y-2 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span className="font-semibold text-brand-blue uppercase tracking-wider text-[11px]">
                {product.category}
              </span>
              <span className="text-slate-300 text-[11px]">
                {product.format}
              </span>
            </div>

            <Link to={`/product/${product.id}`} className="block group-hover:text-brand-blue transition-colors">
              <h3 className="font-serif font-bold text-navy text-base leading-snug line-clamp-2">
                {product.name}
              </h3>
            </Link>

            {product.author && (
              <p className="text-xs text-slate-300 font-sans mt-0.5">
                by {product.author}
              </p>
            )}
          </div>

          <div className="pt-2">
            {/* Rating & Reviews */}
            <div className="flex items-center gap-1 mb-2 text-xs">
              <div className="flex items-center text-brand-yellow">
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="font-bold text-navy text-xs">{product.rating || '4.8'}</span>
              <span className="text-slate-300 text-[11px]">({product.reviewsCount || '20'})</span>
              <span className="ml-auto text-[11px] font-mono text-slate-300">ISBN: {product.isbn.slice(-5)}</span>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-2 mb-3">
              <span className="font-sans font-black text-navy text-xl">
                ₹{product.price}
              </span>
              <span className="text-[11px] text-brand-green font-semibold">
                In Stock @ Store
              </span>
            </div>

            {/* Action Buttons: Add to Cart & Direct WhatsApp */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAddToCart}
                className={`py-2 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 ${
                  isAdded 
                    ? 'bg-brand-green text-white' 
                    : 'bg-navy hover:bg-navy-light text-white'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <a
                href={generateSingleProductWhatsAppUrl(product)}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-xl bg-brand-green/10 hover:bg-brand-green text-brand-green hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 border border-brand-green/30"
                title="Enquire on WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-current" />
                <span>Enquire</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
