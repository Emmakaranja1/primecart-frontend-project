import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await register(formData);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-black tracking-tight dark:text-white">Create Account</h2>
        <p className="text-slate-400 dark:text-slate-500 font-medium">Join our premium shopping experience.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Username</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 dark:text-slate-700 group-focus-within:text-primary dark:group-focus-within:text-blue-400 transition-colors" />
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="pl-12 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary/10 dark:focus:ring-blue-400/10 transition-all font-bold text-lg dark:text-white"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 dark:text-slate-700 group-focus-within:text-primary dark:group-focus-within:text-blue-400 transition-colors" />
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-12 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary/10 dark:focus:ring-blue-400/10 transition-all font-bold text-lg dark:text-white"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 dark:text-slate-700 group-focus-within:text-primary dark:group-focus-within:text-blue-400 transition-colors" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Confirm Password</label>
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 dark:text-slate-700 group-focus-within:text-primary dark:group-focus-within:text-blue-400 transition-colors" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.password_confirmation}
                  onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                  className="pl-12 pr-12 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary/10 dark:focus:ring-blue-400/10 transition-all font-bold text-lg dark:text-white"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 hover:text-primary dark:hover:text-blue-400 transition-colors"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-16 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all group"
          disabled={isLoading}
        >
          <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
          <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      <div className="text-center pt-4">
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-primary dark:text-blue-400 font-black hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}