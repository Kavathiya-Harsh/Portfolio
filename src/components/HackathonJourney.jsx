import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Target, Code, Cpu, ExternalLink, Flag, Rocket } from 'lucide-react';
import { hackathons } from '../data/hackathons';
import { 
  textRevealUp, 
  staggerContainer, 
  viewportOnce, 
  slideInLeft, 
  slideInRight 
} from '../utils/motion';

const HackathonCard = ({ hackathon, index }) => {
  const isEven = index % 2 === 0;
  const isMilestone = hackathon.isMilestone;

  if (isMilestone) {
    return (
      <motion.div
        variants={textRevealUp}
        className="relative flex flex-col items-center mb-16 last:mb-0 w-full"
      >
        <div className="z-20 p-3 rounded-full bg-slate-900 border border-[#d4af37]/30 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
          {index === 0 ? <Flag className="w-5 h-5 text-[#d4af37]" /> : <Rocket className="w-5 h-5 text-blue-400" />}
        </div>
        <div className="mt-4 text-center max-w-md bg-white/5 border border-white/10 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl">
           <p className="text-[10px] font-mono text-[#d4af37] uppercase tracking-widest mb-1">{hackathon.achievement}</p>
           <h4 className="text-lg font-bold text-white mb-2">{hackathon.title}</h4>
           <p className="text-xs text-slate-400 font-mono tracking-wide">{hackathon.description}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={isEven ? slideInLeft : slideInRight}
      className={`relative flex items-center mb-20 last:mb-0 ${
        isEven ? 'md:justify-start' : 'md:justify-end'
      } justify-center w-full`}
    >
      {/* Connector Dot */}
      <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="w-4 h-4 rounded-full bg-[#d4af37] border-4 border-[#0b1120] shadow-[0_0_15px_rgba(212,175,55,0.8)]" />
      </div>

      {/* Content Card */}
      <div className="w-full md:w-[45%] group perspective-1000">
        <motion.div 
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`relative p-8 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden hover:border-[#d4af37]/30 transition-all duration-500 shadow-2xl ${
            isEven ? 'md:mr-auto' : 'md:ml-auto'
          }`}
        >
          {/* Ambient Glow */}
          <div className={`absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r ${hackathon.color} blur-2xl -z-10`} />

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20">
              <Trophy className="w-5 h-5 text-[#d4af37]" />
            </div>
            <span className="text-sm font-mono text-[#d4af37] uppercase tracking-widest">{hackathon.achievement}</span>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">{hackathon.title}</h3>
          
          <div className="flex items-center gap-2 mb-4 text-sm text-slate-500 font-mono">
            <span className="text-blue-400">{hackathon.issuer}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {hackathon.date}</span>
          </div>

          <p className="text-slate-400 text-sm mb-6 leading-relaxed">{hackathon.description}</p>
          
          <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
             <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Code className="w-5 h-5 text-blue-400" />
             </div>
             <div>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-0.5">Project Built</p>
                <p className="font-bold text-sm text-white">{hackathon.project}</p>
             </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {hackathon.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400 uppercase">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">
            <Target className="w-3.5 h-3.5 text-blue-500" />
            <span>Role: {hackathon.role}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function HackathonJourney() {
  return (
    <section id="hackathons" className="py-32 px-6 relative overflow-hidden bg-[#050810]">
      {/* Ambient Orbs — Matched with BentoSkills */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-blue-500/[0.08] blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] rounded-full bg-purple-500/[0.06] blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[45%] w-[400px] h-[400px] rounded-full bg-cyan-500/[0.05] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.12, 0)}
          className="mb-20"
        >
          <motion.div variants={textRevealUp} className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-blue-400" />
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-blue-400">Innovation & Journey</span>
          </motion.div>
          <motion.h2
            variants={textRevealUp}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight mb-8 leading-[1.1]"
          >
            Hackathon <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">Expedition</span>
          </motion.h2>
          <motion.p
            variants={textRevealUp}
            className="text-slate-400 font-medium text-base sm:text-lg max-w-lg leading-relaxed border-l-2 border-slate-700/50 pl-6"
          >
            A chronological timeline of rapid prototyping, high-intensity building, and competitive innovation across global stages.
          </motion.p>
        </motion.div>

        {/* Timeline Content */}
        <div className="relative">
          {/* Vertical Center Line */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-blue-500/50 via-blue-500/20 to-transparent -translate-x-1/2" />
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer(0.2, 0)}
            className="relative z-10"
          >
            {hackathons.map((h, i) => (
              <HackathonCard key={h.id} hackathon={h} index={i} />
            ))}
          </motion.div>
        </div>

        {/* Footer Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          className="mt-32 text-center"
        >
          <p className="text-slate-500 font-mono text-sm mb-6 tracking-widest uppercase">Hungry for more challenges</p>
          <div className="inline-flex items-center gap-2 text-white group cursor-pointer justify-center">
            <span className="text-xl font-bold group-hover:text-blue-400 transition-colors">Always building, always learning</span>
            <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
