import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Layout,
  Server,
  Box,
  Palette,
  Cpu,
  Sparkles,
  Search,
  Zap,
  Globe,
  Terminal,
} from "lucide-react";
import { skillCategories, currentlyLearning } from "../data/skills";
import { staggerContainer, staggerItem } from "../utils/motion";

const iconMap = { Layout, Server, Box, Palette, Cpu, Zap, Globe, Terminal };

const levelConfig = {
  expert: { label: "Expert", width: "95%", color: "from-cyan-400 via-blue-500 to-indigo-500", glow: "shadow-cyan-400/50" },
  advanced: { label: "Advanced", width: "82%", color: "from-blue-400 to-cyan-500", glow: "shadow-blue-400/40" },
  intermediate: { label: "Intermediate", width: "68%", color: "from-emerald-400 to-teal-500", glow: "shadow-emerald-400/30" },
  learning: { label: "Learning", width: "45%", color: "from-amber-400 to-orange-500", glow: "shadow-orange-400/30" },
};

function SkillPill({ skill, index }) {
  const config = levelConfig[skill.level] || levelConfig.intermediate;

  return (
    <motion.div
      variants={staggerItem}
      className="group relative bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all duration-500 hover:-translate-y-0.5"
    >
      <div className="flex justify-between items-center mb-3">
        <span className="font-medium text-white group-hover:text-cyan-300 transition-colors">{skill.name}</span>
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">{config.label}</span>
      </div>

      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: config.width }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1], delay: index * 0.04 }}
          className={`h-full bg-gradient-to-r ${config.color} ${config.glow}`}
        />
      </div>
    </motion.div>
  );
}

function CategoryCard({ category, index }) {
  const Icon = iconMap[category.icon] || Box;
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), { stiffness: 110, damping: 28 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), { stiffness: 110, damping: 28 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      variants={staggerItem}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative h-full perspective-[1100px]"
    >
      <div className="relative h-full rounded-3xl border border-white/10 bg-[#0a0f1c] p-8 backdrop-blur-2xl transition-all duration-700 group-hover:border-cyan-400/30 group-hover:shadow-2xl group-hover:shadow-cyan-500/10 overflow-hidden">

        {/* Dynamic Glow */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: useTransform([mouseX, mouseY], ([x, y]) =>
              `radial-gradient(700px circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(103,232,249,0.12), transparent 75%)`
            ),
          }}
        />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 group-hover:scale-110 transition-transform">
              <Icon className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="text-xs font-mono text-slate-500">0{index + 1}</div>
          </div>

          <h3 className="text-3xl font-bold text-white mb-3 tracking-tight group-hover:text-cyan-100 transition-colors">
            {category.title}
          </h3>
          <p className="text-slate-400 mb-10 leading-relaxed">{category.description}</p>

          <div className="space-y-3 mt-auto">
            {category.skills.map((skill, i) => (
              <SkillPill key={skill.name} skill={skill} index={i} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function SkillsCloud() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = skillCategories
    .map(cat => ({
      ...cat,
      displaySkills: cat.skills.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(cat => {
      if (filter !== 'all' && cat.id !== filter) return false;
      return cat.displaySkills.length > 0;
    });

  return (
    <section id="skills" className="relative py-28 md:py-36 px-4 sm:px-6 overflow-hidden">
      <div className="absolute top-20 -left-40 w-[700px] h-[700px] bg-cyan-500/5 rounded-full blur-[140px]" />
      <div className="absolute bottom-20 -right-40 w-[700px] h-[700px] bg-blue-500/5 rounded-full blur-[140px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-cyan-400/20 text-cyan-400 text-xs font-mono tracking-[3px] mb-6">
              MASTERED &amp; GROWING
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
              Skills <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">&amp; Expertise</span>
            </h2>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 min-w-[340px]">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:border-cyan-400 focus:bg-white/10 transition-all"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {['all', ...skillCategories.map(c => c.id)].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-3 rounded-2xl text-sm font-medium capitalize transition-all ${filter === f
                      ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/30"
                      : "bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white"
                    }`}
                >
                  {f === 'all' ? 'All' : f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <motion.div
          variants={staggerContainer(0.08, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredCategories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={{ ...category, skills: category.displaySkills }}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Currently Learning */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 p-10 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <Sparkles className="w-8 h-8 text-cyan-400" />
            <div>
              <h3 className="text-3xl font-bold text-white">Currently Exploring</h3>
              <p className="text-slate-400">Always learning. Always evolving.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {currentlyLearning.map((tech, i) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.08, y: -4 }}
                transition={{ delay: i * 0.05 }}
                className="px-6 py-3 bg-white/5 border border-white/10 hover:border-cyan-400/30 rounded-2xl text-cyan-300 font-medium flex items-center gap-3 text-sm transition-all"
              >
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
                {tech}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}