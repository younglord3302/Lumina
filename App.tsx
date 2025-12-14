import React, { useState, useMemo } from 'react';
import { ShoppingCart, Search, Menu, Package, Zap, ArrowLeftRight, X, Layers, Check, Heart, Plus, User as UserIcon, LogOut, Clock, Bookmark } from 'lucide-react';
import { MOCK_PRODUCTS } from './constants';
import { Product, CartItem, User, ViewState } from './types';
import { AIChat } from './components/AIChat';
import { ProductModal } from './components/ProductModal';
import { CartSidebar } from './components/CartSidebar';
import { VoiceInput } from './components/VoiceInput';
import { ImageSearch } from './components/ImageSearch';
import { ComparisonModal } from './components/ComparisonModal';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { OrderHistory } from './components/OrderHistory';
import { Wishlist } from './components/Wishlist';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  // Favorites State
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  
  // Wishlist State
  const [wishlist, setWishlist] = useState<number[]>([]);

  // Comparison State
  const [compareItems, setCompareItems] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Quick Add Feedback State
  const [recentlyAdded, setRecentlyAdded] = useState<number[]>([]);

  // Categories derived from products
  const categories = useMemo(() => {
    const cats = Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)));
    return ['All', ...cats];
  }, []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      const matchesFavorite = !showFavorites || favorites.includes(product.id);
      return matchesSearch && matchesCategory && matchesFavorite;
    });
  }, [searchQuery, activeCategory, showFavorites, favorites]);

  // Wishlist Products
  const wishlistProducts = useMemo(() => {
      return MOCK_PRODUCTS.filter(p => wishlist.includes(p.id));
  }, [wishlist]);

  // Actions
  const handleLogin = (user: User) => {
    setUser(user);
    setCurrentView('HOME');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('HOME'); // Ensure we stay on home or redirect
  };

  const addToCart = (product: Product, options?: { color?: string; size?: string }) => {
    // Default to first variant if not provided but available
    const selectedColor = options?.color || (product.colors?.[0]);
    const selectedSize = options?.size || (product.sizes?.[0]);

    setCartItems(prev => {
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selectedColor === selectedColor && 
        item.selectedSize === selectedSize
      );
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedColor === selectedColor && item.selectedSize === selectedSize)
            ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedColor, selectedSize }];
    });
    setIsCartOpen(true);
  };

  const quickAddToCart = (product: Product) => {
    // Default to first variant if available
    const selectedColor = product.colors?.[0];
    const selectedSize = product.sizes?.[0];

    setCartItems(prev => {
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selectedColor === selectedColor && 
        item.selectedSize === selectedSize
      );
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedColor === selectedColor && item.selectedSize === selectedSize)
            ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedColor, selectedSize }];
    });

    // Trigger feedback
    setRecentlyAdded(prev => [...prev, product.id]);
    setTimeout(() => {
      setRecentlyAdded(prev => prev.filter(id => id !== product.id));
    }, 1500);
  };

  const removeFromCart = (id: number, selectedColor?: string, selectedSize?: string) => {
    setCartItems(prev => prev.filter(item => 
      !(item.id === id && item.selectedColor === selectedColor && item.selectedSize === selectedSize)
    ));
  };

  const updateQuantity = (id: number, delta: number, selectedColor?: string, selectedSize?: string) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id && item.selectedColor === selectedColor && item.selectedSize === selectedSize) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const toggleWishlist = (id: number) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]
    );
  };

  const handleVisualSearchMatch = (productId: number) => {
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
    }
  };

  // Comparison Handlers
  const toggleCompare = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompareItems(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 4) {
        alert("You can only compare up to 4 products at a time.");
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromCompare = (id: number) => {
    setCompareItems(prev => prev.filter(p => p.id !== id));
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Render Logic based on ViewState
  if (currentView === 'SIGN_IN') {
    return <SignIn onSignIn={handleLogin} onNavigate={setCurrentView} />;
  }

  if (currentView === 'SIGN_UP') {
    return <SignUp onSignUp={handleLogin} onNavigate={setCurrentView} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setCurrentView('HOME'); setActiveCategory('All'); setSearchQuery(''); setShowFavorites(false); }}>
              <div className="bg-primary text-white p-2 rounded-lg">
                <Package size={24} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-primary">Lumina</span>
            </div>

            {/* Desktop Search */}
            {(currentView === 'HOME' || currentView === 'PRODUCT_DETAIL') && (
              <div className="hidden md:flex flex-1 max-w-lg mx-8">
                <div className="relative w-full group flex items-center bg-slate-100 rounded-full px-4 focus-within:ring-2 focus-within:ring-primary/10 focus-within:bg-white transition-all">
                  <Search className="text-slate-400 group-focus-within:text-primary transition-colors shrink-0 mr-2" size={20} />
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none py-3 text-slate-800 outline-none placeholder:text-slate-400"
                  />
                  <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                    <VoiceInput onTranscript={setSearchQuery} />
                    <ImageSearch products={MOCK_PRODUCTS} onProductFound={handleVisualSearchMatch} />
                  </div>
                </div>
              </div>
            )}
            
            {(currentView !== 'HOME' && currentView !== 'PRODUCT_DETAIL') && (
                <div className="flex-1"></div>
            )}

            {/* Actions */}
            <div className={`flex items-center gap-2 ${currentView === 'ORDER_HISTORY' ? 'ml-auto' : ''}`}>
              
              {/* Auth Buttons */}
              {user ? (
                <div className="flex items-center gap-3 mr-2 pl-2 border-l border-gray-200">
                  <div className="flex items-center gap-2">
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-gray-200" />
                    <span className="hidden lg:block text-sm font-medium text-slate-700">{user.name}</span>
                  </div>
                  
                  <button 
                    onClick={() => setCurrentView('ORDER_HISTORY')}
                    className={`p-2 rounded-full transition-colors ${currentView === 'ORDER_HISTORY' ? 'bg-slate-100 text-primary' : 'text-slate-400 hover:text-primary hover:bg-slate-50'}`}
                    title="Order History"
                  >
                    <Clock size={20} />
                  </button>

                  <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Sign Out"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mr-2 border-r border-gray-200 pr-4">
                   <button 
                    onClick={() => setCurrentView('SIGN_IN')}
                    className="text-sm font-semibold text-slate-600 hover:text-primary px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => setCurrentView('SIGN_UP')}
                    className="text-sm font-semibold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Wishlist Button */}
              <button 
                className={`relative p-3 rounded-full transition-all group ${currentView === 'WISHLIST' ? 'bg-slate-100 text-primary' : 'hover:bg-slate-100 text-slate-700'}`}
                onClick={() => setCurrentView('WISHLIST')}
                title="Wishlist"
              >
                <Bookmark size={24} className={currentView === 'WISHLIST' ? "fill-current" : "group-hover:text-primary transition-colors"} />
                {wishlist.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border border-white"></span>
                )}
              </button>

              {currentView !== 'ORDER_HISTORY' && (
                <>
                  <button 
                    className={`relative p-3 rounded-full transition-all group ${showFavorites ? 'bg-red-50 text-red-500' : 'hover:bg-slate-100 text-slate-700'}`}
                    onClick={() => {
                        setShowFavorites(!showFavorites);
                        if (currentView !== 'HOME') setCurrentView('HOME');
                    }}
                    title={showFavorites ? "Show All Products" : "Show Favorites"}
                  >
                    <Heart size={24} className={showFavorites ? "fill-current" : "group-hover:text-red-500 transition-colors"} />
                    {favorites.length > 0 && !showFavorites && (
                      <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    )}
                  </button>

                  <button 
                    className="relative p-3 hover:bg-slate-100 rounded-full transition-all group"
                    onClick={() => setIsCartOpen(true)}
                  >
                    <ShoppingCart size={24} className="text-slate-700 group-hover:text-primary transition-colors" />
                    {cartCount > 0 && (
                      <span className="absolute top-1 right-1 bg-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </>
              )}
              <button className="md:hidden p-2 text-slate-700">
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Router */}
      {currentView === 'ORDER_HISTORY' ? (
        <OrderHistory onBack={() => setCurrentView('HOME')} />
      ) : currentView === 'WISHLIST' ? (
        <Wishlist 
            items={wishlistProducts}
            onRemove={(id) => toggleWishlist(id)}
            onAddToCart={(p) => addToCart(p)}
            onBack={() => setCurrentView('HOME')}
        />
      ) : (
        <>
          {/* Hero Section (Small) - Only show if not in favorites view or favorites list is empty */}
          {!showFavorites && (
            <div className="bg-primary text-white py-12 md:py-20 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
              <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6">
                  <Zap size={14} className="text-yellow-400 fill-yellow-400" />
                  <span>AI-Powered Shopping Experience</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                  Curated Tech & Lifestyle
                </h1>
                <p className="text-slate-300 max-w-2xl mx-auto text-lg">
                  Explore our collection of premium essentials. Ask Lumi, our AI assistant, for personalized recommendations.
                </p>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
            
            {/* Header for Favorites View */}
            {showFavorites && (
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                  <Heart className="fill-red-500 text-red-500" size={32} />
                  Your Favorites
                </h2>
                <p className="text-slate-500 mt-2">
                  {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved for later
                </p>
              </div>
            )}

            {/* Category Filters (Hide in Favorites View) */}
            {!showFavorites && (
              <div className="flex gap-2 overflow-x-auto pb-8 scrollbar-hide mb-4">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                      activeCategory === cat
                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                        : 'bg-white text-slate-600 border border-gray-200 hover:border-primary/50 hover:text-primary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(product => {
                const isCompared = compareItems.some(p => p.id === product.id);
                const isFavorite = favorites.includes(product.id);
                const isInWishlist = wishlist.includes(product.id);
                const isJustAdded = recentlyAdded.includes(product.id);

                return (
                  <div 
                    key={product.id}
                    className={`group bg-white rounded-2xl border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 
                      ${isJustAdded ? 'border-green-500 ring-2 ring-green-500 shadow-lg shadow-green-100' : isCompared ? 'border-accent ring-1 ring-accent' : 'border-gray-100'}
                    `}
                  >
                    <div 
                      className="aspect-square relative overflow-hidden bg-gray-100 cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      {/* Buttons Container */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                        {/* Compare Toggle */}
                        <button
                          onClick={(e) => toggleCompare(product, e)}
                          className={`p-2 rounded-full backdrop-blur-sm transition-all shadow-sm ${
                            isCompared 
                              ? 'bg-accent text-white hover:bg-blue-600' 
                              : 'bg-white/80 text-slate-500 hover:bg-white hover:text-accent'
                          }`}
                          title={isCompared ? "Remove from compare" : "Add to compare"}
                        >
                          {isCompared ? <Check size={18} /> : <ArrowLeftRight size={18} />}
                        </button>
                        
                        {/* Favorite Toggle */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(product.id);
                          }}
                          className={`p-2 rounded-full backdrop-blur-sm transition-all shadow-sm ${
                            isFavorite
                              ? 'bg-red-50 text-red-500' 
                              : 'bg-white/80 text-slate-500 hover:bg-white hover:text-red-500'
                          }`}
                          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                        </button>
                        
                        {/* Wishlist Toggle */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                          className={`p-2 rounded-full backdrop-blur-sm transition-all shadow-sm ${
                            isInWishlist
                              ? 'bg-blue-50 text-blue-500' 
                              : 'bg-white/80 text-slate-500 hover:bg-white hover:text-blue-500'
                          }`}
                          title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <Bookmark size={18} fill={isInWishlist ? "currentColor" : "none"} />
                        </button>
                      </div>

                      {/* Quick Add Feedback Message */}
                      {isJustAdded && (
                        <div className="absolute bottom-16 right-4 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300 z-30 pointer-events-none flex items-center gap-1.5">
                          <span>Added to Cart</span>
                          <Check size={12} className="text-green-400" />
                          <div className="absolute -bottom-1 right-4 w-2 h-2 bg-slate-900 rotate-45"></div>
                        </div>
                      )}

                      {/* Quick Add Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          quickAddToCart(product);
                        }}
                        className={`absolute bottom-4 right-4 p-3 rounded-full shadow-lg transition-all z-20 transform hover:scale-110 active:scale-95 ${
                          isJustAdded 
                            ? 'bg-green-500 text-white scale-110 shadow-green-200' 
                            : 'bg-white text-slate-900 hover:bg-primary hover:text-white'
                        }`}
                        title="Quick Add"
                      >
                        {isJustAdded ? <Check size={20} /> : <Plus size={20} />}
                      </button>

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                        <span className="bg-white text-slate-900 px-6 py-2 rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          Quick View
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">{product.category}</p>
                          <h3 
                            className="font-bold text-lg text-slate-900 leading-tight mb-1 cursor-pointer hover:text-primary"
                            onClick={() => setSelectedProduct(product)}
                          >
                            {product.name}
                          </h3>
                        </div>
                        <span className="font-bold text-lg text-slate-900">${product.price}</span>
                      </div>
                      <p className="text-slate-500 text-sm line-clamp-2 mb-4 h-10">
                        {product.description}
                      </p>
                      <button 
                        onClick={() => addToCart(product)}
                        className="w-full bg-slate-50 text-slate-900 font-semibold py-3 rounded-xl border border-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={18} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-gray-50 rounded-3xl mt-8">
                <div className="flex justify-center mb-4">
                  {showFavorites ? <Heart size={48} className="text-slate-300" /> : <Search size={48} className="text-slate-300" />}
                </div>
                <p className="text-slate-500 text-lg font-medium">
                  {showFavorites 
                    ? "You haven't saved any items yet." 
                    : "No products found matching your criteria."}
                </p>
                <button 
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); setShowFavorites(false); }}
                  className="mt-6 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                >
                  {showFavorites ? 'Start Exploring' : 'Clear Filters'}
                </button>
              </div>
            )}
          </main>
        </>
      )}

      {/* Footer (Only show on HOME) */}
      {currentView === 'HOME' && (
        <footer className="bg-white border-t border-gray-200 py-12 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4 text-slate-900 font-bold text-xl">
              <Package size={24} className="text-primary" />
              Lumina
            </div>
            <p className="text-slate-500 mb-8">Next-generation e-commerce powered by Gemini AI.</p>
            <div className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} Lumina Store. All rights reserved.
            </div>
          </div>
        </footer>
      )}

      {/* Floating Compare Button */}
      {compareItems.length > 0 && currentView === 'HOME' && (
        <div className="fixed bottom-6 left-6 z-40 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="bg-slate-900 text-white pl-4 pr-6 py-3 rounded-full shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group"
          >
            <div className="relative">
              <Layers size={20} />
              <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-slate-900">
                {compareItems.length}
              </span>
            </div>
            <span className="font-medium">Compare</span>
            <span className="bg-white/10 px-2 py-0.5 rounded text-xs font-semibold">{compareItems.length} / 4</span>
          </button>
        </div>
      )}

      {/* Overlays */}
      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        onAddToCart={addToCart}
        isFavorite={selectedProduct ? favorites.includes(selectedProduct.id) : false}
        onToggleFavorite={() => selectedProduct && toggleFavorite(selectedProduct.id)}
        isInWishlist={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onToggleWishlist={() => selectedProduct && toggleWishlist(selectedProduct.id)}
      />
      
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />

      <ComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        products={compareItems}
        onRemove={removeFromCompare}
        onAddToCart={addToCart}
      />

      <AIChat products={MOCK_PRODUCTS} />
    </div>
  );
};

export default App;