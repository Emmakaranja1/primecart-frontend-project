import { useState } from 'react';
import { Mail, Key, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function PasswordReset() {
  const [step, setStep] = useState<'forgot' | 'otp' | 'reset'>('forgot');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { forgotPassword, verifyOtp, resetPassword, isLoading } = useAuth();

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword({ email });
      toast.success('OTP sent to your email');
      setStep('otp');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOtp({ email, otp });
      toast.success('OTP verified');
      setStep('reset');
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP');
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await resetPassword({ email, otp, password, password_confirmation: confirmPassword });
      toast.success('Password reset successful');
      setStep('forgot'); 
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password');
    }
  };

  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-black tracking-tight dark:text-white">
          {step === 'forgot' && 'Reset Password'}
          {step === 'otp' && 'Verify OTP'}
          {step === 'reset' && 'New Password'}
        </h2>
        <p className="text-slate-400 dark:text-slate-500 font-medium">
          {step === 'forgot' && 'Enter your email to receive a password reset code.'}
          {step === 'otp' && `Enter the 6-digit code sent to ${email}`}
          {step === 'reset' && 'Create a strong new password for your account.'}
        </p>
      </div>

      {step === 'forgot' && (
        <form onSubmit={handleForgot} className="space-y-8">
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 dark:text-slate-700 group-focus-within:text-primary dark:group-focus-within:text-blue-400 transition-colors" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary/10 dark:focus:ring-blue-400/10 transition-all font-bold text-lg dark:text-white"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full h-16 rounded-2xl text-lg font-black text-white shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all group"
            disabled={isLoading}
          >
            <span>{isLoading ? 'Sending...' : 'Send Reset Code'}</span>
            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerify} className="space-y-8">
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Verification Code</label>
            <div className="relative group">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 dark:text-slate-700 group-focus-within:text-primary dark:group-focus-within:text-blue-400 transition-colors" />
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="pl-12 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary/10 dark:focus:ring-blue-400/10 transition-all font-bold text-2xl tracking-[0.5em] text-center dark:text-white"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full h-16 rounded-2xl text-lg font-black text-white shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all group"
            disabled={isLoading}
          >
            <span>{isLoading ? 'Verifying...' : 'Verify Code'}</span>
            <CheckCircle2 className="w-6 h-6 ml-2 group-hover:scale-110 transition-transform" />
          </Button>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={handleReset} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">New Password</label>
              <div className="relative group">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-16 pl-4 pr-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary/10 dark:focus:ring-blue-400/10 transition-all font-bold text-lg dark:text-white"
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
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Confirm New Password</label>
              <div className="relative group">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-16 pl-4 pr-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary/10 dark:focus:ring-blue-400/10 transition-all font-bold text-lg dark:text-white"
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
          <Button 
            type="submit" 
            className="w-full h-16 rounded-2xl text-lg font-black text-white shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all group"
            disabled={isLoading}
          >
            <span>{isLoading ? 'Resetting...' : 'Reset Password'}</span>
            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>
      )}

      <div className="text-center pt-4">
        <Link to="/login" className="text-slate-500 dark:text-slate-400 font-bold hover:text-primary dark:hover:text-blue-400 transition-colors">
          Back to Login
        </Link>
      </div>
    </div>
  );
}