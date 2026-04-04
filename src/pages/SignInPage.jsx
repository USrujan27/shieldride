import React, { useState } from 'react';
import CustomCursor from '../components/CustomCursor';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Phone, ArrowRight, Loader2 } from 'lucide-react';

export default function SignInPage({ onNavigate }) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    setError('');
    if (!phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }

    const stored = localStorage.getItem('shieldride_user');
    if (!stored) {
      setError('No account found. Please sign up first.');
      return;
    }

    const user = JSON.parse(stored);
    if (user.phone !== phone.trim()) {
      setError('Worker not found. Please sign up.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNavigate('dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden" style={{ cursor: 'none' }}>
      <CustomCursor />
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)' }} />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md mx-auto px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10 justify-center cursor-pointer group" onClick={() => onNavigate('home')}>
          <ShieldAlert className="w-8 h-8 text-neon-cyan" />
          <span className="font-heading font-bold text-2xl tracking-wide text-white">ShieldRide</span>
        </div>

        <div className="glass-card p-8">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Welcome back</h1>
          <p className="text-white/50 font-sans text-sm mb-8">Sign in with your registered phone number.</p>

          {/* Phone field */}
          <div className="mb-6">
            <label className="block text-xs font-mono tracking-widest uppercase text-white/50 mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-cyan/60" />
              <input
                type="tel"
                value={phone}
                onChange={e => { setPhone(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleSignIn()}
                placeholder="e.g. 9876543210"
                className="w-full bg-zinc-800/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white font-mono text-sm placeholder-white/20 focus:outline-none focus:border-neon-cyan/60 transition-colors duration-200"
              />
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                className="text-red-400 text-sm font-sans mb-4 px-1"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit button */}
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold font-sans tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 bg-neon-cyan text-black hover:shadow-[0_0_20px_rgba(0,245,255,0.5)] disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>Sign In <ArrowRight className="w-4 h-4" /></>
            )}
          </button>

          <p className="text-center text-white/40 font-sans text-sm mt-6">
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('signup')}
              className="text-neon-cyan hover:underline transition-colors"
            >
              Sign Up
            </button>
          </p>
        </div>

        <p className="text-center text-white/20 text-xs font-mono mt-6 tracking-widest uppercase">
          ← <button onClick={() => onNavigate('home')} className="hover:text-white/50 transition-colors">Back to Home</button>
        </p>
      </motion.div>
    </div>
  );
}
