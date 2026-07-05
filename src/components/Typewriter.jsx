import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const ROLES = [
  'Full Stack Developer',
  'System Design Enthusiast',
  'Problem Solver',
];

const TYPING_SPEED = 70;
const DELETING_SPEED = 35;
const PAUSE_AFTER_TYPED = 2000;
const PAUSE_AFTER_DELETED = 400;

export default function Typewriter() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState('');
  const [phase, setPhase] = useState('typing'); // typing | pausing | deleting | waiting

  useEffect(() => {
    const current = ROLES[roleIndex];
    let timeout;

    switch (phase) {
      case 'typing':
        if (text.length < current.length) {
          timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), TYPING_SPEED);
        } else {
          timeout = setTimeout(() => setPhase('pausing'), 0);
        }
        break;

      case 'pausing':
        timeout = setTimeout(() => setPhase('deleting'), PAUSE_AFTER_TYPED);
        break;

      case 'deleting':
        if (text.length > 0) {
          timeout = setTimeout(() => setText(text.slice(0, -1)), DELETING_SPEED);
        } else {
          timeout = setTimeout(() => setPhase('waiting'), 0);
        }
        break;

      case 'waiting':
        timeout = setTimeout(() => {
          setRoleIndex((prev) => (prev + 1) % ROLES.length);
          setPhase('typing');
        }, PAUSE_AFTER_DELETED);
        break;
    }

    return () => clearTimeout(timeout);
  }, [text, phase, roleIndex]);

  return (
    <span className="text-cyan-400 min-h-[1.5em] inline-flex items-center font-mono">
      <span className="tracking-wide">{text}</span>
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 0.7, ease: 'easeInOut' }}
        className="inline-block w-[2px] h-[1.1em] bg-cyan-400 ml-1 rounded-full"
      />
    </span>
  );
}
