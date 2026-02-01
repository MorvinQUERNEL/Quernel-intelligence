import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-accent text-white
    hover:bg-accent-hover
    border border-transparent
    group
  `,
  secondary: `
    bg-transparent text-text-primary
    border border-border
    hover:border-border-hover hover:bg-bg-tertiary/50
  `,
  ghost: `
    bg-transparent text-text-secondary
    border-none
    hover:text-text-primary
    group
  `,
  accent: `
    bg-accent-secondary text-bg-primary
    hover:bg-amber-600
    border border-transparent
  `,
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'right',
  children,
  className = '',
  disabled,
  type = 'button',
  onClick,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      className={`
        inline-flex items-center justify-center
        font-medium rounded-lg
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizes[size]}
        ${className}
      `}
      whileHover={isDisabled ? {} : { y: -1 }}
      whileTap={isDisabled ? {} : { y: 0 }}
      disabled={isDisabled}
      onClick={onClick}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          {children && <span>{children}</span>}
          {icon && iconPosition === 'right' && (
            <span className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1">
              {icon}
            </span>
          )}
          {(variant === 'ghost' || variant === 'primary') && !icon && (
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          )}
        </>
      )}
    </motion.button>
  );
}
