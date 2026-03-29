import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useOrderStore } from '@/stores/orderStore';
import { usePaymentStore } from '@/stores/paymentStore';
import { Button } from '@/ui/Button';
import PaymentMethods from '@/components/shop/PaymentMethods';
import { formatCurrency} from '@/utils/helpers';
import { toast } from 'sonner';
import type { PaymentGateway } from '@/api/paymentService';

export default function Checkout() {
  const { cart, getCart } = useCartStore();
  const { placeOrder, isLoading: isOrderLoading } = useOrderStore();
  const { getPaymentMethods, initiate, mpesaStkPush, flutterwavePay } = usePaymentStore();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState('');
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>('MPESA');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    getCart();
    getPaymentMethods();
  }, [getCart, getPaymentMethods]);

  const handlePlaceOrder = async () => {
    if (!shippingAddress) {
      toast.error('Please enter a shipping address');
      return;
    }

    // Validate phone number for M-Pesa
    if (selectedGateway === 'MPESA' && !phoneNumber) {
      toast.error('Please enter your M-Pesa phone number');
      return;
    }

    if (selectedGateway === 'MPESA' && phoneNumber.length < 9) {
      toast.error('Please enter a valid phone number');
      return;
    }

    // Validate email for Flutterwave
    if (selectedGateway === 'Flutterwave' && !email) {
      toast.error('Please enter your email address');
      return;
    }

    if (selectedGateway === 'Flutterwave' && !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      // Step 1: Place the order first
      const orderRes = await placeOrder({
        payment_method: selectedGateway,
        shipping_address: shippingAddress
      });
      
      if (orderRes.success && orderRes.data) {
        // Step 2: Initiate payment with the order ID
        try {
          let paymentRes;
          
          if (selectedGateway === 'MPESA') {
            // Use M-Pesa STK Push for M-Pesa payments
            paymentRes = await mpesaStkPush({
              order_id: orderRes.data.order_id,
              phone_number: phoneNumber,
              callback_url: `${window.location.origin}/order-confirmation?order_id=${orderRes.data.order_id}`
            });
          } else if (selectedGateway === 'Flutterwave') {
            // Use Flutterwave specific function with email
            paymentRes = await flutterwavePay({
              order_id: orderRes.data.order_id,
              email: email,
              callback_url: `${window.location.origin}/order-confirmation?order_id=${orderRes.data.order_id}`
            });
          } else {
            // Use generic initiate for other payment methods
            paymentRes = await initiate({
              order_id: orderRes.data.order_id,
              gateway: selectedGateway,
              callback_url: `${window.location.origin}/order-confirmation?order_id=${orderRes.data.order_id}`
            });
          }
          
          if (paymentRes.success && paymentRes.data) {
            if (selectedGateway === 'MPESA') {
              toast.success('Order placed! Check your phone for M-Pesa STK Push prompt...');
              // For M-Pesa, navigate to order confirmation page
              navigate(`/order-confirmation?order_id=${orderRes.data.order_id}`);
            } else if (selectedGateway === 'Flutterwave') {
              toast.success('Order placed! Redirecting to Flutterwave payment...');
              // For Flutterwave, check for payment link
              const flutterwaveData = paymentRes.data as any;
              if (flutterwaveData.payment_link) {
                window.location.href = flutterwaveData.payment_link;
              } else {
                navigate(`/order-confirmation?order_id=${orderRes.data.order_id}`);
              }
            } else {
              toast.success('Order placed! Redirecting to payment...');
              // For other payment methods, check for redirect URLs
              const initiateData = paymentRes.data as any;
              if (initiateData.gateway_response && typeof initiateData.gateway_response === 'object') {
                const gatewayResponse = initiateData.gateway_response;
                if (gatewayResponse.redirect_url) {
                  window.location.href = gatewayResponse.redirect_url;
                } else if (gatewayResponse.checkout_url) {
                  window.location.href = gatewayResponse.checkout_url;
                } else {
                  navigate(`/order-confirmation?order_id=${orderRes.data.order_id}`);
                }
              } else {
                navigate(`/order-confirmation?order_id=${orderRes.data.order_id}`);
              }
            }
          } else {
            toast.error('Failed to initiate payment');
            navigate(`/order-confirmation?order_id=${orderRes.data.order_id}`);
          }
        } catch (paymentError: any) {
          toast.error(paymentError.message || 'Failed to initiate payment');
          navigate(`/order-confirmation?order_id=${orderRes.data.order_id}`);
        }
      } else {
        toast.error('Failed to place order');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    }
  };

  if (!cart || cart.cart_items.length === 0) {
    return (
      <div className="pt-40 pb-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate('/products')}>Back to Shop</Button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="text-4xl font-bold tracking-tight mb-12 dark:text-white">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Section */}
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary dark:text-blue-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold dark:text-white">Shipping Details</h2>
              </div>
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Full Delivery Address</label>
                <textarea
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Street, Apartment, City, Postal Code"
                  className="w-full h-32 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-400/20 transition-all resize-none dark:text-white"
                />
              </div>
            </section>

            {/* Payment Section */}
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
              <PaymentMethods 
                selectedMethod={selectedGateway}
                onMethodSelect={(method) => setSelectedGateway(method as PaymentGateway)}
                onPhoneNumberChange={setPhoneNumber}
                phoneNumber={phoneNumber}
                onEmailChange={setEmail}
                email={email}
              />
            </section>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xl sticky top-24">
              <h2 className="text-2xl font-bold mb-8 dark:text-white">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                {cart.cart_items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      {item.product.title} <span className="text-slate-400 dark:text-slate-500">x{item.quantity}</span>
                    </span>
                    <span className="font-medium dark:text-white">{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
                
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(cart.total_price)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Shipping</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Free</span>
                  </div>
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-end">
                    <span className="font-bold text-lg dark:text-white">Total</span>
                    <span className="text-3xl font-extrabold text-primary dark:text-blue-400">
                      {formatCurrency(cart.total_price)}
                    </span>
                  </div>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full h-14 rounded-full text-lg group"
                onClick={handlePlaceOrder}
                disabled={isOrderLoading}
              >
                {isOrderLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    Confirm & Pay
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>

              <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center space-x-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                  Your transaction is secure and encrypted. By placing this order, you agree to our Terms of Service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}