import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlowButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function GlowButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: GlowButtonProps) {
  const baseStyles = `
    relative overflow-hidden rounded-xl font-semibold
    transition-all duration-300 cursor-pointer
    font-[var(--font-jakarta)]
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-[#00F0FF] to-[#7C3AED]
      text-[#0A0E1A] hover:shadow-[0_0_40px_rgba(0,240,255,0.5)]
      border-0
    `,
    secondary: `
      bg-[#1A1F35] text-[#F8FAFC]
      border border-[#00F0FF]/30 hover:border-[#00F0FF]
      hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]
    `,
    outline: `
      bg-transparent text-[#00F0FF]
      border-2 border-[#00F0FF] hover:bg-[#00F0FF]/10
      hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]
    `,
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {/* Shine effect */}
      <span className="absolute inset-0 overflow-hidden rounded-xl">
        <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-[shine_3s_infinite]" />
      </span>

      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>

      <style>{`
        @keyframes shine {
          0% { left: -100%; }
          50%, 100% { left: 100%; }
        }
      `}</style>
    </motion.button>
  );
}
