import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../data/profile';

const { photoUrl, initials } = profile;

export function ProfilePhoto({ size = 'lg', className = '', showRing = true }) {
  const [error, setError] = useState(false);

  const sizes = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-16 h-16 text-lg',
    lg: 'w-32 h-32 md:w-40 md:h-40 text-3xl md:text-4xl',
    xl: 'w-48 h-48 md:w-56 md:h-56 text-4xl md:text-5xl',
  };

  const sizeClass = sizes[size] || sizes.lg;

  const inner = (
    <>
      {!error && photoUrl ? (
        <img
          src={photoUrl}
          alt={profile.name}
          className="h-full w-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center font-bold text-white/80 bg-blue-500/30">
          {initials}
        </div>
      )}
    </>
  );

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={`relative shrink-0 ${sizeClass} ${className}`}
    >
      {showRing ? (
        <div className="p-1.5 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#06b6d4] shadow-[0_0_24px_-4px_rgba(59, 130, 246,0.4)] w-full h-full">
          <div className="rounded-full overflow-hidden bg-[#0b1120] w-full h-full">
            {inner}
          </div>
        </div>
      ) : (
        <div className="rounded-full overflow-hidden bg-white/10 border border-white/12 h-full w-full">
          {inner}
        </div>
      )}
    </motion.div>
  );
}

export default ProfilePhoto;
