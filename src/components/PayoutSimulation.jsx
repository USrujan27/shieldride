import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ShieldAlert, CheckCircle, Smartphone } from 'lucide-react';
import { initiateClaim, sendPayout, registerWorker, activatePolicy } from '../api/shieldride';

const DEMO_UPI = 'worker@upi';

export default function PayoutSimulation() {
  const [step,        setStep]        = useState(0);
  const [isRunning,   setIsRunning]   = useState(false);
  const [balance,     setBalance]     = useState(1250);
  const [apiStatus,   setApiStatus]   = useState(null);
  const [error,       setError]       = useState(null);

  const resetState = () => {
    setStep(0); setApiStatus(null); setError(null); setBalance(1250);
  };

  const runSimulation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setError(null);
    setApiStatus(null);

    // ── Step 1: Disruption detected ──────────────────────────
    setStep(1);
    await delay(1800);

    // ── Step 2: Fraud check (call backend) ───────────────────
    setStep(2);
    let claimId     = null;
    let payoutAmount = 500;

    try {
      // 1. Register fake worker
      const workerRes = await registerWorker({
        name: 'Demo Person', phone: `demo_${Date.now()}`, city: 'Bangalore', primaryApp: 'Swiggy', workHours: 8
      });
      const workerId = workerRes.data.worker._id;

      // 2. Activate policy
      const policyRes = await activatePolicy({ workerId, premiumPaid: 59 });
      const policyId = policyRes.data.policy._id;

      // 3. Initiate claim (demo mode auto-creates pending claim)
      const { data } = await initiateClaim({
        workerId,
        policyId,
        isDemo: true,
        triggerType: 'rain',
      });
      
      if (data.status === 'Rejected' || data.claim.status === 'Rejected') {
        setError('⚠️ Claim flagged by fraud detection. Under review.');
        setStep(0); setIsRunning(false); return;
      }
      
      claimId     = data.claim._id;
      payoutAmount = data.claim.payoutAmount || 500;
      
      // mock: small pause to simulate fraud check visually
      await delay(1200);

      // ── Step 3: Send payout ───────────────────────────────
      setStep(3);

      if (claimId) {
        const { data } = await sendPayout({
          claimId,
          upiId:  DEMO_UPI,
          amount: payoutAmount,
        });
        setApiStatus(data.message || `₹${payoutAmount} credited to ${DEMO_UPI}`);
      } else {
        // Mock fallback
        await delay(600);
        setApiStatus(`₹${payoutAmount} credited to ${DEMO_UPI}`);
      }

      setBalance(prev => prev + payoutAmount);
    } catch {
      setError('API error — showing mock payout.');
      await delay(600);
      setStep(3);
      setBalance(prev => prev + 500);
      setApiStatus('₹500 credited to worker@upi (mock)');
    }

    // Reset after 5 s
    await delay(5000);
    setIsRunning(false);
    resetState();
  };

  return (
    <div className="py-24 relative z-20 max-w-4xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">Instant Payout Simulation</h2>
        <p className="text-white/50 font-sans tracking-wide">Experience the speed of parametric insurance.</p>
      </div>

      <div className="glass-card p-1 max-w-md mx-auto">
        {/* Phone Frame */}
        <div className="bg-black rounded-[2rem] border-4 border-white/10 p-6 h-[500px] flex flex-col">
          {/* Status Bar */}
          <div className="flex justify-between items-center text-white/50 text-xs font-sans mb-8">
            <span>{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
            <Smartphone className="w-4 h-4" />
          </div>

          {/* Balance */}
          <div className="text-center mb-10">
            <p className="text-white/50 text-sm font-sans mb-1">Wallet Balance</p>
            <motion.h3
              key={balance}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="text-4xl font-mono text-white"
            >
              <span className="text-white/30 mr-1">₹</span>{balance}
            </motion.h3>
          </div>

          {/* Steps */}
          <div className="flex-grow flex flex-col justify-end space-y-3">
            <AnimatePresence mode="popLayout">
              {step >= 1 && (
                <motion.div key="s1"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl flex items-center gap-3"
                >
                  {step === 1 ? <Loader2 className="w-5 h-5 text-red-400 animate-spin" /> : <ShieldAlert className="w-5 h-5 text-red-400" />}
                  <span className="font-mono text-xs text-white/80">{step === 1 ? 'Detecting disruption…' : 'Heavy Rain Confirmed'}</span>
                </motion.div>
              )}

              {step >= 2 && (
                <motion.div key="s2"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="bg-neon-purple/10 border border-neon-purple/30 p-3 rounded-xl flex items-center gap-3"
                >
                  {step === 2 ? <Loader2 className="w-5 h-5 text-neon-purple animate-spin" /> : <ShieldAlert className="w-5 h-5 text-neon-purple" />}
                  <span className="font-mono text-xs text-white/80">{step === 2 ? 'AI Fraud Check…' : 'Verification Passed'}</span>
                </motion.div>
              )}

              {step >= 3 && (
                <motion.div key="s3"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="bg-green-500/10 border border-green-500/30 p-3 rounded-xl flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="font-mono text-xs text-green-400 font-bold">
                    {apiStatus ?? '₹500 credited to UPI'}
                  </span>
                </motion.div>
              )}

              {error && (
                <motion.div key="err"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-xl"
                >
                  <p className="font-mono text-xs text-yellow-400">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CTA Button */}
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className={`mt-6 w-full py-4 text-center rounded-xl font-sans font-bold text-sm tracking-widest uppercase transition-all duration-200 ${
              isRunning
                ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
                : 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/50 hover:bg-neon-cyan hover:text-black hover:shadow-[0_0_20px_rgba(0,245,255,0.4)]'
            }`}
          >
            {isRunning ? 'Simulating…' : 'Run Simulation'}
          </button>
        </div>
      </div>
    </div>
  );
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
