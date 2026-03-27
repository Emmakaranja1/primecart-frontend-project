import { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingCart, 
  Activity,
  Download,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/Card';
import { Badge } from '@/ui/Badge';
import { Button } from '@/ui/Button';
import { cn } from '@/utils/helpers';
import { useReport } from '@/hooks/useReport';
import type { 
  UsersReportData, 
  OrdersReportData, 
  ActivityReportData,
  ExportReportFormat,
  ExportReportType 
} from '@/api/reportService';


const getDateRange = (timeRange: string) => {
  const now = new Date();
  const start = new Date();
  
  switch (timeRange) {
    case '7d':
      start.setDate(now.getDate() - 7);
      break;
    case '30d':
      start.setDate(now.getDate() - 30);
      break;
    case '90d':
      start.setDate(now.getDate() - 90);
      break;
    case '1y':
      start.setFullYear(now.getFullYear() - 1);
      break;
  }
  
  return {
    start: start.toISOString().split('T')[0],
    end: now.toISOString().split('T')[0]
  };
};

const UsersTable = ({ data }: { data: UsersReportData }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th className="px-6 py-3">ID</th>
          <th className="px-6 py-3">Username</th>
          <th className="px-6 py-3">Email</th>
          <th className="px-6 py-3">Role</th>
          <th className="px-6 py-3">Status</th>
          <th className="px-6 py-3">Created</th>
        </tr>
      </thead>
      <tbody>
        {data.users.map((user) => (
          <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td className="px-6 py-4">{user.id}</td>
            <td className="px-6 py-4">{user.username}</td>
            <td className="px-6 py-4">{user.email}</td>
            <td className="px-6 py-4">{user.role}</td>
            <td className="px-6 py-4">
              <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                {user.status}
              </Badge>
            </td>
            <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const OrdersTable = ({ data }: { data: OrdersReportData }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th className="px-6 py-3">ID</th>
          <th className="px-6 py-3">User ID</th>
          <th className="px-6 py-3">Total Amount</th>
          <th className="px-6 py-3">Status</th>
          <th className="px-6 py-3">Payment Status</th>
          <th className="px-6 py-3">Payment Method</th>
          <th className="px-6 py-3">Created</th>
        </tr>
      </thead>
      <tbody>
        {data.orders.map((order) => (
          <tr key={order.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td className="px-6 py-4">{order.id}</td>
            <td className="px-6 py-4">{order.user_id}</td>
            <td className="px-6 py-4">${typeof order.total_amount === 'string' ? parseFloat(order.total_amount).toFixed(2) : order.total_amount.toFixed(2)}</td>
            <td className="px-6 py-4">
              <Badge variant={
                order.status === 'delivered' ? 'default' :
                order.status === 'approved' ? 'secondary' :
                order.status === 'pending' ? 'outline' : 'destructive'
              }>
                {order.status}
              </Badge>
            </td>
            <td className="px-6 py-4">
              <Badge variant={
                order.payment_status === 'paid' ? 'default' :
                order.payment_status === 'pending' ? 'outline' : 'destructive'
              }>
                {order.payment_status}
              </Badge>
            </td>
            <td className="px-6 py-4">{order.payment_method}</td>
            <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ActivityTable = ({ data }: { data: ActivityReportData }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th className="px-6 py-3">ID</th>
          <th className="px-6 py-3">User</th>
          <th className="px-6 py-3">Action</th>
          <th className="px-6 py-3">Entity</th>
          <th className="px-6 py-3">Entity ID</th>
          <th className="px-6 py-3">IP Address</th>
          <th className="px-6 py-3">Created</th>
        </tr>
      </thead>
      <tbody>
        {data.activities.map((activity) => (
          <tr key={activity.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td className="px-6 py-4">{activity.id}</td>
            <td className="px-6 py-4">
              {activity.user ? `${activity.user.username} (${activity.user.email})` : `User ${activity.user_id}`}
            </td>
            <td className="px-6 py-4">{activity.action}</td>
            <td className="px-6 py-4">{activity.entity}</td>
            <td className="px-6 py-4">{activity.entity_id}</td>
            <td className="px-6 py-4">{activity.ip_address || 'N/A'}</td>
            <td className="px-6 py-4">{new Date(activity.created_at).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function ReportsView() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedReport, setSelectedReport] = useState<'users' | 'orders' | 'activity'>('users');
  
  const {
    usersReport,
    ordersReport,
    activityReport,
    isLoading,
    error,
    getUsersReport,
    getOrdersReport,
    getActivityReport,
    exportReport
  } = useReport();

  useEffect(() => {
    const { start, end } = getDateRange(timeRange);
    
    switch (selectedReport) {
      case 'users':
        getUsersReport({ start_date: start, end_date: end });
        break;
      case 'orders':
        getOrdersReport({ start_date: start, end_date: end });
        break;
      case 'activity':
        getActivityReport({ start_date: start, end_date: end });
        break;
    }
  }, [selectedReport, timeRange, getUsersReport, getOrdersReport, getActivityReport]);

  const handleExportReport = async (reportType: ExportReportType, format: ExportReportFormat) => {
    try {
      const { start, end } = getDateRange(timeRange);
      const blob = await exportReport({
        report_type: reportType,
        format,
        start_date: start,
        end_date: end
      });
      
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-report-${timeRange}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reports</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Loading report data...</p>
          </div>
        </div>
        
        <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reports</h1>
            <p className="text-red-600 dark:text-red-400 mt-1">Error loading report data</p>
          </div>
        </div>
        
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <p className="text-red-600 dark:text-red-400">{error.message}</p>
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reports</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            View and export system reports
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
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
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
              </Button>
            ))}
          </div>
          
          <Button variant="outline" size="sm" className="rounded-xl">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1">
        {[
          { id: 'users', label: 'Users', icon: Users },
          { id: 'orders', label: 'Orders', icon: ShoppingCart },
          { id: 'activity', label: 'Activity', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={selectedReport === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedReport(tab.id as 'users' | 'orders' | 'activity')}
              className={cn(
                'rounded-lg font-medium',
                selectedReport === tab.id 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Report Content */}
      {selectedReport === 'users' && usersReport && (
        <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
              Users Report
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl"
                onClick={() => handleExportReport('users', 'excel')}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl"
                onClick={() => handleExportReport('users', 'pdf')}
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 text-sm text-slate-600 dark:text-slate-400">
              Showing {usersReport.users.length} users
              {usersReport.pagination && (
                <span> (Page {usersReport.pagination.current_page} of {usersReport.pagination.total_pages})</span>
              )}
            </div>
            <UsersTable data={usersReport} />
          </CardContent>
        </Card>
      )}

      {selectedReport === 'orders' && ordersReport && (
        <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
              Orders Report
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl"
                onClick={() => handleExportReport('orders', 'excel')}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl"
                onClick={() => handleExportReport('orders', 'pdf')}
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 text-sm text-slate-600 dark:text-slate-400">
              Showing {ordersReport.orders.length} orders
              {ordersReport.pagination && (
                <span> (Page {ordersReport.pagination.current_page} of {ordersReport.pagination.total_pages})</span>
              )}
            </div>
            <OrdersTable data={ordersReport} />
          </CardContent>
        </Card>
      )}

      {selectedReport === 'activity' && activityReport && (
        <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
              Activity Report
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl"
                onClick={() => handleExportReport('activity', 'excel')}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl"
                onClick={() => handleExportReport('activity', 'pdf')}
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 text-sm text-slate-600 dark:text-slate-400">
              Showing {activityReport.activities.length} activities
              {activityReport.pagination && (
                <span> (Page {activityReport.pagination.current_page} of {activityReport.pagination.total_pages})</span>
              )}
            </div>
            <ActivityTable data={activityReport} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
