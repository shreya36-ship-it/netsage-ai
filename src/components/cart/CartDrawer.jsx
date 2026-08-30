import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, MessageSquare, ShoppingBag, ArrowRight, Store, Truck, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { STORE_INFO } from '../../data/storeInfo';

export default function CartDrawer() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalItems, subtotal, isCartOpen, setIsCartOpen, generateWhatsAppOrderUrl } = useCart();
  
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('pickup'); // 'pickup' | 'delivery'

  if (!isCartOpen) return null;

  const whatsappUrl = generateWhatsAppOrderUrl({
    name: customerName,
    address: deliveryMethod === 'pickup' ? `Store Pickup @ ${STORE_INFO.address.locality}` : address,
    note
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark backdrop */}
      <div 
        className="absolute inset-0 bg-navy-dark/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-cream-border">
          
          {/* Cart Header */}
          <div className="p-5 bg-navy text-white flex items-center justify-between border-b border-navy-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center text-brand-blue">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-white">Book Enquiry Cart</h2>
                <p className="text-xs text-slate-300">{totalItems} {totalItems === 1 ? 'item' : 'items'} selected</p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-navy-light transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-cream-dark flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-lg text-navy">Your Cart is Empty</h3>
                  <p className="text-xs text-slate-300 max-w-xs mx-auto">
                    Browse our wide range of children's, educational, and general books to start an enquiry!
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy text-white text-xs font-semibold hover:bg-navy-light transition-colors"
                >
                  <span>Explore Shop Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cartItems.map(({ product, quantity }) => (
                    <div 
                      key={product.id}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-cream/60 border border-cream-border hover:border-brand-blue/30 transition-colors"
                    >
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-14 h-18 object-cover rounded-lg shadow-sm shrink-0 border border-cream-border"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/assets/images/covers/9788131973530.jpg';
                        }}
                      />

                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="font-serif font-bold text-sm text-navy truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs text-slate-300">
                          {product.format} • ₹{product.price}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 pt-1">
                          <div className="flex items-center border border-cream-border rounded-lg bg-white">
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="p-1 text-slate-300 hover:text-navy"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 font-mono font-bold text-xs text-navy">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="p-1 text-slate-300 hover:text-navy"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="font-bold text-xs text-navy ml-auto">
                            ₹{product.price * quantity}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="p-2 text-slate-400 hover:text-brand-red transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Clear Cart link */}
                <div className="flex justify-end">
                  <button
                    onClick={clearCart}
                    className="text-xs text-slate-400 hover:text-brand-red underline font-medium"
                  >
                    Clear All Items
                  </button>
                </div>

                {/* Delivery Preference */}
                <div className="pt-4 border-t border-cream-border space-y-3">
                  <h4 className="font-sans font-bold text-xs text-navy uppercase tracking-wider">
                    Fulfillment Preference
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('pickup')}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        deliveryMethod === 'pickup'
                          ? 'border-brand-blue bg-brand-blue/10 text-brand-blue shadow-sm'
                          : 'border-cream-border text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <Store className="w-4 h-4" />
                      <span>Store Pickup</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('delivery')}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        deliveryMethod === 'delivery'
                          ? 'border-brand-blue bg-brand-blue/10 text-brand-blue shadow-sm'
                          : 'border-cream-border text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <Truck className="w-4 h-4" />
                      <span>Chennai Delivery</span>
                    </button>
                  </div>

                  {/* Optional Customer Information */}
                  <div className="space-y-2 pt-2">
                    <input
                      type="text"
                      placeholder="Your Name (Optional)"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-cream-border text-xs focus:outline-none focus:border-brand-blue bg-cream/30"
                    />

                    {deliveryMethod === 'delivery' && (
                      <input
                        type="text"
                        placeholder="Delivery Address in Chennai"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-cream-border text-xs focus:outline-none focus:border-brand-blue bg-cream/30"
                      />
                    )}

                    <input
                      type="text"
                      placeholder="Special Instructions / Class Grade / Note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-cream-border text-xs focus:outline-none focus:border-brand-blue bg-cream/30"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Cart Footer & WhatsApp Action */}
          {cartItems.length > 0 && (
            <div className="p-5 bg-cream/50 border-t border-cream-border space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs text-slate-300">
                  <span>Estimated Books Subtotal</span>
                  <span className="font-mono font-bold text-navy text-sm">₹{subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-brand-green">
                  <span>Order Processing</span>
                  <span>WhatsApp Direct Confirmation</span>
                </div>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-brand-green hover:bg-emerald-600 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <MessageSquare className="w-5 h-5 fill-current" />
                <span>Send Cart Order via WhatsApp</span>
              </a>

              <p className="text-[11px] text-center text-slate-300">
                Direct WhatsApp link to store owner <strong>K. Pugazhendhi (+91 9500070831)</strong>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
