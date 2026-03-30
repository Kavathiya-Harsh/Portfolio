import React from 'react';
import { motion } from 'framer-motion';
import { User, Code2, Rocket, Brain, Coffee, GraduationCap, MapPin } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import {
  slideInLeft,
  slideInRight,
  staggerContainer,
  textRevealUp,
  blurScaleIn,
  viewportOnce,
} from '../utils/motion';

const aboutData = {
  title: "Passion Meets Innovation",
  subtitle: "Decoding complexity, one hackathon at a time.",
  description: [
    "I am a results-driven Computer Science student at Shree Swaminarayan University (codinggita), currently in my first year of B.E. My journey in tech is fueled by a deep-seated passion for building systems that solve real-world problems.",
    "Based in Gujarat (Kalol), I've spent my early academic years refining my logic and problem-solving skills at Modi School. Since starting my degree, I've dived head-first into the world of Full-Stack development and Algorithmic logic.",
    "What defines me? It's the 'Hackathon Mindset'. I've competed in and won 5 major hackathons across top premier institutes like IIT Madras, IIT Hyderabad, and DA-IICT. I thrive in high-pressure environments where innovation meets execution."
  ],
  stats: [
    { label: 'Location', value: 'Kalol, Gandhinagar', icon: MapPin, color: 'text-blue-400' },
    { label: 'Rapid Builder', icon: Rocket, color: 'text-cyan-400' },
    { label: 'Clean Coder', icon: Code2, color: 'text-emerald-400' }
  ]
};

export default function About() {
  return (
    <section id="about" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Visual/Stats — staggered slide-in from left with blur */}
          <motion.div
            variants={staggerContainer(0.15, 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="order-2 lg:order-1 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6"
          >
            {aboutData.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={slideInLeft}
                whileHover={{ x: 10 }}
                className="group p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl flex items-center gap-6 hover:bg-white/[0.05] hover:border-blue-500/30 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl bg-slate-800/50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">{stat.label}</p>
                  <p className="text-slate-500 text-xs uppercase tracking-widest font-mono">Core Value</p>
                </div>
              </motion.div>
            ))}

            {/* Ambient Background Decorative for Left side */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none rounded-full" />
          </motion.div>

          {/* Right Side: Content — slide in from right */}
          <ScrollReveal direction="right" blur distance={50} className="order-1 lg:order-2">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainer(0.12, 0)}
            >
              <motion.div
                variants={textRevealUp}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-[0.2em] mb-6"
              >
                <User className="w-3 h-3" />
                <span>About Me</span>
              </motion.div>
              
              <motion.h2
                variants={textRevealUp}
                className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-8"
              >
                {aboutData.title.split(' ').slice(0, 2).join(' ')} <br/>
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {aboutData.title.split(' ').slice(2).join(' ')}
                </span>
              </motion.h2>

              <div className="space-y-6 text-slate-300 text-lg leading-relaxed">
                {aboutData.description.map((p, i) => (
                  <motion.p
                    key={i}
                    variants={slideInRight}
                    custom={i}
                  >
                    {p}
                  </motion.p>
                ))}
              </div>

              {/* Small Quick Info Tags */}
              <motion.div
                variants={staggerContainer(0.1, 0.3)}
                className="flex flex-wrap gap-4 mt-10 pt-10 border-t border-white/5"
              >
                {[
                  { icon: GraduationCap, label: 'Modi School Alumnus', color: 'text-blue-400' },
                  { icon: MapPin, label: 'Gujarat Based', color: 'text-cyan-400' },
                  { icon: Coffee, label: '12+ Projects Built', color: 'text-emerald-400' },
                ].map((tag) => (
                  <motion.div
                    key={tag.label}
                    variants={blurScaleIn}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/40 text-xs text-slate-300 border border-white/5"
                  >
                    <tag.icon className={`w-4 h-4 ${tag.color}`} />
                    <span>{tag.label}</span>
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
