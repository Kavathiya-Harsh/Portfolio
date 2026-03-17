import React from 'react';
import { motion } from 'framer-motion';
import { Award, Medal, ExternalLink, Calendar, Building2 } from 'lucide-react';
import { certificates, awards } from '../data/certificates';
import { maskReveal, staggerContainer, staggerItem, transitionSpring } from '../utils/motion';

function CertCard({ item, index }) {
  const Wrapper = item.credentialUrl ? motion.a : motion.div;
  const wrapperProps = item.credentialUrl
    ? { href: item.credentialUrl, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mx', `${x}%`);
    e.currentTarget.style.setProperty('--my', `${y}%`);
  };
  const onLeave = (e) => {
    e.currentTarget.style.setProperty('--mx', `50%`);
    e.currentTarget.style.setProperty('--my', `50%`);
  };

  return (
    <Wrapper
      {...wrapperProps}
      variants={staggerItem}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-30px' }}
      transition={{ ...transitionSpring, delay: index * 0.06 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group relative overflow-hidden block rounded-2xl border border-white/12 bg-slate-800/50 backdrop-blur-md p-6 hover:border-slate-600/60 hover:shadow-[0_12px_40px_-12px_rgba(59, 130, 246,0.25)] hover:bg-white/[0.07] transition-all duration-300"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background:
            'radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgba(59, 130, 246,0.18), transparent 60%)',
          mixBlendMode: 'screen',
        }}
      />
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-500/20 border border-slate-600/60 flex items-center justify-center">
          <Award className="w-6 h-6 text-blue-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-200 transition-colors mb-1">
            {item.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              {item.issuer}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {item.date}
            </span>
          </div>
          {item.description && (
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              {item.description}
            </p>
          )}
          {item.credentialUrl && (
            <span className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-blue-400 group-hover:text-blue-300 transition-colors">
              Verify credential
              <ExternalLink className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>
    </Wrapper>
  );
}

function AwardCard({ item, index }) {
  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mx', `${x}%`);
    e.currentTarget.style.setProperty('--my', `${y}%`);
  };
  const onLeave = (e) => {
    e.currentTarget.style.setProperty('--mx', `50%`);
    e.currentTarget.style.setProperty('--my', `50%`);
  };
  return (
    <motion.div
      variants={staggerItem}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-30px' }}
      transition={{ ...transitionSpring, delay: index * 0.06 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group relative overflow-hidden rounded-2xl border border-white/12 bg-slate-800/50 backdrop-blur-md p-6 hover:border-amber-500/30 hover:shadow-[0_12px_40px_-12px_rgba(245,158,11,0.2)] hover:bg-white/[0.07] transition-all duration-300"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background:
            'radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgba(245,158,11,0.18), transparent 60%)',
          mixBlendMode: 'screen',
        }}
      />
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
          <Medal className="w-6 h-6 text-amber-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-white group-hover:text-amber-200/90 transition-colors mb-1">
            {item.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              {item.issuer}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {item.date}
            </span>
          </div>
          {item.description && (
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function CertificatesAwards() {
  return (
    <section id="certificates" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <p className="text-[#06b6d4] font-mono text-sm uppercase tracking-widest mb-2">
            Credentials & recognition
          </p>
          <motion.h2
            variants={maskReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="text-3xl md:text-5xl font-bold text-white mb-4"
          >
            Certificates & Awards
          </motion.h2>
          <p className="text-slate-400 text-lg max-w-2xl">
            Industry certifications and awards that reflect continuous learning and impact.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Certificates */}
          <motion.div
            variants={staggerContainer(0.06, 0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">Certifications</h3>
            </div>
            {certificates.map((item, index) => (
              <CertCard key={item.id} item={item} index={index} />
            ))}
          </motion.div>

          {/* Awards */}
          <motion.div
            variants={staggerContainer(0.06, 0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-6">
              <Medal className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-semibold text-white">Awards & Recognition</h3>
            </div>
            {awards.map((item, index) => (
              <AwardCard key={item.id} item={item} index={index} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
