import { cn } from '@/utils/helpers';

interface AlertProps {
  className?: string;
  children: React.ReactNode;
}

interface AlertDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

export function Alert({ className, children }: AlertProps) {
  return (
    <div
      className={cn(
        "relative w-full rounded-lg border p-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AlertDescription({ className, children }: AlertDescriptionProps) {
  return (
    <div className={cn("text-sm", className)}>
      {children}
    </div>
  );
}

export function AlertTitle({ className, children }: AlertDescriptionProps) {
  return (
    <div className={cn("font-medium mb-1", className)}>
      {children}
    </div>
  );
}
