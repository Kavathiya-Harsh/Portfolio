import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Linkedin from 'lucide-react/dist/esm/icons/linkedin';
import Twitter from 'lucide-react/dist/esm/icons/twitter';
import Youtube from 'lucide-react/dist/esm/icons/youtube';
import Send from 'lucide-react/dist/esm/icons/send';
import Copy from 'lucide-react/dist/esm/icons/copy';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import {
  textRevealUp,
  slideInLeft,
  slideInRight,
  blurScaleIn,
  staggerContainer,
  viewportOnce,
} from '../utils/motion';
// Firebase, EmailJS & confetti are lazy-loaded on form submit to reduce initial bundle

/* LeetCode SVG icon — lucide doesn't have one */
const LeetCodeIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
  </svg>
);

const socialLinks = [
  {
    id: 'email',
    label: 'Email',
    value: 'harsh.kavathiya.cg@gmail.com',
    icon: Mail,
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
    link: 'mailto:harsh.kavathiya.cg@gmail.com'
  },

  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: 'linkedin.com/in/harshkavathiya',
    icon: Linkedin,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    link: 'https://www.linkedin.com/in/harshkavathiya'
  },
  {
    id: 'twitter',
    label: 'Twitter / X',
    value: '@HarshK62610',
    icon: Twitter,
    color: 'text-sky-400',
    bg: 'bg-sky-400/10',
    link: 'https://x.com/HarshK62610'
  },
  {
    id: 'youtube',
    label: 'YouTube',
    value: '@harsh_kavathiya-001',
    icon: Youtube,
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    link: 'https://www.youtube.com/@harsh_kavathiya-001'
  },
  {
    id: 'leetcode',
    label: 'LeetCode',
    value: 'Harsh_Kavathiya',
    icon: LeetCodeIcon,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    link: 'https://leetcode.com/u/Harsh_Kavathiya/'
  },
];

function ContactCard({ item, index }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(item.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.a
      href={item.link}
      target={item.link.startsWith('http') ? "_blank" : "_self"}
      rel="noopener noreferrer"
      variants={slideInLeft}
      whileHover={{ y: -5, scale: 1.01 }}
      className="group relative flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#d4af37]/30 hover:bg-white/10 transition-all duration-300 backdrop-blur-md overflow-hidden w-full"
      aria-label={`Contact me via ${item.label}: ${item.value}`}
    >
      {/* Dynamic Background Glow */}
      <div className={`absolute inset-0 ${item.bg} opacity-0 group-hover:opacity-100 transition-opacity blur-2xl -z-10`} />
      
      {/* Left: Icon */}
      <div className={`shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${item.bg} border border-white/5 flex items-center justify-center transition-transform group-hover:scale-110`}>
        <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.color}`} />
      </div>

      {/* Middle: Text Content (Icon-Left, Label-Top, Value-Bottom) */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 mb-0.5" style={{ fontSize: 'clamp(8px, 2vw, 10px)' }}>
          {item.label}
        </p>
        <p className="text-white font-medium truncate text-sm sm:text-base leading-tight">
          {item.value}
        </p>
      </div>

      {/* Right: Copy Button */}
      <motion.button
        onClick={copyToClipboard}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="shrink-0 p-2.5 sm:p-3.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors relative min-h-[44px] min-w-[44px] flex items-center justify-center"
        title="Copy"
        aria-label={`Copy ${item.label} to clipboard`}
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.div
              key="check"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <Copy className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.a>
  );
}

export default function ContactForm() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormState((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      setStatus('error');
      setErrorMessage('Please fill in all fields.');
      return;
    }

    setStatus('sending');

    try {
      // Lazy-load confetti on first submit
      const confettiModule = await import('canvas-confetti');
      const confetti = confettiModule.default;

      // Send to server — it handles both DB save + email notification
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setStatus('success');
        
        // Sweet Success Celebration!
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#22d3ee', '#6366f1']
        });

        setFormState({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        throw new Error(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Submission failed:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Failed to send. Please try again later.');
      setTimeout(() => setStatus('idle'), 8000);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header with text reveal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.12, 0)}
          className="text-center mb-16"
        >
          <motion.div
            variants={textRevealUp}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-widest mb-4"
          >
            <Mail className="w-3 h-3" />
            <span>Contact Information</span>
          </motion.div>
          <motion.h2
            variants={textRevealUp}
            className="font-bold text-white tracking-tight mb-8 leading-[1.1]"
            style={{ fontSize: 'clamp(2rem, 10vw, 4.5rem)' }}
          >
            Get in <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">Touch</span>
          </motion.h2>
          <motion.p
            variants={textRevealUp}
            className="text-slate-400 font-medium text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Have a project in mind, want to collaborate, or just want to say hi? Reach out — I'm always open to new opportunities.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          {/* Social Links — staggered slideInLeft */}
          <motion.div
            variants={staggerContainer(0.1, 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-4 justify-between"
          >
            {socialLinks.map((item, i) => (
              <ContactCard key={item.id} item={item} index={i} />
            ))}
          </motion.div>

          {/* Contact Form Card — slideInRight with blur */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="relative p-5 sm:p-8 md:p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden h-full flex flex-col will-change-transform"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none will-change-transform" />
            
            <form 
              onSubmit={handleSubmit}
              className="relative z-10 space-y-6 flex flex-col flex-1"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 mb-1.5 ml-0.5">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formState.name}
                    onChange={handleChange}
                    placeholder="Enter name"
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 mb-1.5 ml-0.5">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 mb-1.5 ml-0.5">Your Message</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project or just say hi..."
                  className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm resize-none"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 25px 50px -12px rgba(37,99,235,0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-xl active:scale-[0.98] disabled:opacity-90 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 group overflow-hidden relative border border-white/10 hover:border-[#d4af37]/30"
              >
                {/* Progress Underlay during sending */}
                {status === 'sending' && (
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '0%' }}
                    transition={{ duration: 3, ease: "linear" }}
                    className="absolute inset-0 bg-white/10 pointer-events-none"
                  />
                )}

                <AnimatePresence mode="wait">
                  {status === 'sending' ? (
                    <motion.div
                      key="sending"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      className="flex items-center gap-3 relative z-10"
                    >
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="tracking-wider uppercase text-xs font-mono"
                      >
                        Securing Mission...
                      </motion.span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-3 relative z-10"
                    >
                      <span className="tracking-tight text-lg">Send Message</span>
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Status Feedback */}
              <AnimatePresence>
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Message sent successfully! I'll get back to you soon.</span>
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm"
                  >
                    {errorMessage}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
