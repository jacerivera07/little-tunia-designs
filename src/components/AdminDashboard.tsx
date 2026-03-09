import { useState, useEffect } from 'react';
import { Package, Plus, Edit, Bell, LogOut, Trash2, CheckCircle, X, BookOpen, Palette, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, onSnapshot, updateDoc, doc, query, addDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../data';
import { ProductForm } from './ProductForm';
import { migrateProductsToFirestore } from '../utils/migrateProducts';

interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  customerInfo?: {
    fullName: string;
    phoneNumber: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
  };
  paymentProof?: string;
  paymentProofFileName?: string;
  items: Array<{
    id: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'completed';
  date: string;
}

interface AdminDashboardProps {
  onClose: () => void;
  adminUser: any;
}

export const AdminDashboard = ({ onClose, adminUser }: AdminDashboardProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeCategory, setActiveCategory] = useState<'pending' | 'confirmed' | 'completed' | 'all'>('pending');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

  // Load orders
  useEffect(() => {
    const ordersQuery = query(collection(db, 'orders'));

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const allOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      
      // Sort by date in JavaScript
      allOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setOrders(allOrders);
    }, (error) => {
      console.error('Error loading orders:', error);
    });

    return () => unsubscribe();
  }, []);

  // Load products from Firestore
  useEffect(() => {
    const productsQuery = query(collection(db, 'products'));

    const unsubscribe = onSnapshot(productsQuery, (snapshot) => {
      const allProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      
      setProducts(allProducts);
    }, (error) => {
      console.error('Error loading products:', error);
    });

    return () => unsubscribe();
  }, []);

  const handleSaveProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      if (editingProduct) {
        // Update existing product
        await setDoc(doc(db, 'products', editingProduct.id), productData);
        alert('Product updated successfully!');
      } else {
        // Add new product
        await addDoc(collection(db, 'products'), productData);
        alert('Product added successfully!');
      }
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'products', productId));
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const filteredOrders = activeCategory === 'all' 
    ? orders 
    : orders.filter(o => o.status === activeCategory);

  const updateOrderStatus = async (orderId: string, newStatus: 'pending' | 'confirmed' | 'completed') => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  return (
    <div className="min-h-screen bg-[#fffcfd] text-gray-800 font-sans">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2">
              <img src="/Web%20images/tunia%20logo.png" alt="Little Tunia Designs" className="h-12 w-auto" />
              <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Little Tunia Designs - Admin
              </span>
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {adminUser?.photoURL ? (
                    <img src={adminUser.photoURL} alt={adminUser.displayName || 'Admin'} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white">
                      <Package className="w-5 h-5" />
                    </div>
                  )}
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">{adminUser?.displayName}</p>
                      <p className="text-sm text-gray-500">{adminUser?.email}</p>
                      <p className="text-xs text-pink-600 font-semibold mt-1">ADMIN</p>
                    </div>
                    <button 
                      onClick={onClose}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative">
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
            Admin Dashboard
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight"
          >
            Manage Your Store. <br />
            <span className="text-pink-500">Track Every Order.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-10"
          >
            View and manage all customer orders, update product listings, and keep track of your business.
          </motion.p>
        </div>
      </section>

      {/* Stats Section with Tabs */}
      <section className="py-16 bg-white border-y border-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Tab Switcher */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-8 py-3 rounded-full font-semibold transition-all ${
                activeTab === 'orders'
                  ? 'bg-pink-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Orders Management
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-8 py-3 rounded-full font-semibold transition-all ${
                activeTab === 'products'
                  ? 'bg-pink-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Products Management
            </button>
          </div>

          {/* Stats Grid */}
          {activeTab === 'orders' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-yellow-50 text-yellow-500 rounded-xl flex items-center justify-center mb-4">
                  <Bell className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-3xl mb-2">{orders.filter(o => o.status === 'pending').length}</h3>
                <p className="text-gray-500">Pending Orders</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-3xl mb-2">{orders.filter(o => o.status === 'confirmed').length}</h3>
                <p className="text-gray-500">Confirmed Orders</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-50 text-green-500 rounded-xl flex items-center justify-center mb-4">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-3xl mb-2">{orders.filter(o => o.status === 'completed').length}</h3>
                <p className="text-gray-500">Completed Orders</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-3xl mb-2">{products.length}</h3>
                <p className="text-gray-500">Total Products</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-3xl mb-2">{products.filter(p => p.category === 'Educational').length}</h3>
                <p className="text-gray-500">Educational</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <Palette className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-3xl mb-2">{products.filter(p => p.category === 'Design Services').length}</h3>
                <p className="text-gray-500">Design Services</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Orders Section (styled like Shop Section) */}
      {activeTab === 'orders' && (
        <section id="orders" className="py-24 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Order Management</h2>
            <p className="text-gray-600">View and manage all customer orders.</p>
          </div>
          <div className="flex gap-2">
            {[
              { key: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
              { key: 'confirmed', label: 'Confirmed', count: orders.filter(o => o.status === 'confirmed').length },
              { key: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'completed').length },
              { key: 'all', label: 'All', count: orders.length }
            ].map((cat) => (
              <button 
                key={cat.key}
                onClick={() => setActiveCategory(cat.key as any)}
                className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all active:scale-95 ${
                  activeCategory === cat.key 
                    ? 'bg-pink-500 border-pink-500 text-white shadow-lg' 
                    : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50 text-gray-600'
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-20">
                <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No {activeCategory !== 'all' ? activeCategory : ''} orders</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-pink-200 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-xl text-gray-900">{order.userName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{order.userEmail}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(order.date).toLocaleString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-pink-600">₱{order.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{order.items.length} item(s)</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex-shrink-0">
                        <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-lg" />
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    {order.status === 'pending' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateOrderStatus(order.id, 'confirmed');
                        }}
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                      >
                        Confirm Order
                      </button>
                    )}
                    {order.status === 'confirmed' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateOrderStatus(order.id, 'completed');
                        }}
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
                      >
                        Mark as Completed
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(order);
                      }}
                      className="px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-pink-300 hover:bg-pink-50 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </section>
      )}

      {/* Products Management Section */}
      {activeTab === 'products' && (
        <section id="products" className="py-24 max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Product Management</h2>
              <p className="text-gray-600">Add, edit, or remove products from your store.</p>
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowProductForm(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Product
            </button>
          </div>

          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {products.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg mb-4">No products in database</p>
                  <p className="text-gray-400 text-sm mb-6">Import existing products or add new ones</p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={async () => {
                        if (confirm('This will import all 7 products from the code to Firestore. Continue?')) {
                          await migrateProductsToFirestore();
                        }
                      }}
                      className="px-6 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                      <Package className="w-5 h-5" />
                      Import 7 Existing Products
                    </button>
                    <button
                      onClick={() => setShowProductForm(true)}
                      className="px-6 py-3 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add New Product
                    </button>
                  </div>
                </div>
              ) : (
                products.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-pink-200 hover:shadow-xl transition-all group flex flex-col"
                  >
                    <div className="relative h-64 bg-gray-50 overflow-hidden flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                        product.category === 'Educational' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {product.category}
                      </span>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">{product.title}</h3>
                      <p className="text-2xl font-bold text-pink-600 mb-4">₱{product.price.toFixed(2)}</p>
                      <div className="flex gap-2 mt-auto">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setShowProductForm(true);
                          }}
                          className="flex-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1 border border-blue-200"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </section>
      )}

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          product={editingProduct || undefined}
          onSave={handleSaveProduct}
          onCancel={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Order Detail Modal (styled like Product Modal) */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-br from-pink-500 to-purple-600 p-8 text-white">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-3xl font-bold mb-2">Order Details</h2>
                <p className="text-pink-100">Order ID: {selectedOrder.id}</p>
              </div>
              
              <div className="p-8">
                <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-200">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedOrder.userName}</h3>
                    <p className="text-gray-600">{selectedOrder.userEmail}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(selectedOrder.date).toLocaleString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    selectedOrder.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {selectedOrder.status.toUpperCase()}
                  </span>
                </div>

                {/* Customer Delivery Information */}
                {selectedOrder.customerInfo && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-500" />
                      Delivery Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600 font-semibold">Full Name:</p>
                        <p className="text-gray-900">{selectedOrder.customerInfo.fullName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-semibold">Phone Number:</p>
                        <p className="text-gray-900">{selectedOrder.customerInfo.phoneNumber}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-600 font-semibold">Address:</p>
                        <p className="text-gray-900">
                          {selectedOrder.customerInfo.address}, {selectedOrder.customerInfo.city}, {selectedOrder.customerInfo.province}
                          {selectedOrder.customerInfo.postalCode && ` ${selectedOrder.customerInfo.postalCode}`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Proof */}
                {selectedOrder.paymentProof && (
                  <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100">
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Payment Proof
                    </h4>
                    <img 
                      src={selectedOrder.paymentProof} 
                      alt="Payment Proof" 
                      className="w-full max-w-md mx-auto rounded-lg border-2 border-green-200 cursor-pointer hover:border-green-400 transition-colors"
                      onClick={() => window.open(selectedOrder.paymentProof, '_blank')}
                      title="Click to view full size"
                    />
                    <p className="text-xs text-gray-500 text-center mt-2">Click image to view full size</p>
                  </div>
                )}

                <h4 className="text-lg font-bold text-gray-900 mb-4">Order Items:</h4>
                <div className="space-y-4 mb-6">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 bg-gray-50 rounded-xl p-4">
                      <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 mb-1">{item.title}</h5>
                        <p className="text-sm text-gray-600 mb-2">Quantity: {item.quantity}</p>
                        <p className="text-pink-600 font-bold">₱{item.price.toFixed(2)} each</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">₱{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t-2 border-gray-200 mb-6">
                  <span className="text-xl font-bold text-gray-900">Total:</span>
                  <span className="text-3xl font-bold text-pink-600">₱{selectedOrder.total.toFixed(2)}</span>
                </div>

                <div className="flex gap-4">
                  {selectedOrder.status === 'pending' && (
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'confirmed');
                        setSelectedOrder(null);
                      }}
                      className="flex-1 py-4 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-lg transition-colors"
                    >
                      Confirm Order
                    </button>
                  )}
                  {selectedOrder.status === 'confirmed' && (
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'completed');
                        setSelectedOrder(null);
                      }}
                      className="flex-1 py-4 px-6 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-lg transition-colors"
                    >
                      Mark as Completed
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedOrder(null)}
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
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <img src="/Web%20images/tunia%20logo.png" alt="Little Tunia Designs" className="h-10 w-auto" />
            <span className="text-xl font-bold text-gray-900">Little Tunia Designs</span>
          </div>
          <p className="text-gray-500 mb-8 leading-relaxed max-w-2xl mx-auto">
            Admin Dashboard - Manage your store with ease.
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 pt-10 border-t border-gray-200 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Little Tunia Designs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
