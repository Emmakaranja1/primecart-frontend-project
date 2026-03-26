import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from "@/utils/helpers";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center space-x-3 text-sm font-bold", className)}>
      <Link 
        to="/" 
        className="flex items-center text-slate-400 hover:text-primary transition-colors group"
      >
        <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
      </Link>
      
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center space-x-3">
          <ChevronRight className="w-4 h-4 text-slate-300" />
          {item.path ? (
            <Link 
              to={item.path} 
              className="text-slate-400 hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
