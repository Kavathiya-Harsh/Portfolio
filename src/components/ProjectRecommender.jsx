import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Monitor, Server, Brain, ArrowRight, RotateCcw, Target } from 'lucide-react';

const questions = [
  {
    id: 'interest',
    question: 'What are you interested in exploring?',
    options: [
      {
        label: 'Frontend & UI/UX',
        value: 'frontend',
        icon: Monitor,
        color: 'blue',
        desc: 'Beautiful interfaces & smooth experiences'
      },
      {
        label: 'Backend & APIs',
        value: 'backend',
        icon: Server,
        color: 'cyan',
        desc: 'Systems, data & performance'
      },
      {
        label: 'Algorithms & Logic',
        value: 'logic',
        icon: Brain,
        color: 'violet',
        desc: 'Problem solving & optimization'
      },
    ],
  },
];

const colorMap = {
  blue: { bg: 'from-blue-500/10 to-cyan-500/10', accent: 'blue', text: 'text-blue-400' },
  cyan: { bg: 'from-cyan-500/10 to-blue-500/10', accent: 'cyan', text: 'text-cyan-400' },
  violet: { bg: 'from-violet-500/10 to-fuchsia-500/10', accent: 'violet', text: 'text-violet-400' },
};

export default function ProjectRecommender({ onFilter }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSelect = (value) => {
    setSelected(value);
    onFilter(value);
    setTimeout(() => setIsOpen(false), 700);
  };

  const handleReset = (e) => {
    e.stopPropagation();
    setSelected(null);
    onFilter('all');
  };

  return (
    <div className="mb-12">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="trigger"
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group w-full sm:w-auto flex items-center justify-between sm:justify-start gap-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 hover:border-cyan-400/50 transition-all duration-500 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-400/20">
                <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-white">Smart Project Finder</div>
                <div className="text-xs text-slate-400">
                  {selected
                    ? `Showing ${selected} projects`
                    : "Discover projects matching your interest"}
                </div>
              </div>
            </div>

            {selected && (
              <motion.button
                onClick={handleReset}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
              >
                <RotateCcw className="w-4 h-4" />
              </motion.button>
            )}
          </motion.button>
        ) : (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="rounded-3xl border border-slate-700/70 bg-[#0a0f1c] p-8 md:p-10 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6 text-cyan-400" />
                <div>
                  <h3 className="text-xl font-bold text-white">Project Recommender</h3>
                  <p className="text-slate-400 text-sm">Tell me what excites you</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>

            <p className="text-slate-300 text-lg leading-relaxed mb-10">
              {questions[0].question}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {questions[0].options.map((opt) => {
                const Icon = opt.icon;
                const c = colorMap[opt.color];
                const isActive = selected === opt.value;

                return (
                  <motion.button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={`group relative h-full p-8 rounded-2xl border transition-all duration-500 flex flex-col items-center text-center overflow-hidden
                      ${isActive
                        ? `border-${c.accent}-400 bg-gradient-to-br ${c.bg} shadow-xl shadow-${c.accent}-500/20`
                        : 'border-slate-700/70 hover:border-slate-600 bg-slate-900/50'
                      }`}
                  >
                    {/* Background Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${c.bg} opacity-50 group-hover:opacity-80 transition-opacity`} />

                    <div className={`relative p-5 rounded-2xl mb-6 transition-transform group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>
                      <Icon className={`w-10 h-10 ${c.text}`} />
                    </div>

                    <div className="relative z-10">
                      <div className={`text-xl font-semibold mb-2 ${isActive ? 'text-white' : 'text-slate-200'}`}>
                        {opt.label}
                      </div>
                      <p className="text-sm text-slate-400 leading-snug">{opt.desc}</p>
                    </div>

                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4 bg-emerald-400 text-emerald-950 text-[10px] font-mono px-2.5 py-1 rounded-full"
                      >
                        SELECTED
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className="text-center mt-8 text-xs text-slate-500">
              Your selection will filter the projects below
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}