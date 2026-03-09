import { useState } from 'react';
import { X, Save, Plus, Trash2, Upload } from 'lucide-react';
import { Product } from '../data';

interface ProductFormProps {
  product?: Product;
  onSave: (product: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

export const ProductForm = ({ product, onSave, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    title: product?.title || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || 'Educational',
    image: product?.image || '',
    features: product?.features || [''],
    whatsInside: product?.whatsInside ? [...product.whatsInside] : [''],
    perfectFor: product?.perfectFor ? [...product.perfectFor] : ['']
  });

  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(product?.image || '');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleImageFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleImageFile(files[0]);
    }
  };

  const handleImageFile = (file: File) => {
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
    };
    reader.readAsDataURL(file);

    // Set the image path
    const imagePath = `/Product%20images/${encodeURIComponent(file.name)}`;
    setFormData({ ...formData, image: imagePath });
    
    alert(`Image selected: ${file.name}\n\nIMPORTANT: Please manually upload this image to /public/Product images/ folder before saving the product.`);
  };

  const handleArrayChange = (field: 'features' | 'whatsInside' | 'perfectFor', index: number, value: string) => {
    const currentArray = formData[field] || [];
    const newArray = [...currentArray];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: 'features' | 'whatsInside' | 'perfectFor') => {
    const currentArray = formData[field] || [];
    setFormData({ ...formData, [field]: [...currentArray, ''] });
  };

  const removeArrayItem = (field: 'features' | 'whatsInside' | 'perfectFor', index: number) => {
    const currentArray = formData[field] || [];
    const newArray = currentArray.filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty strings from arrays
    const cleanedData = {
      ...formData,
      features: formData.features.filter(f => f.trim()),
      whatsInside: formData.whatsInside ? formData.whatsInside.filter(f => f.trim()) : undefined,
      perfectFor: formData.perfectFor ? formData.perfectFor.filter(f => f.trim()) : undefined
    };

    onSave(cleanedData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-8 shadow-2xl">
        <div className="relative bg-gradient-to-br from-pink-500 to-purple-600 p-6 text-white flex items-center justify-between">
          <h2 className="text-2xl font-bold">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button
            onClick={onCancel}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Product Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter product title"
            />
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₱)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="Educational">Educational</option>
                <option value="Design Services">Design Services</option>
              </select>
            </div>
          </div>

          {/* Image Upload - Drag and Drop */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>
            
            {/* Drag and Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                isDragging 
                  ? 'border-pink-500 bg-pink-50' 
                  : 'border-gray-300 hover:border-pink-400 hover:bg-gray-50'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {imagePreview ? (
                <div className="space-y-3">
                  <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                  <p className="text-sm text-gray-600">Click or drag to change image</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-12 h-12 mx-auto text-gray-400" />
                  <div>
                    <p className="text-lg font-semibold text-gray-700">Drop image here or click to browse</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Manual Path Input (fallback) */}
            <div className="mt-3">
              <input
                type="text"
                value={formData.image}
                onChange={(e) => {
                  setFormData({ ...formData, image: e.target.value });
                  setImagePreview(e.target.value);
                }}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                placeholder="Or enter image path manually: /Product images/filename.png"
              />
              <p className="text-xs text-gray-500 mt-1">
                <strong>Note:</strong> Upload the image file to /public/Product images/ folder manually
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              rows={4}
              placeholder="Enter product description"
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Features</label>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleArrayChange('features', index, e.target.value)}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="e.g., 90+ pages"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('features', index)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('features')}
              className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Feature
            </button>
          </div>

          {/* What's Inside */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">What's Inside (Optional)</label>
            {(formData.whatsInside || []).map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('whatsInside', index, e.target.value)}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="e.g., A-Z Alphabet practice"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('whatsInside', index)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('whatsInside')}
              className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          {/* Perfect For */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Perfect For (Optional)</label>
            {(formData.perfectFor || []).map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('perfectFor', index, e.target.value)}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="e.g., Homeschool and classroom use"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('perfectFor', index)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('perfectFor')}
              className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {product ? 'Update Product' : 'Add Product'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-4 border-2 border-gray-200 hover:border-gray-300 rounded-xl font-bold text-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
