import { motion } from 'framer-motion';
import { GradientText } from './GradientText';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionTitle({
  title,
  subtitle,
  centered = true,
  className = '',
}: SectionTitleProps) {
  return (
    <motion.div
      className={`mb-12 md:mb-16 ${centered ? 'text-center' : ''} ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <GradientText
        as="h2"
        animated
        className="text-3xl md:text-4xl lg:text-5xl font-bold font-[var(--font-orbitron)] mb-4"
      >
        {title}
      </GradientText>
      {subtitle && (
        <motion.p
          className="text-[#94A3B8] text-lg md:text-xl max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
