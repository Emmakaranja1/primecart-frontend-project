import React from 'react';
import { cn } from '../../utils/helpers';

interface BrandFilterProps {
  brands: string[];
  selectedBrand: string | null;
  onSelect: (brand: string | null) => void;
}

export const BrandFilter: React.FC<BrandFilterProps> = ({
  brands,
  selectedBrand,
  onSelect,
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Brands
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelect(null)}
          className={cn(
            'px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border-2',
            selectedBrand === null
              ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
              : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
          )}
        >
          All Brands
        </button>
        {brands.map((brand) => (
          <button
            key={brand}
            onClick={() => onSelect(brand)}
            className={cn(
              'px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border-2',
              selectedBrand === brand
                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
            )}
          >
            {brand}
          </button>
        ))}
      </div>
    </div>
  );
};