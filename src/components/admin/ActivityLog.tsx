import { useState, useEffect } from 'react';
import { 
  Activity, 
  Search, 
  Calendar,
  Download,
  RefreshCw,
  User,
  Package,
  ShoppingCart,
  Settings,
  Trash2,
  Edit,
  Plus,
  Eye,
  AlertCircle,
  FileText,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/Card';
import { Badge } from '@/ui/Badge';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { cn } from '@/utils/helpers';
import { toast } from 'sonner';
import { useUserStore } from '@/stores/userStore';

interface ActivityLogProps {}

interface ActivityFilters {
  search: string;
  action: string;
  entity: string;
  date_range: string;
  user_id: string;
}

export default function ActivityLog({}: ActivityLogProps) {
  const { adminActivityLogs: logs, isLoading, error, listAdminActivityLogs } = useUserStore();
  const [filters, setFilters] = useState<ActivityFilters>({
    search: '',
    action: 'all',
    entity: 'all',
    date_range: '7d',
    user_id: 'all',
  });

  useEffect(() => {

    loadActivities();
  }, []);

  useEffect(() => {
    
    loadActivities();
  }, [filters.action, filters.entity, filters.user_id, filters.date_range]);

  const loadActivities = async () => {
    try {
      const params: any = {};
      
      if (filters.action !== 'all') params.action = filters.action;
      if (filters.entity !== 'all') params.entity = filters.entity;
      if (filters.user_id !== 'all') params.user_id = parseInt(filters.user_id);
      
  
      if (filters.date_range !== 'all') {
        const endDate = new Date();
        let startDate = new Date();
        
        switch (filters.date_range) {
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
        
        params.start_date = startDate.toISOString().split('T')[0]; 
        params.end_date = endDate.toISOString().split('T')[0]; 
      }
      
      await listAdminActivityLogs(params);
    } catch (error) {
      console.error('Failed to load activities:', error);
      toast.error('Failed to load activity log');
    }
  };

  const activities = logs?.logs || [];
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = !filters.search || 
      activity.user?.username.toLowerCase().includes(filters.search.toLowerCase()) ||
      activity.action.toLowerCase().includes(filters.search.toLowerCase()) ||
      activity.entity.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Activity Log</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Loading activity log...</p>
          </div>
        </div>
        
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-slate-600 dark:text-slate-400">Failed to load activity log</p>
        <p className="text-sm text-slate-500 dark:text-slate-500">{error.message}</p>
      </div>
    );
  }

  const handleExportLog = () => {
    toast.success('Activity log exported successfully');
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created': return <Plus className="w-4 h-4" />;
      case 'updated': return <Edit className="w-4 h-4" />;
      case 'deleted': return <Trash2 className="w-4 h-4" />;
      case 'viewed': return <Eye className="w-4 h-4" />;
      case 'login': return <User className="w-4 h-4" />;
      case 'exported': return <Download className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20';
      case 'updated': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20';
      case 'deleted': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
      case 'viewed': return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/20';
      case 'login': return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20';
      case 'exported': return 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/20';
      default: return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/20';
    }
  };

  const getEntityIcon = (entity: string) => {
    switch (entity) {
      case 'user': return <Users className="w-4 h-4" />;
      case 'product': return <Package className="w-4 h-4" />;
      case 'order': return <ShoppingCart className="w-4 h-4" />;
      case 'report': return <FileText className="w-4 h-4" />;
      case 'auth': return <Settings className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActionBadge = (action: string) => {
    const variants: Record<string, 'success' | 'warning' | 'destructive' | 'default' | 'secondary'> = {
      created: 'success',
      updated: 'default',
      deleted: 'destructive',
      viewed: 'secondary',
      login: 'default',
      exported: 'warning',
    };
    return variants[action] || 'default';
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Activity Log</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Loading activity log...</p>
          </div>
        </div>
        
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Activity Log</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Track all administrative actions and system events
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="rounded-xl" onClick={handleExportLog}>
            <Download className="w-4 h-4 mr-2" />
            Export Log
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Activities</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {activities.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Today</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {activities.filter(a => {
                    const today = new Date().toDateString();
                    return new Date(a.created_at).toDateString() === today;
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Users</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {new Set(activities.map(a => a.user_id)).size}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Critical Actions</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {activities.filter(a => ['deleted', 'created'].includes(a.action)).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
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
                  placeholder="Search activities by user, action, or entity..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:bg-white dark:focus:bg-slate-700"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={filters.action}
                onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
                className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:bg-white dark:focus:bg-slate-700 text-slate-900 dark:text-white font-medium"
              >
                <option value="all">All Actions</option>
                <option value="created">Created</option>
                <option value="updated">Updated</option>
                <option value="deleted">Deleted</option>
                <option value="viewed">Viewed</option>
                <option value="login">Login</option>
                <option value="exported">Exported</option>
              </select>
              
              <select
                value={filters.entity}
                onChange={(e) => setFilters(prev => ({ ...prev, entity: e.target.value }))}
                className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:bg-white dark:focus:bg-slate-700 text-slate-900 dark:text-white font-medium"
              >
                <option value="all">All Entities</option>
                <option value="user">Users</option>
                <option value="product">Products</option>
                <option value="order">Orders</option>
                <option value="report">Reports</option>
                <option value="auth">Authentication</option>
              </select>
              
              <select
                value={filters.user_id}
                onChange={(e) => setFilters(prev => ({ ...prev, user_id: e.target.value }))}
                className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:bg-white dark:focus:bg-slate-700 text-slate-900 dark:text-white font-medium"
              >
                <option value="all">All Users</option>
                {Array.from(new Set(activities.map(a => a.user))).map(user => (
                  <option key={user!.id} value={user!.id.toString()}>
                    {user!.username}
                  </option>
                ))}
              </select>
              
              <Button variant="outline" size="icon" className="rounded-xl" onClick={loadActivities}>
                <RefreshCw className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity List */}
      <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
            Recent Activities ({filteredActivities.length})
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 pt-0">
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0",
                  getActionColor(activity.action)
                )}>
                  {getActionIcon(activity.action)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-slate-900 dark:text-white">
                      {activity.user?.username}
                    </span>
                    <Badge variant={getActionBadge(activity.action)} className="text-xs">
                      {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
                    </Badge>
                    <div className="flex items-center text-slate-600 dark:text-slate-400">
                      {getEntityIcon(activity.entity)}
                      <span className="ml-1 text-sm">
                        {activity.entity.charAt(0).toUpperCase() + activity.entity.slice(1)}
                        {activity.entity_id > 0 && ` #${activity.entity_id}`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                    <span>{activity.user?.email}</span>
                    <span>•</span>
                    <span>{activity.ip_address}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(activity.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                No activities found matching your filters
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
