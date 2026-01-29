import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiArrowLeft,
  HiPlus,
  HiX,
  HiUpload,
  HiPhotograph,
  HiTag,
  HiSparkles,
  HiCheckCircle,
  HiClock,
  HiSave,
  HiInformationCircle,
} from 'react-icons/hi';
import { PageContainer } from '@/components/ui/layout/PageContainer';
import { Seo } from '@/components/seo/Seo';
import { Button } from '@/components/ui/Button';
import { cn, formatPrice } from '@/lib/utils';
import { compressImage, isDataUrlTooLarge } from '@/lib/imageUtils';

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

import { PRODUCT_CATEGORIES, PRODUCT_BADGES } from '@/lib/constants';

// Sub-categories mapping
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


export function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: '',
    subCategory: '',
    price: '',
    originalPrice: '',
    stock: '',
    badge: '',
    isNew: false,
    variants: [],
    images: [],
    flashSaleCode: '',
    flashSaleEndTime: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ProductFormData, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentVariant, setCurrentVariant] = useState('');
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFieldChange = (field: keyof ProductFormData, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    // Clear error when field is updated
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

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
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

    if (formData.images.length === 0) {
      newErrors.images = 'At least one product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        try {
          // Compress image before adding
          const compressedImage = await compressImage(file, 800, 800, 0.8);
          
          // Check if still too large after compression
          if (isDataUrlTooLarge(compressedImage, 0.5)) {
            // Compress more aggressively
            const moreCompressed = await compressImage(file, 600, 600, 0.6);
            setFormData((prev) => ({
              ...prev,
              images: [...prev.images, moreCompressed],
            }));
            setImagePreview((prev) => [...prev, moreCompressed]);
          } else {
            setFormData((prev) => ({
              ...prev,
              images: [...prev.images, compressedImage],
            }));
            setImagePreview((prev) => [...prev, compressedImage]);
          }
        } catch (error) {
          console.error('Failed to compress image:', error);
          // Fallback to original if compression fails
          const reader = new FileReader();
          reader.onloadend = () => {
            const imageUrl = reader.result as string;
            setFormData((prev) => ({
              ...prev,
              images: [...prev.images, imageUrl],
            }));
            setImagePreview((prev) => [...prev, imageUrl]);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddVariant = () => {
    if (currentVariant.trim() && !formData.variants.some((v) => v.name === currentVariant.trim())) {
      setFormData((prev) => ({
        ...prev,
        variants: [...prev.variants, { name: currentVariant.trim(), image: '' }],
      }));
      setCurrentVariant('');
    }
  };

  const handleRemoveVariant = (variantName: string) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((v) => v.name !== variantName),
    }));
  };

  const handleVariantImageUpload = async (variantName: string, file: File) => {
    try {
      // Compress variant image
      const compressedImage = await compressImage(file, 600, 600, 0.7);
      setFormData((prev) => ({
        ...prev,
        variants: prev.variants.map((v) =>
          v.name === variantName ? { ...v, image: compressedImage } : v
        ),
      }));
    } catch (error) {
      console.error('Failed to compress variant image:', error);
      // Fallback to original
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setFormData((prev) => ({
          ...prev,
          variants: prev.variants.map((v) =>
            v.name === variantName ? { ...v, image: imageUrl } : v
          ),
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (saveAsDraft: boolean = false) => {
    if (!saveAsDraft && !validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setShowSuccess(false);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Prepare product data - DO NOT include 'id' (MongoDB generates it)
      // Backend ValidationPipe has forbidNonWhitelisted: true, so only send DTO-defined fields
      
      // Limit images to first 3 to avoid payload size issues
      const imagesToSend = formData.images.slice(0, 3);
      
      const productData: Record<string, any> = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        image: imagesToSend[0] || '',
        status: saveAsDraft ? 'draft' : 'active', // Set to 'active' so products show up immediately
      };

      // Add optional fields only if they have actual values (not empty strings)
      if (formData.description && formData.description.trim()) {
        productData.description = formData.description;
      }
      if (formData.subCategory && formData.subCategory.trim()) {
        productData.subCategory = formData.subCategory;
      }
      if (formData.originalPrice && formData.originalPrice.trim()) {
        productData.originalPrice = parseFloat(formData.originalPrice);
      }
      // Only send additional images if they exist and are not too large
      if (imagesToSend.length > 1) {
        // Filter out images that are too large
        const validImages = imagesToSend.filter(img => !isDataUrlTooLarge(img, 0.5));
        if (validImages.length > 1) {
          productData.images = validImages;
        }
      }
      if (formData.stock && formData.stock.trim()) {
        const stockNum = parseInt(formData.stock);
        if (!isNaN(stockNum)) {
          productData.stock = stockNum;
        }
      }
      if (formData.badge && formData.badge.trim()) {
        productData.badge = formData.badge;
      }
      if (formData.isNew) {
        productData.isNew = true;
      }
      if (formData.variants && formData.variants.length > 0) {
        productData.variants = formData.variants.map((v) => v.name).filter(Boolean);
        const variantImages = formData.variants.reduce((acc, v) => {
          if (v.image && v.image.trim()) {
            acc[v.name] = v.image;
          }
          return acc;
        }, {} as Record<string, string>);
        if (Object.keys(variantImages).length > 0) {
          productData.variantImages = variantImages;
        }
      }
      if (formData.flashSaleCode && formData.flashSaleCode.trim()) {
        productData.flashSale = {
          code: formData.flashSaleCode,
          endTime: formData.flashSaleEndTime || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        };
      }

      console.log('Product data to submit:', productData);

      // Get auth token from store
      const { useAuthStore } = await import('@/store/useAuthStore');
      const token = useAuthStore.getState().getToken();
      
      if (!token) {
        throw new Error('You must be logged in to create products');
      }

      // Call API to create product
      const { apiService } = await import('@/services/api/api.service');
      await apiService.createProduct(productData, token);

      // Show success message
      setShowSuccess(true);
      
      // Navigate back to dashboard after delay
      setTimeout(() => {
        navigate('/seller/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Failed to create product:', error);
      setErrors({ general: 'Failed to create product. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[color:var(--ds-surface-alt)] via-white to-[color:var(--ds-surface-alt)]">
      <Seo
        title="Add New Product — Scentiment Seller"
        description="Add a new fragrance product to your store"
        canonicalPath="/seller/products/new"
      />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <PageContainer className="py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/seller/dashboard"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <HiArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Dashboard</span>
            </Link>
            <div className="text-2xl font-serif font-semibold text-gray-900">Scentiment</div>
          </div>
        </PageContainer>
      </header>

      <PageContainer className="py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[color:var(--ds-primary)] to-[color:var(--ds-accent)] flex items-center justify-center shadow-lg">
                <HiPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
                <p className="text-gray-600 mt-1">List a new fragrance product in your store</p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="mb-6 rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 flex items-start gap-3 shadow-lg"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <HiCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                </motion.div>
                <div>
                  <p className="text-sm font-semibold text-green-800">Product published successfully!</p>
                  <p className="text-xs text-green-700 mt-1">Redirecting to dashboard...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3"
            >
              <HiInformationCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{errors.general}</p>
            </motion.div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(false); }} className="space-y-6">
            {/* Basic Information */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <HiSparkles className="w-5 h-5 text-[color:var(--ds-primary)]" />
                Basic Information
              </h2>

              <div className="space-y-5">
                {/* Product Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                    placeholder="e.g., Ocean Breeze Candle"
                    className={cn(
                      'ui-input w-full',
                      touched.name && errors.name ? 'border-red-500 focus:border-red-500' : ''
                    )}
                  />
                  {touched.name && errors.name && (
                    <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, description: true }))}
                    placeholder="Describe your product... (e.g., Covers up to 1,000 sqft. Includes Top 3 Hotel Scents)"
                    rows={4}
                    className={cn(
                      'ui-input w-full resize-none',
                      touched.description && errors.description ? 'border-red-500 focus:border-red-500' : ''
                    )}
                  />
                  {touched.description && errors.description && (
                    <p className="mt-1 text-xs text-red-600">{errors.description}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => {
                      handleFieldChange('category', e.target.value);
                      // Reset subcategory when category changes
                      handleFieldChange('subCategory', '');
                    }}
                    onBlur={() => setTouched((prev) => ({ ...prev, category: true }))}
                    className={cn(
                      'ui-input w-full',
                      touched.category && errors.category ? 'border-red-500 focus:border-red-500' : ''
                    )}
                  >
                    <option value="">Select a category</option>
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {touched.category && errors.category && (
                    <p className="mt-1 text-xs text-red-600">{errors.category}</p>
                  )}
                </div>

                {/* Sub-Category */}
                {formData.category && SUBCATEGORIES[formData.category] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label htmlFor="subCategory" className="block text-sm font-semibold text-gray-900 mb-2">
                      Sub-Category <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <select
                      id="subCategory"
                      value={formData.subCategory}
                      onChange={(e) => handleFieldChange('subCategory', e.target.value)}
                      onBlur={() => setTouched((prev) => ({ ...prev, subCategory: true }))}
                      className={cn(
                        'ui-input w-full',
                        touched.subCategory && errors.subCategory ? 'border-red-500 focus:border-red-500' : ''
                      )}
                    >
                      <option value="">Select a sub-category (optional)</option>
                      {SUBCATEGORIES[formData.category].map((subCat) => (
                        <option key={subCat} value={subCat}>
                          {subCat}
                        </option>
                      ))}
                    </select>
                    {touched.subCategory && errors.subCategory && (
                      <p className="mt-1 text-xs text-red-600">{errors.subCategory}</p>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.section>

            {/* Pricing & Inventory */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <HiTag className="w-5 h-5 text-[color:var(--ds-primary)]" />
                Pricing & Inventory
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Price */}
                <div>
                  <label htmlFor="price" className="block text-sm font-semibold text-gray-900 mb-2">
                    Price (€) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => handleFieldChange('price', e.target.value)}
                      onBlur={() => setTouched((prev) => ({ ...prev, price: true }))}
                      placeholder="0.00"
                      className={cn(
                        'ui-input w-full pl-8',
                        touched.price && errors.price ? 'border-red-500 focus:border-red-500' : ''
                      )}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                  </div>
                  {touched.price && errors.price && (
                    <p className="mt-1 text-xs text-red-600">{errors.price}</p>
                  )}
                </div>

                {/* Original Price */}
                <div>
                  <label htmlFor="originalPrice" className="block text-sm font-semibold text-gray-900 mb-2">
                    Original Price (€) <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.originalPrice}
                      onChange={(e) => handleFieldChange('originalPrice', e.target.value)}
                      onBlur={() => setTouched((prev) => ({ ...prev, originalPrice: true }))}
                      placeholder="0.00"
                      className={cn(
                        'ui-input w-full pl-8',
                        touched.originalPrice && errors.originalPrice ? 'border-red-500 focus:border-red-500' : ''
                      )}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                  </div>
                  {touched.originalPrice && errors.originalPrice && (
                    <p className="mt-1 text-xs text-red-600">{errors.originalPrice}</p>
                  )}
                  {formData.originalPrice && formData.price && (
                    <p className="mt-1 text-xs text-green-600">
                      Save: {formatPrice(parseFloat(formData.originalPrice) - parseFloat(formData.price))}
                    </p>
                  )}
                </div>

                {/* Stock */}
                <div>
                  <label htmlFor="stock" className="block text-sm font-semibold text-gray-900 mb-2">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => handleFieldChange('stock', e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, stock: true }))}
                    placeholder="0"
                    className={cn(
                      'ui-input w-full',
                      touched.stock && errors.stock ? 'border-red-500 focus:border-red-500' : ''
                    )}
                  />
                  {touched.stock && errors.stock && (
                    <p className="mt-1 text-xs text-red-600">{errors.stock}</p>
                  )}
                </div>
              </div>
            </motion.section>

            {/* Product Images */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <HiPhotograph className="w-5 h-5 text-[color:var(--ds-primary)]" />
                Product Images <span className="text-red-500">*</span>
              </h2>

              <div className="space-y-4">
                {/* Image Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[color:var(--ds-primary)] transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <HiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop images here, or{' '}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[color:var(--ds-primary)] font-semibold hover:underline"
                    >
                      browse files
                    </button>
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>

                {/* Image Preview Grid */}
                {imagePreview.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <AnimatePresence>
                      {imagePreview.map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200"
                        >
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {index === 0 && (
                            <span className="absolute top-2 left-2 px-2 py-1 text-xs font-semibold bg-[color:var(--ds-primary)] text-white rounded">
                              Primary
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <HiX className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {touched.images && errors.images && (
                  <p className="text-xs text-red-600">{errors.images}</p>
                )}
              </div>
            </motion.section>

            {/* Variants */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <HiTag className="w-5 h-5 text-[color:var(--ds-primary)]" />
                Variants (Optional)
              </h2>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentVariant}
                    onChange={(e) => setCurrentVariant(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddVariant();
                      }
                    }}
                    placeholder="e.g., Black, Silver, White"
                    className="ui-input flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="px-4 py-2 bg-gradient-to-r from-[color:var(--ds-primary)] to-[color:var(--ds-accent)] text-white rounded-lg font-semibold hover:shadow-md transition-all flex items-center gap-2"
                  >
                    <HiPlus className="w-4 h-4" />
                    Add
                  </button>
                </div>

                {formData.variants.length > 0 && (
                  <div className="space-y-4">
                    {formData.variants.map((variant) => (
                      <motion.div
                        key={variant.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50"
                      >
                        {/* Variant Image Preview/Upload */}
                        <div className="flex-shrink-0">
                          <label
                            htmlFor={`variant-image-${variant.name}`}
                            className="block w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 bg-white cursor-pointer hover:border-[color:var(--ds-primary)] transition-colors overflow-hidden group"
                          >
                            {variant.image ? (
                              <img
                                src={variant.image}
                                alt={variant.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 group-hover:text-[color:var(--ds-primary)] transition-colors">
                                <HiPhotograph className="w-6 h-6 mb-1" />
                                <span className="text-xs text-center px-1">Upload</span>
                              </div>
                            )}
                            <input
                              id={`variant-image-${variant.name}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleVariantImageUpload(variant.name, file);
                                }
                              }}
                            />
                          </label>
                        </div>

                        {/* Variant Info */}
                        <div className="flex-1 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-3 py-1.5 bg-[color:var(--ds-primary)]/10 text-[color:var(--ds-primary)] rounded-full text-sm font-semibold">
                                {variant.name}
                              </span>
                            </div>
                            {!variant.image && (
                              <p className="text-xs text-gray-500">Click image area to upload variant picture</p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(variant.name)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove variant"
                          >
                            <HiX className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.section>

            {/* Badge & Options */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <HiSparkles className="w-5 h-5 text-[color:var(--ds-primary)]" />
                Badge & Options
              </h2>

              <div className="space-y-5">
                {/* Badge Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Product Badge (Optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRODUCT_BADGES.map((badge) => (
                      <button
                        key={badge}
                        type="button"
                        onClick={() => handleFieldChange('badge', formData.badge === badge ? '' : badge)}
                        className={cn(
                          'px-4 py-2 rounded-lg font-semibold text-sm transition-all',
                          formData.badge === badge
                            ? 'bg-gradient-to-r from-[color:var(--ds-primary)] to-[color:var(--ds-accent)] text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        )}
                      >
                        {badge}
                      </button>
                    ))}
                  </div>
                </div>

                {/* New Product Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isNew"
                    checked={formData.isNew}
                    onChange={(e) => handleFieldChange('isNew', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-[color:var(--ds-primary)] focus:ring-[color:var(--ds-primary)]"
                  />
                  <label htmlFor="isNew" className="text-sm font-semibold text-gray-900 cursor-pointer">
                    Mark as New Arrival
                  </label>
                </div>

                {/* Flash Sale */}
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <HiClock className="w-5 h-5 text-[color:var(--ds-primary)]" />
                    <label className="text-sm font-semibold text-gray-900">Flash Sale (Optional)</label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="flashSaleCode" className="block text-xs text-gray-600 mb-1">
                        Sale Code
                      </label>
                      <input
                        id="flashSaleCode"
                        type="text"
                        value={formData.flashSaleCode}
                        onChange={(e) => handleFieldChange('flashSaleCode', e.target.value.toUpperCase())}
                        placeholder="e.g., STORM"
                        className="ui-input w-full"
                        maxLength={10}
                      />
                    </div>
                    <div>
                      <label htmlFor="flashSaleEndTime" className="block text-xs text-gray-600 mb-1">
                        End Time
                      </label>
                      <input
                        id="flashSaleEndTime"
                        type="datetime-local"
                        value={formData.flashSaleEndTime}
                        onChange={(e) => handleFieldChange('flashSaleEndTime', e.target.value)}
                        className="ui-input w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200"
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <HiSave className="w-4 h-4" />
                Save as Draft
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-[color:var(--ds-primary)] to-[color:var(--ds-accent)] hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <HiClock className="w-4 h-4" />
                    </motion.div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <HiCheckCircle className="w-4 h-4" />
                    Publish Product
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </PageContainer>
    </div>
  );
}
