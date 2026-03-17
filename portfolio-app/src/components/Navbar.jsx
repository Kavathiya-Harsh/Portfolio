import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ProfilePhoto } from './ProfilePhoto';
import { useRecruiterMode } from '../context/RecruiterModeContext';

const navLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#certificates', label: 'Certificates' },
  { href: '#contact', label: 'Contact' },
];

const RESUME_URL = '/resume.pdf';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { recruiterMode, enterRecruiterMode, exitRecruiterMode } = useRecruiterMode();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleRecruiterToggle = () => {
    if (recruiterMode) exitRecruiterMode();
    else enterRecruiterMode();
  };

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-xl bg-[#0b1120]/80 border-b border-slate-700/50' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-3 text-xl font-bold text-white tracking-tight">
          <ProfilePhoto size="sm" showRing={false} className="ring-1 ring-slate-600" />
          <span><span className="text-blue-400">&lt;</span>Portfolio<span className="text-blue-400">/&gt;</span></span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="relative text-slate-400 hover:text-white transition-colors text-sm font-medium py-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-blue-400 after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={RESUME_URL}
              target={RESUME_URL.startsWith('http') ? '_blank' : undefined}
              rel={RESUME_URL.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-semibold hover:bg-blue-400 transition-colors shadow-lg shadow-blue-500/25"
              onClick={() => setMobileOpen(false)}
            >
              Resume
            </a>
          </li>

          {/* Recruiter Mode Button */}
          <li>
            <motion.button
              type="button"
              onClick={handleRecruiterToggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative ml-1 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden ${
                recruiterMode
                  ? 'bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.25)]'
                  : 'bg-slate-800 border border-slate-600/60 text-slate-300 hover:border-blue-500/50 hover:text-white'
              }`}
              aria-label="Toggle recruiter mode"
            >
              {recruiterMode && (
                <motion.div
                  className="absolute inset-0 bg-cyan-500/10"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              <span className={`relative w-2 h-2 rounded-full ${recruiterMode ? 'bg-cyan-400 animate-pulse' : 'bg-blue-400'}`} />
              <span className="relative">{recruiterMode ? 'Exit Mode' : '⚡ Recruiter Mode'}</span>
            </motion.button>
          </li>
        </ul>

        <button
          type="button"
          className="md:hidden p-2 text-slate-400 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Recruiter Mode Banner */}
      <AnimatePresence>
        {recruiterMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-2.5 flex items-center justify-center gap-3 text-white text-sm">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="font-medium">⚡ Recruiter Mode — Showing top highlights &amp; featured projects.</span>
              <button onClick={exitRecruiterMode} className="ml-4 text-white/70 hover:text-white transition-colors text-xs underline underline-offset-2">
                Exit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden backdrop-blur-xl bg-[#0b1120]/95 border-b border-slate-700/50"
          >
            <ul className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block text-slate-300 hover:text-white transition-colors font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={RESUME_URL}
                  className="block py-2.5 rounded-lg bg-blue-500 text-white text-center font-semibold"
                  onClick={() => setMobileOpen(false)}
                >
                  Download Resume
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleRecruiterToggle}
                  className="w-full py-2.5 rounded-lg border border-slate-600 text-slate-300 text-sm font-medium hover:border-blue-500/50 transition-colors"
                >
                  {recruiterMode ? 'Exit Recruiter Mode' : '⚡ Recruiter Mode'}
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
