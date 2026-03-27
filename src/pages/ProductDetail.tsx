import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProductStore } from '@/stores/productStore';
import { Button } from '@/ui/Button';
import ProductGallery from '@/components/shop/ProductGallery';
import ProductInfo from '@/components/shop/ProductInfo';
import ProductActions from '@/components/shop/ProductActions';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { currentProduct, getProductById, isLoadingProduct, productError } = useProductStore();

  useEffect(() => {
    if (id) {
      getProductById(parseInt(id));
    }
  }, [id, getProductById]);


  if (isLoadingProduct) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4 md:px-8 dark:bg-slate-950 transition-colors duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
          <div className="space-y-8">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4 animate-pulse" />
            <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded w-full animate-pulse" />
            <div className="h-14 bg-slate-200 dark:bg-slate-800 rounded w-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (productError || !currentProduct) {
    return (
      <div className="pt-40 pb-20 text-center dark:bg-slate-950 transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Product not found</h2>
        <Link to="/products">
          <Button variant="outline" className="dark:border-slate-800 dark:text-slate-300">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-slate-400 dark:text-slate-500 mb-12">
          <Link to="/" className="hover:text-primary dark:hover:text-blue-400">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary dark:hover:text-blue-400">Shop</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100 font-medium truncate max-w-[200px]">{currentProduct.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ProductGallery product={currentProduct} />
          </motion.div>

          {/* Info and Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <ProductInfo product={currentProduct} />
            <ProductActions product={currentProduct} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}