import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, User } from 'lucide-react';

export default function Navbar({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Check auth state
    setIsLoggedIn(!!localStorage.getItem('shieldride_user'));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-black/50 backdrop-blur-lg border-b border-white/10 shadow-[0_4px_30px_rgba(0,245,255,0.1)] py-4' 
          : 'bg-transparent py-6'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onNavigate?.('home')}
        >
          <ShieldAlert className="w-8 h-8 text-neon-cyan group-hover:text-neon-purple transition-colors duration-300" />
          <span className="font-heading font-bold text-2xl tracking-wide text-white group-hover:neon-text-cyan transition-all duration-300">
            ShieldRide
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-sans tracking-widest uppercase">
          {['Home', 'Features', 'Pricing', 'Demo'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-white/70 hover:text-white hover:neon-text-cyan transition-all duration-300 relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-neon-cyan group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <button
              onClick={() => onNavigate?.('dashboard')}
              className="flex items-center gap-2 px-6 py-2 rounded-full font-sans text-sm font-bold tracking-wide border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black hover:shadow-[0_0_15px_rgba(0,245,255,0.6)] transition-all duration-300"
            >
              <User className="w-4 h-4" />
              Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => onNavigate?.('signin')}
                className="px-6 py-2 rounded-full font-sans text-sm font-bold tracking-wide border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black hover:shadow-[0_0_15px_rgba(0,245,255,0.6)] transition-all duration-300"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate?.('signup')}
                className="hidden sm:block px-6 py-2 rounded-full font-sans text-sm font-bold tracking-wide bg-neon-cyan text-black hover:shadow-[0_0_15px_rgba(0,245,255,0.6)] transition-all duration-300"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
