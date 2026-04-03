import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const MagneticButton = ({ children, isHighlighted }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative w-full py-4 font-bold font-sans tracking-widest uppercase rounded-xl overflow-hidden group transition-all duration-300 ${
        isHighlighted 
          ? 'bg-neon-cyan text-black shadow-[0_0_20px_rgba(0,245,255,0.4)]' 
          : 'bg-transparent border border-white/20 text-white hover:border-white'
      }`}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-200 pointer-events-none" />
    </motion.button>
  );
};

const plans = [
  { name: "Basic Shield", price: 29, maxPayout: 300, highlighted: false },
  { name: "Standard Shield", price: 59, maxPayout: 500, highlighted: true },
  { name: "Pro Shield", price: 99, maxPayout: 800, highlighted: false }
];

export default function PricingSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
  };

  return (
    <section id="pricing" className="py-24 relative z-20 max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">Transparent Pricing</h2>
        <p className="text-white/50 font-sans tracking-wide">Pay weekly. Cancel anytime.</p>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            whileHover={{ scale: 1.05 }}
            className={`glass-card p-8 relative overflow-hidden group transition-all duration-300 ${
              plan.highlighted 
                ? 'border-neon-cyan shadow-[0_0_30px_rgba(0,245,255,0.15)] transform md:-translate-y-4 bg-white/5' 
                : 'hover:border-white/30 hover:bg-white/5'
            }`}
          >
            {/* Shimmer sweep animation for highlighted card */}
            {plan.highlighted && (
              <motion.div 
                className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20"
                animate={{ left: ['-100%', '200%'] }}
                transition={{ duration: 2, ease: "linear", repeat: Infinity, repeatDelay: 3 }}
              />
            )}

            {plan.highlighted && (
              <div className="absolute top-0 right-0 bg-neon-cyan text-black font-bold font-sans text-[10px] tracking-widest uppercase px-3 py-1 rounded-bl-lg">
                Most Popular
              </div>
            )}

            <div className="relative z-10">
              <h3 className="text-xl font-heading font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-mono font-bold text-neon-cyan">₹{plan.price}</span>
                <span className="text-white/50 font-mono text-sm">/week</span>
              </div>
              
              <div className="space-y-4 mb-8 font-sans text-sm pb-8 border-b border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Max Payout/Day:</span>
                  <span className="font-mono font-bold text-white">₹{plan.maxPayout}</span>
                </div>
                <div className="flex justify-between items-center text-white/50">
                  <span>Triggers Covered:</span>
                  <span>All 5</span>
                </div>
                <div className="flex justify-between items-center text-white/50">
                  <span>Payout Time:</span>
                  <span>Instant (UPI)</span>
                </div>
              </div>

              <div onClick={() => document.getElementById('risk-calculator')?.scrollIntoView({ behavior: 'smooth' })}>
                <MagneticButton isHighlighted={plan.highlighted}>
                  Activate Coverage
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
