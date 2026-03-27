import { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Eye, 
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  RefreshCw,
  User,
  MapPin,
  CreditCard,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/Card';
import { Badge } from '@/ui/Badge';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { formatCurrency } from '@/utils/helpers';
import { toast } from 'sonner';
import { useOrderStore } from '@/stores/orderStore';
import type { AdminOrderListItem } from '@/api/orderService';

interface OrderFilters {
  search: string;
  status: string;
  payment_status: string;
  date_range: string;
}

const transformOrderData = (apiOrder: AdminOrderListItem) => ({
  ...apiOrder,
  order_number: apiOrder.transaction_reference,
  customer_name: apiOrder.user.username,
  customer_email: apiOrder.user.email,
});

const getStatusBadge = (status: string) => {
  const variants: Record<string, 'success' | 'warning' | 'destructive' | 'default'> = {
    pending: 'warning',
    processing: 'default',
    shipped: 'default',
    delivered: 'success',
    cancelled: 'destructive',
    refunded: 'destructive',
  };
  return variants[status] || 'default';
};

const getPaymentStatusBadge = (status: string) => {
  const variants: Record<string, 'success' | 'warning' | 'destructive' | 'default'> = {
    pending: 'warning',
    paid: 'success',
    failed: 'destructive',
    refunded: 'destructive',
  };
  return variants[status] || 'default';
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return <Clock className="w-4 h-4" />;
    case 'processing': return <Package className="w-4 h-4" />;
    case 'shipped': return <Truck className="w-4 h-4" />;
    case 'delivered': return <CheckCircle className="w-4 h-4" />;
    case 'cancelled': return <XCircle className="w-4 h-4" />;
    case 'refunded': return <AlertCircle className="w-4 h-4" />;
    default: return null;
  }
};

const OrderDetailsModal = ({ order, onClose, onUpdateOrderStatus }: { 
  order: AdminOrderListItem & { order_number: string; customer_name: string; customer_email: string }; 
  onClose: () => void; 
  onUpdateOrderStatus: (orderId: number, newStatus: string) => Promise<void> 
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Order Details - {order.transaction_reference}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-xl"
          >
            <XCircle className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Order Status */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Order Status</p>
            <div className="flex items-center space-x-2 mt-1">
              {getStatusIcon(order.status)}
              <Badge variant={getStatusBadge(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Payment Status</p>
            <Badge variant={getPaymentStatusBadge(order.payment_status)} className="mt-1">
              {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Customer Information */}
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Customer Information</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-slate-700 dark:text-slate-300">{order.user.username}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-slate-400" />
              <span className="text-slate-700 dark:text-slate-300">{order.user.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="text-slate-700 dark:text-slate-300">Shipping address available in details</span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Order Summary</h4>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Items Count</span>
              <span className="font-medium text-slate-900 dark:text-white">{order.items_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Payment Method</span>
              <span className="font-medium text-slate-900 dark:text-white">{order.payment_method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Total Amount</span>
              <span className="font-bold text-lg text-purple-600 dark:text-purple-400">
                {formatCurrency(order.total_amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Tracking Information */}
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Tracking Information</h4>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Transaction Reference: {order.transaction_reference}
            </p>
          </div>
        </div>

        {/* Notes */}
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Additional Information</h4>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
            <p className="text-sm text-amber-900 dark:text-amber-100">
              Order ID: {order.id}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={onClose}
          >
            Close
          </Button>
          {order.status === 'pending' && (
            <Button
              className="rounded-xl"
              onClick={() => {
                onUpdateOrderStatus(order.id, 'processing');
              }}
            >
              Start Processing
            </Button>
          )}
          {order.status === 'processing' && (
            <Button
              className="rounded-xl"
              onClick={() => {
                onUpdateOrderStatus(order.id, 'shipped');
              }}
            >
              Mark as Shipped
            </Button>
          )}
          {order.status === 'shipped' && (
            <Button
              className="rounded-xl"
              onClick={() => {
                onUpdateOrderStatus(order.id, 'delivered');
              }}
            >
              Mark as Delivered
            </Button>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default function OrderManagement() {
  const { adminOrders, isLoading, listAdminOrders } = useOrderStore();
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [filters, setFilters] = useState<OrderFilters>({
    search: '',
    status: 'all',
    payment_status: 'all',
    date_range: 'all',
  });
  const [viewingOrder, setViewingOrder] = useState<(AdminOrderListItem & { order_number: string; customer_name: string; customer_email: string }) | null>(null);

  useEffect(() => {
    listAdminOrders();
  }, [listAdminOrders]);

  const orders = adminOrders?.orders || [];
  const transformedOrders = orders.map(transformOrderData);
  
  const filteredOrders = transformedOrders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(filters.search.toLowerCase()) ||
                         order.customer_name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         order.customer_email.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === 'all' || order.status === filters.status;
    const matchesPaymentStatus = filters.payment_status === 'all' || order.payment_status === filters.payment_status;
    
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  const handleSelectOrder = (orderId: string) => {
    const id = parseInt(orderId);
    setSelectedOrders(prev => 
      prev.includes(id) 
        ? prev.filter(existingId => existingId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      
    
      toast.success(`Order ${orderId} status updated to ${newStatus}`);
      
    
      await listAdminOrders();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to update order status: ${errorMessage}`);
    }
  };

  const handleExportOrders = () => {
    toast.success('Orders exported successfully');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Order Management</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Loading orders...</p>
          </div>
        </div>
        
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Order Management</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage customer orders and track shipments
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="rounded-xl" onClick={handleExportOrders}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Orders</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {orders.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Processing</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {orders.filter(o => o.status === 'processing').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Revenue</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {formatCurrency(orders.reduce((sum, order) => {
                    const amount = typeof order.total_amount === 'string' ? parseFloat(order.total_amount) : order.total_amount;
                    return sum + amount;
                  }, 0))}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search orders by number, customer name, or email..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:bg-white dark:focus:bg-slate-700"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:bg-white dark:focus:bg-slate-700 text-slate-900 dark:text-white font-medium"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
              
              <select
                value={filters.payment_status}
                onChange={(e) => setFilters(prev => ({ ...prev, payment_status: e.target.value }))}
                className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:bg-white dark:focus:bg-slate-700 text-slate-900 dark:text-white font-medium"
              >
                <option value="all">All Payment Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              
              <Button variant="outline" size="icon" className="rounded-xl">
                <RefreshCw className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
            Orders ({filteredOrders.length})
          </CardTitle>
          
          {selectedOrders.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {selectedOrders.length} selected
              </span>
              <Button variant="outline" size="sm" className="rounded-xl">
                <Package className="w-4 h-4 mr-2" />
                Bulk Update
              </Button>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="p-6 pt-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="text-left py-4 px-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === filteredOrders.length}
                      onChange={handleSelectAll}
                      className="rounded-lg border-slate-300 dark:border-slate-600"
                    />
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Order
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Customer
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Items
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Total
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Status
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Payment
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Date
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleSelectOrder(order.id.toString())}
                        className="rounded-lg border-slate-300 dark:border-slate-600"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {(order.order_number || order.transaction_reference) as string}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          ID: {order.id}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {order.customer_name || order.user.username}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {order.customer_email || order.user.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {order.items_count}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatCurrency(order.total_amount)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <Badge variant={getStatusBadge(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={getPaymentStatusBadge(order.payment_status)}>
                        {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-lg"
                          onClick={() => setViewingOrder(order)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {viewingOrder && <OrderDetailsModal order={viewingOrder} onClose={() => setViewingOrder(null)} onUpdateOrderStatus={handleUpdateOrderStatus} />}
    </div>
  );
}
