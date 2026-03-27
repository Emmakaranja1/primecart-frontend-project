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
  } = useUserStore();

  return {
    profile,
    isLoading,
    error,
    message,
    getProfile,
    updateProfile,
    updateAddress,
  };
}