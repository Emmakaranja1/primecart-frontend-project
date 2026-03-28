import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrders } from '@/hooks/useOrders';
import OrderHistory from '@/components/user/OrderHistory';
import OrderDetails from '@/components/user/OrderDetails';
import Loading from '@/ui/Loading';
import { Button } from '@/ui/Button';
import { ArrowLeft, Package, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/ui/Alert';

export default function Orders() {
  const { id } = useParams<{ id: string }>();
  const { 
    orders, 
    orderDetails,
    isLoading, 
    error, 
    getOrders, 
    getOrderDetails 
  } = useOrders();

  useEffect(() => {
    if (id) {
      getOrderDetails(parseInt(id));
    } else {
      getOrders();
    }
  }, [id, getOrders, getOrderDetails]);


  if (isLoading && !id && orders.length === 0) {
    return <Loading fullScreen />;
  }


  if (error && !id) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert className="mb-8 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              Failed to load orders: {error.message}
            </AlertDescription>
          </Alert>
          <div className="text-center">
            <Button onClick={() => getOrders()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {id ? `Order #${id.slice(-8)}` : 'My Orders'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
              {id ? 'Detailed view of your purchase' : 'Manage and track your order history'}
            </p>
          </div>
          {id && (
            <Link to="/orders">
              <Button variant="outline" className="rounded-xl dark:border-slate-800 dark:text-slate-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Orders
              </Button>
            </Link>
          )}
        </div>

        {id ? (
          isLoading ? (
            <Loading />
          ) : orderDetails ? (
            <OrderDetails orderData={orderDetails} />
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
              <Package className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
              <h2 className="text-xl font-bold dark:text-white">Order Not Found</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">We couldn't find the order you're looking for.</p>
              <Link to="/orders">
                <Button>View All Orders</Button>
              </Link>
            </div>
          )
        ) : (
          <>
            {error && (
              <Alert className="mb-6 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  Error loading orders: {error.message}
                </AlertDescription>
              </Alert>
            )}
            <OrderHistory />
          </>
        )}
      </div>
    </div>
  );
}