import React from 'react';

export default function FloatingPill() {
  return (
    <div className="fixed bottom-6 right-6 z-50 glass-card px-4 py-2 flex items-center gap-2 rounded-full border-neon-cyan/30 bg-black/50 shadow-[0_0_15px_rgba(0,245,255,0.1)]">
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      <span className="font-mono text-[10px] uppercase tracking-widest text-white/70">
        System Live · 6 Cities
      </span>
    </div>
  );
}
