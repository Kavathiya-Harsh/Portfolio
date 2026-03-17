import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FolderOpen, Zap } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { projects } from '../data/projects';
import { maskReveal, staggerContainer } from '../utils/motion';
import { useRecruiterMode } from '../context/RecruiterModeContext';

export default function ProjectGallery({ typeFilter = 'all' }) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { recruiterMode } = useRecruiterMode();
  
  const categories = ['all', ...new Set(projects.map(p => p.category.toLowerCase()))];
  
  const filteredProjects = projects.filter(project => {
    // In recruiter mode, only show featured projects
    if (recruiterMode && !project.featured) return false;
    
    const matchesFilter = filter === 'all' || project.category.toLowerCase() === filter;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === 'all' || project.type === typeFilter;
    
    return matchesFilter && matchesSearch && matchesType;
  });

  return (
    <section id="projects" className="py-32 px-6 relative overflow-hidden bg-[#0b1120]">
      {/* Decorative Background Decor */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/20 text-blue-400 text-xs font-mono tracking-widest uppercase mb-4">
              Portfolio
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Projects</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl border-l-2 border-slate-600/60 pl-6">
              A curated collection of my work—ranging from high-scale e-commerce platforms to internal developer tools and SaaS products.
            </p>
          </motion.div>

          {/* Filter & Search - Modern UI */}
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
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-white/12 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2 md:justify-end">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-2 rounded-xl text-xs font-semibold capitalize transition-all duration-300 ${
                    filter === cat 
                      ? 'bg-blue-600 text-white shadow-[0_0_25px_rgba(37, 99, 235,0.5)]' 
                      : 'bg-slate-800/50 text-slate-400 hover:bg-white/10 border border-white/8'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div 
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                index={index} 
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <FolderOpen className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No projects found in this category.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
