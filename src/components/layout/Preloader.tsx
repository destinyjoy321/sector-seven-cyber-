import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Preloader: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-4 pointer-events-none select-none"
        >
          <div className="relative flex flex-col items-center justify-center space-y-6">
            
            {/* Logo Image Animation */}
            <div className="relative flex items-center justify-center">
              {/* Outer Pulsing Glow */}
              <motion.div
                animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.2, 0.7, 0.2] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full border border-[#00D2FF]/40 bg-[#00D2FF]/10 blur-md"
              />

              <motion.img
                src="/images/image.png"
                alt="Sector Seven Cyber Logo"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-24 w-auto object-contain mix-blend-multiply relative z-10"
              />
            </div>

            {/* Monospace Readiness Line */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-center space-y-1.5"
            >
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono font-bold text-[#0284C7] tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] animate-ping" />
                <span>INITIALIZING SECURE ENVIRONMENT</span>
              </div>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
