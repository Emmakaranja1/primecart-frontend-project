import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { Skeleton } from '@/ui/Skeleton';
import type { Product } from '@/types/product';
import { useProducts } from '@/hooks/useProducts';

interface ProductGridProps {
  products?: Product[];
  isLoading?: boolean;
  columns?: 2 | 3 | 4;
  useStoreData?: boolean; 
}

export default function ProductGrid({ 
  products: propProducts, 
  isLoading: propIsLoading = false, 
  columns = 3,
  useStoreData = true
}: ProductGridProps) {
  
  const storeData = useProducts();
  const products = useStoreData ? storeData.products : (propProducts || []);
  const isLoading = useStoreData ? storeData.isLoading : propIsLoading;
  const error = useStoreData ? storeData.error : null;
  const gridCols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  };

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 ${gridCols[columns]} gap-8 md:gap-12`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-6">
            <Skeleton className="aspect-[4/5] rounded-[2rem]" />
            <div className="space-y-3 px-2">
              <Skeleton className="h-6 w-2/3 rounded-lg" />
              <Skeleton className="h-4 w-1/2 rounded-lg" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && !isLoading) {
    return (
      <div className="text-center py-32 bg-red-50 dark:bg-red-900/20 rounded-[3rem] border border-red-200 dark:border-red-800 transition-colors duration-300">
        <p className="text-red-600 dark:text-red-400 font-medium text-lg">Error: {error?.message || 'An error occurred'}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <p className="text-slate-400 dark:text-slate-500 font-medium text-lg">No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-8 md:gap-12`}>
      {products.map((product, idx) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
}

