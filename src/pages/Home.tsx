import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react';
import { useProductStore } from '@/stores/productStore';
import ProductCard from '@/components/shop/ProductCard';
import { Button } from '@/ui/Button';
import { Badge } from '@/ui/Badge';

export default function Home() {
  const { products, listProducts, isLoading } = useProductStore();

  useEffect(() => {
    listProducts({ featured: true, limit: 4 });
  }, [listProducts]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-none backdrop-blur-md px-4 py-1">
              New Collection 2026
            </Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
              Elevate Your <span className="text-slate-400">Lifestyle</span> With Prime Selection.
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-lg leading-relaxed">
              Discover a meticulously curated collection of premium goods designed for those who appreciate the finer details.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/products">
                <Button size="lg" className="rounded-full px-10 h-14 text-lg text-white group">
                  Shop Collection
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/products?featured=true">
                <Button size="lg" variant="outline" className="rounded-full px-10 h-14 text-lg text-white border-white/20 hover:bg-white/10">
                  View Featured
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Zap, title: "Fast Delivery", desc: "Get your orders delivered within 24-48 hours with our premium logistics." },
              { icon: Shield, title: "Secure Payments", desc: "Multiple secure payment options including M-Pesa, Flutterwave and more." },
              { icon: Truck, title: "Free Shipping", desc: "Enjoy free shipping on all orders over KES 10,000 across the country." }
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-primary dark:text-blue-400">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold dark:text-white">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-slate-800 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 space-y-4 md:space-y-0">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">Featured Arrivals</h2>
              <p className="text-white max-w-md">Our hand-picked selection of the most trending and high-quality products this season.</p>
            </div>
            <Link to="/products">
              <Button variant="ghost" className="group text-white font-bold hover:bg-slate-700">
                View All Products
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[4/5] bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3 animate-pulse" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {products.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-20 dark:bg-slate-950 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-8">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-800 h-[500px] flex items-center">
            <img 
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1500" 
              alt="Promo" 
              className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
              referrerPolicy="no-referrer"
            />
            <div className="relative z-10 px-8 md:px-20 max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Shop Premium & Get Exclusive Deals
              </h2>
              <p className="text-slate-200 text-lg mb-10">
                Browse our curated collection and enjoy secure shopping with multiple payment methods including M-Pesa, Flutterwave, and DPO.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/products">
                  <Button size="lg" className="bg-white text-primary hover:bg-slate-100 rounded-full px-10">
                    Start Shopping
                  </Button>
                </Link>
                <Link to="/products?featured=true">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 rounded-full px-10">
                    View Deals
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}