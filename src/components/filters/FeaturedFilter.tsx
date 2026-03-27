import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface FeaturedFilterProps {
  isFeatured: boolean;
  onToggle: (value: boolean) => void;
}

export const FeaturedFilter: React.FC<FeaturedFilterProps> = ({
  isFeatured,
  onToggle,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
      <div className="flex items-center space-x-3">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
          isFeatured ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400" : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500"
        )}>
          <Star className={cn("w-4 h-4", isFeatured && "fill-current")} />
        </div>
        <div>
          <h4 className="text-sm font-bold dark:text-white">Featured Only</h4>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Top rated products</p>
        </div>
      </div>
      <button
        onClick={() => onToggle(!isFeatured)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20",
          isFeatured ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            isFeatured ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
};