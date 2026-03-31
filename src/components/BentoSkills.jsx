import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Layout, Server, TrendingUp, Cpu, Code } from 'lucide-react';
import { skillCategories, currentlyLearning } from '../data/skills';
import { blurScaleIn, textRevealUp, staggerContainer, viewportOnce, transitionSlow, fadeInUp } from '../utils/motion';
import { useBreakpoint } from '../utils/useBreakpoint';

// Map icon names from skills data to actual imported components
const iconMap = { Layout, Server, TrendingUp, Cpu, Code };

function SkillIcon({ iconName, className }) {
  const Icon = iconMap[iconName] || Code;
  return <Icon className={className} />;
}

function SkillCard({ skill, index, categoryColor }) {
  const isMobile = useBreakpoint(1024);
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current || isMobile) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isMobile ? 0 : rotateX,
        rotateY: isMobile ? 0 : rotateY,
        transformStyle: "preserve-3d",
        '--skill-color': skill.color || categoryColor
      }}
      variants={blurScaleIn}
      custom={index}
      className="group relative bg-white/[0.03] border border-white/[0.08] hover:border-[var(--skill-color)] rounded-[2rem] p-6 transition-all duration-500 overflow-hidden shadow-2xl will-change-transform h-full flex flex-col justify-between"
    >
      {/* Dynamic Glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at center, var(--skill-color), transparent 70%)` }}
      />
      
      {/* Top Section */}
      <div className="relative z-10 mb-4">
        <div className="flex justify-between items-start mb-4">
          <div 
            className="w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_12px_var(--skill-color)]"
            style={{ backgroundColor: 'var(--skill-color)' }}
          />
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{skill.level}</span>
        </div>
        <h4 className="text-lg font-bold text-white tracking-tight group-hover:translate-x-1 transition-transform">
          {skill.name}
        </h4>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 mt-auto">
        <div className="w-full h-[2px] bg-white/[0.05] rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.fill}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.05 }}
            className="h-full rounded-full"
            style={{ backgroundColor: 'var(--skill-color)', boxShadow: `0 0 10px var(--skill-color)` }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function CategorySection({ category, catIndex }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="mb-16 last:mb-0"
    >
      <div className="flex items-center gap-4 mb-8">
        <div 
          className="p-3 rounded-2xl bg-white/5 border border-white/10"
          style={{ color: category.color }}
        >
          <SkillIcon iconName={category.icon} className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{category.title}</h3>
          <p className="text-slate-500 text-sm font-mono">{category.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {category.skills.map((skill, sIdx) => (
          <SkillCard 
            key={skill.name} 
            skill={skill} 
            index={sIdx + catIndex * 5} 
            categoryColor={category.color}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function BentoSkills() {
  return (
    <section id="skills" className="py-32 px-6 relative overflow-hidden bg-[#050810]">
      {/* Ambient Deco */}
      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/[0.03] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/[0.03] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.12, 0)}
          className="mb-24 text-center"
        >
          <motion.div variants={textRevealUp} className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-cyan-400" />
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-400">Technical Arsenal</span>
            <div className="w-8 h-[1px] bg-cyan-400" />
          </motion.div>
          <motion.h2
            variants={textRevealUp}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight mb-8 leading-[1.1]"
          >
            Skills <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">&</span> Stack
          </motion.h2>
          <motion.p
            variants={textRevealUp}
            className="text-slate-400 font-medium text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            A curated selection of technologies I use to build robust, scalable, and visually compelling digital experiences.
          </motion.p>
        </motion.div>

        {/* Dynamic Categories */}
        <motion.div
          variants={staggerContainer(0.1, 0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {skillCategories.map((category, index) => (
            <CategorySection key={category.id} category={category} catIndex={index} />
          ))}
        </motion.div>

        {/* Learning & Growth */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          className="mt-32 p-12 rounded-[3rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 backdrop-blur-2xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-md">
              <h3 className="text-3xl font-bold text-white mb-4">Continuous Growth</h3>
              <p className="text-slate-400 font-mono text-sm leading-relaxed">
                The tech landscape shifts daily. I'm currently expanding my horizon into high-performance systems and decentralised logic.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center md:justify-end">
              {currentlyLearning.map((item, i) => (
                <div 
                  key={i}
                  className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-sm hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
