import { motion, useScroll } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-slate-800/50">
      <motion.div
        className="h-full bg-gradient-to-r from-[#3b82f6] via-blue-400 to-[#06b6d4] shadow-[0_0_20px_rgba(59, 130, 246,0.4)]"
        style={{ scaleX: scrollYProgress, transformOrigin: 'left' }}
        transition={{ type: 'spring', stiffness: 100, damping: 30 }}
      />
    </div>
  );
}
