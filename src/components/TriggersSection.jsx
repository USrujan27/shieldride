import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const triggers = [
  { icon: '🌧️', title: 'Heavy Rain', condition: 'Rainfall > 25mm/hr' },
  { icon: '🌊', title: 'Flood Alert', condition: 'Level 2+ warning' },
  { icon: '🌡️', title: 'Extreme Heat', condition: 'Temp > 44°C' },
  { icon: '💨', title: 'Severe Pollution', condition: 'AQI > 400' },
  { icon: '🚫', title: 'Civic Disruption', condition: 'Curfew/bandh declared' },
];

export default function TriggersSection() {
  const [activePopup, setActivePopup] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
  };

  const handleCardClick = (index, e) => {
    setActivePopup(index);
    setTimeout(() => {
      setActivePopup(null);
    }, 2000);
  };

  return (
    <section id="features" className="py-32 relative z-20 max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">Coverage Triggers</h2>
        <p className="text-white/50 font-sans tracking-wide">Automated tracking. Zero paperwork.</p>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {triggers.map((trigger, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.05, transition: { duration: 0.2, ease: "easeOut" } }}
            onClick={(e) => handleCardClick(index, e)}
            className="glass-card p-6 flex flex-col items-center justify-center text-center cursor-pointer relative group hover:border-neon-cyan hover:shadow-[0_0_20px_rgba(0,245,255,0.2)] transition-colors duration-200"
          >
            {/* Hover Glow Background */}
            <div className="absolute inset-0 bg-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-[inherit]" />
            
            <div className="text-5xl mb-4 relative z-10">{trigger.icon}</div>
            <h3 className="font-heading font-bold text-lg mb-2 relative z-10">{trigger.title}</h3>
            <p className="font-mono text-xs text-neon-cyan relative z-10">{trigger.condition}</p>

            {/* Click Ripple / Popup Event */}
            <AnimatePresence>
              {activePopup === index && (
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 1, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute inset-0 bg-neon-cyan/30 rounded-2xl z-0 pointer-events-none"
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {activePopup === index && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: -40, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute pointer-events-none bg-zinc-900 border border-neon-cyan px-3 py-2 rounded text-xs font-mono text-white whitespace-nowrap z-20 shadow-[0_0_15px_rgba(0,245,255,0.4)]"
                  style={{ willChange: 'transform, opacity' }}
                >
                  Trigger Activated → ₹500
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
