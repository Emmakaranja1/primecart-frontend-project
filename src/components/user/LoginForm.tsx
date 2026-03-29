import { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      toast.success('Welcome back!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-black tracking-tight dark:text-white">Welcome Back</h2>
        <p className="text-slate-400 dark:text-slate-500 font-medium">Enter your credentials to access your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 dark:text-slate-700 group-focus-within:text-primary dark:group-focus-within:text-blue-400 transition-colors" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary/10 dark:focus:ring-blue-400/10 transition-all font-bold text-lg dark:text-white"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Password</label>
              <Link to="/forgot-password" title="Reset Password" className="text-xs font-bold text-primary dark:text-blue-400 hover:underline">Forgot Password?</Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 dark:text-slate-700 group-focus-within:text-primary dark:group-focus-within:text-blue-400 transition-colors" />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 pr-12 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary/10 dark:focus:ring-blue-400/10 transition-all font-bold text-lg dark:text-white"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 hover:text-primary dark:hover:text-blue-400 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-16 rounded-2xl text-lg font-black bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all group border-0"
          disabled={isLoading}
        >
          <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
          <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      <div className="text-center pt-4">
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary dark:text-blue-400 font-black hover:underline">Create Account</Link>
        </p>
      </div>
    </div>
  );
}