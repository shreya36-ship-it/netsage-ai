import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Heart, X, Sparkles, BookOpen } from 'lucide-react';
import BookCard from '../components/shop/BookCard';
import { PRODUCTS, CATEGORIES, AGE_GROUPS, FORMATS } from '../data/products';
import { useWishlist } from '../context/WishlistContext';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { wishlist } = useWishlist();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Categories');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(searchParams.get('age') || 'All Ages');
  const [selectedFormat, setSelectedFormat] = useState('All Formats');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState('featured');
  const [showWishlistOnly, setShowWishlistOnly] = useState(searchParams.get('wishlist') === 'true');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync URL search params
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) setSelectedCategory(categoryFromUrl);

    const wishlistFromUrl = searchParams.get('wishlist');
    if (wishlistFromUrl === 'true') setShowWishlistOnly(true);
  }, [searchParams]);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    let list = showWishlistOnly ? wishlist : PRODUCTS;

    // Keyword Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.isbn.includes(q) ||
        (p.author && p.author.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Category Filter
    if (selectedCategory !== 'All Categories') {
      list = list.filter(p => 
        p.category.toLowerCase() === selectedCategory.toLowerCase() ||
        p.tags.some(t => t.toLowerCase() === selectedCategory.toLowerCase())
      );
    }

    // Age Group Filter
    if (selectedAgeGroup !== 'All Ages') {
      list = list.filter(p => p.ageGroup === selectedAgeGroup);
    }

    // Format Filter
    if (selectedFormat !== 'All Formats') {
      list = list.filter(p => p.format === selectedFormat);
    }

    // Price Filter
    list = list.filter(p => p.price <= maxPrice);

    // Sorting
    return [...list].sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'title') return a.name.localeCompare(b.name);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [searchQuery, selectedCategory, selectedAgeGroup, selectedFormat, maxPrice, sortBy, showWishlistOnly, wishlist]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSelectedAgeGroup('All Ages');
    setSelectedFormat('All Formats');
    setMaxPrice(1000);
    setSortBy('featured');
    setShowWishlistOnly(false);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Title Bar */}
      <div className="bg-navy text-white p-8 rounded-3xl border border-navy-border shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-brand-yellow font-semibold text-xs uppercase tracking-widest">
              BOOK AFFAIR Catalog
            </span>
            <h1 className="font-serif font-bold text-3xl md:text-4xl text-white mt-1">
              {showWishlistOnly ? 'Your Saved Wishlist' : 'Browse All Books & Stationery'}
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'title' : 'titles'} available for direct WhatsApp enquiry & store pickup
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-navy-dark text-white text-xs border border-navy-border focus:outline-none focus:border-brand-blue placeholder:text-slate-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Wishlist Toggle Tab Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-navy-border/60">
          <button
            onClick={() => setShowWishlistOnly(false)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              !showWishlistOnly
                ? 'bg-brand-blue text-white shadow-sm'
                : 'bg-navy-light text-slate-300 hover:text-white'
            }`}
          >
            All Book Titles
          </button>

          <button
            onClick={() => setShowWishlistOnly(true)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              showWishlistOnly
                ? 'bg-brand-red text-white shadow-sm'
                : 'bg-navy-light text-slate-300 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Wishlist ({wishlist.length})</span>
          </button>

          {showWishlistOnly && (
            <span className="text-xs text-brand-yellow font-medium">
              Showing saved items stored in your local browser state
            </span>
          )}
        </div>
      </div>


      {/* MAIN CATALOG & FILTER SIDEBAR LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-cream-border shadow-sm space-y-6">
            
            <div className="flex items-center justify-between border-b border-cream-border pb-3">
              <div className="flex items-center gap-2 font-serif font-bold text-navy text-base">
                <SlidersHorizontal className="w-4 h-4 text-brand-blue" />
                <span>Filter Books</span>
              </div>
              <button
                onClick={resetFilters}
                className="text-[11px] text-brand-red font-semibold hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="font-sans font-bold text-xs text-navy uppercase tracking-wider block">
                Category / Department
              </label>
              <div className="space-y-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between ${
                      selectedCategory === cat
                        ? 'bg-brand-blue text-white font-bold shadow-sm'
                        : 'text-slate-400 hover:bg-cream/60 hover:text-navy'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Sparkles className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Age Group Filter */}
            <div className="space-y-2 pt-2 border-t border-cream-border">
              <label className="font-sans font-bold text-xs text-navy uppercase tracking-wider block">
                Age Group
              </label>
              <div className="flex flex-wrap gap-1.5">
                {AGE_GROUPS.map(age => (
                  <button
                    key={age}
                    onClick={() => setSelectedAgeGroup(age)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedAgeGroup === age
                        ? 'bg-navy text-white'
                        : 'bg-cream-dark/60 text-slate-400 hover:bg-cream-dark hover:text-navy'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            {/* Format Filter */}
            <div className="space-y-2 pt-2 border-t border-cream-border">
              <label className="font-sans font-bold text-xs text-navy uppercase tracking-wider block">
                Format
              </label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-border text-xs focus:outline-none focus:border-brand-blue bg-white text-navy font-medium"
              >
                {FORMATS.map(fmt => (
                  <option key={fmt} value={fmt}>{fmt}</option>
                ))}
              </select>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-2 pt-2 border-t border-cream-border">
              <div className="flex justify-between items-center text-xs">
                <label className="font-sans font-bold text-navy uppercase tracking-wider">
                  Max Price
                </label>
                <span className="font-mono font-bold text-brand-blue text-sm">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand-blue"
              />
              <div className="flex justify-between text-[10px] text-slate-300 font-mono">
                <span>₹100</span>
                <span>₹500</span>
                <span>₹1000</span>
              </div>
            </div>

          </div>
        </aside>


        {/* MOBILE FILTER TOGGLE */}
        <div className="lg:hidden flex items-center justify-between gap-4">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex-1 py-3 px-4 rounded-2xl bg-white border border-cream-border font-bold text-xs text-navy shadow-sm flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4 text-brand-blue" />
            <span>Filter Catalog ({selectedCategory !== 'All Categories' ? selectedCategory : 'All'})</span>
          </button>
        </div>

        {/* MOBILE FILTER MODAL */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-navy/80 backdrop-blur-sm p-4 overflow-y-auto lg:hidden">
            <div className="bg-white rounded-3xl p-6 space-y-6 max-w-md mx-auto">
              <div className="flex items-center justify-between border-b border-cream-border pb-3">
                <h3 className="font-serif font-bold text-lg text-navy">Filter Books</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-2 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Category */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-navy uppercase">Category</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setMobileFilterOpen(false); }}
                      className={`p-2 rounded-xl text-xs text-left ${selectedCategory === cat ? 'bg-brand-blue text-white font-bold' : 'bg-cream text-navy'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Age */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-navy uppercase">Age Group</label>
                <div className="flex flex-wrap gap-2">
                  {AGE_GROUPS.map(age => (
                    <button
                      key={age}
                      onClick={() => { setSelectedAgeGroup(age); setMobileFilterOpen(false); }}
                      className={`px-3 py-1.5 rounded-xl text-xs ${selectedAgeGroup === age ? 'bg-navy text-white font-bold' : 'bg-cream text-navy'}`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-navy text-white font-bold text-xs rounded-xl"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}


        {/* PRODUCT CATALOG GRID */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Active Filter Chips & Sort Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-cream-border shadow-sm">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-300 font-medium">Active Filters:</span>
              
              {selectedCategory !== 'All Categories' && (
                <span className="px-2.5 py-1 rounded-lg bg-brand-blue/10 text-brand-blue font-semibold flex items-center gap-1">
                  {selectedCategory}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('All Categories')} />
                </span>
              )}

              {selectedAgeGroup !== 'All Ages' && (
                <span className="px-2.5 py-1 rounded-lg bg-navy/10 text-navy font-semibold flex items-center gap-1">
                  {selectedAgeGroup}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedAgeGroup('All Ages')} />
                </span>
              )}

              {selectedFormat !== 'All Formats' && (
                <span className="px-2.5 py-1 rounded-lg bg-brand-yellow/20 text-navy font-semibold flex items-center gap-1">
                  {selectedFormat}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedFormat('All Formats')} />
                </span>
              )}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-end">
              <span className="text-slate-300 font-medium whitespace-nowrap">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-cream-border bg-white text-navy font-semibold focus:outline-none focus:border-brand-blue"
              >
                <option value="featured">Featured / Best Sellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Grid Container */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-cream-border space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-cream-dark flex items-center justify-center text-slate-400">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-xl text-navy">No Books Found</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                No titles matched your current search filters. Try adjusting your category or resetting criteria!
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-xl bg-navy text-white text-xs font-semibold hover:bg-navy-light transition-colors"
              >
                Reset All Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <BookCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
