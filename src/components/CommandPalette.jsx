import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Command as CommandIcon, 
  ArrowRight, 
  Mail, 
  FileText, 
  Github, 
  Linkedin, 
  Code, 
  User, 
  Award, 
  Home,
  Copy,
  Check
} from 'lucide-react';
import { profile } from '../data/profile';

const commands = [
  {
    id: 'home',
    title: 'Go to Home',
    description: 'Jump to the top of the page',
    category: 'Navigate',
    icon: Home,
    action: () => (window.location.hash = '#hero'),
  },
  {
    id: 'projects',
    title: 'View Projects',
    description: 'See my latest work and experiments',
    category: 'Navigate',
    icon: Code,
    action: () => (window.location.hash = '#projects'),
  },
  {
    id: 'skills',
    title: 'Technical Skills',
    description: 'Specializations and toolset',
    category: 'Navigate',
    icon: User,
    action: () => (window.location.hash = '#skills'),
  },
  {
    id: 'certificates',
    title: 'Certificates & Awards',
    description: 'Recognitions and achievements',
    category: 'Navigate',
    icon: Award,
    action: () => (window.location.hash = '#certificates'),
  },
  {
    id: 'contact',
    title: 'Contact Me',
    description: 'Get in touch for collaborations',
    category: 'Navigate',
    icon: Mail,
    action: () => (window.location.hash = '#contact'),
  },
  {
    id: 'email',
    title: 'Copy Email Address',
    description: 'harsh.kavathiya.cg@gmail.com',
    category: 'Actions',
    icon: Copy,
    action: (notify) => {
      navigator.clipboard.writeText('harsh.kavathiya.cg@gmail.com');
      notify('Email copied to clipboard!');
    },
  },
  {
    id: 'resume',
    title: 'Download Resume',
    description: 'PDF format',
    category: 'Actions',
    icon: FileText,
    action: () => window.open(profile.resumeUrl, '_blank'),
  },
  {
    id: 'github',
    title: 'GitHub Profile',
    description: 'View my open source contributions',
    category: 'Links',
    icon: Github,
    action: () => window.open('https://github.com/Kavathiya-Harsh', '_blank'),
  },
  {
    id: 'linkedin',
    title: 'LinkedIn',
    description: 'Connect with me professionally',
    category: 'Links',
    icon: Linkedin,
    action: () => window.open('https://www.linkedin.com/in/harshkavathiya', '_blank'),
  },
];

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [notification, setNotification] = useState(null);
  const inputRef = useRef(null);

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const notify = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2000);
  };

  const handleSelect = useCallback((cmd) => {
    cmd.action(notify);
    if (cmd.category === 'Navigate') onClose();
    else if (cmd.id !== 'email') onClose(); // Close for everything except copy which has a toast
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[activeIndex]) {
          handleSelect(filteredCommands[activeIndex]);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, filteredCommands, handleSelect, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-[#0f172a] border border-slate-700/50 shadow-[0_32px_128px_rgba(0,0,0,0.8)]"
          >
            {/* Search Input */}
            <div className="relative flex items-center border-b border-slate-700/50 px-4 py-4">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent text-white outline-none placeholder:text-slate-500 text-lg"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
              />
              <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded border border-slate-700 bg-slate-800/50 text-[10px] font-mono text-slate-400">
                <span className="text-xs">ESC</span>
              </div>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto py-3 px-2 custom-scrollbar">
              {filteredCommands.length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(
                    filteredCommands.reduce((acc, cmd) => {
                      if (!acc[cmd.category]) acc[cmd.category] = [];
                      acc[cmd.category].push(cmd);
                      return acc;
                    }, {})
                  ).map(([category, items]) => (
                    <div key={category} className="px-2">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 px-2">
                        {category}
                      </h3>
                      <div className="space-y-1">
                        {items.map((cmd) => {
                          const index = filteredCommands.indexOf(cmd);
                          const Icon = cmd.icon;
                          return (
                            <button
                              key={cmd.id}
                              onClick={() => handleSelect(cmd)}
                              onMouseEnter={() => setActiveIndex(index)}
                              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group text-left ${
                                activeIndex === index
                                  ? 'bg-blue-500/10 border border-blue-500/20'
                                  : 'border border-transparent'
                              }`}
                            >
                              <div className={`p-2 rounded-lg transition-colors ${
                                activeIndex === index ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-300'
                              }`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className={`text-sm font-semibold truncate ${
                                    activeIndex === index ? 'text-white' : 'text-slate-300 group-hover:text-white'
                                  }`}>
                                    {cmd.title}
                                  </p>
                                  {activeIndex === index && (
                                    <ArrowRight className="w-3.5 h-3.5 text-blue-400 animate-in fade-in slide-in-from-left-2 duration-300" />
                                  )}
                                </div>
                                <p className="text-xs text-slate-500 truncate mt-0.5">
                                  {cmd.description}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500">
                  <CommandIcon className="w-12 h-12 mx-auto mb-4 opacity-10" />
                  <p className="text-sm">No results found for "{query}"</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-700/50 bg-slate-900/50 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4 text-[10px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <span className="px-1 py-0.5 rounded border border-slate-700 bg-slate-800">↑↓</span> to navigate
                </span>
                <span className="flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800 font-mono text-xs">↵</span> to select
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Command Palette
              </div>
            </div>
          </motion.div>

          {/* Toast Notification */}
          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.1 } }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 border border-blue-500/50 text-white shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)]"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm font-semibold">{notification}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
