import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Circle } from 'lucide-react';

const fullBio = `{
  "name": "Harsh Kavathiya",
  "role": "Computer Science Student & Developer",
  "college": "Shree Swaminarayan University (codinggita)",
  "education": {
    "10th": "Modi School",
    "12th": "Modi School",
    "current": "B.E CSE — Shree Swaminarayan University"
  },
  "status": "Open to Internships & Projects",
  "techStack": ["React", "Next.js", "JavaScript", "Node.js", "Python"],
  "interests": ["Web Development", "Problem Solving", "Open Source"],
  "location": "Kalol, Gandhinagar, Gujarat",
  "contact": "harsh.kavathiya@example.com"
}`;

export default function TerminalBio() {
  const [text, setText] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullBio.slice(0, i));
      i++;
      if (i > fullBio.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden border border-white/12 bg-black/40 backdrop-blur-xl shadow-2xl font-mono text-sm"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-white/12">
        <div className="flex gap-2">
          <Circle className="w-3 h-3 fill-red-500 text-red-500" />
          <Circle className="w-3 h-3 fill-yellow-500 text-yellow-500" />
          <Circle className="w-3 h-3 fill-green-500 text-green-500" />
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Terminal className="w-4 h-4" />
          <span>developer_bio.json</span>
        </div>
      </div>
      <div className="p-6 text-blue-300">
        <pre className="whitespace-pre-wrap">
          {text}
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-2 h-5 bg-blue-500 ml-1 align-middle"
          />
        </pre>
      </div>
    </motion.div>
  );
}
