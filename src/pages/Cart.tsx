import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/ui/Button';
import { toast } from 'sonner';

import  CartItem  from '@/components/shop/CartItem';
import CartSummary from '@/components/shop/CartSummary';

export default function Cart() {
  const { cart, getCart, updateCartItem, removeCartItem, isLoading } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    getCart();
  }, [getCart]);

  const handleUpdateQuantity = async (id: number, quantity: number) => {
    if (quantity < 1) return;
    try {
      await updateCartItem(id, { quantity });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update quantity');
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await removeCartItem(id);
      toast.success('Item removed from cart');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove item');
    }
  };

  if (isLoading && !cart) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4 md:px-8 flex justify-center dark:bg-slate-950 transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!cart || cart.cart_items.length === 0) {
    return (
      <div className="pt-40 pb-20 text-center container mx-auto px-4 md:px-8 dark:bg-slate-950 transition-colors duration-300">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-900 mb-8">
          <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-700" />
        </div>
        <h1 className="text-3xl font-bold mb-4 dark:text-white">Your cart is empty</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Explore our products and find something you love.
        </p>
        <Link to="/products">
          <Button size="lg" className="rounded-full px-10">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="text-4xl font-bold tracking-tight mb-12 dark:text-white">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="popLayout">
              {cart.cart_items.map((item) => (
                <CartItem 
                  key={item.id} 
                  item={item} 
                  onUpdateQuantity={handleUpdateQuantity} 
                  onRemove={handleRemove} 
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <CartSummary 
              totalAmount={Number(cart.total_price)} 
              totalQuantity={cart.total_items}
              onCheckout={() => navigate('/checkout')} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}