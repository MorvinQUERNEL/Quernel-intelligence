import { motion } from 'framer-motion';
import { Badge } from './Badge';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export const SectionHeading = ({
  badge,
  title,
  subtitle,
  centered = true,
  className = '',
}: SectionHeadingProps) => {
  return (
    <motion.div
      className={`
        mb-12 md:mb-16
        ${centered ? 'text-center' : 'text-left'}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {badge && (
        <Badge variant="secondary" className="mb-4">
          {badge}
        </Badge>
      )}
      <h2 className="text-text-primary mb-4">{title}</h2>
      {subtitle && (
        <p
          className={`
            text-text-secondary text-lg
            ${centered ? 'mx-auto' : ''}
          `}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};
