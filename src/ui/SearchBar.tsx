import { Search, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from './Input';
import { Button } from './Button';
import { cn } from "@/utils/helpers";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
}

export default function SearchBar({ 
  onSearch, 
  placeholder = 'Search...', 
  className,
  initialValue = '' 
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn(
        "relative group transition-all duration-300",
        isFocused ? "scale-[1.02]" : "scale-100",
        className
      )}
    >
      <div className={cn(
        "absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300",
        isFocused ? "text-primary dark:text-blue-400" : "text-slate-400 dark:text-slate-600"
      )}>
        <Search className="w-5 h-5" />
      </div>
      
      <Input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={cn(
          "pl-12 pr-12 h-14 rounded-2xl bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300",
          "focus:ring-4 focus:ring-primary/10 dark:focus:ring-blue-500/10 focus:border-primary dark:focus:border-blue-500 focus:shadow-xl focus:shadow-primary/5 dark:focus:shadow-blue-500/5",
          "placeholder:text-slate-300 dark:placeholder:text-slate-700 placeholder:font-medium"
        )}
      />
      
      <AnimatePresence>
        {query && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <Button 
              type="button"
              variant="ghost" 
              size="icon" 
              onClick={handleClear}
              className="h-8 w-8 rounded-xl text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <X className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
