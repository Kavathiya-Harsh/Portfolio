import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, FolderGit2, Award, MapPin } from 'lucide-react';
import { scaleIn, transitionSpring } from '../utils/motion';

const stats = [
  { key: 'years', value: 4, suffix: '+', label: 'Years Experience', icon: Briefcase },
  { key: 'projects', value: 50, suffix: '+', label: 'Projects Shipped', icon: FolderGit2 },
  { key: 'education', value: 1, suffix: '', label: 'Degree in CS', icon: Award },
  { key: 'location', value: null, suffix: '', label: 'Remote / Hybrid', icon: MapPin, text: 'Global' },
];

function AnimatedNumber({ value, suffix }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (value == null) return;
    const duration = 2000;
    const steps = 60;
    const step = value / steps;
    const stepDuration = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);
    return () => clearInterval(timer);
  }, [value]);

  if (value == null) return null;
  return (
    <>
      {count}
      {suffix}
    </>
  );
}

export default function StatsSection() {
  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mx', `${x}%`);
    e.currentTarget.style.setProperty('--my', `${y}%`);
  };
  const onLeave = (e) => {
    e.currentTarget.style.setProperty('--mx', `50%`);
    e.currentTarget.style.setProperty('--my', `50%`);
  };
  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
          }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.key}
                variants={scaleIn}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                onMouseMove={onMove}
                onMouseLeave={onLeave}
                className="relative group overflow-hidden rounded-2xl border border-white/12 bg-slate-800/50 backdrop-blur-md p-6 text-center hover:border-blue-500/25 hover:shadow-[0_0_30px_-8px_rgba(59, 130, 246,0.2)] transition-shadow duration-300"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background:
                      'radial-gradient(200px circle at var(--mx, 50%) var(--my, 50%), rgba(59, 130, 246,0.16), transparent 60%)',
                    mixBlendMode: 'screen',
                  }}
                />
                <motion.div
                  className="inline-flex w-12 h-12 rounded-xl bg-blue-500/20 border border-slate-600/60 items-center justify-center mb-3"
                  whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                >
                  <Icon className="w-6 h-6 text-blue-400" />
                </motion.div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.text != null ? stat.text : <AnimatedNumber value={stat.value} suffix={stat.suffix} />}
                </div>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
