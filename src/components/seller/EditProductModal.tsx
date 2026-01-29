import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiX,
  HiClock,
  HiSave,
  HiPlus,
} from 'react-icons/hi';
import { cn } from '@/lib/utils';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { apiService } from '@/services/api/api.service';
import { useAuthStore } from '@/store/useAuthStore';
import { triggerCatalogRefresh } from '@/hooks/useCatalog';

interface Variant {
  name: string;
  image: string;
}

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  subCategory: string;
  price: string;
  originalPrice: string;
  stock: string;
  badge: string;
  isNew: boolean;
  variants: Variant[];
  images: string[];
  flashSaleCode: string;
  flashSaleEndTime: string;
}

interface FormErrors {
  [key: string]: string;
}

interface InventoryProduct {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  minStock: number;
  price: number;
  status: 'active' | 'inactive' | 'out_of_stock' | 'low_stock';
  image: string;
  lastUpdated: string;
  totalSold: number;
}

const SUBCATEGORIES: Record<string, string[]> = {
  'Diffusers': [
    'Air Diffusers',
    'Mini Diffusers',
    'Pro Diffusers',
    'Car Diffusers',
    'Starter Kits',
    'Discovery Kits',
  ],
  'Diffuser Oils': [
    'Hotel Scents',
    'Designer Scents',
    'Seasonal Scents',
    'Discovery Sets',
    'Single Oils',
    'Refill Packs',
  ],
  'Room Sprays': [
    'Hotel Collection',
    'Designer Collection',
    'Seasonal Collection',
    'Travel Size',
    'Full Size',
  ],
  'Candles': [
    'Soy Candles',
    'Pillar Candles',
    'Jar Candles',
    'Tea Lights',
    'Woody Scents',
    'Fresh Scents',
    'Floral Scents',
    'Fruity Scents',
    'Oriental Scents',
  ],
  'Perfumes': [
    'Unisex',
    'Feminine',
    'Masculine',
    'Eau de Parfum',
    'Eau de Toilette',
    'Extrait de Parfum',
    'Woody',
    'Fresh & Fruity',
    'Amber & Floral',
  ],
  'Scent Voyage': [
    'Travel Sets',
    'Gift Sets',
    'Limited Edition',
    'Seasonal Collections',
  ],
};

interface EditProductModalProps {
  product: InventoryProduct;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditProductModal({ product, onClose, onSuccess }: EditProductModalProps) {
  const { tokens, getToken } = useAuthStore();
  const [formData, setFormData] = useState<ProductFormData>({
    name: product.name,
    description: '',
    category: product.category,
    subCategory: '',
    price: product.price.toString(),
    originalPrice: '',
    stock: product.stock.toString(),
    badge: '',
    isNew: false,
    variants: [],
    images: [product.image],
    flashSaleCode: '',
    flashSaleEndTime: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch full product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const accessToken = getToken?.() || tokens?.accessToken;
        const fullProduct = await apiService.getProduct(product.id, accessToken);
        setFormData({
          name: fullProduct.name || product.name,
          description: fullProduct.description || '',
          category: fullProduct.category || product.category,
          subCategory: fullProduct.subCategory || '',
          price: fullProduct.price?.toString() || product.price.toString(),
          originalPrice: fullProduct.originalPrice?.toString() || '',
          stock: fullProduct.stock?.toString() || product.stock.toString(),
          badge: fullProduct.badge || '',
          isNew: fullProduct.isNew || false,
          variants: fullProduct.variants?.map((v: string) => ({ name: v, image: '' })) || [],
          images: fullProduct.images || [fullProduct.image || product.image],
          flashSaleCode: fullProduct.flashSale?.code || '',
          flashSaleEndTime: fullProduct.flashSale?.endTime || '',
        });
      } catch (error) {
        console.error('Failed to fetch product details:', error);
        // Use basic product data if API fails
      }
    };

    const accessToken = getToken?.() || tokens?.accessToken;
    if (accessToken) {
      fetchProductDetails();
    }
  }, [product, tokens?.accessToken, getToken]);

  const handleFieldChange = (field: keyof ProductFormData, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (formData.originalPrice && parseFloat(formData.originalPrice) <= parseFloat(formData.price || '0')) {
      newErrors.originalPrice = 'Original price must be greater than sale price';
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result as string;
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, imageUrl],
          }));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Get fresh token from store
    const accessToken = getToken?.() || tokens?.accessToken;
    
    if (!accessToken) {
      setErrors({ general: 'Authentication required. Please sign in again.' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const productData: Record<string, any> = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        image: formData.images[0] || product.image,
        stock: parseInt(formData.stock) || 0,
      };

      if (formData.description && formData.description.trim()) {
        productData.description = formData.description;
      }
      if (formData.subCategory && formData.subCategory.trim()) {
        productData.subCategory = formData.subCategory;
      }
      if (formData.originalPrice && formData.originalPrice.trim()) {
        productData.originalPrice = parseFloat(formData.originalPrice);
      }
      if (formData.images && formData.images.length > 1) {
        productData.images = formData.images;
      }
      if (formData.badge && formData.badge.trim()) {
        productData.badge = formData.badge;
      }
      if (formData.isNew) {
        productData.isNew = true;
      }
      if (formData.variants && formData.variants.length > 0) {
        productData.variants = formData.variants.map((v) => v.name).filter(Boolean);
      }
      if (formData.flashSaleCode && formData.flashSaleCode.trim()) {
        productData.flashSale = {
          code: formData.flashSaleCode,
          endTime: formData.flashSaleEndTime || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        };
      }

      await apiService.updateProduct(product.id, productData, accessToken);
      // Trigger global catalog refresh so all pages update
      triggerCatalogRefresh();
      onSuccess();
    } catch (error) {
      console.error('Failed to update product:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update product. Please try again.';
      if (errorMessage.toLowerCase().includes('unauthorized') || errorMessage.includes('401')) {
        setErrors({ general: 'Your session has expired. Please sign in again.' });
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <HiX className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errors.general}
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className={cn(
                    'w-full px-4 py-2 border rounded-lg',
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  )}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleFieldChange('category', e.target.value)}
                    className={cn(
                      'w-full px-4 py-2 border rounded-lg',
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    )}
                  >
                    <option value="">Select category</option>
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>

                {formData.category && SUBCATEGORIES[formData.category] && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sub Category
                    </label>
                    <select
                      value={formData.subCategory}
                      onChange={(e) => handleFieldChange('subCategory', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select sub category</option>
                      {SUBCATEGORIES[formData.category].map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleFieldChange('price', e.target.value)}
                    className={cn(
                      'w-full px-4 py-2 border rounded-lg',
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    )}
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => handleFieldChange('originalPrice', e.target.value)}
                    className={cn(
                      'w-full px-4 py-2 border rounded-lg',
                      errors.originalPrice ? 'border-red-500' : 'border-gray-300'
                    )}
                  />
                  {errors.originalPrice && <p className="text-red-500 text-sm mt-1">{errors.originalPrice}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock *
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleFieldChange('stock', e.target.value)}
                    className={cn(
                      'w-full px-4 py-2 border rounded-lg',
                      errors.stock ? 'border-red-500' : 'border-gray-300'
                    )}
                  />
                  {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => handleFieldChange('isNew', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">Mark as New</span>
                </label>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
              <div className="grid grid-cols-4 gap-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img src={img} alt={`Product ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <HiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-[color:var(--ds-primary)] transition-colors"
                >
                  <HiPlus className="w-6 h-6 text-gray-400" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-[color:var(--ds-primary)] to-[color:var(--ds-accent)] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <HiClock className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <HiSave className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
