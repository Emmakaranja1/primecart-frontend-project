import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal, Search } from 'lucide-react';
import { useProductStore } from '../stores/productStore';
import ProductCard from '../components/shop/ProductCard';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { FilterPanel } from '../components/filters/FilterPanel';
import { cn } from '../utils/helpers';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, pagination, listProducts, isLoading } = useProductStore();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const category = searchParams.get('category') || null;
  const brand = searchParams.get('brand') || null;
  const minPrice = parseInt(searchParams.get('min_price') || '0');
  const maxPrice = parseInt(searchParams.get('max_price') || '1000000');
  const featured = searchParams.get('featured') === 'true';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    listProducts({
      category: category || undefined,
      brand: brand || undefined,
      min_price: minPrice,
      max_price: maxPrice,
      featured,
      page,
      search: searchQuery,
      limit: 12
    });
  }, [listProducts, category, brand, minPrice, maxPrice, featured, page, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (searchQuery) prev.set('search', searchQuery);
      else prev.delete('search');
      prev.set('page', '1');
      return prev;
    });
  };

  const handleCategoryChange = (cat: string | null) => {
    setSearchParams(prev => {
      if (cat) prev.set('category', cat);
      else prev.delete('category');
      prev.set('page', '1');
      return prev;
    });
  };

  const handleBrandChange = (b: string | null) => {
    setSearchParams(prev => {
      if (b) prev.set('brand', b);
      else prev.delete('brand');
      prev.set('page', '1');
      return prev;
    });
  };

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    setSearchParams(prev => {
      prev.set(`${type}_price`, value.toString());
      prev.set('page', '1');
      return prev;
    });
  };

  const handleFeaturedChange = (val: boolean) => {
    setSearchParams(prev => {
      if (val) prev.set('featured', 'true');
      else prev.delete('featured');
      prev.set('page', '1');
      return prev;
    });
  };

  const handleClearAll = () => {
    setSearchParams(new URLSearchParams());
    setSearchQuery('');
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 space-y-6 md:space-y-0">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2 dark:text-white">Shop All</h1>
            <p className="text-slate-500 dark:text-slate-400">Discover our full range of premium products.</p>
          </div>

          <div className="flex items-center space-x-4 w-full md:w-auto">
            <form onSubmit={handleSearch} className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-10 rounded-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-white"
              />
            </form>
            <Button 
              variant="outline" 
              className="rounded-full dark:border-slate-800 dark:text-white dark:hover:bg-slate-900"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <FilterPanel
              selectedCategory={category}
              onCategoryChange={handleCategoryChange}
              selectedBrand={brand}
              onBrandChange={handleBrandChange}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onMinPriceChange={(val) => handlePriceChange('min', val)}
              onMaxPriceChange={(val) => handlePriceChange('max', val)}
              isFeatured={featured}
              onFeaturedChange={handleFeaturedChange}
              onClearAll={handleClearAll}
            />
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-4">
                    <div className="aspect-[4/5] bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3 animate-pulse" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-16 flex justify-center space-x-2">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                      <Button
                        key={p}
                        variant={page === p ? 'default' : 'outline'}
                        className={cn(
                          "w-10 h-10 p-0 rounded-lg",
                          page !== p && "dark:border-slate-800 dark:text-white dark:hover:bg-slate-900"
                        )}
                        onClick={() => setSearchParams(prev => {
                          prev.set('page', p.toString());
                          return prev;
                        })}
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 mb-4">
                  <Search className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                </div>
                <h3 className="text-xl font-bold mb-2 dark:text-white">No products found</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Try adjusting your filters or search query.</p>
                <Button 
                  variant="outline" 
                  className="dark:border-slate-800 dark:text-white dark:hover:bg-slate-900"
                  onClick={handleClearAll}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-white dark:bg-slate-950 z-[70] p-8 lg:hidden shadow-2xl overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-bold dark:text-white">Filters</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(false)} className="dark:text-white dark:hover:bg-slate-900">
                  <X className="w-6 h-6" />
                </Button>
              </div>
              
              <FilterPanel
                selectedCategory={category}
                onCategoryChange={handleCategoryChange}
                selectedBrand={brand}
                onBrandChange={handleBrandChange}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onMinPriceChange={(val) => handlePriceChange('min', val)}
                onMaxPriceChange={(val) => handlePriceChange('max', val)}
                isFeatured={featured}
                onFeaturedChange={handleFeaturedChange}
                onClearAll={handleClearAll}
              />
              
              <div className="mt-10">
                <Button className="w-full h-12 rounded-xl" onClick={() => setIsFilterOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
