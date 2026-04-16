import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Code2, Rocket, MapPin, Trophy, GitBranch,
  Layers, Zap, GraduationCap, ArrowUpRight
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import {
  slideInLeft,
  slideInRight,
  staggerContainer,
  textRevealUp,
  blurScaleIn,
  viewportOnce,
} from '../utils/motion';

/* ── Data ────────────────────────────────────────────────────────────────── */
const stats = [
  { value: '5+',   label: 'Hackathons Won', icon: Trophy,    color: '#d4af37', bg: 'rgba(212,175,55,0.08)'  },
  { value: '12+',  label: 'Projects Built', icon: Layers,    color: '#38bdf8', bg: 'rgba(56,189,248,0.08)'  },
  { value: '1st',  label: 'Year B.E. CS',   icon: GraduationCap, color: '#34d399', bg: 'rgba(52,211,153,0.08)' },
  { value: '∞',    label: 'Lines of Code',  icon: Code2,     color: '#a78bfa', bg: 'rgba(167,139,250,0.08)' },
];

const traits = [
  { icon: Rocket,    label: 'Rapid Builder',      desc: 'Ship fast, iterate faster'      },
  { icon: Code2,     label: 'Clean Coder',         desc: 'Readable, scalable code'        },
  { icon: Zap,       label: 'Hackathon Mindset',   desc: 'High-pressure, sharp execution' },
  { icon: GitBranch, label: 'Full-Stack Dev',      desc: 'End-to-end product builder'     },
];

const tags = [
  { icon: GraduationCap, label: 'Modi School Alumnus', color: '#38bdf8' },
  { icon: MapPin,         label: 'Gujarat, India',       color: '#34d399' },
  { icon: Trophy,         label: '5× Hackathon Winner',  color: '#d4af37' },
];

const paragraphs = [
  "I'm a first-year B.E. Computer Science student at Shree Swaminarayan University (CodingGita), driven by a relentless passion for building systems that solve real-world problems.",
  "I've competed and won across top-tier institutes including IIT Madras, IIT Hyderabad, and DA-IICT — thriving in high-pressure environments where innovation meets execution.",
];

/* ── Stat Card ───────────────────────────────────────────────────────────── */
function StatCard({ stat, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      variants={blurScaleIn}
      custom={index}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -4, scale: 1.03 }}
      className="relative flex flex-col items-center justify-center p-5 rounded-2xl border cursor-default text-center overflow-hidden transition-colors duration-300"
      style={{
        background: hovered ? stat.bg : 'rgba(255,255,255,0.02)',
        borderColor: hovered ? stat.color + '55' : 'rgba(255,255,255,0.06)',
      }}
    >
      {/* glow blob */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${stat.color}22 0%, transparent 70%)`,
        }}
      />
      <stat.icon className="w-5 h-5 mb-3" style={{ color: stat.color }} />
      <p className="text-3xl font-black text-white leading-none">{stat.value}</p>
      <p className="text-xs text-slate-400 mt-1.5 font-medium leading-tight">{stat.label}</p>
    </motion.div>
  );
}

/* ── Trait Row ───────────────────────────────────────────────────────────── */
function TraitRow({ trait, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      variants={slideInLeft}
      custom={index}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ x: 6 }}
      className="group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-default"
      style={{
        background: hovered ? 'rgba(56,189,248,0.05)' : 'rgba(255,255,255,0.02)',
        borderColor: hovered ? 'rgba(56,189,248,0.25)' : 'rgba(255,255,255,0.06)',
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
        style={{
          background: hovered ? 'rgba(56,189,248,0.15)' : 'rgba(255,255,255,0.04)',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        <trait.icon
          className="w-5 h-5 transition-colors duration-300"
          style={{ color: hovered ? '#38bdf8' : '#64748b' }}
        />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white">{trait.label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{trait.desc}</p>
      </div>
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -4 }}
        transition={{ duration: 0.2 }}
        className="ml-auto shrink-0"
      >
        <ArrowUpRight className="w-4 h-4 text-cyan-400" />
      </motion.div>
    </motion.div>
  );
}

/* ── Main Component ──────────────────────────────────────────────────────── */
export default function About() {
  return (
    <section id="about" className="py-28 px-6 relative overflow-hidden">

      {/* ── Ambient background glows ── */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Section badge ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono uppercase tracking-[0.2em]"
            style={{
              background: 'rgba(56,189,248,0.06)',
              borderColor: 'rgba(56,189,248,0.2)',
              color: '#38bdf8',
            }}
          >
            <User className="w-3 h-3" />
            About Me
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-20 items-start">

          {/* ══ LEFT COLUMN ══════════════════════════════════════════════ */}
          <motion.div
            variants={staggerContainer(0.12, 0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="order-2 lg:order-1 flex flex-col gap-6"
          >

            {/* Trait rows */}
            {traits.map((trait, i) => (
              <TraitRow key={trait.label} trait={trait} index={i} />
            ))}

            {/* Stats 2×2 grid */}
            <motion.div
              variants={staggerContainer(0.08, 0.2)}
              className="grid grid-cols-2 gap-3 mt-2"
            >
              {stats.map((stat, i) => (
                <StatCard key={stat.label} stat={stat} index={i} />
              ))}
            </motion.div>

          </motion.div>

          {/* ══ RIGHT COLUMN ═════════════════════════════════════════════ */}
          <ScrollReveal direction="right" blur distance={50} className="order-1 lg:order-2">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainer(0.12, 0)}
            >

              {/* Heading */}
              <motion.h2
                variants={textRevealUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight mb-8"
              >
                Passion Meets<br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #34d399 100%)' }}
                >
                  Innovation
                </span>
              </motion.h2>

              {/* Body paragraphs */}
              <div className="space-y-5 mb-10">
                {paragraphs.map((p, i) => (
                  <motion.p
                    key={i}
                    variants={slideInRight}
                    custom={i}
                    className="text-slate-300 text-base leading-relaxed"
                  >
                    {p}
                  </motion.p>
                ))}
              </div>

              {/* ── Slogan Card ── */}
              <motion.div
                variants={blurScaleIn}
                className="relative mb-10 rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(56,189,248,0.18)' }}
              >
                {/* gradient background */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(56,189,248,0.07) 0%, rgba(129,140,248,0.07) 50%, rgba(52,211,153,0.05) 100%)',
                  }}
                />
                {/* animated shimmer */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(56,189,248,0.06), transparent)',
                  }}
                />
                {/* left accent bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-0.5"
                  style={{
                    background:
                      'linear-gradient(180deg, #38bdf8, #818cf8 50%, #34d399)',
                  }}
                />

                <div className="relative px-7 py-5">
                  {/* slogan text */}
                  <p
                    className="text-xl sm:text-2xl font-black tracking-tight bg-clip-text text-transparent leading-snug"
                    style={{
                      backgroundImage:
                        'linear-gradient(135deg, #38bdf8 0%, #818cf8 55%, #34d399 100%)',
                    }}
                  >
                    Code. Build. Disrupt.
                  </p>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-400 font-medium tracking-wide">
                    Turning ideas into scalable solutions — one commit at a time.
                  </p>
                </div>
              </motion.div>

              {/* ── Divider ── */}
              <motion.div
                variants={textRevealUp}
                className="h-px mb-8"
                style={{ background: 'linear-gradient(90deg, rgba(56,189,248,0.3), transparent)' }}
              />

              {/* ── Tags row ── */}
              <motion.div
                variants={staggerContainer(0.08, 0.1)}
                className="flex flex-wrap gap-3"
              >
                {tags.map((tag) => (
                  <motion.div
                    key={tag.label}
                    variants={blurScaleIn}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-medium cursor-default transition-all duration-300"
                    style={{
                      background: `${tag.color}0d`,
                      borderColor: `${tag.color}28`,
                      color: tag.color,
                    }}
                  >
                    <tag.icon className="w-3.5 h-3.5" />
                    {tag.label}
                  </motion.div>
                ))}
              </motion.div>

            </motion.div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
