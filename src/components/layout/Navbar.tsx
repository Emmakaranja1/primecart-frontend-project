import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, ShoppingBag, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/ui/Button';
import { cn } from '@/utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { cart, getCart } = useCartStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getCart();
    }
  }, [isAuthenticated, getCart]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
    { name: 'Featured', path: '/products?featured=true' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-12 py-6',
        isScrolled 
          ? 'bg-gradient-to-r from-purple-950/95 via-indigo-950/95 to-blue-950/95 backdrop-blur-lg shadow-lg py-5 border-b border-purple-600/30' 
          : 'bg-gradient-to-r from-purple-900/85 via-indigo-900/85 to-blue-900/85 backdrop-blur-md'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="group flex items-center space-x-2">
          <div className="relative">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              className="transition-transform duration-300 group-hover:scale-110"
            >
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="50%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
              <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" opacity="0.1"/>
              <path
                d="M12 15 Q20 8 28 15 L28 25 Q20 32 12 25 Z"
                fill="url(#logoGradient)"
                className="transition-all duration-300 group-hover:opacity-90"
              />
              <ShoppingBag 
                x="13" 
                y="13" 
                width="14" 
                height="14" 
                stroke="white" 
                strokeWidth="2" 
                fill="none"
                className="transition-all duration-300 group-hover:scale-105"
              />
              <Sparkles 
                x="26" 
                y="10" 
                width="8" 
                height="8" 
                fill="#FBBF24"
                className="animate-pulse"
              />
            </svg>
          </div>
          <div className="text-2xl font-bold tracking-tighter">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">PRIME</span>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">CART</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                'text-base font-semibold transition-all duration-300 hover:scale-105 px-4 py-2 rounded-full',
                location.pathname === link.path 
                  ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-cyan-200 border border-purple-400/40 shadow-lg shadow-purple-500/30' 
                  : 'text-slate-200 hover:text-white hover:bg-white/15'
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full transition-all duration-300 hover:scale-110">
              <ShoppingCart className="w-5 h-5" />
              {cart && cart.total_items > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                  {cart.total_items}
                </span>
              )}
            </Button>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="hidden md:flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full transition-all duration-300 hover:scale-105">
                  <User className="w-4 h-4" />
                  <span className="font-medium text-base">{user?.username}</span>
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => logout()} title="Logout" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full transition-all duration-300 hover:scale-105">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm" className="rounded-full px-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105">
                Login
              </Button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 backdrop-blur-xl p-4 md:hidden flex flex-col space-y-4 shadow-2xl border-t border-purple-500/30"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xl font-semibold py-2 border-b border-purple-500/20 text-slate-100 hover:text-white transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
            {!isAuthenticated && (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 shadow-lg shadow-purple-500/25 transition-all duration-300">Login / Register</Button>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}