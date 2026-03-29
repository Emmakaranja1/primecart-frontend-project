import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { useOrders } from '@/hooks/useOrders';
import ProfileForm from '@/components/user/ProfileForm';
import AddressForm from '@/components/user/AddressForm';
import OrderHistory from '@/components/user/OrderHistory';
import Loading from '@/ui/Loading';
import { Button } from '@/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/Card';
import { User, MapPin, Package, LogOut, ShieldCheck, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import type { UpdateProfileRequest } from '@/api/userService';

export default function Profile() {
  const { user, logout } = useAuth();
  const { profile, getProfile, updateProfile, isLoading } = useUser();
  const { getOrders } = useOrders();
  const [activeTab, setActiveTab] = useState<'profile' | 'address' | 'orders' | 'security'>('profile');

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    if (activeTab === 'orders') {
      getOrders();
    }
  }, [activeTab, getOrders]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const handleProfileUpdate = async (data: UpdateProfileRequest) => {
    return await updateProfile(data);
  };

  if (isLoading && !user) {
    return <Loading fullScreen />;
  }

  const tabs = [
    { id: 'profile', label: 'Account Info', icon: User },
    { id: 'address', label: 'Shipping Address', icon: MapPin },
    { id: 'orders', label: 'Order History', icon: Package },
    { id: 'security', label: 'Security', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden dark:bg-slate-900">
              <div className="bg-primary p-8 text-white text-center">
                <div className="w-24 h-24 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center text-4xl font-black border-4 border-white/30">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-black tracking-tight">{user?.username}</h2>
                <p className="text-white/60 text-sm font-medium">{user?.email}</p>
              </div>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'profile' | 'address' | 'orders' | 'security')}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${
                        activeTab === tab.id 
                          ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-4" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-bold text-sm"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </nav>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-none shadow-sm rounded-3xl p-6 bg-blue-50 dark:bg-blue-900/20">
                <div className="text-blue-600 dark:text-blue-400 font-black text-2xl mb-1">12</div>
                <div className="text-blue-400 dark:text-blue-500 text-xs font-black uppercase tracking-widest">Orders</div>
              </Card>
              <Card className="border-none shadow-sm rounded-3xl p-6 bg-purple-50 dark:bg-purple-900/20">
                <div className="text-purple-600 dark:text-purple-400 font-black text-2xl mb-1">4</div>
                <div className="text-purple-400 dark:text-purple-500 text-xs font-black uppercase tracking-widest">Reviews</div>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <Card className="border-none shadow-sm rounded-[2rem] dark:bg-slate-900">
                      <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-2xl font-black tracking-tight dark:text-white">Account Information</CardTitle>
                        <CardDescription className="text-slate-500 dark:text-slate-400 font-medium">Update your personal details and contact information.</CardDescription>
                      </CardHeader>
                      <CardContent className="p-8">
                        <ProfileForm 
                          profile={profile} 
                          onUpdate={handleProfileUpdate} 
                          isLoading={isLoading} 
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === 'address' && (
                  <div className="space-y-6">
                    <Card className="border-none shadow-sm rounded-[2rem] dark:bg-slate-900">
                      <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-2xl font-black tracking-tight dark:text-white">Shipping Address</CardTitle>
                        <CardDescription className="text-slate-500 dark:text-slate-400 font-medium">Manage your primary delivery address for faster checkout.</CardDescription>
                      </CardHeader>
                      <CardContent className="p-8">
                        <AddressForm 
                          initialAddress={profile?.address || ''} 
                          onSubmit={(address) => updateProfile({ address })} 
                          isLoading={isLoading} 
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white px-4">Recent Orders</h2>
                    </div>
                    <OrderHistory />
                  </div>
                )}

                {activeTab === 'security' && (
                  <Card className="border-none shadow-sm rounded-[2rem] dark:bg-slate-900">
                    <CardHeader className="p-8">
                      <CardTitle className="text-2xl font-black tracking-tight dark:text-white">Security Settings</CardTitle>
                      <CardDescription className="text-slate-500 dark:text-slate-400 font-medium">Manage your account password and security preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                      <div className="space-y-6">
                        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-primary dark:text-blue-400 shadow-sm">
                              <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-white">Change Password</h4>
                              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Update your account password regularly.</p>
                            </div>
                          </div>
                          <Button variant="outline" className="rounded-xl dark:border-slate-700 dark:text-slate-300">Update</Button>
                        </div>
                        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-primary dark:text-blue-400 shadow-sm">
                              <CreditCard className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-white">Payment Methods</h4>
                              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Manage your saved cards and payment options.</p>
                            </div>
                          </div>
                          <Button variant="outline" className="rounded-xl dark:border-slate-700 dark:text-slate-300">Manage</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
