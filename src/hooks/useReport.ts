import { useReportStore } from '../stores/reportStore';

export function useReport() {
  const { 
    usersReport,
    ordersReport,
    activityReport,
    exportedBlob,
    isLoading, 
    error,
    exportProgress,
    getUsersReport,
    getOrdersReport,
    getActivityReport,
    exportReport
  } = useReportStore();

  return {
    usersReport,
    ordersReport,
    activityReport,
    exportedBlob,
    isLoading,
    error,
    exportProgress,
    getUsersReport,
    getOrdersReport,
    getActivityReport,
    exportReport
  };
}
