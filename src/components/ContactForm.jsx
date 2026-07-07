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
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.a
      href={item.link}
      target={item.link.startsWith('http') ? "_blank" : "_self"}
      rel="noopener noreferrer"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 backdrop-blur-2xl transition-all duration-500"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

      <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border border-white/10 bg-white/5 group-hover:bg-white/10 transition-colors`}>
        <item.icon className={`w-5 h-5 ${item.color}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono uppercase tracking-[3px] text-slate-400 mb-1">{item.label}</p>
        <p className="text-white font-medium text-[15px] group-hover:text-cyan-100 transition-colors">{item.value}</p>
      </div>

      <motion.button
        onClick={copyToClipboard}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className="p-3 rounded-2xl hover:bg-white/10 text-slate-400 hover:text-white transition-all"
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
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormState(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      setStatus('error');
      setErrorMessage('All fields are required.');
      return;
    }
    if (!validateEmail(formState.email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (formState.message.length < 15) {
      setStatus('error');
      setErrorMessage('Message should be more detailed (min 15 characters).');
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
        confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
        setStatus('success');
        setFormState({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 6000);
      } else {
        throw new Error(data.error || 'Failed to send.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Try again.');
      setTimeout(() => setStatus('idle'), 7000);
    }
  };

  return (
    <section id="contact" className="relative py-28 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Modern Header */}
        <div className="text-center mb-14">
          <div className="inline-block px-6 py-2.5 rounded-2xl bg-white/5 border border-cyan-400/20 text-cyan-400 text-sm font-mono tracking-widest mb-6">
            AVAILABLE FOR OPPORTUNITIES
          </div>
          <h2 className="text-6xl md:text-[4.5rem] font-bold tracking-tighter text-white mb-6">
            Let's create <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">something great</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-lg mx-auto">
            Whether it's a project, collaboration, or just a conversation — I'm all ears.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Social Links */}
          <div className="lg:col-span-5 space-y-5">
            {socialLinks.map(item => (
              <ContactCard key={item.id} item={item} />
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative bg-white/5 border border-white/10 backdrop-blur-3xl rounded-3xl p-7 md:p-10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-500/5 to-transparent rounded-3xl -z-10" />

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono tracking-widest text-slate-400 mb-2">NAME</label>
                    <input
                      type="text"
                      id="name"
                      value={formState.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono tracking-widest text-slate-400 mb-2">EMAIL</label>
                    <input
                      type="email"
                      id="email"
                      value={formState.email}
                      onChange={handleChange}
                      placeholder="you@email.com"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono tracking-widest text-slate-400 mb-2">MESSAGE</label>
                  <textarea
                    id="message"
                    value={formState.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell me about your project or idea..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 resize-none min-h-[140px] transition-all"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={status === 'sending'}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-base flex items-center justify-center gap-3 disabled:opacity-70 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
                >
                  {status === 'sending' ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      SENDING...
                    </>
                  ) : (
                    <>
                      SEND MESSAGE
                      <Send className="w-6 h-6" />
                    </>
                  )}
                </motion.button>

                <AnimatePresence>
                  {status === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-4 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-400"
                    >
                      <CheckCircle2 className="w-6 h-6 mt-0.5" />
                      Message received! I'll reply soon.
                    </motion.div>
                  )}

                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400"
                    >
                      {errorMessage}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}