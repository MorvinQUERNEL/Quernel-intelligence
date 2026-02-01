interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'secondary' | 'success';
  size?: 'sm' | 'md';
  className?: string;
}

const variants = {
  default: 'bg-bg-tertiary text-text-secondary border-border',
  accent: 'bg-accent-secondary/10 text-accent-secondary border-accent-secondary/30',
  secondary: 'bg-accent-subtle text-accent border-accent/30',
  success: 'bg-success/10 text-success border-success/30',
};

const sizes = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
};

export const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}: BadgeProps) => {
  return (
    <span
      className={`
        inline-flex items-center
        font-mono font-medium uppercase tracking-wider
        border rounded-md
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};
