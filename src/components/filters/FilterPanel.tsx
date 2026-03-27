import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../../ui/Button';
import { CategoryFilter } from './CategoryFilter';
import { BrandFilter } from './BrandFilter';
import { PriceRange } from './PriceRange';
import { FeaturedFilter } from './FeaturedFilter';
import { CATEGORIES, BRANDS } from '../../constants/categories';
import { cn } from '../../utils/helpers';

interface FilterPanelProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  selectedBrand: string | null;
  onBrandChange: (brand: string | null) => void;
  minPrice: number;
  maxPrice: number;
  onMinPriceChange: (price: number) => void;
  onMaxPriceChange: (price: number) => void;
  isFeatured: boolean;
  onFeaturedChange: (featured: boolean) => void;
  onClearAll: () => void;
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedBrand,
  onBrandChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  isFeatured,
  onFeaturedChange,
  onClearAll,
  className,
}) => {
  const hasFilters = selectedCategory || selectedBrand || minPrice > 0 || maxPrice < 1000000 || isFeatured;

  return (
    <div className={cn("space-y-10", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black uppercase tracking-tighter dark:text-white">Filters</h2>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-xs font-bold text-primary hover:bg-primary/5 rounded-full"
          >
            <X className="w-3 h-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <CategoryFilter
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelect={onCategoryChange}
      />

      <BrandFilter
        brands={BRANDS}
        selectedBrand={selectedBrand}
        onSelect={onBrandChange}
      />

      <PriceRange
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinChange={onMinPriceChange}
        onMaxChange={onMaxPriceChange}
      />

      <FeaturedFilter
        isFeatured={isFeatured}
        onToggle={onFeaturedChange}
      />
    </div>
  );
};

export default FilterPanel;