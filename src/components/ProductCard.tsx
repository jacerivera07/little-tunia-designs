import { ShoppingCart, Download, CheckCircle } from 'lucide-react';
import { Product } from '../data';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden group">
        <img 
          src={product.image} 
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
            product.category === 'Educational' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
          }`}>
            {product.category}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">{product.title}</h3>
          <p className="text-xl font-bold text-pink-600">
            {product.price === 0 ? 'Free' : `₱${product.price.toFixed(2)}`}
          </p>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <div className="space-y-2 mb-6 flex-grow">
          {product.features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-center text-xs text-gray-500">
              <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
              {feature}
            </div>
          ))}
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="w-full py-3 px-4 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors active:scale-95"
        >
          {product.category === 'Educational' ? <Download className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          {product.price === 0 ? 'Download Now' : 'Add to Cart'}
        </button>
      </div>
    </motion.div>
  );
};
