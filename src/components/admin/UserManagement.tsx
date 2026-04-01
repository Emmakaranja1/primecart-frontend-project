import { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Search, 
  Trash2, 
  Ban,
  CheckCircle,
  XCircle,
  Phone,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/Card';
import { Badge } from '@/ui/Badge';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { toast } from 'sonner';
import { useUserStore } from '@/stores/userStore';

interface UserFilters {
  search: string;
  status: string;
  role: string;
  dateRange: string;
}

export default function UserManagement() {
  const { 
    adminUsers, 
    isLoading, 
    error, 
    listAdminUsers, 
    deleteUser, 
    activateUser, 
    deactivateUser 
  } = useUserStore();
  
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    status: 'all',
    role: 'all',
    dateRange: 'all',
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [actioningUserId, setActioningUserId] = useState<number | null>(null);
  const [deleteConfirmUserId, setDeleteConfirmUserId] = useState<number | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      await listAdminUsers();
    } catch {
      toast.error('Failed to load users');
    }
  }, [listAdminUsers]);

  
  useEffect(() => {
    if (!adminUsers || adminUsers.users.length === 0) {
      loadUsers();
      setLastRefreshed(new Date());
    }
    
  }, []); 

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadUsers();
      setLastRefreshed(new Date());
      toast.success('Users refreshed');
    } catch (error) {
      toast.error('Failed to refresh users');
    } finally {
      setIsRefreshing(false);
    }
  };

  const users = adminUsers?.users || [];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(filters.search.toLowerCase()) ||
                         user.email.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === 'all' || user.status === filters.status;
    const matchesRole = filters.role === 'all' || user.role === filters.role;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);
      setSelectedUsers(prev => prev.filter(id => id !== userId));
      setDeleteConfirmUserId(null);
      toast.success('User deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to delete user: ${errorMessage}`);
    } finally {
      setActioningUserId(null);
    }
  };

  const handleToggleUserStatus = async (userId: number, currentStatus: string) => {
    setActioningUserId(userId);
    try {
      if (currentStatus === 'active') {
        await deactivateUser(userId);
        toast.success('User deactivated successfully');
      } else {
        await activateUser(userId);
        toast.success('User activated successfully');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to update user status: ${errorMessage}`);
    } finally {
      setActioningUserId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'destructive' | 'default'> = {
      active: 'success',
      inactive: 'warning',
      suspended: 'destructive',
    };
    return variants[status] || 'default';
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      customer: 'default',
      admin: 'destructive',
      moderator: 'secondary',
    };
    return variants[role] || 'default';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">User Management</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Loading users...</p>
          </div>
        </div>
        
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">User Management</h1>
            <p className="text-red-600 dark:text-red-400 mt-1">Error: {error.message}</p>
          </div>
          <Button onClick={loadUsers} className="rounded-xl">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">User Management</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your users, roles, and permissions
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="default" 
            size="sm" 
            className="rounded-xl bg-emerald-600 dark:bg-emerald-700 text-white border-emerald-700 dark:border-emerald-800 hover:bg-emerald-700 dark:hover:bg-emerald-800 shadow-lg shadow-emerald-200/50 dark:shadow-none transition-all duration-200"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            title="Refresh users list"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          {lastRefreshed && (
            <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
              Updated: {lastRefreshed.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Users</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {users.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Inactive Users</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {users.filter(u => u.status === 'inactive').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Admins</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 flex items-center justify-center">
                <Ban className="w-6 h-6 text-red-600 dark:text-red-400" />
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
                  placeholder="Search users by name or email..."
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
              
              <select
                value={filters.role}
                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:bg-white dark:focus:bg-slate-700 text-slate-900 dark:text-white font-medium"
              >
                <option value="all">All Roles</option>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
              
              <Button variant="outline" size="icon" className="rounded-xl">
                <RefreshCw className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
            Users ({filteredUsers.length})
          </CardTitle>
          
          {selectedUsers.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {selectedUsers.length} selected
              </span>
              <Button variant="outline" size="sm" className="rounded-xl">
                <Ban className="w-4 h-4 mr-2" />
                Bulk Action
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
                      checked={selectedUsers.length === filteredUsers.length}
                      onChange={handleSelectAll}
                      className="rounded-lg border-slate-300 dark:border-slate-600"
                    />
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    User
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Role
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Status
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Contact
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="rounded-lg border-slate-300 dark:border-slate-600"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {user.username}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={getRoleBadge(user.role)}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={getStatusBadge(user.status)}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        {user.phone_number && (
                          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                            <Phone className="w-3 h-3 mr-1" />
                            {user.phone_number}
                          </div>
                        )}
                        {user.address && (
                          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="truncate max-w-[200px]">{user.address}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {deleteConfirmUserId === user.id ? (
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 border border-red-200 dark:border-red-800 text-sm space-y-2">
                          <p className="font-medium text-red-900 dark:text-red-100">Delete user?</p>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-lg text-xs"
                              onClick={() => setDeleteConfirmUserId(null)}
                              disabled={actioningUserId === user.id}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="rounded-lg text-xs"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={actioningUserId === user.id}
                            >
                              {actioningUserId === user.id ? 'Deleting...' : 'Delete'}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {user.status === 'active' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-lg text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all duration-200 shadow-sm"
                              onClick={() => handleToggleUserStatus(user.id, user.status)}
                              disabled={actioningUserId === user.id || user.role === 'admin'}
                              title={user.role === 'admin' ? 'Cannot deactivate admin users' : 'Deactivate user'}
                            >
                              {actioningUserId === user.id ? (
                                <>
                                  <div className="w-3 h-3 mr-1 animate-spin rounded-full border border-amber-600 border-t-transparent" />
                                  Deactivating...
                                </>
                              ) : (
                                <>
                                  <Ban className="w-3 h-3 mr-1" />
                                  Deactivate
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-lg text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all duration-200 shadow-sm"
                              onClick={() => handleToggleUserStatus(user.id, user.status)}
                              disabled={actioningUserId === user.id}
                              title="Activate user"
                            >
                              {actioningUserId === user.id ? (
                                <>
                                  <div className="w-3 h-3 mr-1 animate-spin rounded-full border border-emerald-600 border-t-transparent" />
                                  Activating...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Activate
                                </>
                              )}
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all duration-200 shadow-sm"
                            onClick={() => setDeleteConfirmUserId(user.id)}
                            disabled={actioningUserId === user.id || user.role === 'admin'}
                            title={user.role === 'admin' ? 'Cannot delete admin users' : 'Delete user permanently'}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
