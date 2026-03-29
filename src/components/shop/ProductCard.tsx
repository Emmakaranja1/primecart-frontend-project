import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/ui/Button';
import { Badge } from '@/ui/Badge';
import type { Product } from '@/types/product';
import { formatCurrency } from '@/utils/helpers';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}


const getProductRating = (productId: number): number => {
  
  const seed = productId % 100;
  return 3.5 + (seed % 15) / 10;
};

const getProductImage = (product: Product) => {
  if (product.image) {
    let imageUrl = product.image.trim();
    
    if (imageUrl) {
      
      if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
        imageUrl = `https://${imageUrl}`;
      }
      
      
      try {
        new URL(imageUrl);
        return imageUrl;
      } catch {
        
        return `https://picsum.photos/seed/${product.id}/600/800`;
      }
    }
  }
  
  
  return `https://picsum.photos/seed/${product.id}/600/800`;
};

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.src = `https://picsum.photos/seed/fallback/600/800`;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const rating = getProductRating(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addItem({ product_id: product.id, quantity: 1 });
      toast.success(`${product.title} added to cart`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };


return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-slate-950/50 transition-all"
    >
      <Link to={`/products/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-slate-50 dark:bg-slate-800">
          <img
            src={getProductImage(product)}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
            onError={handleImageError}
          />
          
          {product.featured && (
            <div className="absolute top-4 left-4">
              <Badge variant="default" className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-primary dark:text-white border-none shadow-sm">
                Featured
              </Badge>
            </div>
          )}

          {/* Quick Add Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent">
            <Button 
              onClick={handleAddToCart}
              className="w-full bg-white dark:bg-slate-800 text-primary dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 border-none"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-1">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {product.category || 'General'}
            </p>
            <div className="flex items-center text-amber-400">
              <span className="text-xs font-bold mr-1">{rating.toFixed(1)}</span>
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
            </div>
          </div>
          
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2 line-clamp-1 group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
            {product.title}
          </h3>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-extrabold text-primary dark:text-blue-400">
              {formatCurrency(product.price)}
            </span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-primary dark:text-blue-400">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
