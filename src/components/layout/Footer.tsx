import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-tr from-slate-950 via-indigo-950 to-purple-950 border-t border-gradient-to-r from-purple-600/20 via-cyan-600/20 to-blue-600/20 backdrop-blur-xl pt-16 pb-8 px-4 md:px-8 transition-colors duration-300 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-cyan-600 to-blue-600" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)`
        }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
        <div className="space-y-4">
          <Link to="/" className="group flex items-center space-x-2">
            <div className="relative">
              <svg
                width="32"
                height="32"
                viewBox="0 0 40 40"
                className="transition-transform duration-300 group-hover:scale-110"
              >
                <defs>
                  <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9333EA" />
                    <stop offset="33%" stopColor="#2563EB" />
                    <stop offset="66%" stopColor="#0891B2" />
                    <stop offset="100%" stopColor="#0284C7" />
                  </linearGradient>
                </defs>
                <circle cx="20" cy="20" r="18" fill="url(#footerLogoGradient)" opacity="0.1"/>
                <path
                  d="M12 15 Q20 8 28 15 L28 25 Q20 32 12 25 Z"
                  fill="url(#footerLogoGradient)"
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
              <span className="bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">PRIME</span>
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">CART</span>
            </div>
          </Link>
          <p className="text-slate-400 text-base max-w-xs leading-relaxed">
            Experience the future of shopping with our curated selection of premium products and seamless checkout.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-6 text-slate-100 text-lg tracking-wide">Shop</h4>
          <ul className="space-y-3 text-base text-slate-400">
            <li><Link to="/products" className="hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 inline-block">All Products</Link></li>
            <li><Link to="/products?featured=true" className="hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 inline-block">Featured</Link></li>
            <li><Link to="/products?category=Electronics" className="hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 inline-block">Electronics</Link></li>
            <li><Link to="/products?category=Fashion" className="hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 inline-block">Fashion</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-6 text-slate-100 text-lg tracking-wide">Support</h4>
          <ul className="space-y-3 text-base text-slate-400">
            <li><Link to="/faq" className="hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 inline-block">FAQ</Link></li>
            <li><Link to="/shipping" className="hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 inline-block">Shipping</Link></li>
            <li><Link to="/returns" className="hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 inline-block">Returns</Link></li>
            <li><Link to="/contact" className="hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 inline-block">Contact Us</Link></li>
          </ul>
        </div>

        </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gradient-to-r from-purple-600/10 via-cyan-600/10 to-blue-600/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-slate-500 relative z-10">
        <p>© {currentYear} PrimeCart. All rights reserved.</p>
        <div className="flex space-x-6">
          <Link to="/privacy" className="hover:text-slate-300 transition-colors duration-300 hover:translate-x-1 inline-block">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-slate-300 transition-colors duration-300 hover:translate-x-1 inline-block">Terms of Service</Link>
          <Link to="/cookies" className="hover:text-slate-300 transition-colors duration-300 hover:translate-x-1 inline-block">Cookies Settings</Link>
        </div>
      </div>
    </footer>
  );
}
