import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Typewriter from './Typewriter';
import MagneticButton from './MagneticButton';
import TerminalBio from './TerminalBio';
import ProfilePhoto from './ProfilePhoto';
import { fadeInUp, transitionSpring } from '../utils/motion';

const lineStagger = 0.12;

export default function Hero() {
  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: lineStagger, delayChildren: 0.2 } },
          }}
          className="text-center mb-12"
        >
          <motion.div variants={fadeInUp} transition={transitionSpring} className="flex justify-center mb-6">
            <ProfilePhoto size="xl" showRing />
          </motion.div>
          <motion.p
            variants={fadeInUp}
            transition={transitionSpring}
            className="text-[#06b6d4] font-mono text-sm uppercase tracking-widest mb-4"
          >
            Welcome to my space
          </motion.p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            <motion.span variants={fadeInUp} transition={transitionSpring} className="block">
              Hi, I&apos;m a <br className="sm:hidden" />
            </motion.span>
            <motion.span variants={fadeInUp} transition={transitionSpring} className="block min-h-[1.2em]">
              <Typewriter />
            </motion.span>
          </h1>
          <motion.p
            variants={fadeInUp}
            transition={transitionSpring}
            className="text-slate-400 text-lg max-w-xl mx-auto mb-6"
          >
            I build fast, accessible web applications and love solving problems with code.
            Four-plus years of shipping products from idea to production—frontend, backend, and DevOps.
          </motion.p>
          <motion.p
            variants={fadeInUp}
            transition={transitionSpring}
            className="text-slate-500 text-sm max-w-lg mx-auto mb-10"
          >
            Open to new opportunities. Based remotely; happy to collaborate across time zones.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            transition={transitionSpring}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <MagneticButton 
              href="#contact"
              className="gap-2 relative overflow-hidden shadow-[0_0_40px_-8px_rgba(59, 130, 246,0.5)] hover:shadow-[0_0_50px_-8px_rgba(59, 130, 246,0.6)] transition-shadow duration-500"
            >
              Get in Touch <ArrowRight className="w-5 h-5" />
            </MagneticButton>
            <MagneticButton
              href="/resume.pdf"
              className="gap-2 bg-white/10 text-white border border-white/15 hover:bg-white/20 shadow-none"
            >
              Download CV
            </MagneticButton>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <TerminalBio />
        </motion.div>
      </div>
    </section>
  );
}
