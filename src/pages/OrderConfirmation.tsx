import { useEffect } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Package, ShoppingBag, Home } from 'lucide-react';
import { Button } from '@/ui/Button';
import OrderDetails from '@/components/user/OrderDetails';
import { useOrders } from '@/hooks/useOrders';

export default function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order;
  const { orderDetails, getOrderDetails, isLoading, error } = useOrders();

  useEffect(() => {
    if (order?.id) {
      getOrderDetails(parseInt(order.id));
    }
  }, [order, getOrderDetails]);

  if (!order) {
    return <Navigate to="/" />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Unable to Load Order</h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium mb-6">
            {error.message || 'We couldn\'t load your order details. Please try again later.'}
          </p>
          <div className="space-y-3">
            <Link to="/orders">
              <Button className="w-full">View Order History</Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-black tracking-tight text-slate-900 dark:text-white"
          >
            Order Confirmed!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-slate-500 dark:text-slate-400 mt-4 text-lg font-medium"
          >
            Thank you for your purchase. Your order <span className="text-primary dark:text-blue-400 font-bold">#{order.id.slice(-8)}</span> has been placed successfully.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-8"
        >
          {orderDetails && <OrderDetails orderData={orderDetails} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/products">
              <Button variant="outline" className="w-full h-16 rounded-2xl text-lg font-black group dark:border-slate-800 dark:text-white dark:hover:bg-slate-900">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Continue Shopping
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/">
              <Button className="w-full h-16 rounded-2xl text-lg font-black shadow-xl shadow-primary/20">
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-3xl p-8 flex items-start space-x-4 border border-blue-100 dark:border-blue-900/20">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-blue-900 dark:text-blue-100 text-lg">Track Your Order</h3>
              <p className="text-blue-700 dark:text-blue-300 font-medium mt-1">
                You can track your order status in your profile. We'll also send you email updates as your order progresses.
              </p>
              <Link to="/orders">
                <Button variant="link" className="text-blue-600 dark:text-blue-400 font-black p-0 mt-2 h-auto">
                  View Order History
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}