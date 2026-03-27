import React from 'react';
import { formatCurrency } from '../../utils/helpers';

interface PriceRangeProps {
  minPrice: number;
  maxPrice: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}

export const PriceRange: React.FC<PriceRangeProps> = ({
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Price Range
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-600">Min</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => onMinChange(Number(e.target.value))}
              className="w-full pl-7 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 dark:text-white"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-600">Max</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => onMaxChange(Number(e.target.value))}
              className="w-full pl-7 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 dark:text-white"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
        <span>{formatCurrency(minPrice)}</span>
        <span>{formatCurrency(maxPrice)}</span>
      </div>
    </div>
  );
};