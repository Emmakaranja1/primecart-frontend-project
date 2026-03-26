import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';

export function useAuth() {
  const { 
    user, 
    token, 
    isAuthenticated, 
    isLoading, 
    error, 
    message,
    login, 
    register, 
    logout, 
    adminLogin,
    forgotPassword, 
    verifyOtp, 
    resetPassword 
  } = useAuthStore();

  const { profile, getProfile } = useUserStore();

  return {
    user,
    profile,
    token,
    isAuthenticated,
    isLoading,
    error,
    message,
    login,
    register,
    logout,
    adminLogin,
    forgotPassword,
    verifyOtp,
    resetPassword,
    getProfile: getProfile
  };
}