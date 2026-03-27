import React, { useState, useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '../../ui/Button';
import { cn } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';

interface AddressFormProps {
  initialAddress?: string;
  onSubmit?: (address: string) => void;
  isLoading?: boolean;
  className?: string;
  autoFocus?: boolean;
  useProfileAddress?: boolean; 
}

export default function AddressForm({ 
  initialAddress = '', 
  onSubmit, 
  isLoading = false,
  className,
  autoFocus = false,
  useProfileAddress = false
}: AddressFormProps) {
  const { profile } = useAuth();
  const [address, setAddress] = useState(
    useProfileAddress && profile?.address ? profile.address : initialAddress
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(address);
    }
  };

  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-8", className)}>
      <div className="space-y-3">
        <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Shipping Address</label>
        <div className="relative">
          <MapPin className="absolute left-4 top-6 w-5 h-5 text-slate-300 dark:text-slate-600" />
          <textarea
            ref={textareaRef}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:bg-white dark:focus:bg-slate-700 focus:ring-4 focus:ring-primary/10 transition-all font-bold min-h-[120px] resize-none shadow-inner dark:text-white dark:placeholder:text-slate-500"
            placeholder="Enter your full shipping address (Street, City, Country, ZIP)"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button 
          type="submit" 
          className="h-14 rounded-2xl font-black shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all col-span-2"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Confirm Address'}
        </Button>
      </div>
    </form>
  );
}
