import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ROLES = [
  'Full Stack Developer',
  'CS Student @ SSU',
  'Web Developer',
  'Problem Solver',
  'Open Source Enthusiast',
];

export default function Typewriter() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = ROLES[roleIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (text.length < current.length) {
            setText(current.slice(0, text.length + 1));
          } else {
            setIsDeleting(true);
          }
        } else {
          if (text.length > 0) {
            setText(text.slice(0, -1));
          } else {
            setIsDeleting(false);
            setRoleIndex((roleIndex + 1) % ROLES.length);
          }
        }
      },
      isDeleting ? 40 : 80
    );
    return () => clearTimeout(timeout);
  }, [text, isDeleting, roleIndex]);

  return (
    <span className="text-[#06b6d4] min-h-[1.5em] inline-block">
      {text}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-0.5 h-5 bg-[#06b6d4] ml-0.5 align-middle"
      />
    </span>
  );
}
