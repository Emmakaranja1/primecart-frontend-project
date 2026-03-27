import { X, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/ui/Button';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, totalAmount, totalQuantity, updateItem, removeItem } = useCart();

  const handleUpdateQuantity = async (id: number, quantity: number) => {
    try {
      await updateItem(id, { quantity });
      toast.success('Cart updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update cart');
    }
  };

  const handleRemoveItem = async (id: number) => {
    try {
      await removeItem(id);
      toast.success('Item removed from cart');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove item');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold">Shopping Cart</h2>
                {totalQuantity > 0 && (
                  <span className="bg-primary text-white text-sm font-bold px-2 py-1 rounded-full">
                    {totalQuantity}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-500 mb-2">Your cart is empty</h3>
                  <p className="text-slate-400">Add some products to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Cart Summary */}
            {items.length > 0 && (
              <div className="border-t border-slate-100 p-6">
                <CartSummary
                  totalAmount={totalAmount}
                  totalQuantity={totalQuantity}
                  showCheckoutButton={false}
                />
                <div className="mt-6 space-y-3">
                  <Button
                    className="w-full h-12 rounded-xl font-semibold"
                    onClick={onClose}
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-xl font-semibold"
                    onClick={() => {
                      
                      onClose();
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}