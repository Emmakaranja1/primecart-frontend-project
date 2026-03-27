import { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Edit, 
  Trash2, 
  Plus,
  Tag,
  Box,
  TrendingUp,
  TrendingDown,
  Star,
  Download,
  RefreshCw,
  Grid,
  List
} from 'lucide-react';
import { Card, CardContent } from '@/ui/Card';
import { Badge } from '@/ui/Badge';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { formatCurrency } from '@/utils/helpers';
import { toast } from 'sonner';
import type { Product } from '@/api/productService';
import { useProductStore } from '@/stores/productStore';
import ProductForm from './ProductForm';

interface ProductFilters {
  search: string;
  category: string;
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
    updateProduct,
    deleteProduct,
    clearErrors
  } = useProductStore();
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: 'all',
    status: 'all',
    priceRange: 'all',
    featured: 'all',
  });
  
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  useEffect(() => {
    listAdminProducts();
  }, [listAdminProducts]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'An error occurred');
      clearErrors();
    }
  }, [error, clearErrors]);

  const filteredProducts = (productsData?.products || []).filter((product: Product) => {
    const matchesSearch = product.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         product.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.category === 'all' || product.category === filters.category;
    const matchesStatus = filters.status === 'all' || 
                         (filters.status === 'active' && product.is_active) ||
                         (filters.status === 'inactive' && !product.is_active);
    const matchesFeatured = filters.featured === 'all' || 
                          (filters.featured === 'featured' && product.featured) ||
                          (filters.featured === 'regular' && !product.featured);
    
    return matchesSearch && matchesCategory && matchesStatus && matchesFeatured;
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
      setSelectedProducts(filteredProducts.map((product: Product) => product.id));
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    const success = await deleteProduct(productId);
    if (success) {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
      toast.success('Product deleted successfully');
    } else {
      toast.error('Failed to delete product');
    }
  };

  const handleToggleProductStatus = async (productId: number, currentStatus: boolean) => {
    const product = productsData?.products.find((p: Product) => p.id === productId);
    if (!product) return;
    
    try {
      await updateProduct(productId, { 
        title: product.title,
        description: product.description || null,
        price: Number(product.price),
        quantity: Number(product.quantity),
        category: product.category || null,
        brand: product.brand || null,
        image: product.image || null,
        is_active: !currentStatus,
        featured: product.featured || false,
      });
      toast.success(`Product ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error('Failed to update product status');
    }
  };

  const handleToggleFeatured = async (productId: number, currentFeatured: boolean) => {
    const product = productsData?.products.find((p: Product) => p.id === productId);
    if (!product) return;
    
    try {
      await updateProduct(productId, { 
        title: product.title,
        description: product.description || null,
        price: Number(product.price),
        quantity: Number(product.quantity),
        category: product.category || null,
        brand: product.brand || null,
        image: product.image || null,
        is_active: product.is_active || false,
        featured: !currentFeatured,
      });
      toast.success(`Product ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`);
    } catch (error) {
      toast.error('Failed to update product featured status');
    }
  };

  const handleExportProducts = () => {
    toast.success('Products exported successfully');
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 'success' : 'destructive';
  };

  const getStockBadge = (quantity: number) => {
    if (quantity > 50) return 'success';
    if (quantity > 10) return 'warning';
    return 'destructive';
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-slate-950/50 hover:-translate-y-1">
      <div className="relative">
        <img
          src={product.image || 'https://picsum.photos/seed/product/400/400'}
          alt={product.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://picsum.photos/seed/product/400/400';
          }}
        />
        {product.featured && (
          <div className="absolute top-2 left-2">
            <Badge variant="default" className="bg-yellow-500 text-white border-none">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant={getStatusBadge(product.is_active!)}>
            {product.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">
              {product.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
              {product.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(Number(product.price))}
            </span>
            <Badge variant={getStockBadge(Number(product.quantity))}>
              Stock: {product.quantity}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>{product.category}</span>
            <span>{product.brand}</span>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Button 
            variant="ghost"
            size="sm"
            className="rounded-lg"
            onClick={() => setEditingProduct(product)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-lg"
              onClick={() => handleToggleProductStatus(product.id, product.is_active!)}
            >
              {product.is_active ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <TrendingUp className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-lg text-red-600 hover:text-red-700"
              onClick={() => handleDeleteProduct(product.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Product Management</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Loading products...</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
          ))}
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
          <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-lg"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-lg"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          
          <Button variant="outline" size="sm" className="rounded-xl" onClick={handleExportProducts}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="rounded-xl" onClick={() => {
            setEditingProduct(undefined);
            setShowProductModal(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
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
                  {productsData?.products?.filter((p: Product) => p.is_active).length || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 flex items-center justify-center">
                <Box className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Featured</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {productsData?.products?.filter((p: Product) => p.featured).length || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Low Stock</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {productsData?.products?.filter((p: Product) => Number(p.quantity) <= 10).length || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
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
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Clothing">Clothing</option>
                <option value="Home">Home</option>
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

      {/* Products Display */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Products ({filteredProducts.length})
        </h2>
        
        {selectedProducts.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {selectedProducts.length} selected
            </span>
            <Button variant="outline" size="sm" className="rounded-xl">
              <Tag className="w-4 h-4 mr-2" />
              Bulk Edit
            </Button>
          </div>
        )}
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product: Product) => (
            <div key={product.id} className="relative">
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.id)}
                onChange={() => handleSelectProduct(product.id)}
                className="absolute top-4 left-4 z-10 rounded-lg border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
              />
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
          <CardContent className="p-6">
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
                      Price
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Stock
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Status
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product: Product) => (
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
                            src={product.image || 'https://picsum.photos/seed/product/60/60'}
                            alt={product.title}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://picsum.photos/seed/product/60/60';
                            }}
                          />
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {product.title}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {product.brand}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline">
                          {product.category}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {formatCurrency(Number(product.price))}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={getStockBadge(Number(product.quantity))}>
                          {product.quantity}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Badge variant={getStatusBadge(product.is_active!)}>
                            {product.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          {product.featured && (
                            <Badge variant="default" className="bg-yellow-500 text-white">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-lg"
                            onClick={() => setEditingProduct(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-lg"
                            onClick={() => handleToggleFeatured(product.id, product.featured!)}
                          >
                            <Star className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-lg text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* ProductForm Modal */}
      {showProductModal && (
        <ProductForm
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(undefined);
          }}
          initialData={editingProduct}
        />
      )}
    </div>
  );
}
