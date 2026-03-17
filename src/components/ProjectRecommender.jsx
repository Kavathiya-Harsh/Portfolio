import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Monitor, Server, Brain, ArrowRight, RotateCcw } from 'lucide-react';

const questions = [
  {
    id: 'interest',
    question: 'What kind of work are you looking for?',
    options: [
      { label: 'Frontend & UI', value: 'frontend', icon: Monitor, color: 'blue' },
      { label: 'Backend & APIs', value: 'backend', icon: Server, color: 'cyan' },
      { label: 'Logic & Algorithms', value: 'logic', icon: Brain, color: 'green' },
    ],
  },
];

const colorMap = {
  blue: { bg: 'bg-blue-500/15', border: 'border-blue-500/40', text: 'text-blue-400', activeBg: 'bg-blue-500/25' },
  cyan: { bg: 'bg-cyan-500/15', border: 'border-cyan-500/40', text: 'text-cyan-400', activeBg: 'bg-cyan-500/25' },
  green: { bg: 'bg-green-500/15', border: 'border-green-500/40', text: 'text-green-400', activeBg: 'bg-green-500/25' },
};

export default function ProjectRecommender({ onFilter }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSelect = (value) => {
    setSelected(value);
    onFilter(value);
    setTimeout(() => setIsOpen(false), 600);
  };

  const handleReset = () => {
    setSelected(null);
    onFilter('all');
  };

  return (
    <div className="mb-8">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="trigger"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-800/80 border border-slate-700/60 hover:border-blue-500/40 transition-all duration-300"
          >
            <Sparkles className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
              {selected ? `Showing: ${selected.charAt(0).toUpperCase() + selected.slice(1)} projects` : 'Find the right project for you'}
            </span>
            {selected && (
              <button
                onClick={(e) => { e.stopPropagation(); handleReset(); }}
                className="ml-2 p-1 rounded-md hover:bg-slate-700 text-slate-500 hover:text-white transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.button>
        ) : (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="rounded-2xl border border-slate-700/60 bg-[#111827] p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">Project Finder</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-slate-500 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>

            <p className="text-slate-400 text-sm mb-6">{questions[0].question}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {questions[0].options.map((opt) => {
                const Icon = opt.icon;
                const c = colorMap[opt.color];
                const isActive = selected === opt.value;
                return (
                  <motion.button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex flex-col items-center gap-3 p-5 rounded-xl border transition-all duration-300 ${
                      isActive
                        ? `${c.activeBg} ${c.border} shadow-lg`
                        : `bg-slate-800/50 border-slate-700/50 hover:${c.border}`
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${c.bg} ${c.border} border`}>
                      <Icon className={`w-5 h-5 ${c.text}`} />
                    </div>
                    <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-400'}`}>
                      {opt.label}
                    </span>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`text-[10px] font-mono ${c.text}`}
                      >
                        ✓ Selected
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
