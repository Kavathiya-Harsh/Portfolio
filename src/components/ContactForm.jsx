import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Linkedin from 'lucide-react/dist/esm/icons/linkedin';
import Twitter from 'lucide-react/dist/esm/icons/twitter';
import Youtube from 'lucide-react/dist/esm/icons/youtube';
import Send from 'lucide-react/dist/esm/icons/send';
import Copy from 'lucide-react/dist/esm/icons/copy';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';


const socialLinks = [
  { id: 'email', label: 'Email', value: 'harsh.kavathiya.cg@gmail.com', icon: Mail, color: 'text-rose-400', link: 'mailto:harsh.kavathiya.cg@gmail.com' },
  { id: 'linkedin', label: 'LinkedIn', value: 'linkedin.com/in/harshkavathiya', icon: Linkedin, color: 'text-blue-400', link: 'https://www.linkedin.com/in/harshkavathiya' },
  { id: 'twitter', label: 'X / Twitter', value: '@HarshK62610', icon: Twitter, color: 'text-sky-400', link: 'https://x.com/HarshK62610' },
  { id: 'youtube', label: 'YouTube', value: '@harsh_kavathiya-001', icon: Youtube, color: 'text-red-400', link: 'https://www.youtube.com/@harsh_kavathiya-001' },
];

function ContactCard({ item }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(item.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.a
      href={item.link}
      target={item.link.startsWith('http') ? "_blank" : "_self"}
      rel="noopener noreferrer"
      whileHover={{ y: -6, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      className="group relative flex items-center gap-5 p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-cyan-400/30 hover:bg-white/10 backdrop-blur-xl transition-all duration-500 overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />

      <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 ${item.color.replace('text', 'bg')}/10`}>
        <item.icon className={`w-7 h-7 ${item.color}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono uppercase tracking-[2px] text-slate-400 mb-1">{item.label}</p>
        <p className="text-white font-medium text-[15px] truncate group-hover:text-cyan-100 transition-colors">
          {item.value}
        </p>
      </div>

      <motion.button
        onClick={copyToClipboard}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className="p-3 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all"
      >
        <AnimatePresence mode="wait">
          {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
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
    setFormState(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      setStatus('error');
      setErrorMessage('All fields are required.');
      return;
    }

    setStatus('sending');

    try {
      const confetti = (await import('canvas-confetti')).default;

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        confetti({ particleCount: 180, spread: 80, origin: { y: 0.6 } });
        setStatus('success');
        setFormState({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 6000);
      } else {
        throw new Error(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to send message. Try again.');
      setTimeout(() => setStatus('idle'), 7000);
    }
  };

  return (
    <section id="contact" className="relative py-20 md:py-28 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 text-cyan-400 text-xs font-mono tracking-widest mb-6">
            LET'S CONNECT
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6">
            Get in <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Open to exciting opportunities, collaborations, or just a friendly chat.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* Social Links */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {socialLinks.map((item, index) => (
              <ContactCard key={item.id} item={item} />
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 relative rounded-3xl bg-white/5 border border-white/10 backdrop-blur-3xl p-8 md:p-12 shadow-2xl"
          >
            <div className="absolute -inset-px bg-gradient-to-br from-cyan-400/20 via-transparent to-violet-400/20 rounded-[2.5rem] -z-10" />

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono tracking-widest text-slate-400 mb-2">NAME</label>
                  <input
                    type="text"
                    id="name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    placeholder="Alex Rivera"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono tracking-widest text-slate-400 mb-2">EMAIL</label>
                  <input
                    type="email"
                    id="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    placeholder="you@email.com"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono tracking-widest text-slate-400 mb-2">MESSAGE</label>
                <textarea
                  id="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Hi Harsh, I'd love to discuss a potential collaboration..."
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-3xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 resize-none transition-all"
                />
              </div>

              <motion.button
                type="submit"
                disabled={status === 'sending'}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-lg flex items-center justify-center gap-3 shadow-xl shadow-cyan-500/30 disabled:opacity-70"
              >
                {status === 'sending' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    SENDING...
                  </>
                ) : (
                  <>
                    SEND MESSAGE
                    <Send className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              <AnimatePresence>
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                  >
                    <CheckCircle2 className="w-6 h-6" />
                    Message sent successfully! I'll reply soon.
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm"
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