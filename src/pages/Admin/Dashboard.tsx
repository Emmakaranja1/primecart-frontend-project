import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../../stores/userStore';
import { useOrderStore } from '../../stores/orderStore';
import { useProductStore } from '../../stores/productStore';
import { useReportStore } from '../../stores/reportStore';
import { useAuthStore } from '../../stores/authStore';
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
  Calendar,
  DollarSign,
  BarChart3,
  LogOut
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/helpers';
import ProductForm from '../../components/admin/ProductForm';
import UserManagement from '../../components/admin/UserManagement';
import OrderManagement from '../../components/admin/OrderManagement';
import ProductManagement from '../../components/admin/ProductManagement';
import ActivityLog from '../../components/admin/ActivityLog';
import ReportsView from '../../components/admin/ReportsView';

type TabType = 'overview' | 'orders' | 'users' | 'products' | 'logs' | 'reports';

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

  const { logout, isLoading: logoutLoading } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
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
      value: formatCurrency(ordersReport?.orders?.reduce((sum, order) => sum + (typeof order.total_amount === 'string' ? parseFloat(order.total_amount) : order.total_amount), 0) || 0), 
      change: '+12.5%', 
      icon: DollarSign, 
      color: 'text-green-600', 
      bg: 'bg-green-50' 
    },
    { 
      label: 'Total Orders', 
      value: ordersReport?.pagination?.total || 0, 
      change: '+8.2%', 
      icon: ShoppingBag, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Total Users', 
      value: usersReport?.pagination?.total || 0, 
      change: '+15.4%', 
      icon: Users, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50' 
    },
    { 
      label: 'Active Products', 
      value: adminProducts?.products?.length || 0, 
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
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 fixed left-0 top-0 h-screen overflow-y-auto flex flex-col">
        {/* Logo/Branding */}
        <div className="px-6 py-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">PRIMECART DASHBOARD</h2>
        </div>

        <div className="p-4 flex-1">
          <Card className="border-none shadow-sm dark:bg-slate-800 rounded-[2rem] p-4 h-full flex flex-col">
            <nav className="space-y-2 flex-1">
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

            {/* Logout Button */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="w-5 h-5" />
                <span>{logoutLoading ? 'Logging out...' : 'Logout'}</span>
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="ml-64 w-[calc(100%-256px)] pb-20">
        <div className="px-6 sm:px-8 lg:px-10">
          {/* Header - Only show on overview */}
          {activeTab === 'overview' && (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pt-8">
                <div className="space-y-1">
                  <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Admin Dashboard</h1>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Welcome back, Administrator. Here's what's happening today.</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="outline" 
                    className="rounded-xl h-12 px-5 font-bold dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                    onClick={() => setActiveTab('reports')}
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

              {/* Stats Grid - Only show on overview */}
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
            </>
          )}

          {/* Content View */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={activeTab !== 'overview' ? 'pt-8' : ''}
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
                          {adminOrders?.orders && adminOrders.orders.length > 0 ? (
                            adminOrders.orders.slice(0, 5).map((order: any) => (
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
                                  <Badge variant={order.status === 'completed' || order.status === 'delivered' ? 'success' : order.status === 'pending' ? 'warning' : 'default'} className="mt-1">
                                    {order.status}
                                  </Badge>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-slate-500 dark:text-slate-400">No orders yet</p>
                            </div>
                          )}
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
                          {adminActivityLogs?.logs && adminActivityLogs.logs.length > 0 ? (
                            adminActivityLogs.logs.slice(0, 6).map((log: any) => (
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
                            ))
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-slate-500 dark:text-slate-400">No activity logs yet</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === 'users' && <UserManagement />}

                {activeTab === 'orders' && <OrderManagement />}

                {activeTab === 'products' && <ProductManagement />}

                {activeTab === 'logs' && <ActivityLog />}

                {activeTab === 'reports' && <ReportsView />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      <AnimatePresence>
        {showProductForm && (
          <ProductForm 
            onClose={() => setShowProductForm(false)} 
            initialData={editingProduct}
          />
        )}
      </AnimatePresence>
    </div>
  );
}