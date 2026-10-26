import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

      // Show after scrolling down 400px
      setIsVisible(scrollY > 400);

      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.round((scrollY / totalHeight) * 100)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="fixed bottom-5 left-5 z-40"
        >
          <button
            onClick={scrollToTop}
            className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-slate-200/90 text-slate-700 hover:text-sky-600 hover:border-sky-300 hover:shadow-2xl transition-all active:scale-90 cursor-pointer"
            aria-label="Kembali ke atas halaman"
            title="Kembali ke atas"
          >
            {/* Circular Progress Border */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
              viewBox="0 0 44 44"
            >
              <circle
                cx="22"
                cy="22"
                r="19"
                className="stroke-slate-100"
                strokeWidth="2.5"
                fill="none"
              />
              <circle
                cx="22"
                cy="22"
                r="19"
                className="stroke-sky-500 transition-all duration-150 ease-out"
                strokeWidth="2.5"
                strokeDasharray={119.38}
                strokeDashoffset={119.38 - (119.38 * scrollProgress) / 100}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Icon & Hover Effect */}
            <ArrowUp className="w-5 h-5 text-slate-700 group-hover:text-sky-600 group-hover:-translate-y-0.5 transition-transform" />

            {/* Tooltip on Desktop */}
            <span className="sr-only">Kembali ke atas</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
