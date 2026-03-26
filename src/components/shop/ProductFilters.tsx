import { X, Check, Laptop, Shirt, Sofa, Sparkles, Dumbbell } from 'lucide-react';
import { Button } from '@/ui/Button';
import { CATEGORIES } from '@/utils/constants';
import { cn } from '@/utils/helpers';
import { useProducts } from '@/hooks/useProducts';
import { motion } from 'framer-motion';

// Icon mapping with colors
const iconMap = {
  laptop: { icon: Laptop, color: '#3B82F6, #06B6D4' },
  shirt: { icon: Shirt, color: '#EC4899, #F43F5E' },
  sofa: { icon: Sofa, color: '#10B981, #10B981' },
  sparkles: { icon: Sparkles, color: '#8B5CF6, #8B5CF6' },
  dumbbell: { icon: Dumbbell, color: '#F97316, #EF4444' },
};

interface ProductFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isFeatured: boolean;
  onFeaturedChange: (featured: boolean) => void;
  onClearAll: () => void;
  className?: string;
}

// Integration hook for product filters
export function useProductFilters() {
  const { listProducts, isLoading } = useProducts();
  
  const applyFilters = (filters: {
    category?: string;
    featured?: boolean;
    search?: string;
  }) => {
    listProducts(filters);
  };
  
  return {
    applyFilters,
    isLoading
  };
}

export default function ProductFilters({ 
  selectedCategory, 
  onCategoryChange, 
  isFeatured, 
  onFeaturedChange, 
  onClearAll,
  className 
}: ProductFiltersProps) {
  return (
    <div className={cn("space-y-12", className)}>
      {/* Categories */}
      <div>
        <div className="flex justify-between items-center mb-8">
          <h4 className="font-black text-sm uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Categories</h4>
          {selectedCategory && (
            <button 
              onClick={() => onCategoryChange('')}
              className="text-xs font-bold text-primary dark:text-blue-400 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="space-y-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={cn(
                "flex items-center justify-between w-full text-left px-5 py-3 rounded-2xl transition-all duration-300 group border-2",
                selectedCategory === cat.value 
                  ? "text-white shadow-xl transform scale-105 border-transparent" 
                  : "hover:shadow-md text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              )}
              style={selectedCategory === cat.value ? {
                background: `linear-gradient(135deg, ${iconMap[cat.icon as keyof typeof iconMap]?.color || '#6B7280, #4B5563'})`
              } : undefined}
            >
              <span className="font-bold flex items-center gap-2">
                {(() => {
                  const iconData = iconMap[cat.icon as keyof typeof iconMap];
                  const IconComponent = iconData?.icon;
                  return IconComponent ? (
                    <div className={cn(
                      "p-2 rounded-xl",
                      selectedCategory === cat.value ? "bg-white/20" : "bg-gradient-to-br from-white/20 to-white/10"
                    )}>
                      <IconComponent className="w-4 h-4" style={{
                        color: selectedCategory === cat.value ? 'white' : iconData.color.split(',')[0]
                      }} />
                    </div>
                  ) : null;
                })()}
                {cat.label}
              </span>
              <div className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center transition-all",
                selectedCategory === cat.value ? "bg-white/20" : "bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10"
              )}>
                {selectedCategory === cat.value ? (
                  <Check className="w-3 h-3 text-white" />
                ) : (
                  <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full group-hover:bg-primary" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Filter */}
      <div>
        <h4 className="font-black text-sm uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-8">Availability</h4>
        <label className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer group hover:shadow-md transition-all">
          <span className="font-bold text-slate-600 dark:text-slate-400">Featured Only</span>
          <div className={cn(
            "w-12 h-6 rounded-full p-1 transition-colors duration-300",
            isFeatured ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
          )}>
            <motion.div 
              animate={{ x: isFeatured ? 24 : 0 }}
              className="w-4 h-4 bg-white rounded-full shadow-sm"
            />
          </div>
          <input 
            type="checkbox" 
            className="hidden" 
            checked={isFeatured}
            onChange={(e) => onFeaturedChange(e.target.checked)}
          />
        </label>
      </div>

      {/* Clear All */}
      {(selectedCategory || isFeatured) && (
        <Button 
          variant="outline" 
          className="w-full h-14 rounded-2xl border-dashed border-2 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
          onClick={onClearAll}
        >
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );
}
