import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { cn } from "@/utils/helpers";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className,
  showCloseButton = true 
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[110] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                "w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto",
                className
              )}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex justify-between items-center p-8 border-b border-slate-100 dark:border-slate-800">
                  {title && <h3 className="text-2xl font-black tracking-tight dark:text-white">{title}</h3>}
                  {showCloseButton && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={onClose}
                      className="rounded-full h-10 w-10 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    >
                      <X className="w-6 h-6" />
                    </Button>
                  )}
                </div>
              )}
              
              {/* Content */}
              <div className="p-8">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
