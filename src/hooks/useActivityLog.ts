import { useActivityLogStore } from '../stores/activityLogStore';

export function useActivityLog() {
  const { 
    logs, 
    isLoading, 
    error,
    listAdminActivityLogs 
  } = useActivityLogStore();

  return {
    logs: logs?.logs || [],
    pagination: logs?.pagination || null,
    isLoading,
    error,
    getLogs: listAdminActivityLogs
  };
}
