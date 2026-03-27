import { useUserStore } from '../stores/userStore';

export function useUser() {
  const {
    profile,
    isLoading,
    error,
    message,
    getProfile,
    updateProfile,
    updateAddress,
    listAdminUsers,
    activateUser,
    deactivateUser,
    deleteUser,
    listAdminActivityLogs,
  } = useUserStore();

  return {
    profile,
    isLoading,
    error,
    message,
    getProfile,
    updateProfile,
    updateAddress,
    listAdminUsers,
    activateUser,
    deactivateUser,
    deleteUser,
    listAdminActivityLogs,
  };
}