import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const steps = [
  { title: "Sign Up", desc: "Link your delivery account (Swiggy, Zomato, Porter)." },
  { title: "Activate Plan", desc: "Choose coverage based on your active zones." },
  { title: "Trigger Detected", desc: "Our AI monitors weather, AQI, and civic alerts 24/7." },
  { title: "Instant Payout", desc: "Money hits your UPI before the rain stops. Zero claims." }
];

export default function HowItWorks() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="py-24 relative z-20 max-w-5xl mx-auto px-6" ref={containerRef}>
      <div className="text-center mb-24">
        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">How ShieldRide Works</h2>
        <p className="text-white/50 font-sans tracking-wide">Four steps to absolute peace of mind.</p>
      </div>

      <div className="relative">
        {/* Draw Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/10 transform md:-translate-x-1/2" />
        <motion.div 
          className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-neon-cyan transform md:-translate-x-1/2 shadow-[0_0_15px_rgba(0,245,255,0.6)] origin-top"
          style={{ scaleY: lineHeight }}
        />

        <div className="space-y-24 relative">
          {steps.map((step, i) => (
            <div key={i} className={`flex items-center gap-8 md:gap-16 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}>
              
              {/* Invisible spacer for desktop layout */}
              <div className="hidden md:block md:w-1/2" />
              
              {/* Node indicator */}
              <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-black border-2 border-white/20 z-10 transition-all duration-300">
                <motion.div
                  className="w-full h-full rounded-full bg-neon-cyan"
                  style={{ opacity: useTransform(scrollYProgress, v => v > (i * 0.25) ? 1 : 0) }}
                />
              </div>

              {/* Content Card */}
              <motion.div 
                className="ml-8 md:ml-0 md:w-1/2 glass-card p-6"
                initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="text-neon-cyan font-mono text-sm mb-2 opacity-70">Step 0{i+1}</div>
                <h3 className="font-heading font-bold text-2xl mb-2">{step.title}</h3>
                <p className="font-sans text-white/50">{step.desc}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
