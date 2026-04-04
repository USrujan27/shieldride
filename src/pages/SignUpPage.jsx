import React, { useState } from 'react';
import CustomCursor from '../components/CustomCursor';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, User, Phone, MapPin, Bike, IndianRupee, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

const CITIES = ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'];
const PLATFORMS = ['Swiggy', 'Zomato', 'Ola', 'Uber', 'Blinkit', 'Dunzo', 'Other'];

export default function SignUpPage({ onNavigate }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    platform: '',
    earnings: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSignUp = () => {
    setError('');
    const { name, phone, city, platform, earnings } = formData;
    if (!name.trim() || !phone.trim() || !city || !platform || !earnings.trim()) {
      setError('Please fill all fields.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const userData = {
        name: name.trim(),
        phone: phone.trim(),
        city,
        platform,
        earnings: earnings.trim(),
        workerId: 'SR' + Date.now(),
        tier: 'Standard Shield',
        premium: 59,
        maxPayout: 500,
        coverageActive: true
      };
      localStorage.setItem('shieldride_user', JSON.stringify(userData));
      setLoading(false);
      setSuccess(true);
      setTimeout(() => onNavigate('dashboard'), 1000);
    }, 1000);
  };

  const fields = [
    { key: 'name', label: 'Full Name', placeholder: 'e.g. Rajan Kumar', type: 'text', icon: User },
    { key: 'phone', label: 'Phone Number', placeholder: 'e.g. 9876543210', type: 'tel', icon: Phone },
    { key: 'earnings', label: 'Weekly Earnings (₹)', placeholder: 'e.g. 4000', type: 'number', icon: IndianRupee }
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden py-16" style={{ cursor: 'none' }}>
      <CustomCursor />
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(123,97,255,0.06) 0%, transparent 70%)' }} />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md mx-auto px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10 justify-center cursor-pointer" onClick={() => onNavigate('home')}>
          <ShieldAlert className="w-8 h-8 text-neon-cyan" />
          <span className="font-heading font-bold text-2xl tracking-wide text-white">ShieldRide</span>
        </div>

        <div className="glass-card p-8">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Create account</h1>
          <p className="text-white/50 font-sans text-sm mb-8">Join thousands of gig workers protected by ShieldRide.</p>

          <div className="space-y-5">
            {/* Text / number inputs */}
            {fields.map(({ key, label, placeholder, type, icon: Icon }) => (
              <div key={key}>
                <label className="block text-xs font-mono tracking-widest uppercase text-white/50 mb-2">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-cyan/60" />
                  <input
                    type={type}
                    value={formData[key]}
                    onChange={e => update(key, e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-zinc-800/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white font-mono text-sm placeholder-white/20 focus:outline-none focus:border-neon-cyan/60 transition-colors duration-200"
                  />
                </div>
              </div>
            ))}

            {/* City select */}
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase text-white/50 mb-2">City</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-cyan/60" />
                <select
                  value={formData.city}
                  onChange={e => update('city', e.target.value)}
                  className="w-full bg-zinc-800/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-neon-cyan/60 transition-colors duration-200 appearance-none"
                >
                  <option value="" className="bg-zinc-900">Select city...</option>
                  {CITIES.map(c => <option key={c} value={c} className="bg-zinc-900">{c}</option>)}
                </select>
              </div>
            </div>

            {/* Platform select */}
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase text-white/50 mb-2">Platform</label>
              <div className="relative">
                <Bike className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-cyan/60" />
                <select
                  value={formData.platform}
                  onChange={e => update('platform', e.target.value)}
                  className="w-full bg-zinc-800/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-neon-cyan/60 transition-colors duration-200 appearance-none"
                >
                  <option value="" className="bg-zinc-900">Select platform...</option>
                  {PLATFORMS.map(p => <option key={p} value={p} className="bg-zinc-900">{p}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                className="text-red-400 text-sm font-sans mt-4 px-1"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Success */}
          <AnimatePresence>
            {success && (
              <motion.div
                className="flex items-center gap-2 text-green-400 text-sm font-sans mt-4 px-1"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CheckCircle className="w-4 h-4" />
                Account created successfully! Redirecting...
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <button
            onClick={handleSignUp}
            disabled={loading || success}
            className="w-full mt-6 py-3 rounded-xl font-bold font-sans tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-neon-cyan to-neon-purple text-black hover:shadow-[0_0_25px_rgba(0,245,255,0.4)] disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>Create Account <ArrowRight className="w-4 h-4" /></>
            )}
          </button>

          <p className="text-center text-white/40 font-sans text-sm mt-6">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('signin')}
              className="text-neon-cyan hover:underline transition-colors"
            >
              Sign In
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
