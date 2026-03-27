import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  FileText, 
  Activity,
  Menu,
  X,
  LogOut,
  Settings,
  Bell
} from 'lucide-react';
import { Button } from '@/ui/Button';
import { cn } from '@/utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const sidebarItems = [
  {
    name: 'Dashboard',
    path: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Users',
    path: '/admin/users',
    icon: Users,
  },
  {
    name: 'Products',
    path: '/admin/products',
    icon: Package,
  },
  {
    name: 'Orders',
    path: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    name: 'Reports',
    path: '/admin/reports',
    icon: FileText,
  },
  {
    name: 'Activity Log',
    path: '/admin/activity',
    icon: Activity,
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Top Bar */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-4 md:px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800',
          isScrolled && 'shadow-sm'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Sidebar Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex"
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 40 40"
                  className="transition-transform duration-300"
                >
                  <defs>
                    <linearGradient id="adminLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="50%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                  <circle cx="20" cy="20" r="18" fill="url(#adminLogoGradient)" opacity="0.1"/>
                  <path
                    d="M12 15 Q20 8 28 15 L28 25 Q20 32 12 25 Z"
                    fill="url(#adminLogoGradient)"
                  />
                  <Settings 
                    x="13" 
                    y="13" 
                    width="14" 
                    height="14" 
                    stroke="white" 
                    strokeWidth="2" 
                    fill="none"
                  />
                </svg>
              </div>
              <div className="text-xl font-bold tracking-tighter">
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">PRIME</span>
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">CART</span>
                <span className="text-slate-400 dark:text-slate-600 text-sm ml-2">Admin</span>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                3
              </span>
            </Button>

            <div className="hidden md:flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {user?.username || 'Admin User'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Administrator</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 pt-20',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'
        )}
      >
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                           (item.path !== '/admin' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                  isActive
                    ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                <Icon className={cn(
                  'w-5 h-5 transition-transform duration-200',
                  isActive ? 'scale-110' : 'group-hover:scale-110'
                )} />
                {isSidebarOpen && (
                  <span className="font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        {isSidebarOpen && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">
                Need Help?
              </p>
              <p className="text-xs text-purple-700 dark:text-purple-300 mb-3">
                Check our documentation for detailed guides.
              </p>
              <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                View Docs
              </Button>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div 
              className="absolute inset-0 bg-black/50" 
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 pt-20">
              <nav className="p-4 space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || 
                                 (item.path !== '/admin' && location.pathname.startsWith(item.path));
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200',
                        isActive
                          ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={cn(
          'transition-all duration-300 pt-20',
          isSidebarOpen ? 'md:ml-64' : 'md:ml-20'
        )}
      >
        <div className="p-6">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}
