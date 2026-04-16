import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Search, FolderOpen, Zap, X as CloseIcon } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { projects } from '../data/projects';
import {
  textRevealUp,
  slideInRight,
  blurScaleIn,
  staggerContainer,
  viewportOnce,
  transitionSlow,
} from '../utils/motion';
import { useRecruiterMode } from '../context/RecruiterModeContext';
import { useBreakpoint } from '../utils/useBreakpoint';

export default function ProjectGallery({ typeFilter = 'all' }) {
  const { recruiterMode } = useRecruiterMode();
  const sectionRef = useRef(null);
  const isMobile = useBreakpoint(1024);
  
  // Horizontal parallax for title
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const titleX = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [40, -40]);

  const filteredProjects = projects.filter(project => {
    if (recruiterMode && !project.featured) return false;
    const matchesType = typeFilter === 'all' || project.type === typeFilter;
    return matchesType;
  });

  return (
    <section id="projects" ref={sectionRef} className="py-32 px-6 relative overflow-hidden bg-[#0b1120]">
      {/* Decorative Background */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer(0.12, 0)}
            className="flex-1"
          >
            <motion.span
              variants={textRevealUp}
              className="inline-block px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/20 text-blue-400 text-xs font-mono tracking-widest uppercase mb-4"
            >
              Portfolio
            </motion.span>
            {/* Title with horizontal parallax */}
            <motion.h2
              variants={textRevealUp}
              style={{ x: titleX }}
              className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-[1.1] will-change-transform"
            >
              Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">Projects</span>
            </motion.h2>
            <motion.p
              variants={textRevealUp}
              className="text-slate-400 font-medium text-base sm:text-lg max-w-xl border-l-2 border-slate-600/60 pl-6 leading-relaxed"
            >
              A curated collection of my work—ranging from high-scale e-commerce platforms to internal developer tools and SaaS products.
            </motion.p>
          </motion.div>
        </div>


        {/* Project Cards Grid — staggered blurScaleIn */}
        <motion.div 
          variants={staggerContainer(0.12, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-32 text-center"
          >
            <FolderOpen className="w-16 h-16 text-slate-700 mx-auto mb-6" />
            <h4 className="text-white text-xl font-bold mb-2">
              No projects found
            </h4>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
              Your filtered view didn't return any items. Try clearing your filters.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
