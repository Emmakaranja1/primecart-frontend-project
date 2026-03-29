import { useEffect, useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Package, ShoppingBag, Home } from 'lucide-react';
import { Button } from '@/ui/Button';
import OrderDetails from '@/components/user/OrderDetails';
import { useOrders } from '@/hooks/useOrders';
import { usePayment } from '@/hooks/usePayment';
import { toast } from 'sonner';

export default function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order;
  const { orderDetails, getOrderDetails, isLoading, error } = useOrders();
  const { flutterwaveVerify, mpesaStatus } = usePayment();
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);

  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const orderId = urlParams.get('order_id');
    const transactionId = urlParams.get('transaction_id') || urlParams.get('tx_ref');
    const status = urlParams.get('status');
    
    
    if (orderId && transactionId && (status === 'successful' || status === 'completed')) {
      console.log('Starting auto-verification from URL params:', { orderId, transactionId, status });
      startAutoVerification(transactionId);
    }
  }, [location.search]);

  const startMpesaAutoVerification = (paymentId: string) => {
    if (verifyingPayment) return;
    
    setVerifyingPayment(true);
    let attempts = 0;
    const maxAttempts = 10;
    
    const verifyInterval = setInterval(async () => {
      attempts++;
      
      try {
        console.log(`M-Pesa auto verification attempt ${attempts}/${maxAttempts} for payment:`, paymentId);
        const result = await mpesaStatus(parseInt(paymentId));
        
        if (result.success && result.data) {
          const paymentStatus = result.data.status;
          
          console.log('M-Pesa verification response:', {
            status: paymentStatus,
            payment_id: result.data.payment_id,
            transaction_id: result.data.transaction_id,
            amount: result.data.amount,
            verification_result: result.data.verification_result
          });
          
          
          if (paymentStatus === 'completed' || paymentStatus === 'paid') {
            clearInterval(verifyInterval);
            setVerifyingPayment(false);
            setPaymentVerified(true);
            toast.success('M-Pesa payment completed successfully!');
            
            
            if (order?.id) {
              setTimeout(() => {
                getOrderDetails(parseInt(order.id));
              }, 1000);
            }
          } else if (paymentStatus === 'failed') {
            clearInterval(verifyInterval);
            setVerifyingPayment(false);
            setPaymentVerified(false);
            toast.error('M-Pesa payment failed. Please try again.');
            
            
            if (order?.id) {
              setTimeout(() => {
                getOrderDetails(parseInt(order.id));
              }, 1000);
            }
          } else if (paymentStatus === 'processing') {
            
            console.log('M-Pesa payment still processing, continuing verification...');
          } else if (attempts >= maxAttempts) {
            
            clearInterval(verifyInterval);
            setVerifyingPayment(false);
            toast.warning('M-Pesa payment verification timed out. Please check your order status later.');
          }
        }
      } catch (error) {
        console.error('M-Pesa verification attempt failed:', error);
        
        if (attempts >= maxAttempts) {
          clearInterval(verifyInterval);
          setVerifyingPayment(false);
          toast.error('Unable to verify M-Pesa payment status. Please contact support.');
        }
      }
    }, 12000); 
    
    
    return () => clearInterval(verifyInterval);
  };

  const startAutoVerification = (transactionId: string) => {
    if (verifyingPayment) return;
    
    setVerifyingPayment(true);
    let attempts = 0;
    const maxAttempts = 10; 
    
    const verifyInterval = setInterval(async () => {
      attempts++;
      
      try {
        console.log(`Auto verification attempt ${attempts}/${maxAttempts} for transaction:`, transactionId);
        const result = await flutterwaveVerify(transactionId);
        
        if (result.success && result.data) {
          const paymentStatus = result.data.status;
          
          console.log('Payment verification response:', {
            status: paymentStatus,
            payment_id: result.data.payment_id,
            transaction_id: result.data.transaction_id,
            gateway_reference: result.data.gateway_reference,
            verification_result: result.data.verification_result
          });
          
          
          if (paymentStatus === 'completed') {
            clearInterval(verifyInterval);
            setVerifyingPayment(false);
            setPaymentVerified(true);
            toast.success('Payment completed successfully!');
            
            
            if (order?.id) {
              setTimeout(() => {
                getOrderDetails(parseInt(order.id));
              }, 1000);
            }
          } else if (paymentStatus === 'failed') {
            clearInterval(verifyInterval);
            setVerifyingPayment(false);
            setPaymentVerified(false);
            toast.error('Payment failed. Please try again.');
            
        
            if (order?.id) {
              setTimeout(() => {
                getOrderDetails(parseInt(order.id));
              }, 1000);
            }
          } else if (paymentStatus === 'processing') {
            
            console.log('Payment still processing, continuing verification...');
          } else if (attempts >= maxAttempts) {
            
            clearInterval(verifyInterval);
            setVerifyingPayment(false);
            toast.warning('Payment verification timed out. Please check your order status later.');
          }
        }
      } catch (error) {
        console.error('Verification attempt failed:', error);
        
        if (attempts >= maxAttempts) {
          clearInterval(verifyInterval);
          setVerifyingPayment(false);
          toast.error('Unable to verify payment status. Please contact support.');
        }
      }
    }, 12000); 
    
    
    return () => clearInterval(verifyInterval);
  };

  useEffect(() => {
    if (order?.id) {
      getOrderDetails(parseInt(order.id));
    }
  }, [order, getOrderDetails]);

  
  useEffect(() => {
    if (orderDetails?.order?.payment_status === 'pending' && 
        orderDetails?.order?.payment_transaction_id &&
        !verifyingPayment &&
        !paymentVerified) {
      
      if (orderDetails?.order?.payment_method === 'Flutterwave') {
        console.log('Starting auto-verification for pending Flutterwave payment:', orderDetails.order.payment_transaction_id);
        startAutoVerification(orderDetails.order.payment_transaction_id);
      } else if (orderDetails?.order?.payment_method === 'MPESA') {
        console.log('Starting auto-verification for pending M-Pesa payment:', orderDetails.order.payment_transaction_id);
        startMpesaAutoVerification(orderDetails.order.payment_transaction_id);
      }
    }
  }, [orderDetails]);

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
          
          {verifyingPayment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <div className="text-left">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">Verifying payment status...</span>
                  <p className="text-blue-500 dark:text-blue-500 text-sm">This may take a few moments</p>
                </div>
              </div>
            </motion.div>
          )}
          
          {paymentVerified && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-4 bg-green-100 dark:bg-green-900/30 rounded-xl border border-green-200 dark:border-green-800"
            >
              <div className="flex items-center justify-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div className="text-left">
                  <span className="text-green-600 dark:text-green-400 font-medium">Payment completed successfully!</span>
                  <p className="text-green-500 dark:text-green-500 text-sm">Your order has been confirmed</p>
                </div>
              </div>
            </motion.div>
          )}
          
          {orderDetails?.order?.payment_status === 'failed' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 rounded-xl border border-red-200 dark:border-red-800"
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="w-5 h-5 bg-red-600 dark:bg-red-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
                <div className="text-left">
                  <span className="text-red-600 dark:text-red-400 font-medium">Payment failed</span>
                  <p className="text-red-500 dark:text-red-500 text-sm">Please try again or contact support</p>
                </div>
              </div>
            </motion.div>
          )}
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