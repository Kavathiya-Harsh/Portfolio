import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, ExternalLink, Download } from 'lucide-react';

export default function QRCodeModal({ isOpen, onClose }) {
  const portfolioUrl = import.meta.env.VITE_PORTFOLIO_URL || window.location.href;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(portfolioUrl)}&bgcolor=1e293b&color=ffffff&margin=10`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'portfolio-qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-[#0f172a]/90 border border-slate-700/50 shadow-[0_32px_128px_rgba(0,0,0,0.8)] backdrop-blur-xl p-8"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 mb-4 border border-blue-500/20">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Scan to View on Mobile</h3>
              <p className="text-sm text-slate-400">
                Quickly open my portfolio on your phone or share it with others.
              </p>
            </div>

            {/* QR Code Container */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-slate-900 rounded-xl p-4 border border-white/10">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-full aspect-square rounded-lg shadow-inner"
                  loading="lazy"
                />
              </div>
            </div>

            {/* URL Display */}
            <div className="mt-6 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between gap-3 group cursor-pointer hover:bg-slate-800 transition-colors overflow-hidden">
              <span className="text-xs font-mono text-slate-400 truncate flex-1">
                {portfolioUrl}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
            </div>

            {/* Action Buttons */}
            <div className="mt-8 grid grid-cols-1 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/20 transition-all border border-blue-400/20"
              >
                <Download className="w-4 h-4" />
                <span>Save QR Code</span>
              </motion.button>
            </div>

            {/* Footer Text */}
            <p className="mt-4 text-[10px] text-center text-slate-500 uppercase tracking-widest font-bold">
              Portfolio Navigation
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
