import { useState } from 'react';
import { Mail, Lock, ArrowRight, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { adminLogin, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminLogin({ email, password });
      toast.success('Welcome to Admin Dashboard!');
      navigate('/admin');
    } catch (error: any) {
      toast.error(error.message || 'Admin login failed. Please check your credentials.');
    }
  };

  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-4xl font-black tracking-tight dark:text-white">Admin Login</h2>
        <p className="text-slate-400 dark:text-slate-500 font-medium">Access the administrative dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Admin Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 dark:text-slate-700 group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-purple-500/10 dark:focus:ring-purple-400/10 transition-all font-bold text-lg dark:text-white"
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Password</label>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 dark:text-slate-700 group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors" />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 pr-12 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-purple-500/10 dark:focus:ring-purple-400/10 transition-all font-bold text-lg dark:text-white"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            type="submit" 
            className="w-full h-16 rounded-2xl text-lg font-black bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-xl shadow-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/30 transition-all group"
            disabled={isLoading}
          >
            <span>{isLoading ? 'Signing in...' : 'Sign In as Admin'}</span>
            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </form>

      <div className="text-center pt-4">
        <a href="/login" className="text-slate-500 dark:text-slate-400 font-bold hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
          ← Back to User Login
        </a>
      </div>
    </div>
  );
}
