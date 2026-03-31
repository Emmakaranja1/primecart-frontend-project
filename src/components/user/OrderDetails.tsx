import { Package, CreditCard, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { formatCurrency, formatDate, cn } from '../../utils/helpers';
import { getProductImage } from '../../utils/imageUtils';
import { Link } from 'react-router-dom';
import type { OrderDetailsData } from '../../api/orderService';

interface OrderDetailsProps {
  orderData: OrderDetailsData;
  className?: string;
}

export default function OrderDetails({ orderData, className }: OrderDetailsProps) {
  const { order, items } = orderData;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'delivered':
      case 'approved':
        return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-none px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest';
      case 'pending':
      case 'processing':
        return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-none px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest';
      case 'failed':
      case 'cancelled':
      case 'rejected':
        return 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-none px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest';
      default:
        return 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest';
    }
  };

  return (
    <div className={cn("space-y-12", className)}>
      {/* Order Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="space-y-2">
          <div className="flex items-center space-x-3 text-slate-400 dark:text-slate-500">
            <Package className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Order Reference</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight dark:text-white">{order.transaction_reference}</h2>
          <div className="flex items-center space-x-4 pt-2">
            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 font-bold text-sm">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(order.created_at)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Payment Status</p>
              <Badge className={getStatusColor(order.payment_status)}>{order.payment_status}</Badge>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Order Status</p>
              <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden dark:bg-slate-900 transition-colors duration-300">
            <CardHeader className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <CardTitle className="text-xl font-black dark:text-white">Order Items</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-8">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-8 group">
                    <div className="w-24 h-24 rounded-2xl bg-slate-50 dark:bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-100 dark:border-slate-800">
                      <img 
                        src={getProductImage(item.product.image, 'seed/product/200/200')} 
                        alt={item.product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-grow">
                      <Link to={`/products/${item.product.id}`}>
                        <h4 className="font-black text-lg mb-1 group-hover:text-primary dark:group-hover:text-blue-400 transition-colors flex items-center dark:text-white">
                          {item.product.title}
                          <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h4>
                      </Link>
                      <div className="flex items-center space-x-4">
                        <span className="text-slate-900 dark:text-white font-black">{formatCurrency(item.price)}</span>
                        <span className="text-slate-400 dark:text-slate-500 font-bold text-sm">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-lg dark:text-white">{formatCurrency(Number(item.subtotal))}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Info */}
        <div className="space-y-8">
          {/* Summary */}
          <Card className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden dark:bg-slate-900 transition-colors duration-300">
            <CardHeader className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <CardTitle className="text-xl font-black dark:text-white">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 font-bold">
                <span>Subtotal</span>
                <span>{formatCurrency(order.total_amount)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 font-bold">
                <span>Shipping</span>
                <span className="text-emerald-500 dark:text-emerald-400">Free</span>
              </div>
              <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
              <div className="flex justify-between items-center">
                <span className="text-xl font-black dark:text-white">Total</span>
                <span className="text-2xl font-black text-primary dark:text-blue-400">{formatCurrency(order.total_amount)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden dark:bg-slate-900 transition-colors duration-300">
            <CardHeader className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <CardTitle className="text-xl font-black dark:text-white">Shipping & Payment</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-slate-400 dark:text-slate-500">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest">Address</span>
                </div>
                <p className="font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{order.shipping_address}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-slate-400 dark:text-slate-500">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest">Payment Method</span>
                </div>
                <p className="font-black text-slate-900 dark:text-white uppercase tracking-widest">{order.payment_method}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}