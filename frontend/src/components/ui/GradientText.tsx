import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  animated?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p';
}

export function GradientText({
  children,
  className = '',
  animated = false,
  as: Component = 'span',
}: GradientTextProps) {
  const gradientClass = animated
    ? 'gradient-text-animated'
    : 'gradient-text';

  const MotionComponent = motion[Component] as typeof motion.span;

  return (
    <MotionComponent
      className={`${gradientClass} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </MotionComponent>
  );
}
