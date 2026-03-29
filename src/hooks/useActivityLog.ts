import { useUserStore } from '../stores/userStore';

export function useActivityLog() {
  const { 
    adminActivityLogs, 
    isLoading, 
    error, 
    listAdminActivityLogs 
  } = useUserStore();

  return {
    activityLogs: adminActivityLogs?.logs || [],
    pagination: adminActivityLogs?.pagination || null,
    isLoading,
    error,
    listAdminActivityLogs
  };
}
