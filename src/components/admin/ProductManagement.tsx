import { useState, useEffect } from 'react';
import { 
  Search, 
  Edit, 
  Trash2, 
  Plus,
  Tag,
  TrendingUp,
  Star,
  RefreshCw,
  Package
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/Card';
import { Badge } from '@/ui/Badge';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { formatCurrency } from '@/utils/helpers';
import { getProductImage } from '@/utils/imageUtils';
import { toast } from 'sonner';
import { CATEGORIES, BRANDS } from '@/constants/categories';
import type { Product } from '@/api/productService';
import { useProductStore } from '@/stores/productStore';
import ProductForm from './ProductForm';

interface ProductFilters {
  search: string;
  category: string;
  brand: string;
  status: string;
  priceRange: string;
  featured: string;
}

export default function ProductManagement() {
  const { 
    adminProducts: productsData, 
    isLoading, 
    error,
    listAdminProducts,
    deleteProduct,
    clearErrors
  } = useProductStore();
  
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [deleteConfirmProductId, setDeleteConfirmProductId] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: 'all',
    brand: 'all',
    status: 'all',
    priceRange: 'all',
    featured: 'all',
  });

  useEffect(() => {
    if (!productsData || productsData.products.length === 0) {
      listAdminProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'An error occurred');
      clearErrors();
    }
  }, [error, clearErrors]);

  const uniqueCategories = CATEGORIES;
  const uniqueBrands = BRANDS;

  const filteredProducts = (productsData?.products || []).filter((product: Product) => {
    const matchesSearch = product.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         product.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.category === 'all' || product.category === filters.category;
    const matchesBrand = filters.brand === 'all' || product.brand === filters.brand;
    const matchesStatus = filters.status === 'all' || 
                         (filters.status === 'active' && product.is_active) ||
                         (filters.status === 'inactive' && !product.is_active);
    const matchesFeatured = filters.featured === 'all' || 
                          (filters.featured === 'featured' && product.featured) ||
                          (filters.featured === 'regular' && !product.featured);
    
    return matchesSearch && matchesCategory && matchesBrand && matchesStatus && matchesFeatured;
  });

  const handleSelectProduct = (productId: number) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(product => product.id));
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      await deleteProduct(productId);
      setSelectedProducts(prev => prev.filter(id => id !== productId));
      setDeleteConfirmProductId(null);
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Delete product error:', error);
      
      // Handle different error types
      if (error && typeof error === 'object' && 'success' in error) {
        // Backend returned error response
        const backendError = error as { success: boolean; message: string; status?: number };
        if (backendError.status === 400) {
          toast.error(backendError.message || 'Cannot delete product due to constraints');
        } else if (backendError.status === 404) {
          toast.error('Product not found');
        } else {
          toast.error(backendError.message || 'Failed to delete product');
        }
      } else {
        // Network or other error
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Failed to delete product: ${errorMessage}`);
      }
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await listAdminProducts();
      setLastRefreshed(new Date());
      toast.success('Products refreshed');
    } catch {
      toast.error('Failed to refresh products');
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 'success' : 'warning';
  };

  const getFeaturedBadge = (featured: boolean) => {
    return featured ? 'default' : 'secondary';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Product Management</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Loading products...</p>
          </div>
        </div>
        
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Product Management</h1>
            <p className="text-red-600 dark:text-red-400 mt-1">Error: {error.message}</p>
          </div>
          <Button onClick={() => listAdminProducts()} className="rounded-xl">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Product Management</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your products, inventory, and pricing
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="default" 
            size="sm" 
            className="rounded-xl bg-purple-600 dark:bg-purple-700 text-white border-purple-700 dark:border-purple-800 hover:bg-purple-700 dark:hover:bg-purple-800 shadow-lg shadow-purple-200/50 dark:shadow-none transition-all duration-200"
            onClick={() => {
              setEditingProduct(undefined);
              setShowProductForm(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="rounded-xl bg-emerald-600 dark:bg-emerald-700 text-white border-emerald-700 dark:border-emerald-800 hover:bg-emerald-700 dark:hover:bg-emerald-800 shadow-lg shadow-emerald-200/50 dark:shadow-none transition-all duration-200"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            title="Refresh products list"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          {lastRefreshed && (
            <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
              Updated: {lastRefreshed.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Products</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {productsData?.products?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Products</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {productsData?.products?.filter(p => p.is_active).length || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Featured Products</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {productsData?.products?.filter(p => p.featured).length || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Categories</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {uniqueCategories.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                <Tag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Brands</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {uniqueBrands.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search products by name, description, or brand..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:bg-white dark:focus:bg-slate-700"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:bg-white dark:focus:bg-slate-700 text-slate-900 dark:text-white font-medium"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map((category: string) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                value={filters.brand}
                onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:bg-white dark:focus:bg-slate-700 text-slate-900 dark:text-white font-medium"
              >
                <option value="all">All Brands</option>
                {uniqueBrands.map((brand: string) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
              
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:bg-white dark:focus:bg-slate-700 text-slate-900 dark:text-white font-medium"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              
              <select
                value={filters.featured}
                onChange={(e) => setFilters(prev => ({ ...prev, featured: e.target.value }))}
                className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:bg-white dark:focus:bg-slate-700 text-slate-900 dark:text-white font-medium"
              >
                <option value="all">All Products</option>
                <option value="featured">Featured</option>
                <option value="regular">Regular</option>
              </select>
              
              <Button variant="outline" size="icon" className="rounded-xl">
                <RefreshCw className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
            Products ({filteredProducts.length})
          </CardTitle>
          
          {selectedProducts.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {selectedProducts.length} selected
              </span>
              <Button variant="outline" size="sm" className="rounded-xl">
                <Trash2 className="w-4 h-4 mr-2" />
                Bulk Delete
              </Button>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="p-6 pt-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="text-left py-4 px-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length}
                      onChange={handleSelectAll}
                      className="rounded-lg border-slate-300 dark:border-slate-600"
                    />
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Product
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Category
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Brand
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Price
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Stock
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Status
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Featured
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="rounded-lg border-slate-300 dark:border-slate-600"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={getProductImage(product.image, `seed/${product.id}/200/200`)}
                          alt={product.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {product.title}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-[200px]">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="text-xs">
                        {product.category || 'Uncategorized'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary" className="text-xs">
                        {product.brand || 'No Brand'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(product.price)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-sm font-medium ${
                        (product.quantity as number) > 10 ? 'text-emerald-600 dark:text-emerald-400' :
                        (product.quantity as number) > 0 ? 'text-amber-600 dark:text-amber-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {product.quantity || 0} units
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={getStatusBadge(product.is_active || false)} className="text-xs">
                        {product.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={getFeaturedBadge(product.featured || false)} className="text-xs">
                        {product.featured ? 'Featured' : 'Regular'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      {deleteConfirmProductId === product.id ? (
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 border border-red-200 dark:border-red-800 text-sm space-y-2">
                          <p className="font-medium text-red-900 dark:text-red-100">Delete product?</p>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-lg text-xs"
                              onClick={() => setDeleteConfirmProductId(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="rounded-lg text-xs"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 shadow-sm"
                            onClick={() => {
                              setEditingProduct(product);
                              setShowProductForm(true);
                            }}
                            title="Edit product"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all duration-200 shadow-sm"
                            onClick={() => setDeleteConfirmProductId(product.id)}
                            title="Delete product permanently"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </CardContent>
      </Card>
      
      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm 
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(undefined);
          }}
          initialData={editingProduct}
        />
      )}
    </div>
  );
}
