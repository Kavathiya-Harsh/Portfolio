import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { education } from '../data/education';
import { fadeInUp, staggerContainer, viewportOnce } from '../utils/motion';

function EducationCard({ item, index }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="relative group lg:pl-8 pb-12 last:pb-0"
    >
      {/* Timeline Line (Desktop) */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-800 lg:block hidden">
        <motion.div 
          initial={{ height: 0 }}
          whileInView={{ height: '100%' }}
          viewport={viewportOnce}
          transition={{ duration: 1, delay: index * 0.2 }}
          className="w-full bg-gradient-to-b from-blue-500 via-cyan-400 to-transparent"
        />
      </div>

      {/* Timeline Dot (Desktop) */}
      <div className="absolute left-[-4px] top-0 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] lg:block hidden group-hover:scale-150 transition-transform" />

      <div className="relative bg-white/[0.03] border border-white/[0.08] hover:border-white/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
        {/* Glow Element */}
        <div 
          className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ 
            background: `radial-gradient(1000px circle at var(--mouse-x, 0) var(--mouse-y, 0), ${item.color}15, transparent 40%)` 
          }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div 
              className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform"
              style={{ color: item.color }}
            >
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{item.degree}</h3>
              <p className="text-slate-400 font-medium">{item.institution}</p>
            </div>
          </div>
          
          <div className="flex flex-col md:items-end">
            <div className="flex items-center gap-2 text-slate-500 font-mono text-xs uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{item.period}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 font-mono text-xs uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              <span>{item.location}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500 mb-4">Focus & Specialization</p>
            <div className="inline-flex px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm font-medium mb-4">
              {item.specialization}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-400 font-mono uppercase tracking-wider">{item.status}</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500 mb-4">Key Achievements</p>
            <ul className="space-y-3">
              {item.details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-3 group/item">
                  <CheckCircle2 className="w-4 h-4 text-blue-500/60 mt-0.5 group-hover/item:text-blue-500 transition-colors" />
                  <span className="text-sm text-slate-400 leading-relaxed group-hover/item:text-slate-300 transition-colors">{detail}</span>
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
    <section id="education" className="py-32 px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-violet-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.1, 0)}
          className="mb-20 text-center md:text-left"
        >
          <motion.div variants={fadeInUp} className="flex items-center justify-center md:justify-start gap-3 mb-6">
            <div className="w-8 h-[1px] bg-blue-500" />
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-blue-500">Academic Foundation</span>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight mb-8 leading-[1.1]"
          >
            Education <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">Journey</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-slate-400 font-medium text-base sm:text-lg max-w-xl leading-relaxed md:mx-0 mx-auto"
          >
            A chronological look at my academic background and key milestones in technology and science.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.2, 0.4)}
          className="space-y-4"
        >
          {education.map((item, index) => (
            <EducationCard key={item.id} item={item} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
