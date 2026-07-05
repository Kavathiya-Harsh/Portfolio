import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, Award, CheckCircle2 } from 'lucide-react';
import { education } from '../data/education';
import { fadeInUp, staggerContainer, viewportOnce } from '../utils/motion';

function EducationCard({ item, index }) {
  const cardRef = React.useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty('--mouse-x', `${x}%`);
    cardRef.current.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="group relative"
    >
      {/* Vertical Timeline Line */}
      <div className="absolute left-8 top-12 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent hidden lg:block" />

      {/* Timeline Dot */}
      <div className="absolute left-6 w-5 h-5 rounded-full border-4 border-slate-900 bg-gradient-to-br from-cyan-400 to-blue-500 shadow-[0_0_20px_rgba(103,232,249,0.6)] hidden lg:block z-10" />

      <div className="relative bg-white/[0.035] border border-white/10 hover:border-cyan-400/30 rounded-3xl p-8 md:p-10 backdrop-blur-2xl transition-all duration-700 group-hover:-translate-y-1 group-hover:shadow-2xl overflow-hidden">

        {/* Dynamic Mouse Glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(103,232,249,0.25) 0%, transparent 60%)`
          }}
        />

        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
          {/* Left Info */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/20">
                <GraduationCap className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <div className="font-mono text-xs tracking-[2px] text-cyan-400 mb-1">{item.period}</div>
                <div className="text-2xl font-bold text-white leading-tight">{item.degree}</div>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 text-slate-400">
                <MapPin className="w-4 h-4" />
                <span>{item.institution}, {item.location}</span>
              </div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300">
                {item.specialization}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-emerald-400 text-sm font-medium">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {item.status}
            </div>
          </div>

          {/* Right Content - Achievements */}
          <div className="flex-1">
            <div className="uppercase font-mono text-xs tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <Award className="w-4 h-4" />
              KEY ACHIEVEMENTS
            </div>

            <ul className="space-y-6">
              {item.details.map((detail, idx) => (
                <li key={idx} className="flex gap-4 group/item">
                  <div className="mt-1.5">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400/70 group-hover/item:text-cyan-400 transition-colors" />
                  </div>
                  <p className="text-slate-300 leading-relaxed group-hover/item:text-white transition-colors">
                    {detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Education() {
  return (
    <section id="education" className="relative py-28 md:py-36 px-4 sm:px-6 overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-cyan-500/5 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-violet-500/5 to-transparent blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.15, 0.1)}
          className="text-center mb-20"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            <span className="font-mono uppercase tracking-[3px] text-sm text-cyan-400">My Academic Path</span>
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6"
          >
            Education <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent">Journey</span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-slate-400 max-w-2xl mx-auto text-lg"
          >
            From foundational learning to cutting-edge specialization — here's how I built my technical foundation.
          </motion.p>
        </motion.div>

        {/* Timeline Cards */}
        <motion.div
          variants={staggerContainer(0.1, 0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="space-y-16"
        >
          {education.map((item, index) => (
            <EducationCard key={item.id || index} item={item} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}