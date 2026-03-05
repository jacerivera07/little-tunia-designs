import { useState, useEffect } from 'react';
import { ShoppingBag, Star, Mail, Instagram, Facebook, BookOpen, Palette, ChevronRight, Menu, X, Download, ShoppingCart, CheckCircle, User, LogOut, Plus, Minus, Trash2, CheckCircle2, Clock, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { products, Product } from './data';
import { ProductCard } from './components/ProductCard';
import { auth, googleProvider, db } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';

const App = () => {
  const [cartItems, setCartItems] = useState<Array<Product & { quantity: number }>>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [orders, setOrders] = useState<Array<{
    id: string;
    items: Array<Product & { quantity: number }>;
    total: number;
    status: 'pending' | 'confirmed' | 'completed';
    date: string;
  }>>([]);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoggingIn(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Load user's orders from Firestore
  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }

    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const userOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as typeof orders;
      setOrders(userOrders);
    });

    return () => unsubscribe();
  }, [user]);

  const handleGoogleLogin = async () => {
    if (isLoggingIn) return;
    
    setIsLoggingIn(true);
    
    try {
      await signInWithPopup(auth, googleProvider);
      // Success - user will be set by onAuthStateChanged
    } catch (error: any) {
      setIsLoggingIn(false);
      
      // Only show error for real issues, not user cancellations
      if (error.code === 'auth/popup-closed-by-user' || 
          error.code === 'auth/cancelled-popup-request') {
        console.log('Login cancelled by user');
        return;
      }
      
      console.error('Login error:', error);
      alert(`Login failed: ${error.message}\n\nPlease make sure popups are enabled for this site.`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMenuOpen(false);
    }
  };

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#fffcfd] text-gray-800 font-sans">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2">
              <img src="/Web%20images/tunia%20logo.png" alt="Little Tunia Designs" className="h-12 w-auto" />
              <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Little Tunia Designs
              </span>
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('shop')} className="text-gray-600 hover:text-pink-600 font-medium transition-colors">Shop</button>
              <button onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-pink-600 font-medium transition-colors">About</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-600 hover:text-pink-600 font-medium transition-colors">Contact</button>
              <button 
                onClick={() => setShowCart(true)}
                className="relative p-2 text-gray-700 hover:text-pink-600 transition-colors"
              >
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>
              
              {/* User Profile */}
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-900">{user.displayName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setShowProfile(true);
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                      >
                        <Package className="w-4 h-4" />
                        My Orders
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full font-medium text-gray-700 hover:border-pink-300 hover:bg-pink-50 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <User className="w-4 h-4" />
                  {isLoggingIn ? 'Signing In...' : 'Sign In'}
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-pink-50 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                <button onClick={() => scrollToSection('shop')} className="block text-lg font-medium text-gray-600 w-full text-left">Shop</button>
                <button onClick={() => scrollToSection('about')} className="block text-lg font-medium text-gray-600 w-full text-left">About</button>
                <button onClick={() => scrollToSection('contact')} className="block text-lg font-medium text-gray-600 w-full text-left">Contact</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative">
        {/* Background border image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none"
          style={{ backgroundImage: "url('/Web%20images/tunia%20background.png')" }}
        ></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full bg-pink-50 text-pink-600 text-sm font-bold border border-pink-100"
          >
            Empowering Young Minds Through Design
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight"
          >
            Art that gives back. <br />
            <span className="text-pink-500">In memory of Tunia.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-10"
          >
            Digital resources for tiny learners and bespoke design services for big dreams. 
            From printable tracing books to custom branding.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button onClick={() => scrollToSection('shop')} className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-gray-800 transition-all flex items-center gap-2">
              Browse the Shop <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features/Stats */}
      <section className="py-16 bg-white border-y border-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Instant Downloads</h3>
            <p className="text-gray-500">Get your educational materials immediately after checkout.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center mb-4">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Custom Designs</h3>
            <p className="text-gray-500">Professional branding and cards tailored to your unique vision.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center mb-4">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Loved by Parents</h3>
            <p className="text-gray-500">Rated 5 stars by educators and parents around the world.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gradient-to-b from-pink-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-6">About Little Tunia Designs</h2>
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  Little Tunia Designs was born out of love — love for creativity, and love for a small dog named Tunia who left a big mark on my heart. Every planner, workbook, eBook, and digital template I create carries a touch of that love, designed to inspire, organize, and empower others.
                </p>
                <p>
                  While I'm still growing, my dream is to turn this creative journey into a mission that helps independent animal rescuers — giving back to the heroes who save lives every day. Through every design sold, Little Tunia keeps giving love forward.
                </p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <img 
                src="/Web%20images/about%20tunia.png" 
                alt="about tunia" 
                className="w-full h-auto rounded-3xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Shop Section */}
      <section id="shop" className="py-24 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Our Marketplace</h2>
            <p className="text-gray-600">Premium digital assets and creative services.</p>
          </div>
          <div className="flex gap-2">
            {['All', 'Educational', 'Design Services'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all active:scale-95 ${
                  activeCategory === cat 
                    ? 'bg-pink-500 border-pink-500 text-white shadow-lg' 
                    : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50 text-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Have a custom design project?</h2>
          <p className="text-lg md:text-xl text-pink-50 mb-10 max-w-xl mx-auto relative z-10">
            I'm currently accepting new commissions for business cards, logo design, and social media branding. Let's create something together!
          </p>
          <a href="mailto:hello@littletuniadesigns.com" className="bg-white text-pink-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-pink-50 transition-colors inline-block relative z-10 shadow-xl">
            Get a Free Quote
          </a>
        </div>
      </section>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-full h-96 object-contain bg-gray-50"
                />
              </div>
              
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                      selectedProduct.category === 'Educational' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {selectedProduct.category}
                    </span>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedProduct.title}</h2>
                  </div>
                  <p className="text-3xl font-bold text-pink-600">
                    {selectedProduct.price === 0 ? 'Free' : `₱${selectedProduct.price.toFixed(2)}`}
                  </p>
                </div>
                
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">{selectedProduct.description}</p>
                
                {selectedProduct.whatsInside && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">What's Inside:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedProduct.whatsInside.map((item, idx) => (
                        <div key={idx} className="flex items-center text-gray-700">
                          <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProduct.perfectFor && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Perfect For:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedProduct.perfectFor.map((item, idx) => (
                        <div key={idx} className="flex items-center text-gray-700">
                          <CheckCircle className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Features:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedProduct.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 py-4 px-6 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors active:scale-95"
                  >
                    {selectedProduct.category === 'Educational' ? <Download className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                    {selectedProduct.price === 0 ? 'Download Now' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="px-6 py-4 border-2 border-gray-200 hover:border-gray-300 rounded-xl font-bold text-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Modal */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCart(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, x: 300 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.9, opacity: 0, x: 300 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6" />
                  Shopping Cart ({cartCount})
                </h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">Your cart is empty</p>
                    <button
                      onClick={() => {
                        setShowCart(false);
                        scrollToSection('shop');
                      }}
                      className="mt-4 px-6 py-3 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition-colors"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 bg-gray-50 rounded-xl p-4">
                        <button
                          onClick={() => {
                            setSelectedProduct(item);
                            setShowCart(false);
                          }}
                          className="flex-shrink-0"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-24 h-24 object-cover rounded-lg hover:opacity-80 transition-opacity"
                          />
                        </button>
                        <div className="flex-1">
                          <button
                            onClick={() => {
                              setSelectedProduct(item);
                              setShowCart(false);
                            }}
                            className="text-left hover:text-pink-600 transition-colors"
                          >
                            <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                          </button>
                          <p className="text-pink-600 font-bold mb-2">₱{item.price.toFixed(2)}</p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-auto w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-pink-600">₱{cartTotal.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setShowCart(false);
                      setShowCheckout(true);
                    }}
                    className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCheckout(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {/* Order Summary */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.title} x {item.quantity}
                        </span>
                        <span className="font-semibold text-gray-900">
                          ₱{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-gray-200 flex justify-between">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="font-bold text-pink-600 text-xl">₱{cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h3>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-xl">G</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">GCash Payment</h4>
                        <p className="text-blue-100 text-sm">Fast & Secure</p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-600 mb-3 font-semibold">Scan QR Code or use account details:</p>
                      <img 
                        src="/Web%20images/gcash.jpg" 
                        alt="GCash Payment Details" 
                        className="w-full rounded-lg"
                      />
                    </div>

                    <div className="space-y-2 text-sm">
                      <p className="font-semibold">Instructions:</p>
                      <ol className="list-decimal list-inside space-y-1 text-blue-50">
                        <li>Open your GCash app</li>
                        <li>Send ₱{cartTotal.toFixed(2)} using the QR code or account details above</li>
                        <li>Take a screenshot of the payment confirmation</li>
                        <li>Send the screenshot to our email or Facebook page</li>
                        <li>Include your order details in the message</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Send Payment Proof To:</h3>
                  <div className="space-y-3">
                    <a
                      href="mailto:hello@littletuniadesigns.com"
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <Mail className="w-5 h-5 text-pink-500" />
                      <div>
                        <p className="font-semibold text-gray-900">Email</p>
                        <p className="text-sm text-gray-600">hello@littletuniadesigns.com</p>
                      </div>
                    </a>
                    <a
                      href="https://www.facebook.com/littletunia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <Facebook className="w-5 h-5 text-pink-500" />
                      <div>
                        <p className="font-semibold text-gray-900">Facebook</p>
                        <p className="text-sm text-gray-600">@littletuniadesigns</p>
                      </div>
                    </a>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    if (!user) {
                      alert('Please sign in to place an order');
                      return;
                    }

                    try {
                      const newOrder = {
                        userId: user.uid,
                        userEmail: user.email,
                        userName: user.displayName,
                        items: cartItems.map(item => ({
                          id: item.id,
                          title: item.title,
                          price: item.price,
                          quantity: item.quantity,
                          image: item.image
                        })),
                        total: cartTotal,
                        status: 'pending',
                        date: new Date().toISOString()
                      };

                      await addDoc(collection(db, 'orders'), newOrder);
                      
                      setShowCheckout(false);
                      setShowOrderConfirmation(true);
                      setCartItems([]);
                    } catch (error) {
                      console.error('Error creating order:', error);
                      alert('Failed to create order. Please try again.');
                    }
                  }}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
                >
                  I've Sent the Payment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Profile/Orders Modal */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowProfile(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                <div className="flex items-center gap-3">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-12 h-12 rounded-full border-2 border-white" />
                  ) : (
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-pink-500" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold">{user?.displayName}</h2>
                    <p className="text-pink-100 text-sm">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowProfile(false)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-6 h-6 text-pink-500" />
                  My Orders
                </h3>

                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg mb-2">No orders yet</p>
                    <p className="text-gray-400 text-sm mb-6">Start shopping to see your orders here</p>
                    <button
                      onClick={() => {
                        setShowProfile(false);
                        scrollToSection('shop');
                      }}
                      className="px-6 py-3 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition-colors"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Order #{order.id.slice(-8)}</p>
                            <p className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {order.status === 'pending' && (
                              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Pending
                              </span>
                            )}
                            {order.status === 'confirmed' && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Confirmed
                              </span>
                            )}
                            {order.status === 'completed' && (
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Completed
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-sm">
                              <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg" />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{item.title}</p>
                                <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-semibold text-gray-900">₱{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                          <span className="font-semibold text-gray-900">Total</span>
                          <span className="text-xl font-bold text-pink-600">₱{order.total.toFixed(2)}</span>
                        </div>

                        {order.status === 'pending' && (
                          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                            <p className="text-xs text-yellow-800">
                              ⏳ Waiting for payment confirmation. We'll notify you once verified.
                            </p>
                          </div>
                        )}

                        {order.status === 'completed' && (
                          <button className="mt-4 w-full py-2 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" />
                            Download Products
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Confirmation Modal */}
      <AnimatePresence>
        {showOrderConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowOrderConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">Thank You!</h2>
                <p className="text-pink-100">Your order has been received</p>
              </div>

              <div className="p-8 text-center">
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  We will notify you once your payment is confirmed. You'll receive your digital products via email shortly after verification.
                </p>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-800 font-semibold mb-2">
                    📧 Check your email for order details
                  </p>
                  <p className="text-xs text-blue-600">
                    If you have any questions, feel free to contact us!
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowOrderConfirmation(false);
                    scrollToSection('shop');
                  }}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg mb-3"
                >
                  Continue Shopping
                </button>
                
                <button
                  onClick={() => setShowOrderConfirmation(false)}
                  className="w-full py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-gray-50 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <img src="/Web%20images/tunia%20logo.png" alt="Little Tunia Designs" className="h-10 w-auto" />
              <span className="text-xl font-bold text-gray-900">Little Tunia Designs</span>
            </div>
            <p className="text-gray-500 max-w-sm mb-6 leading-relaxed">
              We create educational materials that spark joy and professional designs that build brands. Our mission is to make learning and business beautiful.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-pink-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/littletunia" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-pink-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-pink-500 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase text-sm tracking-widest">Resources</h4>
            <ul className="space-y-4 text-gray-500">
              <li><a href="#" className="hover:text-pink-600 transition-colors">Printables Guide</a></li>
              <li><a href="#" className="hover:text-pink-600 transition-colors">Education Blog</a></li>
              <li><a href="#" className="hover:text-pink-600 transition-colors">Design Portfolio</a></li>
              <li><a href="#" className="hover:text-pink-600 transition-colors">Free Worksheets</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase text-sm tracking-widest">Support</h4>
            <ul className="space-y-4 text-gray-500">
              <li><a href="#" className="hover:text-pink-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-pink-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-pink-600 transition-colors">Refund Policy</a></li>
              <li><a href="#" className="hover:text-pink-600 transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 pt-10 border-t border-gray-200 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Little Tunia Designs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
