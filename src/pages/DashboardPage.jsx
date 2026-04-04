import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert, ShieldCheck, User, MapPin, Bike, IndianRupee,
  LogOut, Zap, BadgeCheck, Clock, TrendingUp
} from 'lucide-react';

export default function DashboardPage({ onNavigate }) {
  const [user, setUser] = useState(null);
  const [showSignOut, setShowSignOut] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('shieldride_user');
    if (!stored) {
      onNavigate('signin');
      return;
    }
    setUser(JSON.parse(stored));
  }, [onNavigate]);

  const handleSignOut = () => {
    localStorage.removeItem('shieldride_user');
    onNavigate('signin');
  };

  if (!user) return null;

  const stats = [
    { label: 'Tier', value: user.tier, icon: BadgeCheck, color: 'text-neon-cyan' },
    { label: 'Max Payout / Day', value: `₹${user.maxPayout}`, icon: IndianRupee, color: 'text-green-400' },
    { label: 'Weekly Premium', value: `₹${user.premium}`, icon: TrendingUp, color: 'text-neon-purple' },
    { label: 'Coverage', value: user.coverageActive ? 'Active' : 'Inactive', icon: ShieldCheck, color: user.coverageActive ? 'text-green-400' : 'text-red-400' }
  ];

  const triggers = ['Heavy Rain', 'Cyclone Warning', 'Flood Alert', 'Heatwave', 'Strike / Bandh'];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden" style={{ cursor: 'none' }}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.04) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(123,97,255,0.04) 0%, transparent 70%)' }} />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <ShieldAlert className="w-7 h-7 text-neon-cyan" />
            <span className="font-heading font-bold text-xl tracking-wide">ShieldRide</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 font-mono text-xs tracking-widest uppercase">Coverage Active</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowSignOut(p => !p)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-white/70 hover:text-white hover:border-white/30 transition-all duration-200 font-sans text-sm"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
              </button>

              {showSignOut && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 bg-zinc-900 border border-white/10 rounded-xl shadow-xl overflow-hidden min-w-[160px]"
                >
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors font-sans"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-16 relative z-10">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mb-10"
        >
          <p className="font-mono text-xs tracking-widest uppercase text-white/40 mb-1">Dashboard</p>
          <h1 className="text-3xl md:text-4xl font-heading font-bold">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">{user.name}</span>
          </h1>
          <p className="text-white/50 font-sans text-sm mt-2">Worker ID: <span className="font-mono text-white/70">{user.workerId}</span></p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        >
          {stats.map(({ label, value, icon: Icon, color }, i) => (
            <div key={i} className="glass-card p-5 flex flex-col gap-3">
              <Icon className={`w-5 h-5 ${color}`} />
              <div>
                <p className="text-white/40 font-mono text-xs tracking-widest uppercase">{label}</p>
                <p className={`font-bold font-mono text-lg mt-1 ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Card */}
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
          >
            <h2 className="font-heading font-bold text-lg mb-5 flex items-center gap-2">
              <User className="w-5 h-5 text-neon-cyan" /> Profile Details
            </h2>
            <div className="space-y-4 font-sans text-sm">
              {[
                { icon: User, label: 'Name', value: user.name },
                { icon: MapPin, label: 'City', value: user.city },
                { icon: Bike, label: 'Platform', value: user.platform },
                { icon: IndianRupee, label: 'Weekly Earnings', value: `₹${user.earnings}` }
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-white/5">
                  <div className="flex items-center gap-2 text-white/50">
                    <Icon className="w-4 h-4 text-white/30" /> {label}
                  </div>
                  <span className="text-white font-mono">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Coverage Card */}
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.25, ease: 'easeOut' }}
          >
            <h2 className="font-heading font-bold text-lg mb-5 flex items-center gap-2">
              <Zap className="w-5 h-5 text-neon-purple" /> Your Coverage
            </h2>
            <div className="mb-4">
              <p className="text-white/40 font-mono text-xs tracking-widest uppercase mb-1">Triggers Covered</p>
              <div className="space-y-2 mt-3">
                {triggers.map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm font-sans text-white/70">
                    <ShieldCheck className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-white/40 text-xs font-mono">
                <Clock className="w-3 h-3" />
                <span>Payout time: Instant via UPI</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sign out CTA at bottom on mobile */}
        <motion.div
          className="mt-8 flex justify-center sm:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all duration-200 font-sans text-sm"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </motion.div>
      </main>
    </div>
  );
}
