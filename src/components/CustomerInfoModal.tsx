import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Phone, Save } from 'lucide-react';

interface CustomerInfo {
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

interface CustomerInfoModalProps {
  onSave: (info: CustomerInfo) => void;
  initialData?: Partial<CustomerInfo>;
}

export const CustomerInfoModal = ({ onSave, initialData }: CustomerInfoModalProps) => {
  const [formData, setFormData] = useState<CustomerInfo>({
    fullName: initialData?.fullName || '',
    phoneNumber: initialData?.phoneNumber || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    province: initialData?.province || '',
    postalCode: initialData?.postalCode || ''
  });

  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  const validateForm = () => {
    const newErrors: Partial<CustomerInfo> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.province.trim()) {
      newErrors.province = 'Province is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="relative bg-gradient-to-br from-pink-500 to-purple-600 p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Complete Your Profile</h2>
          <p className="text-pink-100">We need your information for order delivery</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                errors.fullName ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="Juan Dela Cruz"
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                errors.phoneNumber ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="+63 912 345 6789"
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Street Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                errors.address ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="123 Main Street, Barangay Name"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          {/* City and Province */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                City/Municipality
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                  errors.city ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Manila"
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Province
              </label>
              <input
                type="text"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                  errors.province ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Metro Manila"
              />
              {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
            </div>
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Postal Code (Optional)
            </label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              placeholder="1000"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Information
          </button>

          <p className="text-sm text-gray-500 text-center">
            Your information will be used for order delivery and communication purposes only.
          </p>
        </form>
      </motion.div>
    </div>
  );
};
