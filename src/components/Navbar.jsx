import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Menu from 'lucide-react/dist/esm/icons/menu';
import X from 'lucide-react/dist/esm/icons/x';
import FileDown from 'lucide-react/dist/esm/icons/file-down';
import { useBreakpoint } from '../utils/useBreakpoint';
import { profile } from '../data/profile';

const MotionLink = motion.create(Link);

const navLinks = [
  { href: 'hero',       label: 'Home' },
  { href: 'about',      label: 'About' },
  { href: 'skills',     label: 'Skills' },
  { href: 'projects',   label: 'Projects' },
  { href: 'hackathons', label: 'Hackathons' },
  { href: 'contact',    label: 'Contact' },
];

const RESUME_URL = profile.resumeUrl;

/* ─── Single Nav Item ────────────────────────────────────────────────────── */
function NavItem({ link, isActive, isHovered, onHoverEnter, onHoverLeave, onClick }) {
  return (
    <li
      className="relative"
      onMouseEnter={() => onHoverEnter(link.href)}
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
              willChange: 'opacity, transform',
            }}
          />
        )}
      </AnimatePresence>

      <Link
        to={`/${link.href}`}
        onClick={onClick}
        className="relative flex flex-col items-center px-4 py-3.5 rounded-xl select-none cursor-pointer outline-none"
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
                willChange: 'opacity, transform',
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
      </Link>
    </li>
  );
}

/* ─── Resume Button ──────────────────────────────────────────────────────── */
function ResumeBtn() {
  return (
    <motion.a
      href={RESUME_URL}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.94 }}
      className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl overflow-hidden text-xs font-bold uppercase tracking-widest will-change-transform ml-3 text-white"
      style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
        boxShadow: '0 4px 18px rgba(37,99,235,0.38)',
      }}
    >
      <FileDown className="w-3.5 h-3.5" />
      <span className="relative z-10">Resume</span>
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
  const location = useLocation();
  const currentHash = location.hash || '#hero';

  /* scroll glass */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* active section observer */
  useEffect(() => {
    const ids = navLinks.map((l) => l.href);
    const obs = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const o = new IntersectionObserver(
        ([e]) => { 
          if (e.isIntersecting) {
            // Update active state based on scroll
            setActiveId(id);
          } 
        },
        { rootMargin: '-30% 0px -40% 0px', threshold: 0 }
      );
      o.observe(el);
      obs.push(o);
    });
    return () => obs.forEach((o) => o.disconnect());
  }, []);

  const handleLinkClick = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
    setMobileOpen(false);
  };

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
        <MotionLink
          to="/"
          onClick={(e) => handleNavClick(e, 'hero')}
          className="flex items-center group relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Harsh Kavathiya - Home"
          aria-label="Harsh Kavathiya - Portfolio Home"
        >
          <motion.div whileHover={{ rotateY: 12, rotateX: -6 }} className="relative z-10">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center will-change-transform select-none"
              style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.05) 100%)',
                border: '1px solid rgba(212,175,55,0.3)',
                boxShadow: '0 0 14px rgba(212,175,55,0.18)',
              }}
            >
              <span
                className="text-sm font-black tracking-tight leading-none"
                style={{
                  background: 'linear-gradient(135deg, #f5e07a 0%, #d4af37 50%, #a07820 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                HK
              </span>
            </div>
          </motion.div>
          <motion.div
            animate={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 blur-xl rounded-full -z-10"
            style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.28) 0%, transparent 70%)' }}
          />
        </MotionLink>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavItem
              key={link.href}
              link={link}
              isActive={activeId === link.href}
              isHovered={hoveredId === link.href}
              onHoverEnter={setHoveredId}
              onHoverLeave={() => setHoveredId(null)}
              onClick={handleLinkClick}
            />
          ))}
          <li><ResumeBtn /></li>
        </ul>

        {/* Mobile toggle */}
        <motion.button
          type="button"
          className="md:hidden p-3.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          whileTap={{ scale: 0.9 }}
          aria-label={mobileOpen ? "Close menu" : "Open navigation menu"}
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
            initial={{ opacity: 0, scaleY: 0, originY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`md:hidden bg-[#0b1120]/98 border-b border-slate-700/50 overflow-hidden ${!isMobile && 'backdrop-blur-2xl'}`}
          >
            <ul className="px-6 py-5 flex flex-col gap-1">
              {navLinks.map((link, i) => {
                const isActive = activeId === link.href;
                return (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.045, type: 'spring', stiffness: 320, damping: 28 }}
                  >
                    <Link
                      to={`/${link.href}`}
                      onClick={handleLinkClick}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-200 ${
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
                    </Link>
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
