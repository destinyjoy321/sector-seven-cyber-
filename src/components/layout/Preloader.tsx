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
            
            {/* Electric Cyan Geometric Line Animation */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              {/* Outer Pulsing Glow */}
              <motion.div
                animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.2, 0.7, 0.2] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full border border-[#00D2FF]/40 bg-[#00D2FF]/10 blur-md"
              />

              {/* Geometric Cyan Hexagonal / Shield Line Drawing SVG */}
              <svg className="w-14 h-14 text-[#00D2FF]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <motion.path
                  d="M24 4L42 14V34L24 44L6 34V14L24 4Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.9, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M24 14L33 19V29L24 34L15 29V19L24 14Z"
                  stroke="#0284C7"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, delay: 0.25, ease: 'easeInOut' }}
                />
                <motion.circle
                  cx="24"
                  cy="24"
                  r="3.5"
                  fill="currentColor"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.75 }}
                />
              </svg>
            </div>

            {/* Brand Title & Monospace Readiness Line */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-center space-y-1.5"
            >
              <span className="font-mono text-xs font-black tracking-[0.25em] text-slate-900 uppercase">
                SECTOR SEVEN CYBER
              </span>
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
