import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Code2, Copy, Check } from 'lucide-react';

export default function CodeSnippetModal({ snippet, onClose }) {
  const [copied, setCopied] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!snippet) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl border border-slate-700/60 bg-[#0f1729] shadow-2xl shadow-black/40"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/15 border border-blue-500/25">
                <Code2 className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{snippet.title}</h3>
                <span className="text-[10px] font-mono text-slate-500 uppercase">{snippet.language}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-600/50 text-slate-400 hover:text-white hover:border-blue-500/40 transition-all text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Code */}
          <div className="overflow-auto max-h-[60vh] p-5">
            <pre className="text-sm font-mono leading-relaxed text-slate-300 whitespace-pre-wrap">
              <code>{snippet.code}</code>
            </pre>
          </div>

          {/* Footer hint */}
          <div className="px-5 py-3 border-t border-slate-700/50 flex items-center justify-between">
            <span className="text-[10px] text-slate-600 font-mono">Press ESC to close</span>
            <div className="flex gap-1">
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <span className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
