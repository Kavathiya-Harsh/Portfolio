import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Twitter, Youtube } from 'lucide-react';
import {
  smoothFadeIn,
  staggerContainer,
  blurScaleIn,
  viewportOnce,
} from '../utils/motion';

const links = [
  { href: 'https://github.com/Kavathiya-Harsh', icon: Github, label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/harshkavathiya', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://x.com/HarshK62610', icon: Twitter, label: 'Twitter / X' },
  { href: 'https://youtube.com/@harshkavathiya-c3k', icon: Youtube, label: 'YouTube' },
  { href: 'mailto:harsh.kavathiya.cg@gmail.com', icon: Mail, label: 'Email' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-12 px-6 border-t border-white/12">
      <motion.div
        variants={smoothFadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <p className="text-slate-500 text-sm">
          © {year} Portfolio. Built with React, Tailwind & Framer Motion.
        </p>
        <motion.div
          variants={staggerContainer(0.06, 0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex items-center gap-4"
        >
          {links.map(({ href, icon: Icon, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-[#3b82f6] transition-colors"
              variants={blurScaleIn}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={label}
            >
              <Icon className="w-5 h-5" />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </footer>
  );
}
