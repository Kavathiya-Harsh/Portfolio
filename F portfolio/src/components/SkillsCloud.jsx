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
import {
  maskReveal,
  staggerContainer,
  staggerItem,
  transitionSpring,
} from "../utils/motion";

const iconMap = { Layout, Server, Box, Palette, Cpu, Zap, Globe, Terminal };

const levelConfig = {
  expert: {
    label: "Expert",
    width: "95%",
    color: "from-cyan-400 to-blue-600",
    glow: "shadow-cyan-500/40",
  },
  advanced: {
    label: "Advanced",
    width: "80%",
    color: "from-blue-400 to-blue-600",
    glow: "shadow-blue-500/40",
  },
  intermediate: {
    label: "Intermediate",
    width: "65%",
    color: "from-emerald-400 to-teal-600",
    glow: "shadow-emerald-500/30",
  },
  learning: {
    label: "Learning",
    width: "40%",
    color: "from-orange-400 to-red-600",
    glow: "shadow-orange-500/30",
  },
};

function SkillPill({ skill, index }) {
  const config = levelConfig[skill.level] || levelConfig.intermediate;
  return (
    <motion.div
      variants={staggerItem}
      className="group relative flex flex-col gap-2 p-3 rounded-xl bg-slate-800/50 border border-white/8 hover:border-white/12 transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
          {skill.name}
        </span>
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">
          {config.label}
        </span>
      </div>
      <div className="h-1 w-full bg-slate-800/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: config.width }}
          viewport={{ once: true }}
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
            delay: index * 0.05,
          }}
          className={`h-full bg-gradient-to-r ${config.color} ${config.glow} shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
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

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 100,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 100,
    damping: 30,
  });

  function onMouseMove(e) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function onMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      variants={staggerItem}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      ref={cardRef}
      className="group relative perspective-1000"
    >
      <div className="relative h-full p-6 rounded-3xl border border-white/12 bg-gradient-to-br from-white/10 to-white/[0.02] backdrop-blur-xl overflow-hidden transition-all duration-500 group-hover:border-blue-500/50 group-hover:shadow-[0_0_50px_-12px_rgba(59, 130, 246,0.3)]">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Spot Light Effect */}
        <motion.div
          className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([x, y]) =>
                `radial-gradient(600px circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(59, 130, 246, 0.15), transparent 80%)`,
            ),
          }}
        />

        <div className="relative z-20 flex flex-col h-full">
          <div className="flex items-start justify-between mb-6">
            <div className="p-3 rounded-2xl bg-blue-500/15 border border-blue-500/20 text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
              <Icon className="w-6 h-6" />
            </div>
            <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
              0{index + 1}
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
            {category.title}
          </h3>
          <p className="text-sm text-slate-400 mb-8 line-clamp-2">
            {category.description}
          </p>

          <div className="grid grid-cols-1 gap-3 mt-auto">
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

  // Extract unique categories dynamically
  const categories = ['all', ...skillCategories.map(cat => cat.id)];

  const filteredCategories = skillCategories
    .map(category => ({
      ...category,
      // Filter skills within the category if searching
      displaySkills: category.skills.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(cat => {
      const matchesFilter = filter === 'all' || cat.id === filter;
      const matchesSearch = cat.displaySkills.length > 0;
      return matchesFilter && matchesSearch;
    });

  return (
    <section id="skills" className="py-32 px-6 relative overflow-hidden bg-[#0b1120]">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/20 text-blue-400 text-xs font-mono tracking-widest uppercase mb-4">
              Expertise
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Skills <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">&</span> Tools
            </h2>
            <p className="text-slate-400 text-lg max-w-xl border-l-2 border-slate-600/60 pl-6">
              My technical arsenal refined through professional experience and passion projects. 
              I specialize in building high-performance web applications with modern stacks.
            </p>
          </motion.div>

          {/* Search & Filter - Modern UI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6 min-w-[320px]"
          >
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-all" />
              <input
                type="text"
                placeholder="Search technologies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-white/12 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2 rounded-xl text-xs font-semibold capitalize transition-all duration-300 ${
                    filter === f
                      ? "bg-blue-600 text-white shadow-[0_0_25px_rgba(37, 99, 235,0.5)]"
                      : "bg-slate-800/50 text-slate-400 hover:bg-white/10 border border-white/8"
                  }`}
                >
                  {f.replace('-', ' ')}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredCategories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={{ ...category, skills: category.displaySkills }}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Learning Journey - Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 relative p-8 rounded-[2.5rem] border border-white/12 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 backdrop-blur-sm overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-24 h-24 text-white" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
                Learning Journey <Sparkles className="w-5 h-5 text-blue-400" />
              </h3>
              <p className="text-slate-400 text-sm">
                The tech world moves fast. Here&apos;s what I&apos;m currently adding to my repertoire.
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end gap-3 flex-1">
              {currentlyLearning.map((tech, i) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5, scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                  transition={{ delay: i * 0.1 }}
                  className="px-5 py-2.5 rounded-full bg-slate-800/50 border border-white/12 text-cyan-400 font-mono text-xs flex items-center gap-2 hover:border-slate-600/60 transition-all cursor-default"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  {tech}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
