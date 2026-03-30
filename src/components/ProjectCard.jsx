import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ExternalLink, Github, Code2, Star, ArrowUpRight, Gauge, FileCode, Layers } from 'lucide-react';
import { transitionSpring, blurScaleIn } from '../utils/motion';
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
      <span className="text-slate-500">{label}</span>
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
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [showCode, setShowCode] = useState(false);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 100, damping: 30 });

  function onMouseMove(e) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function onMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const { metrics, codeSnippet } = project;

  return (
    <>
      <motion.div
        variants={blurScaleIn}
        className="h-full perspective-1000 will-change-transform"
      >
        <motion.div
          ref={cardRef}
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

          {/* Featured Badge */}
          {project.featured && (
            <div className="absolute top-4 left-4 z-20">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-blue-500/30">
                <Star className="w-3 h-3 fill-current" />
                Featured
              </div>
            </div>
          )}

          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <motion.img
              src={project.image || 'https://placehold.co/600x400/111827/3b82f6?text=Project'}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/30 to-transparent" />

            {/* Quick Actions */}
            <div className="absolute bottom-3 right-3 flex gap-2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
              {codeSnippet && (
                <button
                  onClick={() => setShowCode(true)}
                  className="p-2.5 bg-slate-800/90 backdrop-blur-sm rounded-xl text-cyan-400 hover:text-cyan-300 hover:bg-slate-700 transition-all border border-slate-600/50"
                  title="View Logic"
                >
                  <Code2 className="w-4 h-4" />
                </button>
              )}
              <a
                href={project.github || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-slate-800/90 backdrop-blur-sm rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 transition-all border border-slate-600/50"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={project.link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/30"
              >
                <ArrowUpRight className="w-4 h-4" />
              </a>
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
    </>
  );
}
