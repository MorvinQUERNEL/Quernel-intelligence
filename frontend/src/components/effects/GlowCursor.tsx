import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export function GlowCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

  const cursorX = useSpring(0, { stiffness: 500, damping: 30 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 30 });

  useEffect(() => {
    // Only show on desktop
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const checkInteractive = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, input, textarea, select, [role="button"]');
      setIsHoveringInteractive(!!isInteractive);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousemove', checkInteractive);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Add custom cursor class to body
    document.body.classList.add('custom-cursor-active');

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousemove', checkInteractive);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [cursorX, cursorY]);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
      >
        <motion.div
          className="rounded-full bg-white"
          animate={{
            width: isHoveringInteractive ? 40 : 8,
            height: isHoveringInteractive ? 40 : 8,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.div>

      {/* Glow ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
      >
        <motion.div
          className="rounded-full border-2 border-[#00F0FF]/50"
          animate={{
            width: isHoveringInteractive ? 60 : 40,
            height: isHoveringInteractive ? 60 : 40,
            borderColor: isHoveringInteractive
              ? 'rgba(124, 58, 237, 0.5)'
              : 'rgba(0, 240, 255, 0.5)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            boxShadow: isHoveringInteractive
              ? '0 0 20px rgba(124, 58, 237, 0.3)'
              : '0 0 20px rgba(0, 240, 255, 0.3)',
          }}
        />
      </motion.div>
    </>
  );
}
