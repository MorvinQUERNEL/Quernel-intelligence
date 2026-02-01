import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Badge } from './Badge';

type CardVariant = 'default' | 'featured';

interface CardProps {
  variant?: CardVariant;
  featuredLabel?: string;
  hover?: boolean;
  children?: ReactNode;
  className?: string;
}

export function Card({
  variant = 'default',
  featuredLabel = 'Recommandé',
  hover = true,
  children,
  className = '',
}: CardProps) {
  const baseStyles = `
    relative
    bg-bg-tertiary
    border border-border
    rounded-xl
    overflow-hidden
    transition-all duration-300 ease-out
  `;

  const variantStyles: Record<CardVariant, string> = {
    default: '',
    featured: 'border-accent/50 shadow-lg',
  };

  const hoverStyles = hover
    ? 'hover:border-border-hover hover:shadow-md hover:-translate-y-0.5'
    : '';

  return (
    <motion.div
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${hoverStyles}
        ${className}
      `}
    >
      {variant === 'featured' && (
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="accent">{featuredLabel}</Badge>
        </div>
      )}
      {children}
    </motion.div>
  );
}

// Card subcomponents for better composition
interface CardSubProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardSubProps) {
  return <div className={`p-6 pb-0 ${className}`}>{children}</div>;
}

export function CardContent({ children, className = '' }: CardSubProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: CardSubProps) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}
