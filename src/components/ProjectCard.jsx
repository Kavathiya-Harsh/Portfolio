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
import { useDimensions } from '../hooks/useDimensions';
import CodeSnippetModal from './CodeSnippetModal';

function MetricBadge({ icon: Icon, label, value, color = 'cyan' }) {
  const colors = {
    green: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    blue: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    cyan: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    yellow: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
  };

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-xl border ${colors[color] || colors.cyan}`}>
      <Icon className="w-3.5 h-3.5" />
      {label && <span className="text-slate-400">{label}</span>}
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}

const ProjectCard = React.forwardRef(({ project, index = 0 }, ref) => {
  const [measureRef, dimensions] = useDimensions();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [showCode, setShowCode] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 120, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 120, damping: 25 });

  const handleMouseMove = (e) => {
    if (!dimensions.width) return;
    const x = (e.clientX - dimensions.left) / dimensions.width - 0.5;
    const y = (e.clientY - dimensions.top) / dimensions.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const { metrics, codeSnippet, video } = project;

  return (
    <>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08 }}
        className="h-full perspective-[1200px]"
      >
        <motion.div
          ref={measureRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d"
          }}
          className="group relative h-full rounded-3xl border border-white/10 bg-[#0a0f1c] overflow-hidden shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500"
        >
          {/* Dynamic Spotlight Overlay */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10"
            style={{
              background: useTransform(
                [mouseX, mouseY],
                ([x, y]) => `radial-gradient(600px circle at ${50 + x * 40}% ${50 + y * 40}%, rgba(103,232,249,0.18), transparent 70%)`
              ),
            }}
          />

          {/* Project Image */}
          <div className="relative h-56 overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0f1c]/60 to-[#0a0f1c]" />

            {/* Floating Action Buttons */}
            <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-20">
              {video && (
                <motion.button
                  onClick={() => setShowVideo(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3.5 bg-red-600 hover:bg-red-500 rounded-2xl text-white shadow-lg shadow-red-500/40 transition-all"
                >
                  <Play className="w-4 h-4" />
                </motion.button>
              )}

              {codeSnippet && (
                <motion.button
                  onClick={() => setShowCode(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-2xl border border-cyan-400/20 hover:border-cyan-400/50 transition-all"
                >
                  <Code2 className="w-4 h-4" />
                </motion.button>
              )}

              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3.5 bg-slate-800 hover:bg-slate-700 rounded-2xl text-slate-300 hover:text-white transition-all"
              >
                <Github className="w-4 h-4" />
              </motion.a>

              <motion.a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl hover:brightness-110 transition-all shadow-lg"
              >
                <ArrowUpRight className="w-4 h-4" />
              </motion.a>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-center justify-between mb-3">
              <span className="uppercase font-mono text-[10px] tracking-[2px] text-cyan-400">{project.category}</span>
              {metrics?.lighthouse && <PerformanceBadge score={metrics.lighthouse} />}
            </div>

            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors tracking-tight">
              {project.title}
            </h3>

            <p className="text-slate-400 text-[15px] leading-relaxed mb-6 line-clamp-3">
              {project.description}
            </p>

            {/* Metrics */}
            {metrics && (
              <div className="flex flex-wrap gap-2 mb-6">
                <MetricBadge icon={FileCode} value={metrics.lines + " LOC"} color="blue" />
                {metrics.lighthouse && (
                  <MetricBadge icon={Gauge} value={metrics.lighthouse + "%"} color="green" />
                )}
                <MetricBadge icon={Layers} value={metrics.complexity} color="cyan" />
              </div>
            )}

            {/* Tags */}
            <div className="mt-auto flex flex-wrap gap-2">
              {(project.tags || []).map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-cyan-300 hover:border-cyan-400/30 transition-all"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Modals */}
      {showCode && codeSnippet && (
        <CodeSnippetModal snippet={codeSnippet} onClose={() => setShowCode(false)} />
      )}

      {showVideo && video && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setShowVideo(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-4xl rounded-3xl overflow-hidden border border-slate-700 shadow-2xl"
          >
            <div className="bg-[#0d1117] px-5 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3 text-white">
                <Play className="text-red-500" />
                <span>{project.title} — Live Demo</span>
              </div>
              <button onClick={() => setShowVideo(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative pt-[56.25%] bg-black">
              <iframe
                src={`${video}?autoplay=1&modestbranding=1&rel=0`}
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
});

ProjectCard.displayName = 'ProjectCard';

function PerformanceBadge({ score }) {
  const isHigh = score >= 95;
  return (
    <div className={`px-3 py-1 text-xs font-mono rounded-full border flex items-center gap-1.5 ${isHigh ? 'border-emerald-500/30 text-emerald-400' : 'border-yellow-500/30 text-yellow-400'}`}>
      <div className={`w-2 h-2 rounded-full ${isHigh ? 'bg-emerald-400' : 'bg-yellow-400'} animate-pulse`} />
      {score}
    </div>
  );
}

export default ProjectCard;