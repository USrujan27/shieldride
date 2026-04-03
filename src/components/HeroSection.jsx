import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, Zap, ShieldCheck } from 'lucide-react';
import { useCountUp } from '../hooks/useCountUp';
import { getWeather } from '../api/shieldride';

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

const ScrambleText = ({ text }) => {
  const [displayText, setDisplayText] = useState(text);
  
  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(text.split('').map((char, index) => {
        if(index < iteration) {
          return text[index];
        }
        return char === ' ' ? ' ' : LETTERS[Math.floor(Math.random() * LETTERS.length)];
      }).join(''));
      
      if(iteration >= text.length){
        clearInterval(interval);
      }
      iteration += 1/3;
    }, 30);
    
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayText}</span>;
};

const MagneticButton = ({ children }) => {
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
      className="relative px-8 py-4 bg-transparent border-2 border-neon-cyan text-neon-cyan font-bold font-sans tracking-widest uppercase rounded-full overflow-hidden group hover:shadow-[0_0_20px_rgba(0,245,255,0.4)]"
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-purple opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
    </motion.button>
  );
};

export default function HeroSection() {
  const payoutAmount = useCountUp(500, 3);
  const [simStep, setSimStep] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [lightning, setLightning] = useState(0);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const { data } = await getWeather('Bangalore');
        setWeatherData(data);
      } catch (err) {
        console.error('Weather fetch failed in Hero', err);
      }
    };
    
    fetchWeather();
    const weatherInterval = setInterval(fetchWeather, 60000); // 60s polling

    // Lightning effect
    const lightningInterval = setInterval(() => {
      if(Math.random() > 0.7) {
        setLightning(1);
        setTimeout(() => setLightning(0), 100);
        setTimeout(() => setLightning(0.5), 150);
        setTimeout(() => setLightning(0), 250);
      }
    }, 4000);

    // Simulation steps
    setTimeout(() => setSimStep(1), 2000); // Rain detected
    setTimeout(() => { setShowToast(true); setSimStep(2); }, 4000); // Trigger
    setTimeout(() => setSimStep(3), 6000); // Payout
    
    return () => {
      clearInterval(lightningInterval);
      clearInterval(weatherInterval);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Lightning Flash Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 transition-opacity"
        style={{ backgroundColor: 'white', opacity: lightning, mixBlendMode: 'overlay' }}
      />

      {/* Rain Effect */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none" style={{ willChange: "transform" }}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[1px] h-16 bg-gradient-to-b from-transparent to-white rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: -100 }}
            animate={{ top: '120vh' }}
            transition={{
              duration: 0.8 + Math.random() * 0.4,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random()
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-20">
        <div className="space-y-8 flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-zinc-900/90"
            style={{ willChange: 'transform, opacity' }}
          >
            <ShieldCheck className="w-4 h-4 text-neon-cyan" />
            <span className="text-xs font-mono text-white/70 tracking-widest uppercase">System Online</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight">
            <span className="text-white">Rain Stops You.</span><br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">
              <ScrambleText text="We Pay You." />
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/50 max-w-lg font-sans leading-relaxed">
            AI-powered income protection for gig workers. Instant payouts when the city stands still due to extreme weather or events.
          </p>
          
          <div onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
            <MagneticButton>Protect My Income</MagneticButton>
          </div>
        </div>

        {/* Floating HUD Card */}
        <motion.div 
          className="glass-card p-6 border-l-4 border-l-neon-cyan relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
        >
          <h3 className="font-mono text-sm uppercase tracking-widest text-white/50 mb-6 border-b border-white/10 pb-2">Live Monitor [Bangalore]</h3>
          
          <div className="space-y-4 font-mono text-sm">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Weather Condition</span>
              <span className="text-neon-cyan">{weatherData ? weatherData.condition : 'Loading...'} {weatherData?.condition === 'Rain' ? '🌧️' : ''}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Temperature</span>
              <span className="text-neon-purple">{weatherData ? `${weatherData.temp}°C` : 'Loading...'} 🌡️</span>
            </div>
            
            <div className="h-[1px] bg-white/10 my-4" />

            {/* Simulation States */}
            <div className="space-y-3">
              <div className={`flex items-center gap-3 transition-opacity duration-300 ${simStep >= 1 ? 'opacity-100' : 'opacity-30'}`}>
                <CloudRain className="w-5 h-5 text-neon-cyan" />
                <span>Step 1: Rain Detected</span>
              </div>
              <div className={`flex items-center gap-3 transition-opacity duration-300 ${simStep >= 2 ? 'opacity-100' : 'opacity-30'}`}>
                <Zap className="w-5 h-5 text-neon-purple" />
                <span>Step 2: Trigger Activated</span>
              </div>
              <div className={`flex items-center gap-3 transition-opacity duration-300 ${simStep >= 3 ? 'opacity-100' : 'opacity-30'}`}>
                <ShieldCheck className="w-5 h-5 text-green-400" />
                <span>
                  Step 3: Payout ₹{simStep >= 3 ? payoutAmount : 0}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-zinc-900 border border-neon-cyan/50 px-6 py-3 rounded-full flex items-center gap-3 z-50 shadow-[0_0_20px_rgba(0,245,255,0.2)]"
            style={{ willChange: 'transform, opacity', transform: 'translateZ(0) translateX(-50%)' }}
          >
            <CloudRain className="text-neon-cyan w-5 h-5" />
            <span className="font-mono text-sm">Rain detected in Bangalore</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
