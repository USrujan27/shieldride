import React, { Suspense, lazy, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';

// Lazy-load all below-the-fold sections for faster initial paint
const TriggersSection  = lazy(() => import('./components/TriggersSection'));
const RiskCalculator   = lazy(() => import('./components/RiskCalculator'));
const HowItWorks       = lazy(() => import('./components/HowItWorks'));
const ComparisonSection = lazy(() => import('./components/ComparisonSection'));
const PayoutSimulation = lazy(() => import('./components/PayoutSimulation'));
const PricingSection   = lazy(() => import('./components/PricingSection'));
const FloatingPill     = lazy(() => import('./components/FloatingPill'));
const Footer           = lazy(() => import('./components/Footer'));

const SectionFallback = () => (
  <div className="flex items-center justify-center py-32">
    <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
  </div>
);

function HomePage({ onNavigate }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001
  });

  return (
    <div className="bg-black text-white selection:bg-neon-cyan/30 min-h-screen" style={{ cursor: 'none' }}>
      {/* Neon Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-neon-cyan origin-left z-[100]"
        style={{ scaleX, boxShadow: '0 0 8px #00F5FF' }}
      />

      <CustomCursor />
      <Navbar onNavigate={onNavigate} />

      <main>
        {/* Hero is eagerly loaded */}
        <section id="home">
          <HeroSection onNavigate={onNavigate} />
        </section>

        <Suspense fallback={<SectionFallback />}>
          <section id="features">
            <TriggersSection />
          </section>
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <section id="risk-calculator">
            <RiskCalculator />
          </section>
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <section id="how-it-works">
            <HowItWorks />
          </section>
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <ComparisonSection />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <section id="demo">
            <PayoutSimulation />
          </section>
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <section id="pricing">
            <PricingSection onNavigate={onNavigate} />
          </section>
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <FloatingPill />
      </Suspense>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}

function App() {
  const [page, setPage] = useState('home');

  const navigate = (target) => {
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (page === 'signin') return <SignInPage onNavigate={navigate} />;
  if (page === 'signup') return <SignUpPage onNavigate={navigate} />;
  if (page === 'dashboard') return <DashboardPage onNavigate={navigate} />;

  return <HomePage onNavigate={navigate} />;
}

export default App;
