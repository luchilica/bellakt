import { useEffect } from 'react';
import { motion } from 'motion/react';

interface LoadingScreenProps {
  message?: string;
  minDuration?: number;
  onFinished?: () => void;
}

export function LoadingScreen({
  minDuration = 0,
  onFinished,
}: LoadingScreenProps) {
  useEffect(() => {
    let finishTimeout: NodeJS.Timeout | undefined;
    if (minDuration > 0 && onFinished) {
      finishTimeout = setTimeout(() => {
        onFinished();
      }, minDuration);
    }

    return () => {
      if (finishTimeout) clearTimeout(finishTimeout);
    };
  }, [minDuration, onFinished]);

  return (
    <div
      id="bellakt-loading-screen"
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#F3F6FA] via-[#EBF1F8] to-[#E2EAF4] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 overflow-hidden select-none"
    >
      {/* Background ambient circular halos */}
      <div className="absolute w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none -top-24 -left-24 animate-pulse" />
      <div className="absolute w-[450px] h-[450px] bg-[#002B7F]/8 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20 animate-pulse delay-700" />

      {/* Centered Animated Logo in Circle */}
      <div className="relative flex items-center justify-center z-10">
        {/* Outer Pulsing Glow Ring */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0.4 }}
          animate={{
            scale: [0.9, 1.18, 0.9],
            opacity: [0.3, 0.65, 0.3],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -inset-5 rounded-full bg-gradient-to-tr from-[#002B7F]/20 via-blue-300/30 to-[#0052CC]/20 dark:from-blue-600/30 dark:via-blue-400/20 dark:to-indigo-500/30 blur-md pointer-events-none"
        />

        {/* Rotating Border Orbit */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -inset-3 rounded-full border-2 border-dashed border-[#002B7F]/25 dark:border-blue-400/30 pointer-events-none"
        />

        {/* Core White Circular Plaque for Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full bg-white dark:bg-slate-900 shadow-[0_12px_40px_rgba(0,43,127,0.15)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] border border-slate-100 dark:border-slate-800 flex items-center justify-center p-5 sm:p-6 overflow-hidden"
        >
          {/* Shimmer sweep effect */}
          <motion.div
            initial={{ x: '-150%' }}
            animate={{ x: '150%' }}
            transition={{
              repeat: Infinity,
              duration: 2.4,
              ease: 'easeInOut',
              repeatDelay: 1,
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 dark:via-white/10 to-transparent skew-x-12 pointer-events-none"
          />

          {/* Logo Image with gentle floating bounce */}
          <motion.img
            src="/logo.svg"
            alt="Волковысское ОАО «Беллакт»"
            className="w-full h-auto object-contain relative z-10"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo.png';
            }}
            animate={{
              y: [-2.5, 2.5, -2.5],
              scale: [1, 1.03, 1],
            }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
