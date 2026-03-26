import { motion } from 'framer-motion';
import { cn } from "@/utils/helpers";

interface LoadingProps {
  fullScreen?: boolean;
  className?: string;
}

export default function Loading({ fullScreen = false, className }: LoadingProps) {
  return (
    <div className={cn(
      "flex items-center justify-center",
      fullScreen ? "fixed inset-0 z-[100] bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm" : "py-12",
      className
    )}>
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-16 h-16 border-4 border-primary dark:border-blue-500 border-t-transparent rounded-full"
        />
        <div className="absolute text-[10px] font-black tracking-tighter text-primary dark:text-blue-400">
          LC
        </div>
      </div>
    </div>
  );
}
