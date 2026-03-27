import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Button } from '@/ui/Button';
import { cn } from '@/utils/helpers';
import type { Product } from '@/types/product';

interface ProductGalleryProps {
  product?: Product;
  images?: string[];
  className?: string;
}

export default function ProductGallery({ product, images, className }: ProductGalleryProps) {
  
  const galleryImages = images || (product?.image ? [product.image] : []);
  
  
  if (galleryImages.length === 0) {
    galleryImages.push('https://picsum.photos/seed/product/800/1000');
  }
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const next = () => setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://picsum.photos/seed/product/800/1000';
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* Main Image */}
      <div className="relative aspect-[4/5] bg-slate-50 dark:bg-slate-800 rounded-[3rem] overflow-hidden group shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={galleryImages[currentIndex]}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "w-full h-full object-cover transition-transform duration-700",
              isZoomed ? "scale-150 cursor-zoom-out" : "scale-100 cursor-zoom-in group-hover:scale-105"
            )}
            onClick={() => setIsZoomed(!isZoomed)}
            referrerPolicy="no-referrer"
            onError={handleImageError}
          />
        </AnimatePresence>

        {/* Navigation Arrows */}
        {galleryImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-6 top-1/2 -translate-y-1/2 h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-primary hover:scale-110"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-6 top-1/2 -translate-y-1/2 h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-primary hover:scale-110"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
          </>
        )}

        {/* Zoom Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-6 right-6 h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-primary"
          onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed); }}
        >
          <Maximize2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Thumbnails */}
      {galleryImages.length > 1 && (
        <div className="flex items-center space-x-4 overflow-x-auto pb-4 px-2 scrollbar-hide">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-300",
                currentIndex === idx 
                  ? "ring-4 ring-primary ring-offset-4 scale-110 shadow-xl shadow-primary/20 dark:shadow-none" 
                  : "opacity-50 hover:opacity-100 hover:scale-105"
              )}
            >
              <img 
                src={img} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
                onError={handleImageError}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
