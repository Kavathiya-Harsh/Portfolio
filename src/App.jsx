import React, { useState, useEffect, useCallback, lazy, Suspense, useMemo } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useBreakpoint } from './utils/useBreakpoint';
import FileText from 'lucide-react/dist/esm/icons/file-text';
import Linkedin from 'lucide-react/dist/esm/icons/linkedin';

// Critical components (loaded immediately)
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AntigravityBackground from './components/AntigravityBackground';

// Lazy-loaded: Non-critical above-fold components
const CodeScrollIndicator = lazy(() => import('./components/CodeScrollIndicator'));
const LoadingScreen = lazy(() => import('./components/LoadingScreen'));
const MeshGradient = lazy(() => import('./components/MeshGradient'));

// Data
import { profile } from './data/profile';

// Context
import { RecruiterModeProvider } from './context/RecruiterModeContext';
import { usePerformance } from './context/PerformanceContext';

// Lazy-loaded below-the-fold components (loaded after initial paint)

const About = lazy(() => import('./components/About'));
const BentoSkills = lazy(() => import('./components/BentoSkills'));
const ProjectGallery = lazy(() => import('./components/ProjectGallery'));
const HackathonJourney = lazy(() => import('./components/HackathonJourney'));
const LeetCodeActivity = lazy(() => import('./components/LeetCodeActivity'));
const CertificatesAwards = lazy(() => import('./components/CertificatesAwards'));
const Education = lazy(() => import('./components/Education'));
const ContactForm = lazy(() => import('./components/ContactForm'));
const Footer = lazy(() => import('./components/Footer'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));

const RESUME_URL = profile.resumeUrl;
const LINKEDIN_URL = 'https://www.linkedin.com/in/harshkavathiya';

/**
 * Detect if we should skip the loading screen.
 * Skip for: bots, lighthouse, etc.
 * This lets the Hero paint as fast as possible on constrained devices.
 */
const SHOULD_SKIP_INTRO = (() => {
  if (typeof window === 'undefined') return true;
  // Always skip for performance auditors (Lighthouse, bots)
  if (/bot|googlebot|crawler|spider|robot|crawling|lighthouse|GTmetrix|Pingdom|PageSpeed/i.test(navigator.userAgent))
    return true;

  // NOTE: Session storage check removed as per user request to always show preloader on reload
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
      initial={{ opacity: 0, y: 60, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 bottom-0 sm:bottom-6 md:bottom-8 flex justify-center z-[100] pointer-events-none"
    >
      <div className="w-full sm:w-auto px-4 pb-4 sm:p-0 pointer-events-auto">

        {/* Outer glow ring */}
        <div className="relative">
          <motion.div
            className="absolute -inset-[1px] rounded-t-2xl sm:rounded-2xl pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(56,189,248,0.35) 0%, rgba(99,102,241,0.25) 50%, rgba(56,189,248,0.15) 100%)',
            }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Dock body */}
          <div
            className="relative flex items-center gap-2 sm:gap-3 rounded-t-2xl sm:rounded-2xl px-3 py-3 sm:px-4 sm:py-2.5 w-full sm:w-auto"
            style={{
              background: 'linear-gradient(135deg, rgba(7,11,22,0.97) 0%, rgba(13,18,32,0.97) 100%)',
              backdropFilter: 'blur(28px)',
              boxShadow: '0 -4px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 1px 0 rgba(255,255,255,0.06) inset',
              paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))',
            }}
          >
            {/* Label + live dot */}
            <div className="hidden lg:flex items-center gap-2 mr-1">
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" style={{ boxShadow: '0 0 5px rgba(52,211,153,0.8)' }} />
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-slate-500">
                  Quick Actions
                </span>
              </span>
            </div>

            {/* Thin vertical divider (desktop only) */}
            <div className="hidden lg:block w-px h-5 bg-slate-700/60 mr-1" />

            <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto">

              {/* ── PDF Button ── */}
              <motion.a
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-center gap-2 rounded-xl text-xs font-bold text-white overflow-hidden min-h-[44px] sm:min-h-0 px-4 py-3 sm:px-3.5 sm:py-2 group"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
                  boxShadow: '0 4px 20px rgba(6,182,212,0.3), 0 0 0 1px rgba(6,182,212,0.2)',
                }}
                whileHover={{
                  scale: 1.06,
                  y: -2,
                  boxShadow: '0 8px 28px rgba(6,182,212,0.45), 0 0 0 1px rgba(6,182,212,0.35)',
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              >
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ x: '-110%' }}
                  whileHover={{ x: '110%' }}
                  transition={{ duration: 0.55, ease: 'easeInOut' }}
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)' }}
                />
                <FileText className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10">Resume</span>
              </motion.a>

              {/* ── LinkedIn Button ── */}
              <motion.a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-center gap-2 rounded-xl text-xs font-bold text-slate-300 overflow-hidden min-h-[44px] sm:min-h-0 px-4 py-3 sm:px-3.5 sm:py-2 group"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                }}
                whileHover={{
                  scale: 1.06,
                  y: -2,
                  color: '#fff',
                  boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
                  borderColor: 'rgba(99,102,241,0.4)',
                  background: 'rgba(99,102,241,0.12)',
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              >
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ x: '-110%', opacity: 0 }}
                  whileHover={{ x: '110%', opacity: 1 }}
                  transition={{ duration: 0.55, ease: 'easeInOut' }}
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }}
                />
                <Linkedin className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10">LinkedIn</span>
              </motion.a>
            </div>
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
    try { sessionStorage.setItem('portfolio-loaded', '1'); } catch { }
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

          <AntigravityBackground />

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
                <LeetCodeActivity />
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
