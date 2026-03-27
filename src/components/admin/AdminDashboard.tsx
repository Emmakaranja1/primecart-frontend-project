import { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/Card';
import { Badge } from '@/ui/Badge';
import { Button } from '@/ui/Button';
import { cn } from '@/utils/helpers';
import { formatCurrency } from '@/utils/helpers';
import { useReportStore } from '@/stores/reportStore';
import { useUserStore } from '@/stores/userStore';
import { useProductStore } from '@/stores/productStore';
import type { OrdersReportOrder, ActivityReportActivity } from '@/api/reportService';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'neutral';
}

function KPICard({ title, value, change, changeLabel, icon: Icon, trend = 'neutral' }: KPICardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-emerald-600 dark:text-emerald-400';
      case 'down': return 'text-red-600 dark:text-red-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="w-4 h-4" />;
      case 'down': return <ArrowDownRight className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none overflow-hidden dark:bg-slate-900 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-slate-950/50 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              {title}
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
              {typeof value === 'number' && title.includes('Revenue') ? formatCurrency(value) : value}
            </p>
            
            {change !== undefined && (
              <div className="flex items-center space-x-2">
                <div className={cn('flex items-center space-x-1', getTrendColor())}>
                  {getTrendIcon()}
                  <span className="text-sm font-semibold">
                    {change > 0 ? '+' : ''}{change}%
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {changeLabel}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20">
            <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const { usersReport, ordersReport, activityReport, isLoading, error } = useReportStore();
  const { getUsersReport, getOrdersReport, getActivityReport } = useReportStore();
  const { adminUsers } = useUserStore();
  const { adminProducts } = useProductStore();

  useEffect(() => {
    
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      
      const endDate = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
      }
      
      const dateParams = {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
      };
      
      
      await Promise.all([
        getUsersReport(dateParams),
        getOrdersReport(dateParams),
        getActivityReport(dateParams),
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  
  const kpiData = {
    totalRevenue: ordersReport?.orders.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0,
    totalOrders: ordersReport?.orders.length || 0,
    totalUsers: adminUsers?.users.length || usersReport?.users.length || 0,
    totalProducts: adminProducts?.products.length || activityReport?.activities.filter(a => a.entity === 'product').length || 0,
    revenueChange: 0, 
    ordersChange: 0,
    usersChange: 0,
    productsChange: 0,
  };

  const recentOrders = ordersReport?.orders.slice(0, 5).map((order: OrdersReportOrder) => ({
    id: order.id,
    order_number: order.id,
    customer: `User ID: ${order.user_id}`, 
    amount: Number(order.total_amount),
    status: order.status,
    date: new Date(order.created_at).toLocaleDateString(),
  })) || [];

  const topProducts = activityReport?.activities
    .filter(a => a.entity === 'product')
    .slice(0, 5)
    .map((activity: ActivityReportActivity) => ({
      name: `Product ${activity.entity_id}`,
      sales: 0, 
      revenue: 0, 
      trend: 'neutral' as const,
    })) || [];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'destructive' | 'default'> = {
      completed: 'success',
      processing: 'warning',
      pending: 'destructive',
      shipped: 'default',
    };
    return variants[status] || 'default';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Loading your dashboard...</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-slate-600 dark:text-slate-400">Failed to load dashboard</p>
        <p className="text-sm text-slate-500 dark:text-slate-500">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={cn(
                  'rounded-lg font-medium',
                  timeRange === range 
                    ? 'bg-purple-600 text-white hover:bg-purple-700' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </Button>
            ))}
          </div>
          
          <Button variant="outline" size="sm" className="rounded-xl">
            <Calendar className="w-4 h-4 mr-2" />
            Custom Range
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Revenue"
          value={kpiData.totalRevenue}
          change={kpiData.revenueChange}
          changeLabel="vs last period"
          icon={DollarSign}
          trend={kpiData.revenueChange > 0 ? 'up' : 'down'}
        />
        
        <KPICard
          title="Total Orders"
          value={kpiData.totalOrders.toLocaleString()}
          change={kpiData.ordersChange}
          changeLabel="vs last period"
          icon={ShoppingCart}
          trend={kpiData.ordersChange > 0 ? 'up' : 'down'}
        />
        
        <KPICard
          title="Total Users"
          value={kpiData.totalUsers.toLocaleString()}
          change={kpiData.usersChange}
          changeLabel="vs last period"
          icon={Users}
          trend={kpiData.usersChange > 0 ? 'up' : 'down'}
        />
        
        <KPICard
          title="Total Products"
          value={kpiData.totalProducts.toLocaleString()}
          change={kpiData.productsChange}
          changeLabel="vs last period"
          icon={Package}
          trend={kpiData.productsChange > 0 ? 'up' : 'down'}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Recent Orders
              </CardTitle>
              <Button variant="ghost" size="sm" className="rounded-xl">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </CardHeader>
            
            <CardContent className="p-6 pt-0">
              <div className="space-y-4">
                {recentOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 rounded-xl transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {order.id}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {order.customer} • {order.date}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatCurrency(order.amount)}
                      </span>
                      <Badge variant={getStatusBadge(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <div className="lg:col-span-1">
          <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Top Products
              </CardTitle>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Filter className="w-4 h-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="p-6 pt-0">
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-400">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 dark:text-white truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {product.sales} sold
                        </span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {formatCurrency(product.revenue)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {getTrendIcon(product.trend)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
