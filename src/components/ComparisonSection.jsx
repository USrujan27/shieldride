import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function ComparisonSection() {
  const containerRef = useRef(null);
  const [sliderPos, setSliderPos] = useState(50);
  const isMobile = window.innerWidth < 768;

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const percentage = Math.max(0, Math.min(100, (x / width) * 100));
    setSliderPos(percentage);
  };

  const handleTouchMove = (e) => {
    const { left, width } = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - left;
    const percentage = Math.max(0, Math.min(100, (x / width) * 100));
    setSliderPos(percentage);
  };

  return (
    <section className="py-24 relative z-20 max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">The ShieldRide Advantage</h2>
        <p className="text-white/50 font-sans tracking-wide">Slide to see the difference.</p>
      </div>

      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="w-full h-[500px] relative rounded-3xl overflow-hidden cursor-ew-resize group"
      >
        {/* LEFT: Without ShieldRide (Base Layer) */}
        <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center grayscale text-neutral-500">
          <div className="bg-neutral-800 p-8 rounded-2xl text-center shadow-inner">
            <h3 className="text-5xl font-mono mb-2">₹0</h3>
            <p className="text-sm tracking-widest uppercase font-sans">Income during rain</p>
            <div className="mt-8 opacity-50">
              <p>Stuck under a bridge.</p>
              <p>Waiting for orders.</p>
            </div>
          </div>
        </div>

        {/* RIGHT: With ShieldRide (Clipped Overlay) */}
        <div 
          className="absolute inset-0 bg-black flex flex-col items-center justify-center text-white z-10"
          style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
        >
          {/* Neon Glow bg */}
          <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 pointer-events-none" />
          
          <div className="glass-card p-8 rounded-2xl text-center shadow-[0_0_30px_rgba(0,245,255,0.2)] border-neon-cyan">
            <h3 className="text-5xl font-mono mb-2 text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple drop-shadow-[0_0_10px_rgba(0,245,255,0.8)]">
              ₹500
            </h3>
            <p className="text-sm tracking-widest uppercase font-sans text-neon-cyan">Instant Payout</p>
            <div className="mt-8 shadow-sm">
              <p>Paid instantly.</p>
              <p>Family secured.</p>
            </div>
          </div>
        </div>

        {/* Slider Handle */}
        <div 
          className="absolute top-0 bottom-0 w-[2px] bg-white z-20"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            <div className="flex gap-1">
              <div className="w-1 h-3 bg-black rounded-full" />
              <div className="w-1 h-3 bg-black rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
