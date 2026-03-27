import { Badge } from '@/ui/Badge';
import { formatCurrency } from '@/utils/helpers';
import { Star, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import type { Product } from '@/types/product';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none px-3">
            {product.category || 'General'}
          </Badge>
          <div className="flex items-center text-amber-400">
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-2 text-sm font-bold text-slate-900 dark:text-slate-100">4.9 (128 reviews)</span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 leading-tight">
          {product.title}
        </h1>
        
        <p className="text-3xl font-bold text-primary dark:text-blue-400 mb-6">
          {formatCurrency(product.price)}
        </p>
        
        <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-8">
          {product.description || "Experience the perfect blend of style and functionality. This premium product is crafted with the highest quality materials to ensure durability and comfort for everyday use."}
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-primary dark:text-blue-400">
            <Truck className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Free Shipping</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-primary dark:text-blue-400">
            <RotateCcw className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">30-Day Returns</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-primary dark:text-blue-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">2-Year Warranty</span>
        </div>
      </div>
    </div>
  );
}
