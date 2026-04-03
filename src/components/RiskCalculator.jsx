import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { registerWorker, getWeather } from '../api/shieldride';

const cities = ['Bangalore', 'Mumbai', 'Chennai', 'Hyderabad', 'Delhi', 'Pune'];

export default function RiskCalculator() {
  const [city,       setCity]       = useState('Bangalore');
  const [hours,      setHours]      = useState(8);
  const [riskLevel,  setRiskLevel]  = useState(50);
  const [premium,    setPremium]    = useState(59);
  const [riskScore,  setRiskScore]  = useState(50);
  const [tier,       setTier]       = useState('standard');
  const [weather,    setWeather]    = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [error,      setError]      = useState(null);
  const [success,    setSuccess]    = useState(null);

  // Animated premium display (simple CSS counter via key change)
  const [displayPremium, setDisplayPremium] = useState(premium);
  useEffect(() => {
    const t = setTimeout(() => setDisplayPremium(premium), 50);
    return () => clearTimeout(t);
  }, [premium]);

  // Fetch live weather for selected city
  const fetchWeather = useCallback(async (selectedCity) => {
    setWeatherLoading(true);
    try {
      const { data } = await getWeather(selectedCity);
      setWeather(data);
      // Adjust risk level based on live weather
      if (data.triggerFired) {
        setRiskLevel(Math.min(100, riskLevel + 20));
      }
    } catch {
      // Silently fail for weather, show mock
      setWeather({ rainfall: 27, temp: 28, aqi: 85, triggerFired: false });
    } finally {
      setWeatherLoading(false);
    }
  }, [riskLevel]);

  useEffect(() => { fetchWeather(city); }, [city]);

  // Live-refresh weather every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => fetchWeather(city), 60000);
    return () => clearInterval(interval);
  }, [city, fetchWeather]);

  // Update premium based on risk level
  useEffect(() => {
    if (riskLevel < 40)       { setPremium(29); setTier('basic'); }
    else if (riskLevel <= 70) { setPremium(59); setTier('standard'); }
    else                      { setPremium(99); setTier('pro'); }
    setRiskScore(riskLevel);
  }, [riskLevel]);

  const handleGetPlan = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { data } = await registerWorker({
        name:           'Demo Worker',
        phone:          '9999999999',
        city,
        platform:       'Swiggy',
        weeklyEarnings: 3500,
        workHours:      hours,
      });
      setRiskScore(data.riskScore);
      setTier(data.recommendedTier);
      setPremium(data.recommendedPremium);
      setSuccess(`✅ Plan calculated! Risk score: ${data.riskScore}`);
      // Scroll to payout demo
      setTimeout(() => {
        document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
      }, 800);
    } catch {
      setError('Backend offline — showing local estimate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-32 relative z-20 max-w-5xl mx-auto px-6">
      <div className="glass-card p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-cyan/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">

          {/* ── Inputs ─────────────────────────────────────────── */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-2">AI Risk Calculator</h2>
              <p className="text-white/50 font-sans text-sm">Personalized dynamic premium based on live weather + your zone.</p>
            </div>

            {/* Live Weather Badge */}
            {weather && (
              <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border text-xs font-mono ${
                weather.triggerFired
                  ? 'border-red-500/40 bg-red-500/10 text-red-400'
                  : 'border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan'
              }`}>
                {weatherLoading
                  ? <Loader2 className="w-3 h-3 animate-spin" />
                  : <span>{weather.triggerFired ? '⚠️' : '🟢'}</span>
                }
                <span>
                  {city} · {weather.rainfall}mm/hr · {weather.temp}°C · AQI {weather.aqi}
                  {weather.triggerFired && ` · TRIGGER: ${weather.triggerType?.toUpperCase()}`}
                </span>
              </div>
            )}

            <div className="space-y-6">
              {/* City Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="font-mono text-xs text-white/70 uppercase tracking-widest">Select City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-black/50 border border-white/20 rounded-lg p-3 text-white font-sans outline-none focus:border-neon-cyan transition-colors"
                >
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Work Hours Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-xs text-white/70 uppercase tracking-widest">Work Hours / Day</label>
                  <span className="font-mono text-neon-cyan">{hours} hrs</span>
                </div>
                <input
                  type="range" min="2" max="12" value={hours}
                  onChange={(e) => { setHours(parseInt(e.target.value)); setRiskLevel(Math.min(100, parseInt(e.target.value) * 8)); }}
                  className="w-full accent-neon-cyan cursor-pointer"
                />
              </div>

              {/* Risk Level Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-xs text-white/70 uppercase tracking-widest">Zone Risk Level</label>
                  <span className="font-mono text-neon-purple">{riskLevel}%</span>
                </div>
                <input
                  type="range" min="0" max="100" value={riskLevel}
                  onChange={(e) => setRiskLevel(parseInt(e.target.value))}
                  className="w-full accent-neon-purple cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* ── Outputs ────────────────────────────────────────── */}
          <div className="glass-card p-8 bg-black/40 border border-white/5 flex flex-col justify-center relative overflow-hidden">
            <h3 className="font-mono text-xs text-white/50 uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Real-time Quote</h3>

            {/* Risk Score Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-xs font-mono text-white/70 mb-2">
                <span>Risk Score</span>
                <span className={riskScore > 70 ? 'text-red-400' : riskScore > 40 ? 'text-neon-purple' : 'text-neon-cyan'}>
                  {riskScore > 70 ? 'High' : riskScore > 40 ? 'Medium' : 'Low'} · {riskScore}
                </span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${riskScore > 70 ? 'bg-red-500' : riskScore > 40 ? 'bg-neon-purple' : 'bg-neon-cyan'}`}
                  animate={{ width: `${riskScore}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Premium display */}
            <div className="flex-grow flex flex-col items-center justify-center text-center">
              <p className="font-mono text-xs text-white/50 uppercase tracking-widest mb-2">Recommended Weekly Premium</p>
              <motion.div
                key={displayPremium}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="text-6xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple flex items-baseline justify-center"
              >
                <span className="text-3xl mr-1 text-neon-cyan">₹</span>
                {displayPremium}
              </motion.div>
              <p className="font-mono text-xs text-white/30 mt-1 uppercase">{tier} plan</p>

              {/* Feedback messages */}
              {error   && <p className="mt-4 text-xs font-mono text-yellow-400 bg-yellow-400/10 px-3 py-2 rounded-lg">{error}</p>}
              {success && <p className="mt-4 text-xs font-mono text-green-400 bg-green-400/10 px-3 py-2 rounded-lg">{success}</p>}

              <button
                onClick={handleGetPlan}
                disabled={loading}
                className="mt-8 relative px-6 py-3 bg-neon-cyan text-black font-bold font-sans uppercase tracking-widest rounded transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,245,255,0.6)] hover:bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Calculating…' : 'Get My Plan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
