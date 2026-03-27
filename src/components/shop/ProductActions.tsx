import { useState } from 'react';
import { Button } from '@/ui/Button';
import { ShoppingCart, Plus, Minus, Heart } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { toast } from 'sonner';
import type { Product } from '@/types/product';

interface ProductActionsProps {
  product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    try {
      await addToCart({ product_id: product.id, quantity });
      toast.success(`${product.title} added to cart`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  return (
    <div className="space-y-8 mb-12">
      <div className="flex items-center space-x-6">
        <div className="flex items-center bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 p-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-10 w-10 dark:text-slate-400 dark:hover:text-white"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="w-12 text-center font-bold text-lg dark:text-white">{quantity}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-10 w-10 dark:text-slate-400 dark:hover:text-white"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
          Only <span className="text-emerald-600 dark:text-emerald-400 font-bold">{product.quantity || 12} left</span> in stock
        </p>
      </div>

      <div className="flex space-x-4">
        <Button 
          size="lg" 
          className="flex-1 h-14 rounded-full text-lg shadow-xl shadow-primary/20"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-5 h-5 mr-3" />
          Add to Cart
        </Button>
        <Button variant="outline" size="lg" className="h-14 w-14 rounded-full p-0 dark:border-slate-800 dark:text-slate-300">
          <Heart className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
