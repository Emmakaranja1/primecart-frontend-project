import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Search, 
  ArrowLeft, 
  RefreshCw,
  AlertTriangle,
  Compass
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';

interface NotFoundProps {
  customMessage?: string;
  showBackButton?: boolean;
  redirectPath?: string;
}

export default function NotFound({ 
  customMessage, 
  showBackButton = true, 
  redirectPath = '/' 
}: NotFoundProps = {}) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(redirectPath);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Main 404 Card */}
        <Card className="border-none shadow-2xl dark:bg-slate-900/50 backdrop-blur-xl rounded-[3rem] overflow-hidden">
          <CardContent className="p-12 text-center">
            {/* 404 Icon and Number */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative mb-8"
            >
              <div className="text-[120px] font-black bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent leading-none">
                404
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <AlertTriangle className="w-6 h-6 text-white" />
              </motion.div>
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4 mb-8"
            >
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {customMessage || "Page Not Found"}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-medium max-w-md mx-auto">
                Oops! The page you're looking for seems to have vanished into the digital void. 
                Let's get you back on track.
              </p>
            </motion.div>

            {/* Search Suggestions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Try searching or use the navigation below
                </span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4"
            >
              <Button
                onClick={handleGoHome}
                className="rounded-xl h-12 px-8 font-black shadow-lg shadow-primary/20 flex items-center space-x-2"
              >
                <Home className="w-5 h-5" />
                <span>Go Home</span>
              </Button>

              {showBackButton && (
                <Button
                  variant="outline"
                  onClick={handleGoBack}
                  className="rounded-xl h-12 px-8 font-bold dark:border-slate-800 dark:text-slate-300 flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Go Back</span>
                </Button>
              )}

              <Button
                variant="ghost"
                onClick={handleRefresh}
                className="rounded-xl h-12 px-8 font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </Button>
            </motion.div>
          </CardContent>
        </Card>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
            <Compass className="w-4 h-4" />
            <span>Popular destinations:</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
            <Link 
              to="/"
              className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-primary hover:text-primary transition-all"
            >
              Home
            </Link>
            <Link 
              to="/products"
              className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-primary hover:text-primary transition-all"
            >
              Shop
            </Link>
            <Link 
              to="/admin/dashboard"
              className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-primary hover:text-primary transition-all"
            >
              Admin
            </Link>
            <Link 
              to="/profile"
              className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-primary hover:text-primary transition-all"
            >
              Profile
            </Link>
          </div>
        </motion.div>

        {/* Error Details (Development Only) */}
        {import.meta.env.DEV && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8"
          >
            <Card className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-2xl">
              <CardContent className="p-4">
                <div className="text-left text-sm font-mono text-red-700 dark:text-red-300">
                  <div className="font-black mb-2">Development Info:</div>
                  <div>Path: {window.location.pathname}</div>
                  <div>Timestamp: {new Date().toISOString()}</div>
                  <div>User Agent: {navigator.userAgent}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}