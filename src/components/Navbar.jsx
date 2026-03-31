import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { profile } from '../data/profile';

const navLinks = [
  { href: '#hero',         label: 'Home' },
  { href: '#about',        label: 'About' },
  { href: '#skills',       label: 'Skills' },
  { href: '#projects',     label: 'Projects' },
  { href: '#hackathons',   label: 'Hackathons' },
  { href: '#contact',      label: 'Contact' },
];

const RESUME_URL = profile.resumeUrl;

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId]     = useState('hero');

  /* ── scroll glass effect ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── active section via IntersectionObserver ── */
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const observers = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: '-30% 0px -40% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  /* ── smooth scroll on click ── */
  const handleNavClick = useCallback((e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const linkClass = (id) =>
    `relative text-sm font-medium py-1 transition-colors duration-200
    after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full
    after:origin-left after:rounded-full after:transition-transform after:duration-300
    after:content-['']
    ${
      activeId === id
        ? 'text-[#d4af37] after:scale-x-100 after:bg-[#d4af37]'
        : "text-slate-400 hover:text-white after:scale-x-0 after:bg-[#d4af37] hover:after:scale-x-100"
    }`;

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-xl bg-[#0b1120]/80 border-b border-slate-700/50 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* ── Brand ── */}
        <motion.a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="flex items-center gap-3 group relative perspective-1000"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
             whileHover={{ rotateY: 10, rotateX: -5 }}
             className="relative z-10"
          >
            <img
              src="/hk_logo.png"
              alt="HK Logo"
              className="w-10 h-10 rounded-xl object-cover drop-shadow-[0_0_8px_rgba(212,175,55,0.5)] group-hover:drop-shadow-[0_0_16px_rgba(212,175,55,0.8)] transition-all duration-500 will-change-transform"
            />
          </motion.div>
          {/* Subtle glow behind logo on hover */}
          <div className="absolute inset-0 bg-[#d4af37]/0 group-hover:bg-[#d4af37]/10 blur-xl rounded-full transition-all duration-500 -z-10" />
        </motion.a>

        {/* ── Desktop Links ── */}
        <ul className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const id = link.href.slice(1);
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={linkClass(id)}
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.label}
                  {activeId === id && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#d4af37]"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
          <li>
            <motion.a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold uppercase tracking-wider hover:shadow-[0_10px_20px_-5px_rgba(37,99,235,0.4)] transition-all will-change-transform"
            >
              Resume
            </motion.a>
          </li>
        </ul>

        {/* ── Mobile Toggle ── */}
        <button
          type="button"
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden backdrop-blur-xl bg-[#0b1120]/95 border-b border-slate-700/50"
          >
            <ul className="px-6 py-5 flex flex-col gap-1">
              {navLinks.map((link) => {
                const id = link.href.slice(1);
                const isActive = activeId === id;
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm ${
                        isActive
                          ? 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                      onClick={(e) => handleNavClick(e, link.href)}
                    >
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] shrink-0" />
                      )}
                      {link.label}
                    </a>
                  </li>
                );
              })}
              <li className="pt-2">
                <a
                  href={RESUME_URL}
                  className="block py-2.5 rounded-lg bg-blue-500 text-white text-center font-semibold hover:bg-blue-400 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Download Resume
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
