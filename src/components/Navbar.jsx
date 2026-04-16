import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, FileDown } from 'lucide-react';
import { useBreakpoint } from '../utils/useBreakpoint';
import { profile } from '../data/profile';

const navLinks = [
  { href: '#hero',       label: 'Home' },
  { href: '#about',      label: 'About' },
  { href: '#skills',     label: 'Skills' },
  { href: '#projects',   label: 'Projects' },
  { href: '#hackathons', label: 'Hackathons' },
  { href: '#contact',    label: 'Contact' },
];

const RESUME_URL = profile.resumeUrl;

/* ─── Single Nav Item ────────────────────────────────────────────────────── */
function NavItem({ link, isActive, isHovered, onHoverEnter, onHoverLeave, onClick }) {
  return (
    <li
      className="relative"
      onMouseEnter={() => onHoverEnter(link.href.slice(1))}
      onMouseLeave={onHoverLeave}
    >
      {/* Sliding pill — only visible on hover; layoutId lets it glide between items */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            layoutId="nav-hover-pill"
            className="absolute inset-0 rounded-xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 34 }}
            style={{
              background:
                'radial-gradient(ellipse at 50% 80%, rgba(212,175,55,0.14) 0%, rgba(212,175,55,0.04) 70%, transparent 100%)',
              boxShadow: '0 0 18px rgba(212,175,55,0.10)',
            }}
          />
        )}
      </AnimatePresence>

      <a
        href={link.href}
        onClick={(e) => onClick(e, link.href)}
        className="relative flex flex-col items-center px-4 py-2.5 rounded-xl select-none cursor-pointer outline-none"
      >
        {/* Glowing dot — slides between active items */}
        <AnimatePresence>
          {isActive && (
            <motion.span
              layoutId="nav-dot"
              key="active-dot"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 32 }}
              className="absolute -top-px left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
              style={{
                background: '#d4af37',
                boxShadow:
                  '0 0 6px 2px rgba(212,175,55,0.95), 0 0 18px 4px rgba(212,175,55,0.45)',
              }}
            />
          )}
        </AnimatePresence>

        {/* Label */}
        <motion.span
          animate={{
            color: isActive ? '#d4af37' : isHovered ? '#ffffff' : '#94a3b8',
            textShadow: isActive
              ? '0 0 14px rgba(212,175,55,0.55)'
              : isHovered
              ? '0 0 20px rgba(212,175,55,0.6), 0 0 40px rgba(212,175,55,0.25)'
              : 'none',
            y: isHovered && !isActive ? -1.5 : 0,
          }}
          transition={{ duration: 0.16, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10 text-sm font-semibold leading-none tracking-wide"
        >
          {link.label}
        </motion.span>

        {/* Underline bar */}
        <span className="relative mt-[5px] h-[2px] w-full rounded-full overflow-hidden">
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{
              background: isActive
                ? 'linear-gradient(90deg, transparent, #d4af37 40%, #d4af37 60%, transparent)'
                : 'linear-gradient(90deg, transparent, rgba(212,175,55,0.75) 40%, rgba(212,175,55,0.75) 60%, transparent)',
              originX: '0%',
            }}
            initial={false}
            animate={{
              scaleX: isActive || isHovered ? 1 : 0,
              opacity: isActive ? 1 : isHovered ? 0.9 : 0,
            }}
            transition={{ type: 'spring', stiffness: 420, damping: 36 }}
          />
        </span>
      </a>
    </li>
  );
}

/* ─── Resume Button ──────────────────────────────────────────────────────── */
function ResumeBtn() {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href={RESUME_URL}
      target="_blank"
      rel="noopener noreferrer"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.94 }}
      className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl overflow-hidden text-xs font-bold uppercase tracking-widest will-change-transform ml-3"
    >
      {/* bg gradient */}
      <motion.span
        className="absolute inset-0"
        animate={{
          background: hovered
            ? 'linear-gradient(135deg, #c9a227 0%, #f0d060 50%, #c9a227 100%)'
            : 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
        }}
        transition={{ duration: 0.38 }}
      />
      {/* glow ring */}
      <motion.span
        className="absolute inset-0 rounded-xl"
        animate={{
          boxShadow: hovered
            ? '0 0 22px rgba(212,175,55,0.65), 0 0 44px rgba(212,175,55,0.28), inset 0 1px 0 rgba(255,255,255,0.15)'
            : '0 4px 18px rgba(37,99,235,0.38)',
        }}
        transition={{ duration: 0.28 }}
      />
      {/* content */}
      <motion.span
        animate={{ color: hovered ? '#0b1120' : '#ffffff' }}
        transition={{ duration: 0.26 }}
        className="relative z-10 flex items-center gap-2"
      >
        <motion.span animate={{ rotate: hovered ? [0, -10, 0] : 0 }} transition={{ duration: 0.4 }}>
          <FileDown className="w-3.5 h-3.5" />
        </motion.span>
        Resume
      </motion.span>
    </motion.a>
  );
}

/* ─── Main Navbar ────────────────────────────────────────────────────────── */
export default function Navbar() {
  const isMobile   = useBreakpoint(1024);
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId,   setActiveId]   = useState('hero');
  const [hoveredId,  setHoveredId]  = useState(null);

  /* scroll glass */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* active section */
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const obs = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActiveId(id); },
        { rootMargin: '-30% 0px -40% 0px', threshold: 0 }
      );
      o.observe(el);
      obs.push(o);
    });
    return () => obs.forEach((o) => o.disconnect());
  }, []);

  /* smooth scroll */
  const handleNavClick = useCallback((e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? `bg-[#0b1120]/90 border-b border-slate-700/40 shadow-[0_4px_40px_rgba(0,0,0,0.5)] ${!isMobile && 'backdrop-blur-2xl'}`
          : 'bg-transparent'
      }`}
    >
      {/* top gold accent line */}
      <motion.div
        animate={{ scaleX: scrolled ? 1 : 0, opacity: scrolled ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute top-0 left-0 right-0 h-px origin-left"
        style={{ background: 'linear-gradient(90deg, transparent, #d4af37 40%, #d4af37 60%, transparent)' }}
      />

      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Brand */}
        <motion.a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="flex items-center group relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Harsh Kavathiya - Home"
        >
          <motion.div whileHover={{ rotateY: 12, rotateX: -6 }} className="relative z-10">
            <img
              src="/hk_logo.png"
              alt="Harsh Kavathiya Logo"
              className="w-10 h-10 rounded-xl object-cover will-change-transform"
              style={{ filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.5))' }}
            />
          </motion.div>
          <motion.div
            animate={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 blur-xl rounded-full -z-10"
            style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.28) 0%, transparent 70%)' }}
          />
        </motion.a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavItem
              key={link.href}
              link={link}
              isActive={activeId === link.href.slice(1)}
              isHovered={hoveredId === link.href.slice(1)}
              onHoverEnter={setHoveredId}
              onHoverLeave={() => setHoveredId(null)}
              onClick={handleNavClick}
            />
          ))}
          <li><ResumeBtn /></li>
        </ul>

        {/* Mobile toggle */}
        <motion.button
          type="button"
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            {mobileOpen ? (
              <motion.span key="x"
                initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}
              >
                <X className="w-6 h-6" />
              </motion.span>
            ) : (
              <motion.span key="menu"
                initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}
              >
                <Menu className="w-6 h-6" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
            className={`md:hidden bg-[#0b1120]/98 border-b border-slate-700/50 overflow-hidden ${!isMobile && 'backdrop-blur-2xl'}`}
          >
            <ul className="px-6 py-5 flex flex-col gap-1">
              {navLinks.map((link, i) => {
                const isActive = activeId === link.href.slice(1);
                return (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.045, type: 'spring', stiffness: 320, damping: 28 }}
                  >
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                        isActive
                          ? 'text-[#d4af37] border border-[#d4af37]/20'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                      style={isActive ? {
                        background: 'radial-gradient(ellipse at left, rgba(212,175,55,0.10) 0%, transparent 70%)',
                      } : {}}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{
                          background: isActive ? '#d4af37' : '#334155',
                          boxShadow: isActive ? '0 0 8px rgba(212,175,55,0.8)' : 'none',
                        }}
                      />
                      {link.label}
                    </a>
                  </motion.li>
                );
              })}

              <motion.li
                className="pt-3"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.045, type: 'spring', stiffness: 320, damping: 28 }}
              >
                <a
                  href={RESUME_URL}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-bold uppercase tracking-wider"
                  style={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
                    boxShadow: '0 4px 20px rgba(37,99,235,0.35)',
                  }}
                >
                  <FileDown className="w-4 h-4" />
                  Download Resume
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
