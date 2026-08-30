import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORE_INFO } from '../data/storeInfo';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('book_affair_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('book_affair_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const generateWhatsAppOrderUrl = (customerDetails = {}) => {
    if (cartItems.length === 0) return '#';

    let text = `📚 *BOOK AFFAIR — Book Order / Enquiry*\n`;
    text += `*Store Location:* K. K. Nagar, Chennai\n`;
    text += `----------------------------------------\n\n`;

    cartItems.forEach((item, index) => {
      text += `${index + 1}. *${item.product.name}*\n`;
      text += `   • ISBN: \`${item.product.isbn}\`\n`;
      text += `   • Format: ${item.product.format} (${item.product.ageRange})\n`;
      text += `   • Qty: ${item.quantity} × ₹${item.product.price} = *₹${item.quantity * item.product.price}*\n\n`;
    });

    text += `----------------------------------------\n`;
    text += `💰 *Total Estimated Amount:* ₹${subtotal}\n\n`;

    if (customerDetails.name) text += `👤 *Name:* ${customerDetails.name}\n`;
    if (customerDetails.address) text += `📍 *Delivery Address / Pickup:* ${customerDetails.address}\n`;
    if (customerDetails.note) text += `📝 *Special Request:* ${customerDetails.note}\n\n`;

    text += `Hi, please confirm stock availability and payment/pickup details for these items!`;

    const encoded = encodeURIComponent(text);
    return `https://wa.me/${STORE_INFO.whatsappNumber}?text=${encoded}`;
  };

  const generateSingleProductWhatsAppUrl = (product) => {
    let text = `📚 *BOOK AFFAIR — Book Stock Enquiry*\n\n`;
    text += `Hi! I'm interested in buying/enquiring about:\n`;
    text += `*${product.name}*\n`;
    text += `• ISBN: \`${product.isbn}\`\n`;
    text += `• Category: ${product.category}\n`;
    text += `• Price: ₹${product.price}\n\n`;
    text += `Could you please confirm if this title is available in store today?`;
    
    return `https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      isCartOpen,
      setIsCartOpen,
      generateWhatsAppOrderUrl,
      generateSingleProductWhatsAppUrl
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
