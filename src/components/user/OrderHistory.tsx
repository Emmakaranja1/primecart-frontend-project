import { useEffect } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { Badge } from '../../ui/Badge';
import { Package, ChevronRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/Button';

export default function OrderHistory() {
  const { orders, getOrders, isLoading } = useOrders();

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  if (isLoading && orders.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-white dark:bg-slate-900 rounded-3xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
        </div>
        <h3 className="text-xl font-bold mb-2 dark:text-white">No orders yet</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-8">You haven't placed any orders in our store.</p>
        <Link to="/products">
          <Button className="rounded-full px-8">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 transition-colors duration-300"
        >
          <div className="flex items-center space-x-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary dark:text-blue-400">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Order #{order.transaction_reference.slice(0, 8)}</p>
              <p className="font-bold text-lg dark:text-white">{formatCurrency(order.total_amount)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Date</p>
              <p className="font-medium dark:text-slate-300">{formatDate(order.created_at)}</p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Items</p>
              <p className="font-medium dark:text-slate-300">{order.items_count} items</p>
            </div>
            <Badge 
              variant={order.payment_status === 'paid' ? 'success' : 'warning'}
              className="px-4 py-1.5 rounded-full"
            >
              {order.payment_status}
            </Badge>
            <Link to={`/orders/${order.id}`}>
              <Button variant="ghost" size="icon" className="rounded-full dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800">
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}