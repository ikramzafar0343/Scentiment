import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiArrowLeft,
  HiCube,
  HiSearch,
  HiPlus,
  HiMinus,
  HiPencil,
  HiTrash,
  HiCheck,
  HiX,
  HiExclamationCircle,
  HiCollection,
  HiTrendingUp,
  HiChevronDown,
} from 'react-icons/hi';
import { PageContainer } from '@/components/ui/layout/PageContainer';
import { Seo } from '@/components/seo/Seo';
import { cn, formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import placeholderImage100 from '@/assets/images/placeholder-100.svg';
import { apiService } from '@/services/api/api.service';
import { useAuthStore } from '@/store/useAuthStore';
import { EditProductModal } from '@/components/seller/EditProductModal';
import { triggerCatalogRefresh } from '@/hooks/useCatalog';

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

// Mock inventory data - replace with actual API calls
const MOCK_PRODUCTS: InventoryProduct[] = [
  {
    id: '1',
    name: 'Ocean Breeze Candle',
    category: 'Candles',
    sku: 'CND-OB-001',
    stock: 45,
    minStock: 20,
    price: 49.99,
    status: 'active',
    image: placeholderImage100,
    lastUpdated: '2024-01-15',
    totalSold: 245,
  },
  {
    id: '2',
    name: 'Santal Diffuser Oil',
    category: 'Diffuser Oils',
    sku: 'OIL-ST-002',
    stock: 8,
    minStock: 15,
    price: 39.99,
    status: 'low_stock',
    image: placeholderImage100,
    lastUpdated: '2024-01-14',
    totalSold: 198,
  },
  {
    id: '3',
    name: 'Lavender Room Spray',
    category: 'Room Sprays',
    sku: 'SPR-LV-003',
    stock: 0,
    minStock: 10,
    price: 29.99,
    status: 'out_of_stock',
    image: placeholderImage100,
    lastUpdated: '2024-01-13',
    totalSold: 156,
  },
  {
    id: '4',
    name: 'Scent Diffuser Mini 2',
    category: 'Diffusers',
    sku: 'DFF-MN-004',
    stock: 120,
    minStock: 25,
    price: 29.99,
    status: 'active',
    image: placeholderImage100,
    lastUpdated: '2024-01-15',
    totalSold: 134,
  },
  {
    id: '5',
    name: 'Rose Perfume',
    category: 'Perfumes',
    sku: 'PRF-RS-005',
    stock: 35,
    minStock: 20,
    price: 79.99,
    status: 'active',
    image: placeholderImage100,
    lastUpdated: '2024-01-12',
    totalSold: 112,
  },
  {
    id: '6',
    name: 'Vanilla Candle',
    category: 'Candles',
    sku: 'CND-VN-006',
    stock: 5,
    minStock: 20,
    price: 49.99,
    status: 'low_stock',
    image: placeholderImage100,
    lastUpdated: '2024-01-11',
    totalSold: 89,
  },
];

const CATEGORIES = ['All Categories', 'Candles', 'Diffuser Oils', 'Room Sprays', 'Diffusers', 'Perfumes'];

export function Inventory() {
  const { tokens } = useAuthStore();
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'low_stock' | 'out_of_stock'>('all');
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [stockValue, setStockValue] = useState<number>(0);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [editingProduct, setEditingProduct] = useState<InventoryProduct | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<InventoryProduct | null>(null);

  // Fetch products from API
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const accessToken = tokens?.accessToken;
      if (!accessToken) {
        setProducts([]);
        return;
      }
      // Pass token to get all products (including pending/draft) for seller
      const apiProducts = await apiService.getProducts(1, 100, accessToken);
      
      // Transform API products to InventoryProduct format
      const inventoryProducts: InventoryProduct[] = apiProducts.map((p: any) => ({
        id: p._id || p.id,
        name: p.name,
        category: p.category,
        sku: p.sku || `SKU-${p._id || p.id}`,
        stock: p.stock || 0,
        minStock: p.minStock || 10,
        price: p.price,
        status: p.stock === 0 ? 'out_of_stock' : (p.stock <= (p.minStock || 10) ? 'low_stock' : 'active') as InventoryProduct['status'],
        image: p.image || placeholderImage100,
        lastUpdated: p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        totalSold: p.totalSold || 0,
      }));
      
      setProducts(inventoryProducts);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Fallback to mock data if API fails
      setProducts(MOCK_PRODUCTS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [tokens?.accessToken]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All Categories' || product.category === selectedCategory;
      const matchesStatus =
        statusFilter === 'all' ||
        product.status === statusFilter ||
        (statusFilter === 'low_stock' && product.stock <= product.minStock);
      const matchesLowStock = !showLowStockOnly || product.stock <= product.minStock;

      return matchesSearch && matchesCategory && matchesStatus && matchesLowStock;
    });
  }, [products, searchQuery, selectedCategory, statusFilter, showLowStockOnly]);

  // Statistics
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;
    const outOfStockCount = products.filter((p) => p.stock === 0).length;
    const totalValue = products.reduce((sum, p) => sum + p.stock * p.price, 0);

    return {
      totalProducts,
      totalStock,
      lowStockCount,
      outOfStockCount,
      totalValue,
    };
  }, [products]);

  const handleStockEdit = (product: InventoryProduct) => {
    setEditingStock(product.id);
    setStockValue(product.stock);
  };

  const handleStockSave = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStock = stockValue;
          let newStatus: InventoryProduct['status'] = 'active';
          if (newStock === 0) {
            newStatus = 'out_of_stock';
          } else if (newStock <= p.minStock) {
            newStatus = 'low_stock';
          }
          return {
            ...p,
            stock: newStock,
            status: newStatus,
            lastUpdated: new Date().toISOString().split('T')[0],
          };
        }
        return p;
      })
    );
    setEditingStock(null);
    setStockValue(0);
  };

  const handleStockCancel = () => {
    setEditingStock(null);
    setStockValue(0);
  };

  const handleQuickStockUpdate = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStock = Math.max(0, p.stock + delta);
          let newStatus: InventoryProduct['status'] = 'active';
          if (newStock === 0) {
            newStatus = 'out_of_stock';
          } else if (newStock <= p.minStock) {
            newStatus = 'low_stock';
          }
          return {
            ...p,
            stock: newStock,
            status: newStatus,
            lastUpdated: new Date().toISOString().split('T')[0],
          };
        }
        return p;
      })
    );
  };

  const handleEditProduct = (product: InventoryProduct) => {
    setEditingProduct(product);
  };

  const handleDeleteProduct = (product: InventoryProduct) => {
    setDeletingProduct(product);
  };

  const confirmDelete = async () => {
    if (!deletingProduct || !tokens?.accessToken) return;

    try {
      await apiService.deleteProduct(deletingProduct.id, tokens.accessToken);
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      setDeletingProduct(null);
      // Trigger global catalog refresh so all pages update
      triggerCatalogRefresh();
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const handleProductUpdated = async () => {
    setEditingProduct(null);
    await fetchProducts();
  };

  const getStatusBadge = (_status: InventoryProduct['status'], stock: number, minStock: number) => {
    if (stock === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
          Out of Stock
        </span>
      );
    }
    if (stock <= minStock) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
          Low Stock
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
        In Stock
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[color:var(--ds-surface-alt)] via-white to-[color:var(--ds-surface-alt)]">
      <Seo
        title="Inventory Management — Scentiment Seller"
        description="Manage your product inventory and stock levels"
        canonicalPath="/seller/inventory"
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
        >
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[color:var(--ds-primary)] to-[color:var(--ds-accent)] flex items-center justify-center shadow-lg">
                  <HiCube className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
                  <p className="text-gray-600 mt-1">Manage stock levels and product availability</p>
                </div>
              </div>
              <Link to="/seller/products/new">
                <Button className="bg-gradient-to-r from-[color:var(--ds-primary)] to-[color:var(--ds-accent)] hover:shadow-lg transition-all flex items-center gap-2">
                  <HiPlus className="w-4 h-4" />
                  Add Product
                </Button>
              </Link>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="group rounded-2xl border border-gray-200/50 p-4 shadow-sm bg-gradient-to-br from-[#0066cc]/20 via-[#e6f2ff]/30 to-[#f0f7ff]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalProducts}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[color:var(--ds-primary)] to-[color:var(--ds-accent)] flex items-center justify-center shadow-md">
                  <HiCollection className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="group rounded-2xl border border-gray-200/50 p-4 shadow-sm bg-gradient-to-br from-blue-200/30 via-blue-100/30 to-blue-50/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Total Stock</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalStock.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                  <HiCube className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="group rounded-2xl border border-gray-200/50 p-4 shadow-sm bg-gradient-to-br from-yellow-200/30 via-yellow-100/30 to-yellow-50/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.lowStockCount}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-md">
                  <HiExclamationCircle className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="group rounded-2xl border border-gray-200/50 p-4 shadow-sm bg-gradient-to-br from-red-200/30 via-rose-100/30 to-red-50/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{stats.outOfStockCount}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md">
                  <HiX className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="group rounded-2xl border border-gray-200/50 p-4 shadow-sm bg-gradient-to-br from-emerald-200/30 via-green-100/30 to-emerald-50/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Inventory Value</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{formatPrice(stats.totalValue)}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                  <HiTrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-white via-gray-50/50 to-white rounded-2xl p-5 shadow-md border border-gray-200/60 mb-6 backdrop-blur-sm"
          >
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="flex-1 relative group">
                <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[color:var(--ds-primary)] transition-colors z-10" />
                <input
                  type="text"
                  placeholder="Search by name or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white/90 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition-all duration-200 focus:border-[color:var(--ds-primary)] focus:ring-2 focus:ring-[color:var(--ds-primary)]/20 focus:bg-white hover:border-gray-300"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full min-w-[180px] pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-white/90 text-sm text-gray-900 shadow-sm outline-none transition-all duration-200 focus:border-[color:var(--ds-primary)] focus:ring-2 focus:ring-[color:var(--ds-primary)]/20 focus:bg-white hover:border-gray-300 appearance-none cursor-pointer font-medium"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                  className="w-full min-w-[150px] pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-white/90 text-sm text-gray-900 shadow-sm outline-none transition-all duration-200 focus:border-[color:var(--ds-primary)] focus:ring-2 focus:ring-[color:var(--ds-primary)]/20 focus:bg-white hover:border-gray-300 appearance-none cursor-pointer font-medium"
                >
                  <option value="all">All Status</option>
                  <option value="active">In Stock</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
                <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Low Stock Toggle */}
              <button
                onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                className={cn(
                  'px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap shadow-sm border',
                  showLowStockOnly
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-yellow-400/30 shadow-md hover:shadow-lg hover:scale-[1.02]'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                )}
              >
                <HiExclamationCircle className={cn('w-4 h-4', showLowStockOnly ? 'text-white' : 'text-yellow-500')} />
                <span className="hidden sm:inline">Low Stock</span>
                <span className="sm:hidden">Low</span>
              </button>
            </div>
          </motion.div>

          {/* Products Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <AnimatePresence>
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                          Loading products…
                        </td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                          No products found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{product.name}</p>
                                <p className="text-xs text-gray-500">{product.totalSold} sold</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600 font-mono">{product.sku}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {editingStock === product.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  value={stockValue}
                                  onChange={(e) => setStockValue(parseInt(e.target.value) || 0)}
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                  min="0"
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleStockSave(product.id)}
                                  className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                >
                                  <HiCheck className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={handleStockCancel}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                >
                                  <HiX className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                <span
                                  className={cn(
                                    'text-sm font-semibold',
                                    product.stock === 0
                                      ? 'text-red-600'
                                      : product.stock <= product.minStock
                                      ? 'text-yellow-600'
                                      : 'text-gray-900'
                                  )}
                                >
                                  {product.stock}
                                </span>
                                <span className="text-xs text-gray-500">/ {product.minStock} min</span>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleQuickStockUpdate(product.id, -1)}
                                    className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                    title="Decrease stock"
                                  >
                                    <HiMinus className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleStockEdit(product)}
                                    className="p-1 text-[color:var(--ds-primary)] hover:bg-[color:var(--ds-primary)]/10 rounded transition-colors"
                                    title="Edit stock"
                                  >
                                    <HiPencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleQuickStockUpdate(product.id, 1)}
                                    className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                    title="Increase stock"
                                  >
                                    <HiPlus className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-semibold text-gray-900">{formatPrice(product.price)}</span>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(product.status, product.stock, product.minStock)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="p-2 text-[color:var(--ds-primary)] hover:bg-[color:var(--ds-primary)]/10 rounded-lg transition-colors"
                                title="Edit product"
                              >
                                <HiPencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete product"
                              >
                                <HiTrash className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </PageContainer>

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={handleProductUpdated}
        />
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setDeletingProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <HiExclamationCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Delete Product</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <strong>{deletingProduct.name}</strong>? This will permanently remove the product from your inventory.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingProduct(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
