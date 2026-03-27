import React from 'react';
import { cn } from '../../utils/helpers';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelect: (category: string | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelect,
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Categories
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelect(null)}
          className={cn(
            'px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border-2',
            selectedCategory === null
              ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
              : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
          )}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={cn(
              'px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border-2',
              selectedCategory === category
                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};