import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, MessageSquare, ArrowRight, Store, Truck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { STORE_INFO } from '../data/storeInfo';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalItems, subtotal, generateWhatsAppOrderUrl } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');

  const whatsappUrl = generateWhatsAppOrderUrl({
    name: customerName,
    address: deliveryMethod === 'pickup' ? `Store Pickup @ ${STORE_INFO.address.locality}` : address,
    note
  });

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-cream-dark flex items-center justify-center text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif font-bold text-3xl text-navy">Your Cart is Currently Empty</h1>
          <p className="text-xs text-slate-300 max-w-sm mx-auto">
            You haven't added any books to your cart yet. Explore our wide range of children's and educational titles!
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-navy text-white text-xs font-bold hover:bg-navy-light transition-colors"
        >
          <span>Browse Bookstore Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="bg-navy text-white p-8 rounded-3xl border border-navy-border shadow-xl">
        <h1 className="font-serif font-bold text-3xl md:text-4xl">Book Enquiry & Cart Review</h1>
        <p className="text-xs text-slate-300 mt-1">
          Review your selected titles and generate a direct WhatsApp inquiry link to store owner K. Pugazhendhi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-cream-border p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-cream-border pb-4">
              <h2 className="font-serif font-bold text-lg text-navy">
                Cart Items ({totalItems})
              </h2>
              <button
                onClick={clearCart}
                className="text-xs text-brand-red font-semibold hover:underline"
              >
                Clear Cart
              </button>
            </div>

            <div className="space-y-4">
              {cartItems.map(({ product, quantity }) => (
                <div 
                  key={product.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-cream/40 border border-cream-border gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-16 h-20 object-cover rounded-xl shadow-sm border border-cream-border shrink-0"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/images/covers/9788131973530.jpg';
                      }}
                    />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-brand-blue">{product.category}</span>
                      <h3 className="font-serif font-bold text-base text-navy">{product.name}</h3>
                      <p className="text-xs text-slate-300">Format: {product.format} • ISBN: {product.isbn}</p>
                      <p className="text-xs font-bold text-navy mt-1">₹{product.price} each</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-cream-border">
                    <div className="flex items-center border border-cream-border rounded-xl bg-white p-1">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="px-2.5 py-1 text-slate-400 hover:text-navy font-bold"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 font-mono font-bold text-xs text-navy">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="px-2.5 py-1 text-slate-400 hover:text-navy font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-mono font-bold text-sm text-navy">
                      ₹{product.price * quantity}
                    </span>

                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="p-2 text-slate-400 hover:text-brand-red"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Customer Info & WhatsApp Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-cream-border p-6 shadow-sm space-y-6">
            <h2 className="font-serif font-bold text-lg text-navy border-b border-cream-border pb-3">
              Fulfillment & WhatsApp Enquiry
            </h2>

            {/* Delivery Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-navy uppercase tracking-wider block">
                Fulfillment Preference
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 ${
                    deliveryMethod === 'pickup' ? 'border-brand-blue bg-brand-blue/10 text-brand-blue' : 'border-cream-border text-slate-300'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Store Pickup</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 ${
                    deliveryMethod === 'delivery' ? 'border-brand-blue bg-brand-blue/10 text-brand-blue' : 'border-cream-border text-slate-300'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Chennai Delivery</span>
                </button>
              </div>
            </div>

            {/* Customer Inputs */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Customer Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border text-xs focus:outline-none focus:border-brand-blue"
                />
              </div>

              {deliveryMethod === 'delivery' && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Delivery Address in Chennai</label>
                  <input
                    type="text"
                    placeholder="Street name, landmark, area"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border text-xs focus:outline-none focus:border-brand-blue"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Special Request / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Need gift wrapping or specific edition"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border text-xs focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>

            {/* Price Summary */}
            <div className="pt-4 border-t border-cream-border space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Total Items</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between font-bold text-navy text-base pt-1">
                <span>Estimated Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-2xl bg-brand-green hover:bg-emerald-600 text-white font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              <span>Send Cart Order via WhatsApp</span>
            </a>

            <div className="flex items-center gap-2 text-[11px] text-slate-300 justify-center">
              <CheckCircle2 className="w-4 h-4 text-brand-green" />
              <span>Direct connection to K. Pugazhendhi (+91 9500070831)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
