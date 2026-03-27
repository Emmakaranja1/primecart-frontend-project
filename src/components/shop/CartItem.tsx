import { Minus, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/ui/Button';
import { formatCurrency } from '@/utils/helpers';
import type { CartItem as CartItemType } from '@/types/cart';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { product } = item;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
    >
      {/* Product Image */}
      <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0 relative">
        <img 
          src={product.image || 'https://picsum.photos/seed/product/400/500'} 
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Product Details */}
      <div className="flex-grow text-center sm:text-left">
        <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{product.title}</h3>
        <p className="text-sm text-slate-400 mb-4 line-clamp-1">{product.description}</p>
        <div className="flex items-center justify-center sm:justify-start space-x-4">
          <span className="text-xl font-black">{formatCurrency(item.price)}</span>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-3 bg-slate-50 p-1 rounded-2xl">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-sm"
          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
          disabled={item.quantity <= 1}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="w-8 text-center font-bold">{item.quantity}</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-sm"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          disabled={item.quantity >= 10}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Remove Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-12 w-12 rounded-2xl text-slate-300 hover:text-destructive hover:bg-destructive/5 transition-all"
        onClick={() => onRemove(item.id)}
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    </motion.div>
  );
}