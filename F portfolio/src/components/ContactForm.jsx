import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { maskReveal } from '../utils/motion';

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.h2
          variants={maskReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="text-3xl md:text-4xl font-bold text-white mb-4"
        >
          Get in Touch
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-slate-400 mb-10"
        >
          Have a project in mind or want to chat? Drop a message.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          onSubmit={handleSubmit}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            e.currentTarget.style.setProperty('--mx', `${x}%`);
            e.currentTarget.style.setProperty('--my', `${y}%`);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.setProperty('--mx', `50%`);
            e.currentTarget.style.setProperty('--my', `50%`);
          }}
          className="relative group overflow-hidden rounded-2xl border border-white/12 bg-slate-800/50 backdrop-blur-md p-6 md:p-8"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background:
                'radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(59, 130, 246,0.14), transparent 60%)',
              mixBlendMode: 'screen',
            }}
          />
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <label className="block">
              <span className="text-slate-400 text-sm mb-2 block">Name</span>
              <input
                type="text"
                required
                className="w-full rounded-lg border border-white/12 bg-slate-800/50 px-4 py-3 text-white placeholder-gray-500 focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                placeholder="Your name"
              />
            </label>
            <label className="block">
              <span className="text-slate-400 text-sm mb-2 block">Email</span>
              <input
                type="email"
                required
                className="w-full rounded-lg border border-white/12 bg-slate-800/50 px-4 py-3 text-white placeholder-gray-500 focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                placeholder="you@example.com"
              />
            </label>
          </div>
          <label className="block mb-4">
            <span className="text-slate-400 text-sm mb-2 block">Message</span>
            <textarea
              required
              rows={5}
              className="w-full rounded-lg border border-white/12 bg-slate-800/50 px-4 py-3 text-white placeholder-gray-500 focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] resize-none"
              placeholder="Tell me about your project..."
            />
          </label>
          <motion.button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-[#3b82f6] hover:bg-blue-500 shadow-lg shadow-blue-500/25 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {sent ? 'Message sent!' : 'Send message'}
            {!sent && <Send className="w-4 h-4" />}
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
