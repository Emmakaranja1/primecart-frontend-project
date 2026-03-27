import { Minus, Plus } from 'lucide-react';
import { Button } from '@/ui/Button';
import { cn } from '@/utils/helpers';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  disabled = false,
  className,
  size = 'md'
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (quantity > min && !disabled) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max && !disabled) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= min && value <= max) {
      onQuantityChange(value);
    }
  };

  const sizeClasses = {
    sm: {
      button: 'h-8 w-8',
      input: 'w-12 h-8 text-sm',
      icon: 'w-3 h-3'
    },
    md: {
      button: 'h-10 w-10',
      input: 'w-16 h-10 text-base',
      icon: 'w-4 h-4'
    },
    lg: {
      button: 'h-12 w-12',
      input: 'w-20 h-12 text-lg',
      icon: 'w-5 h-5'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          classes.button,
          "rounded-xl border-slate-200 hover:bg-slate-50 hover:border-slate-300",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={handleDecrease}
        disabled={disabled || quantity <= min}
      >
        <Minus className={classes.icon} />
      </Button>

      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={min}
        max={max}
        className={cn(
          classes.input,
          "text-center font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
        )}
        disabled={disabled}
      />

      <Button
        variant="outline"
        size="icon"
        className={cn(
          classes.button,
          "rounded-xl border-slate-200 hover:bg-slate-50 hover:border-slate-300",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={handleIncrease}
        disabled={disabled || quantity >= max}
      >
        <Plus className={classes.icon} />
      </Button>
    </div>
  );
}
