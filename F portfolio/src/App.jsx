import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, FileText, Linkedin } from 'lucide-react';

// Components
import Navbar from './components/Navbar';
import MeshGradient from './components/MeshGradient';
import CodeScrollIndicator from './components/CodeScrollIndicator';
import Hero from './components/Hero';
import StatsSection from './components/StatsSection';
import GitHubActivity from './components/GitHubActivity';
import ProjectGallery from './components/ProjectGallery';
import ProjectRecommender from './components/ProjectRecommender';
import BentoSkills from './components/BentoSkills';
import ExperienceTimeline from './components/ExperienceTimeline';
import CertificatesAwards from './components/CertificatesAwards';
import TestimonialCarousel from './components/TestimonialCarousel';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

// Pages

// Context
import { RecruiterModeProvider } from './context/RecruiterModeContext';

// Feature
import CommandPalette from './components/CommandPalette';

const RESUME_URL = '/resume.pdf';
const EMAIL = 'hello@example.com';
const LINKEDIN_URL = 'https://linkedin.com';

function QuickActionsDock() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="fixed inset-x-0 bottom-4 md:bottom-6 flex justify-center pointer-events-none z-40"
    >
      <div className="pointer-events-auto inline-flex items-center gap-3 rounded-2xl bg-[#111827]/90 border border-slate-700/60 backdrop-blur-xl px-4 py-2.5 shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
        <span className="hidden md:inline text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
          Quick Actions
        </span>
        <div className="flex items-center gap-2">
          <motion.a
            href={RESUME_URL}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-500 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/25 hover:bg-blue-400 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <FileText className="w-4 h-4" />
            <span>PDF</span>
          </motion.a>
          <motion.button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-white border border-slate-600/60 hover:bg-slate-700 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Copy className="w-4 h-4" />
            <span>{copied ? 'Copied' : 'Copy Email'}</span>
          </motion.button>
          <motion.a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-white border border-slate-600/60 hover:bg-slate-700 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

function PortfolioMain() {
  const [projectFilter, setProjectFilter] = useState('all');

  return (
    <>
      <Hero />
      <StatsSection />
      <GitHubActivity />
      
      <section id="projects" className="py-24 px-6 relative scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono tracking-widest uppercase mb-4">
                Work
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Featured <span className="text-blue-400">Projects</span>
              </h2>
            </div>
            <ProjectRecommender onFilter={setProjectFilter} />
          </div>
          <ProjectGallery typeFilter={projectFilter} />
        </div>
      </section>

      <BentoSkills />
      <ExperienceTimeline />
      <CertificatesAwards />
      <TestimonialCarousel />
      <ContactForm />
    </>
  );
}

export default function App() {
  const location = useLocation();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <RecruiterModeProvider>
      <MeshGradient />
      <CodeScrollIndicator />
      <Navbar />
      
      <CommandPalette 
        isOpen={isPaletteOpen} 
        onClose={() => setIsPaletteOpen(false)} 
      />
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PortfolioMain />
              <QuickActionsDock />
              <Footer />
            </motion.div>
          } />
          <Route path="*" element={<PortfolioMain />} />
        </Routes>
      </AnimatePresence>
    </RecruiterModeProvider>
  );
}
