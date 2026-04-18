import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Search from 'lucide-react/dist/esm/icons/search';
import FolderOpen from 'lucide-react/dist/esm/icons/folder-open';
import Zap from 'lucide-react/dist/esm/icons/zap';
import X from 'lucide-react/dist/esm/icons/x';
import Figma from 'lucide-react/dist/esm/icons/figma';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
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
        
        {/* Figma CTA Button */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={blurScaleIn}
          className="mt-20 flex justify-center"
        >
          <motion.a
            href="https://www.figma.com/design/STdKa6aBHN0NWjLAmTrDJ0/Untitled?node-id=0-1&p=f"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-3 px-8 py-5 rounded-2xl bg-[#030712] border border-blue-500/30 overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Glossy gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Glow effect */}
            <div className="absolute -inset-1 blur-2xl bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

            <div className="relative flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-[#0b1120] border border-blue-500/20 group-hover:border-blue-400/40 transition-colors">
                <Figma className="w-6 h-6 text-blue-400 group-hover:text-cyan-400 transition-colors" />
              </div>
              <div className="flex flex-col items-start pr-4">
                <span className="text-[10px] font-bold text-blue-400/60 uppercase tracking-[0.2em]">Explore Design</span>
                <span className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">View More on Figma</span>
              </div>
              <ExternalLink className="w-5 h-5 text-slate-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </motion.a>
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-32 text-center"
          >
            <FolderOpen className="w-16 h-16 text-slate-700 mx-auto mb-6" />
            <h3 className="text-white text-xl font-bold mb-2">
              No projects found
            </h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">
              Your filtered view didn't return any items. Try clearing your filters.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
