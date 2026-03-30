import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Linkedin, Twitter, Youtube, Send, Copy, CheckCircle2 } from 'lucide-react';
import {
  textRevealUp,
  slideInLeft,
  slideInRight,
  blurScaleIn,
  staggerContainer,
  viewportOnce,
} from '../utils/motion';
// Firebase, EmailJS & confetti are lazy-loaded on form submit to reduce initial bundle

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
    id: 'mobile',
    label: 'Mobile',
    value: '+91 9274435924',
    icon: Phone,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    link: 'tel:+919274435924'
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
    value: '@harshkavathiya',
    icon: Youtube,
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    link: 'https://youtube.com/@harshkavathiya-c3k?si=3GtSWsRCvfk1UCxx'
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
      whileHover={{ y: -4 }}
      className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 backdrop-blur-md overflow-hidden"
    >
      {/* Dynamic Background Glow */}
      <div className={`absolute inset-0 ${item.bg} opacity-0 group-hover:opacity-100 transition-opacity blur-2xl -z-10`} />
      
      <div className={`shrink-0 w-12 h-12 rounded-xl ${item.bg} border border-white/5 flex items-center justify-center transition-transform group-hover:scale-110`}>
        <item.icon className={`w-6 h-6 ${item.color}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-0.5">{item.label}</p>
        <p className="text-white font-medium truncate text-sm md:text-base">{item.value}</p>
      </div>

      <button
        onClick={copyToClipboard}
        className="shrink-0 p-2 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-colors relative"
        title="Copy"
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
      </button>
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
      // Lazy-load Firebase, EmailJS & confetti on first submit
      const [firebaseModule, firestoreModule, emailjsModule, confettiModule] = await Promise.all([
        import('../utils/firebase'),
        import('firebase/firestore'),
        import('@emailjs/browser'),
        import('canvas-confetti'),
      ]);

      const { db } = firebaseModule;
      const { collection, addDoc, serverTimestamp } = firestoreModule;
      const emailjs = emailjsModule.default;
      const confetti = confettiModule.default;

      // 1. Save to Firebase Firestore (with 10-second timeout)
      const savePromise = addDoc(collection(db, 'messages'), {
        ...formState,
        to_email: 'harsh.kavathiya.cg@gmail.com',
        timestamp: serverTimestamp(),
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 10000)
      );

      await Promise.race([savePromise, timeoutPromise]);

      // 2. Send Email via EmailJS
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: formState.name,
            from_email: formState.email,
            subject: `Portfolio Message from ${formState.name}`,
            message: formState.message,
            to_email: 'harsh.kavathiya.cg@gmail.com',
            time: new Date().toLocaleString(),
          },
          publicKey
        );
      }

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
    } catch (error) {
      console.error('Submission failed:', error);
      setStatus('error');
      
      let msg = 'Failed to send. Please check your Firebase/EmailJS settings.';
      if (error.message === 'timeout') {
         msg = 'Request timed out. This is usually due to incorrect Firebase Security Rules or a slow connection.';
      } else if (error.code === 'permission-denied') {
         msg = 'Firebase Permission Denied. Please ensure your Firestore Rules allow "create".';
      } else if (error.message) {
         msg = `Error: ${error.message}`;
      }
      
      setErrorMessage(msg);
      setTimeout(() => setStatus('idle'), 8000);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden">
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
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight mb-8 leading-[1.1]"
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
            className="relative p-8 md:p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden h-full flex flex-col"
          >
            {/* Ambient inner glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
            
            <form 
              onSubmit={handleSubmit}
              className="relative z-10 space-y-6 flex flex-col flex-1"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-mono uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">Full Name</label>
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
                  <label htmlFor="email" className="block text-xs font-mono uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">Email Address</label>
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
                <label htmlFor="message" className="block text-xs font-mono uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">Your Message</label>
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

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_25px_50px_-10px_rgba(37,99,235,0.5)] active:scale-[0.98] disabled:opacity-90 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 group overflow-hidden relative"
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
              </button>

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
