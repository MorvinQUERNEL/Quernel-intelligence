import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

// Overlay that slides across the screen during transition
const overlayVariants = {
  initial: {
    scaleX: 0,
    originX: 0,
  },
  enter: {
    scaleX: [0, 1, 1, 0],
    originX: [0, 0, 1, 1],
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
      times: [0, 0.4, 0.4, 1],
    },
  },
};

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();

  return (
    <>
      {/* Transition overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`overlay-${location.pathname}`}
          className="fixed inset-0 z-[100] bg-accent pointer-events-none"
          initial="initial"
          animate="enter"
          variants={overlayVariants}
        />
      </AnimatePresence>

      {/* Page content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="enter"
          exit="exit"
          variants={pageVariants}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
