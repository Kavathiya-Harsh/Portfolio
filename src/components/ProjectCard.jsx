import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import Github from 'lucide-react/dist/esm/icons/github';
import Code2 from 'lucide-react/dist/esm/icons/code-2';
import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right';
import Gauge from 'lucide-react/dist/esm/icons/gauge';
import FileCode from 'lucide-react/dist/esm/icons/file-code';
import Layers from 'lucide-react/dist/esm/icons/layers';
import Play from 'lucide-react/dist/esm/icons/play';
import X from 'lucide-react/dist/esm/icons/x';
import { transitionSpring, blurScaleIn } from '../utils/motion';
import { useDimensions } from '../hooks/useDimensions';
import CodeSnippetModal from './CodeSnippetModal';

function MetricBadge({ icon: Icon, label, value, color }) {
  const colorMap = {
    green: 'bg-green-500/10 border-green-500/25 text-green-400',
    blue: 'bg-blue-500/10 border-blue-500/25 text-blue-400',
    cyan: 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/25 text-yellow-400',
  };

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-mono ${colorMap[color]}`}>
      <Icon className="w-3 h-3" />
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function PerformanceBadge({ score }) {
  const color = score >= 95 ? 'green' : score >= 85 ? 'yellow' : 'blue';
  const colorClasses = {
    green: 'bg-green-500/10 border-green-500/20 text-green-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  };
  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${colorClasses[color]}`}>
      <div className={`w-2 h-2 rounded-full ${color === 'green' ? 'bg-green-500' : color === 'yellow' ? 'bg-yellow-500' : 'bg-blue-500'} animate-pulse`} />
      <span className="text-[10px] font-mono">Lighthouse: {score}</span>
    </div>
  );
}

export default function ProjectCard({ project, index = 0 }) {
  const [measureRef, dimensions] = useDimensions();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [showCode, setShowCode] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 100, damping: 30 });

  function onMouseMove(e) {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return;
    if (dimensions.width === 0) return;
    
    // Performance: Use cached dimensions to prevent layout thrashing
    const x = (e.clientX - dimensions.left) / dimensions.width - 0.5;
    const y = (e.clientY - dimensions.top) / dimensions.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function onMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const { metrics, codeSnippet, video } = project;

  return (
    <>
      <motion.div
        variants={blurScaleIn}
        className="h-full perspective-1000 will-change-transform"
      >
        <motion.div
          ref={measureRef}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="group relative h-full rounded-2xl border border-slate-700/60 bg-[#111827] overflow-hidden shadow-xl transition-all duration-500 hover:border-blue-500/50 hover:shadow-blue-500/10"
        >
          {/* Spotlight */}
          <motion.div
            className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"
            style={{
              background: useTransform(
                [mouseX, mouseY],
                ([x, y]) => `radial-gradient(400px circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(59, 130, 246, 0.12), transparent 80%)`
              ),
            }}
          />


          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <motion.img
              loading="lazy"
              decoding="async"
              width="600"
              height="400"
              src={project.image || 'https://placehold.co/600x400/111827/3b82f6?text=Project'}
              alt={`${project.title} - ${project.category} Portfolio Project`}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/30 to-transparent" />

            {/* Quick Actions */}
            <div className="absolute bottom-3 right-3 flex gap-2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
              {/* Play Demo Button */}
              {video && (
                <motion.button
                  onClick={() => setShowVideo(true)}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3.5 bg-red-600/90 backdrop-blur-sm rounded-xl text-white hover:bg-red-500 transition-all border border-red-500/50 hover:border-red-400 shadow-lg shadow-red-500/30"
                  title="Watch Demo"
                  aria-label={`Watch demo video for ${project.title}`}
                >
                  <Play className="w-4 h-4 fill-current" />
                </motion.button>
              )}
              {codeSnippet && (
                <motion.button
                  onClick={() => setShowCode(true)}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3.5 bg-slate-800/90 backdrop-blur-sm rounded-xl text-cyan-400 hover:text-cyan-300 hover:bg-slate-700 transition-all border border-slate-600/50 hover:border-cyan-500/50"
                  title="View Logic"
                  aria-label={`View code logic and snippet for project: ${project.title}`}
                >
                  <Code2 className="w-4 h-4" />
                </motion.button>
              )}
              <motion.a
                href={project.github || '#'}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="p-3.5 bg-slate-800/90 backdrop-blur-sm rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 transition-all border border-slate-600/50 hover:border-white/20"
                aria-label={`View ${project.title} source code on GitHub (opens in new tab)`}
                title="View GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </motion.a>
              <motion.a
                href={project.link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2, boxShadow: "0 10px 20px -5px rgba(59,130,246,0.5)" }}
                whileTap={{ scale: 0.9 }}
                className="p-3.5 bg-blue-500 text-white rounded-xl hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/30"
                aria-label={`Visit ${project.title} live website (opens in new tab)`}
                title="Visit Live Site"
              >
                <ArrowUpRight className="w-4 h-4" />
              </motion.a>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-[0.2em]">
                {project.category}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors tracking-tight">
              {project.title}
            </h3>

            <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
              {project.description}
            </p>

            {/* Metrics Bar */}
            {metrics && (
              <div className="flex flex-wrap gap-2 mb-4">
                <MetricBadge icon={FileCode} label="" value={metrics.lines + ' LOC'} color="blue" />
                {metrics.lighthouse && (
                  <MetricBadge
                    icon={Gauge}
                    label=""
                    value={metrics.lighthouse + '/100'}
                    color={metrics.lighthouse >= 95 ? 'green' : 'yellow'}
                  />
                )}
                <MetricBadge
                  icon={Layers}
                  label=""
                  value={metrics.complexity}
                  color={metrics.complexity === 'High' ? 'cyan' : 'blue'}
                />
              </div>
            )}

            {/* Tags */}
            <div className="mt-auto flex flex-wrap gap-1.5">
              {(project.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-[10px] font-medium rounded-md bg-slate-800 border border-slate-700 text-slate-400 group-hover:text-cyan-300 group-hover:border-blue-500/25 transition-all"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Code Snippet Modal */}
      {showCode && codeSnippet && (
        <CodeSnippetModal snippet={codeSnippet} onClose={() => setShowCode(false)} />
      )}

      {/* Video Demo Modal */}
      {showVideo && video && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="relative w-full max-w-3xl rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl shadow-black/60"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0d1117] border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-red-400 fill-current" />
                <span className="text-sm font-semibold text-white">{project.title} — Demo</span>
              </div>
              <button
                onClick={() => setShowVideo(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                aria-label="Close video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video */}
            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
              <iframe
                src={`${video}?autoplay=1&rel=0&modestbranding=1`}
                title={`${project.title} Demo`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
