import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '../components/user/LoginForm';
import RegisterForm from '../components/user/RegisterForm';
import PasswordReset from '../components/user/PasswordReset';
import { ShieldCheck, Sparkles, Zap, ShoppingCart } from 'lucide-react';
import Loading from '@/ui/Loading';

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();
  
  const isRegister = location.pathname === '/register';
  const isForgot = location.pathname === '/forgot-password';
  const redirectReason = searchParams.get('reason'); 

  const [view, setView] = useState<'login' | 'register' | 'forgot'>(
    isRegister ? 'register' : isForgot ? 'forgot' : 'login'
  );

  
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  
  useEffect(() => {
    if (isRegister) setView('register');
    else if (isForgot) setView('forgot');
    else setView('login');
  }, [location.pathname, isRegister, isForgot]);

  
  if (isLoading) {
    return <Loading fullScreen />;
  }

  
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side: Visuals */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-20">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/4 -left-1/4 w-full h-full bg-primary/20 blur-[120px] rounded-full"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [0, -90, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-blue-500/20 blur-[120px] rounded-full"
          />
        </div>

        <div className="relative z-10 max-w-lg space-y-12">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary"
            >
              <ShieldCheck className="w-10 h-10" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl font-black text-white leading-tight tracking-tighter"
            >
              Experience <br />
              <span className="text-primary">Pure Luxury.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-400 font-medium leading-relaxed"
            >
              Join thousands of satisfied customers who trust PrimeCart for their premium shopping needs.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-10">
            {[
              { icon: Zap, label: 'Fast Delivery', desc: 'Global shipping in 3-5 days' },
              { icon: Sparkles, label: 'Premium Quality', desc: 'Handpicked luxury items' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 text-white">
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="font-black uppercase tracking-widest text-xs">{item.label}</span>
                </div>
                <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-20 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="w-full max-w-md">
          {/* Cart Redirect Notice */}
          {redirectReason === 'add_to_cart' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl"
            >
              <div className="flex items-start space-x-3">
                <ShoppingCart className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">
                    Authentication Required
                  </h4>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    Please sign in or create an account to add items to your cart and continue shopping.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {view === 'login' && <LoginForm />}
              {view === 'register' && <RegisterForm />}
              {view === 'forgot' && <PasswordReset />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}