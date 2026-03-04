import { useState } from 'react';
import { ShoppingBag, Star, Mail, Instagram, Facebook, BookOpen, Palette, ChevronRight, Menu, X, Download, ShoppingCart, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { products, Product } from './data';
import { ProductCard } from './components/ProductCard';

const App = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAddToCart = (_product: Product) => {
    setCartCount(prev => prev + 1);
  };

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
              <img src="public/web images/tunia logo.png" alt="Little Tunia Designs" className="h-12 w-auto" />
              <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Little Tunia Designs
              </span>
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('shop')} className="text-gray-600 hover:text-pink-600 font-medium transition-colors">Shop</button>
              <button onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-pink-600 font-medium transition-colors">About</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-600 hover:text-pink-600 font-medium transition-colors">Contact</button>
              <button className="relative p-2 text-gray-700 hover:text-pink-600 transition-colors">
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>
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
          style={{ backgroundImage: "url('public/web images/tunia background.png')" }}
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
            Art that givs back. <br />
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
                src="public/web images/about tunia.png" 
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
                  className="w-full h-80 object-cover"
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

      {/* Footer */}
      <footer className="bg-gray-50 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <img src="/web images/tunia logo.png" alt="Little Tunia Designs" className="h-10 w-auto" />
              <span className="text-xl font-bold text-gray-900">Little Tunia Designs</span>
            </div>
            <p className="text-gray-500 max-w-sm mb-6 leading-relaxed">
              We create educational materials that spark joy and professional designs that build brands. Our mission is to make learning and business beautiful.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-pink-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-pink-500 transition-colors">
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
