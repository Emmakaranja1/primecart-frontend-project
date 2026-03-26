import { Star, StarHalf } from 'lucide-react';
import { cn } from "@/utils/helpers";

interface RatingProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showCount?: boolean;
}

export default function Rating({ 
  rating, 
  count, 
  size = 'md', 
  className,
  showCount = true 
}: RatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const starSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="flex items-center space-x-0.5">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className={cn(starSize[size], "fill-amber-400 text-amber-400")} />
        ))}
        {hasHalfStar && (
          <StarHalf className={cn(starSize[size], "fill-amber-400 text-amber-400")} />
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className={cn(starSize[size], "text-slate-200 dark:text-slate-700")} />
        ))}
      </div>
      
      {showCount && count !== undefined && (
        <span className={cn(
          "text-slate-400 dark:text-slate-500 font-bold",
          size === 'sm' ? 'text-[10px]' : 'text-xs'
        )}>
          ({count})
        </span>
      )}
    </div>
  );
}
