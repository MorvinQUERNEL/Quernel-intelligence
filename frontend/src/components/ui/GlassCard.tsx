import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'violet' | 'emerald';
  hover?: boolean;
}

export function GlassCard({
  children,
  className = '',
  glowColor = 'cyan',
  hover = true,
  ...props
}: GlassCardProps) {
  const glowStyles = {
    cyan: 'hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]',
    violet: 'hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]',
    emerald: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]',
  };

  const borderGlow = {
    cyan: 'hover:border-[#00F0FF]/50',
    violet: 'hover:border-[#7C3AED]/50',
    emerald: 'hover:border-[#10B981]/50',
  };

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl
        bg-[#1A1F35]/70 backdrop-blur-xl
        border border-white/10
        transition-all duration-500
        ${hover ? glowStyles[glowColor] : ''}
        ${hover ? borderGlow[glowColor] : ''}
        ${className}
      `}
      whileHover={hover ? { y: -5, scale: 1.02 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...props}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
