import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../../stores/userStore';
import { useOrderStore } from '../../stores/orderStore';
import { useProductStore } from '../../stores/productStore';
import { useReportStore } from '../../stores/reportStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { 
  Users, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  X,
  Calendar,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/helpers';
import ProductForm from '../../components/admin/ProductForm';
import UserManagement from '../../components/admin/UserManagement';
import OrderManagement from '../../components/admin/OrderManagement';
import ProductManagement from '../../components/admin/ProductManagement';
import ActivityLog from '../../components/admin/ActivityLog';
import ReportsView from '../../components/admin/ReportsView';

type TabType = 'overview' | 'orders' | 'users' | 'products' | 'logs';

interface StatCard {
  label: string;
  value: string | number;
  change: string;
  icon: any;
  color: string;
  bg: string;
}

interface TabItem {
  id: TabType;
  label: string;
  icon: any;
}

export default function AdminDashboard() {
  const { 
    adminUsers, 
    isLoading: userLoading,
    adminActivityLogs,
    listAdminUsers,
    listAdminActivityLogs
  } = useUserStore();
  
  const { 
    adminOrders, 
    isLoading: orderLoading,
    listAdminOrders
  } = useOrderStore();
  
  const { 
    adminProducts,
    isLoading: productLoading,
    listAdminProducts
  } = useProductStore();
  
  const { 
    usersReport, 
    ordersReport, 
    isLoading: reportsLoading,
    getUsersReport, 
    getOrdersReport 
  } = useReportStore();
  
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showReports, setShowReports] = useState(false);

  const orders = adminOrders?.orders || [];
  const products = adminProducts?.products || [];
  const users = adminUsers?.users || [];
  const activityLogs = adminActivityLogs?.logs || [];

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          listAdminUsers(),
          listAdminActivityLogs(),
          listAdminOrders(),
          listAdminProducts(),
          getUsersReport(),
          getOrdersReport()
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadData();
  }, [listAdminUsers, listAdminActivityLogs, listAdminOrders, listAdminProducts, getUsersReport, getOrdersReport]);

  const openAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const isLoading = userLoading || orderLoading || productLoading || reportsLoading;

  if (isLoading && activeTab === 'overview') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats: StatCard[] = [
    { 
      label: 'Total Revenue', 
      value: formatCurrency(ordersReport?.orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0), 
      change: '+12.5%', 
      icon: DollarSign, 
      color: 'text-green-600', 
      bg: 'bg-green-50' 
    },
    { 
      label: 'Total Orders', 
      value: ordersReport?.pagination?.total || orders.length, 
      change: '+8.2%', 
      icon: ShoppingBag, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Total Users', 
      value: usersReport?.pagination?.total || users.length, 
      change: '+15.4%', 
      icon: Users, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50' 
    },
    { 
      label: 'Active Products', 
      value: products.length, 
      change: '+2.1%', 
      icon: Package, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50' 
    },
  ];

  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'logs', label: 'Activity Logs', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Welcome back, Administrator. Here's what's happening today.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              className="rounded-xl h-12 px-5 font-bold dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
              onClick={() => setShowReports(true)}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Reports
            </Button>
            <Button variant="outline" className="rounded-xl h-12 px-5 font-bold dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900">
              <Calendar className="w-4 h-4 mr-2" />
              Last 30 Days
            </Button>
            <Button 
              onClick={openAddProduct}
              className="rounded-xl h-12 px-6 font-black shadow-lg shadow-primary/20"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <Card key={idx} className="border-none shadow-sm dark:bg-slate-900 rounded-3xl overflow-hidden group hover:shadow-md transition-all">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl ${stat.bg} dark:bg-slate-800 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-7 h-7" />
                  </div>
                  <div className={`flex items-center text-sm font-black ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                    {stat.change.startsWith('+') ? <ArrowUpRight className="w-4 h-4 ml-1" /> : <ArrowDownRight className="w-4 h-4 ml-1" />}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-widest">{stat.label}</p>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <div className="xl:col-span-2">
            <Card className="border-none shadow-sm dark:bg-slate-900 rounded-[2rem] p-4 sticky top-32">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${
                      activeTab === tab.id 
                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Content View */}
          <div className="xl:col-span-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Orders */}
                    <Card className="border-none shadow-sm dark:bg-slate-900 rounded-[2rem]">
                      <CardHeader className="p-8 flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl font-black tracking-tight dark:text-white">Recent Orders</CardTitle>
                          <CardDescription className="text-slate-500 dark:text-slate-400 font-medium">Latest transactions from your store.</CardDescription>
                        </div>
                        <Button variant="outline" className="rounded-xl h-10 px-4 font-bold text-xs dark:border-slate-800 dark:text-slate-300" onClick={() => setActiveTab('orders')}>
                          View All
                        </Button>
                      </CardHeader>
                      <CardContent className="p-8 pt-0">
                        <div className="space-y-4">
                          {orders.slice(0, 5).map((order: any) => (
                            <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-primary/20 transition-all group">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary dark:text-white shadow-sm font-black text-[10px]">
                                  #{order.transaction_reference?.slice(-4) || order.id}
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-900 dark:text-white">Order #{order.id}</h4>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{formatDate(order.created_at)}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-black text-slate-900 dark:text-white">{formatCurrency(order.total_amount)}</p>
                                <Badge variant={order.status === 'completed' ? 'success' : 'warning'} className="mt-1">
                                  {order.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Activity Logs */}
                    <Card className="border-none shadow-sm dark:bg-slate-900 rounded-[2rem]">
                      <CardHeader className="p-8 flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl font-black tracking-tight dark:text-white">Activity Logs</CardTitle>
                          <CardDescription className="text-slate-500 dark:text-slate-400 font-medium">Real-time system and user events.</CardDescription>
                        </div>
                        <Button variant="outline" className="rounded-xl h-10 px-4 font-bold text-xs dark:border-slate-800 dark:text-slate-300" onClick={() => setActiveTab('logs')}>
                          View All
                        </Button>
                      </CardHeader>
                      <CardContent className="p-8 pt-0">
                        <div className="space-y-6">
                          {activityLogs.slice(0, 6).map((log: any) => (
                            <div key={log.id} className="flex items-start space-x-4 relative">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 flex-shrink-0">
                                <Activity className="w-5 h-5" />
                              </div>
                              <div className="flex-1 space-y-1">
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-200">
                                  <span className="text-primary dark:text-blue-400">{log.user?.username || `User ${log.user_id}`}</span> {log.action}
                                </p>
                                <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {formatDate(log.created_at)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === 'users' && <UserManagement />}

                {activeTab === 'orders' && <OrderManagement />}

                {activeTab === 'products' && <ProductManagement />}

                {activeTab === 'logs' && <ActivityLog />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showProductForm && (
          <ProductForm 
            onClose={() => setShowProductForm(false)} 
            initialData={editingProduct}
          />
        )}
        {showReports && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-6xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Reports</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowReports(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                <ReportsView />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}