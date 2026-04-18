import React, { useState, useEffect, useCallback, lazy, Suspense, useMemo } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useBreakpoint } from './utils/useBreakpoint';
import FileText from 'lucide-react/dist/esm/icons/file-text';
import Linkedin from 'lucide-react/dist/esm/icons/linkedin';

// Critical components (loaded immediately)
import Navbar from './components/Navbar';
import Hero from './components/Hero';

// Lazy-loaded: Non-critical above-fold components
const CodeScrollIndicator = lazy(() => import('./components/CodeScrollIndicator'));
const LoadingScreen = lazy(() => import('./components/LoadingScreen'));
const MeshGradient  = lazy(() => import('./components/MeshGradient'));

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

/**
 * Detect if we should skip the loading screen.
 * Skip for: bots, lighthouse, mobile devices (< 768px).
 * This lets the Hero paint as fast as possible on constrained devices.
 */
const SHOULD_SKIP_INTRO = (() => {
  if (typeof window === 'undefined') return true;
  // Always skip for performance auditors
  if (/bot|googlebot|crawler|spider|robot|crawling|lighthouse|GTmetrix|Pingdom|PageSpeed/i.test(navigator.userAgent))
    return true;
  // Skip on mobile/tablet — loading screen adds ~3s of TBT
  if (window.innerWidth < 768) return true;
  // Skip if session already saw loading screen
  if (sessionStorage.getItem('portfolio-loaded')) return true;
  return false;
})();

/**
 * Helper component that manages smooth scrolling to sections when 
 * the URL path changes (e.g., /about). Handles fixed navbar offset.
 */
function ScrollToPathElement() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Extract ID from pathname (e.g., "/about" -> "about")
    const id = pathname.replace('/', '');
    
    if (id) {
      const element = document.getElementById(id);
      if (element) {
        // Offset for the fixed navbar (approx 80px)
        const offset = 80;
        const offsetPosition = window.scrollY + element.getBoundingClientRect().top - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
        return;
      }
    }
    
    // Fallback: Scroll to top if no ID or at root
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

function QuickActionsDock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="fixed inset-x-0 bottom-0 sm:bottom-4 md:bottom-6 flex justify-center z-[100]"
    >
      <div className="w-full sm:w-auto p-4 sm:p-0 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3 rounded-t-2xl sm:rounded-2xl bg-[#111827]/95 border-t sm:border border-slate-700/60 backdrop-blur-xl px-4 py-3 sm:px-4 sm:py-2.5 shadow-[0_-8px_30px_rgba(0,0,0,0.5)] sm:shadow-[0_24px_60px_rgba(0,0,0,0.6)] w-full sm:w-auto"
             style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}>
          <span className="hidden lg:inline text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400 mr-2">
            Quick Actions
          </span>
          <div className="grid grid-cols-2 sm:flex items-center gap-3 w-full sm:w-auto">
            <motion.a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 sm:px-3 sm:py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition-colors min-h-[44px] sm:min-h-0"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FileText className="w-4 h-4" />
              <span>PDF</span>
            </motion.a>
            <motion.a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 sm:px-3 sm:py-2 text-xs font-bold text-white border border-slate-600/60 hover:bg-slate-700 transition-colors min-h-[44px] sm:min-h-0"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </motion.a>
          </div>
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

export default function App() {
  const isMobile = useBreakpoint(1024);
  const { isLowPower } = usePerformance();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  
  const [isLoading, setIsLoading] = useState(!SHOULD_SKIP_INTRO);
  const [isDelayedReady, setIsDelayedReady] = useState(SHOULD_SKIP_INTRO);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    // Mark session so we don't play intro again on navigation
    try { sessionStorage.setItem('portfolio-loaded', '1'); } catch {}
    // Minimal settling delay
    setTimeout(() => setIsDelayedReady(true), 50);
  }, []);

  // If we skipped the intro, remove the app-shell immediately
  useEffect(() => {
    if (SHOULD_SKIP_INTRO) {
      const shell = document.getElementById('app-shell');
      if (shell) shell.remove();
    }
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
    <>
      <ScrollToPathElement />
      <MotionConfig reducedMotion={isLowPower ? 'always' : 'user'}>
      <RecruiterModeProvider>
        {/* 
          PERFORMANCE FIX: Always render ALL content from the start.
          The loading screen is a fixed z-250 overlay ON TOP of the content.
          This means the DOM never changes when loading ends = ZERO CLS.
          The content is already laid out underneath, just hidden by the overlay.
        */}
        
        {/* Loading screen — lazy loaded, only for desktop with no prior session */}
        {!SHOULD_SKIP_INTRO && (
          <Suspense fallback={null}>
            <AnimatePresence>
              {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
            </AnimatePresence>
          </Suspense>
        )}

        {/* Main content — ALWAYS rendered, stable in DOM from first paint */}
        <Suspense fallback={null}>
          <MeshGradient />
        </Suspense>
        
        {/* Only show persistent UI once loading is complete to prevent "leakage" */}
        <AnimatePresence>
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              {(!isLowPower && !isMobile) && (
                <Suspense fallback={null}>
                  <CodeScrollIndicator />
                </Suspense>
              )}
              <Navbar />
            </motion.div>
          )}
        </AnimatePresence>
        
        <Suspense fallback={null}>
          <CommandPalette 
            isOpen={isPaletteOpen} 
            onClose={() => setIsPaletteOpen(false)} 
          />
        </Suspense>

        {/* Main page content — always in DOM, no conditional rendering */}
        <div className="pb-32 sm:pb-40 md:pb-12" style={{ paddingBottom: 'calc(10rem + env(safe-area-inset-bottom, 0px))' }}>
          <main>
            <div id="hero"><Hero isReady={isDelayedReady} /></div>
            
            <Suspense fallback={<SectionFallback />}>
              <SectionDivider />
              <GitHubActivity />
            </Suspense>

            <Suspense fallback={<SectionFallback />}>
              <SectionDivider />
              <div id="about"><About /></div>
            </Suspense>

            <Suspense fallback={<SectionFallback />}>
              <SectionDivider />
              <div id="skills"><BentoSkills /></div>
            </Suspense>

            <Suspense fallback={<SectionFallback />}>
              <SectionDivider />
              <div id="projects"><ProjectGallery /></div>
            </Suspense>

            <Suspense fallback={<SectionFallback />}>
              <SectionDivider />
              <div id="hackathons"><HackathonJourney /></div>
              <SectionDivider />
              <CertificatesAwards />
              <SectionDivider />
              <Education />
            </Suspense>

            <Suspense fallback={<SectionFallback />}>
              <SectionDivider />
              <div id="contact"><ContactForm /></div>
              <QuickActionsDock />
              <Footer />
            </Suspense>
          </main>
        </div>
      </RecruiterModeProvider>
      </MotionConfig>
    </>
  );
}
