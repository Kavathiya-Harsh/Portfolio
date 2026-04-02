import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { useBreakpoint } from './utils/useBreakpoint';
import { FileText, Linkedin } from 'lucide-react';

// Critical above-the-fold components (loaded immediately)
import Navbar from './components/Navbar';
import MeshGradient from './components/MeshGradient';
import CodeScrollIndicator from './components/CodeScrollIndicator';
import LoadingScreen from './components/LoadingScreen';
import Hero from './components/Hero';

// Data
import { profile } from './data/profile';

// Context
import { RecruiterModeProvider } from './context/RecruiterModeContext';
import { usePerformance } from './context/PerformanceContext';

// Lazy-loaded below-the-fold components (loaded after initial paint)
const GitHubActivity = lazy(() => import('./components/GitHubActivity'));
const About = lazy(() => import('./components/About'));
const BentoSkills = lazy(() => import('./components/BentoSkills'));
const ProjectGallery = lazy(() => import('./components/ProjectGallery'));
const HackathonJourney = lazy(() => import('./components/HackathonJourney'));
const CertificatesAwards = lazy(() => import('./components/CertificatesAwards'));
const Education = lazy(() => import('./components/Education'));
const ContactForm = lazy(() => import('./components/ContactForm'));
const Footer = lazy(() => import('./components/Footer'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));

const RESUME_URL = profile.resumeUrl;
const LINKEDIN_URL = 'https://www.linkedin.com/in/harshkavathiya';

function QuickActionsDock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="fixed inset-x-0 bottom-4 md:bottom-6 flex justify-center pointer-events-none z-[60]"
    >
      <div className="pointer-events-auto inline-flex items-center gap-2 md:gap-3 rounded-2xl bg-[#111827]/90 border border-slate-700/60 backdrop-blur-xl px-3 py-2 md:px-4 md:py-2.5 shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
        <span className="hidden md:inline text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
          Quick Actions
        </span>
        <div className="flex items-center gap-1.5 md:gap-2">
          <motion.a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 md:gap-1.5 rounded-xl bg-blue-500 px-2.5 py-1.5 md:px-3 md:py-2 text-[10px] md:text-xs font-semibold text-white shadow-md shadow-blue-500/25 hover:bg-blue-400 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <FileText className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>PDF</span>
          </motion.a>
          <motion.a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 md:gap-1.5 rounded-xl bg-slate-800 px-2.5 py-1.5 md:px-3 md:py-2 text-[10px] md:text-xs font-semibold text-white border border-slate-600/60 hover:bg-slate-700 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Linkedin className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>LinkedIn</span>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

/* Section Divider — animated glow line between sections */
function SectionDivider() {
  return (
    <div className="py-2">
      <div className="section-divider" />
    </div>
  );
}

/* Minimal fallback for lazy-loaded sections */
function SectionFallback() {
  return <div className="min-h-[200px]" />;
}

function PortfolioMain() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pb-40 md:pb-12"
    >
      <Hero />
      <Suspense fallback={<SectionFallback />}>
        <SectionDivider />
        <GitHubActivity />
        <SectionDivider />
        <About />
        <SectionDivider />
        <BentoSkills />
        <SectionDivider />
        <ProjectGallery />
        <SectionDivider />
        <HackathonJourney />
        <SectionDivider />
        <CertificatesAwards />
        <SectionDivider />
        <Education />
        <SectionDivider />
        <ContactForm />
        <QuickActionsDock />
        <Footer />
      </Suspense>
    </motion.div>
  );
}

export default function App() {
  const isMobile = useBreakpoint(1024);
  const { isLowPower } = usePerformance();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

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
    <MotionConfig reducedMotion={isMobile || isLowPower ? 'always' : 'user'}>
      <RecruiterModeProvider>
        <AnimatePresence>
          {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
        </AnimatePresence>
        
        <MeshGradient />
        {!isLowPower && <CodeScrollIndicator />}
        <Navbar />
        
        <Suspense fallback={null}>
          <CommandPalette 
            isOpen={isPaletteOpen} 
            onClose={() => setIsPaletteOpen(false)} 
          />
        </Suspense>
        
        <PortfolioMain />
      </RecruiterModeProvider>
    </MotionConfig>
  );
}
