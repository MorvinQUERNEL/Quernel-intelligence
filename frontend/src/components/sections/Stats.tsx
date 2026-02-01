import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  {
    value: 50,
    suffix: '+',
    label: 'Projets réalisés',
    color: '#00F0FF',
  },
  {
    value: 24,
    suffix: '/7',
    label: 'Agents IA actifs',
    color: '#7C3AED',
  },
  {
    value: 98,
    suffix: '%',
    label: 'Satisfaction client',
    color: '#10B981',
  },
  {
    value: 35,
    prefix: '+',
    suffix: '%',
    label: 'CA moyen généré',
    color: '#00F0FF',
  },
];

function CountUp({ value, prefix = '', suffix = '', color, isInView }: {
  value: number;
  prefix?: string;
  suffix: string;
  color: string;
  isInView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const duration = 2000;
    const stepTime = Math.abs(Math.floor(duration / end));

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span style={{ color }} className="font-[var(--font-mono)] font-bold">
      {prefix}{count}{suffix}
    </span>
  );
}

export function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="relative py-16 md:py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00F0FF]/5 via-[#7C3AED]/5 to-[#10B981]/5" />

      <div className="container-custom relative z-10">
        <motion.div
          ref={ref}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-4xl md:text-5xl lg:text-6xl mb-2">
                <CountUp
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  color={stat.color}
                  isInView={isInView}
                />
              </div>
              <p className="text-[#94A3B8] text-sm md:text-base">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
