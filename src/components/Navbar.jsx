import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Menu from 'lucide-react/dist/esm/icons/menu';
import X from 'lucide-react/dist/esm/icons/x';
import FileDown from 'lucide-react/dist/esm/icons/file-down';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import ZapOff from 'lucide-react/dist/esm/icons/zap-off';
import { useBreakpoint } from '../utils/useBreakpoint';
import { profile } from '../data/profile';
import { usePerformance } from '../context/PerformanceContext';

const MotionLink = motion.create(Link);

const navLinks = [
  { href: 'hero', label: 'Home' },
  { href: 'about', label: 'About' },
  { href: 'skills', label: 'Skills' },
  { href: 'projects', label: 'Projects' },
  { href: 'hackathons', label: 'Hackathons' },
  { href: 'contact', label: 'Contact' },
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
      {/* Sliding frosted pill — layoutId lets it glide between items */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            layoutId="nav-hover-pill"
            className="absolute inset-0 pointer-events-none rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 4px 20px -2px rgba(6,182,212,0.15)',
              backdropFilter: 'blur(12px)',
              willChange: 'opacity, transform',
            }}
          >
            {/* Soft inner bottom glow */}
            <div className="absolute inset-x-2 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      <Link
        to={`/${link.href}`}
        onClick={onClick}
        className="relative flex flex-col items-center px-4 py-3 rounded-xl select-none cursor-pointer outline-none"
      >
        {/* Active Indicator Dot */}
        <AnimatePresence>
          {isActive && (
            <motion.span
              layoutId="nav-dot"
              key="active-dot"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-[18px] h-1 rounded-t-full"
              style={{
                background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
                boxShadow: '0 -2px 10px rgba(6,182,212,0.6)',
                willChange: 'opacity, transform',
              }}
            />
          )}
        </AnimatePresence>

        {/* Label */}
        <motion.span
          animate={{
            color: isActive ? '#ffffff' : isHovered ? '#f8fafc' : '#94a3b8',
            textShadow: isActive
              ? '0 0 16px rgba(6,182,212,0.5)'
              : isHovered
                ? '0 0 12px rgba(255,255,255,0.3)'
                : 'none',
            y: isHovered && !isActive ? -1 : 0,
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative z-10 text-sm font-medium leading-none tracking-wide"
        >
          {link.label}
        </motion.span>
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

/* ─── Particles Toggle Button ─────────────────────────────────────────────── */
function ParticlesToggleBtn() {
  const { isLowPower, toggleLowPower } = usePerformance();
  const active = !isLowPower;

  return (
    <motion.button
      type="button"
      onClick={toggleLowPower}
      title={active ? 'Disable particles' : 'Enable particles'}
      aria-label={active ? 'Disable particle animation' : 'Enable particle animation'}
      whileHover={{ scale: 1.08, y: -1 }}
      whileTap={{ scale: 0.92 }}
      className="relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 ml-1"
      style={{
        background: active
          ? 'rgba(0, 245, 255, 0.08)'
          : 'rgba(255,255,255,0.04)',
        border: active
          ? '1px solid rgba(0,245,255,0.25)'
          : '1px solid rgba(255,255,255,0.08)',
        boxShadow: active ? '0 0 12px rgba(0,245,255,0.15)' : 'none',
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {active ? (
          <motion.span
            key="on"
            initial={{ opacity: 0, rotate: -30, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 30, scale: 0.6 }}
            transition={{ duration: 0.2 }}
          >
            <Sparkles className="w-4 h-4" style={{ color: '#00f5ff' }} />
          </motion.span>
        ) : (
          <motion.span
            key="off"
            initial={{ opacity: 0, rotate: 30, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -30, scale: 0.6 }}
            transition={{ duration: 0.2 }}
          >
            <ZapOff className="w-4 h-4 text-slate-500" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ─── Main Navbar ────────────────────────────────────────────────────────── */
export default function Navbar() {
  const isMobile = useBreakpoint(1024);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState('hero');
  const [hoveredId, setHoveredId] = useState(null);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? `bg-[#0b1120]/90 border-b border-slate-700/40 shadow-[0_4px_40px_rgba(0,0,0,0.5)] ${!isMobile && 'backdrop-blur-2xl'}`
          : 'bg-transparent'
        }`}
    >
      {/* top gold accent line */}
      <motion.div
        animate={{ scaleX: scrolled ? 1 : 0, opacity: scrolled ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ background: 'linear-gradient(90deg, transparent, #06b6d4 40%, #3b82f6 60%, transparent)' }}
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
            <svg
              width="40"
              height="40"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 transition-all duration-300"
              style={{ filter: 'drop-shadow(0 0 12px rgba(6,182,212,0.5))' }}
            >
              <defs>
                <linearGradient id="hk-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f5ff" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>

              {/* Outer soft shield/hexagon container */}
              <polygon
                points="50,8 88,30 88,70 50,92 12,70 12,30"
                stroke="url(#hk-logo-grad)"
                strokeWidth="3.5"
                fill="rgba(11, 17, 32, 0.8)"
                strokeLinejoin="round"
                className="transition-colors duration-300 group-hover:stroke-white"
              />

              {/* H letter path */}
              <path
                d="M 32,32 L 32,68 M 32,50 L 50,50 M 50,32 L 50,68"
                stroke="url(#hk-logo-grad)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* K letter arms (connecting to the right leg of H) */}
              <path
                d="M 50,50 L 66,32 M 50,50 L 66,68"
                stroke="url(#hk-logo-grad)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
          <motion.div
            animate={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 blur-xl rounded-full -z-10"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)' }}
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
          <li><ParticlesToggleBtn /></li>
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
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-200 ${isActive
                          ? 'text-[#06b6d4] border border-[#06b6d4]/20'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                      style={isActive ? {
                        background: 'radial-gradient(ellipse at left, rgba(6,182,212,0.15) 0%, transparent 70%)',
                      } : {}}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{
                          background: isActive ? '#06b6d4' : '#334155',
                          boxShadow: isActive ? '0 0 10px rgba(6,182,212,0.8)' : 'none',
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
