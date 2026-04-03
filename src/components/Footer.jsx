import React from 'react';
import { Mail, Link, Globe, ShieldAlert } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-32 py-12 relative z-20 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-6 h-6 text-neon-cyan" />
            <span className="font-heading font-bold text-xl text-white">ShieldRide</span>
          </div>
          <p className="text-white/50 font-sans max-w-sm mb-6">
            Rain stops you. We've got you covered. AI-powered parametric income insurance for India's gig workforce.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-white/50 hover:text-neon-cyan transition-colors">
              <Mail className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/50 hover:text-neon-cyan transition-colors">
              <Link className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/50 hover:text-neon-cyan transition-colors">
              <Globe className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="font-mono text-xs text-white uppercase tracking-widest mb-4">Product</h4>
          <ul className="space-y-2 text-sm text-white/50 font-sans">
            <li><a href="#" className="hover:text-neon-cyan transition-colors">Triggers</a></li>
            <li><a href="#" className="hover:text-neon-cyan transition-colors">Calculator</a></li>
            <li><a href="#" className="hover:text-neon-cyan transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-neon-cyan transition-colors">API for Platforms</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-xs text-white uppercase tracking-widest mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-white/50 font-sans">
            <li><a href="#" className="hover:text-neon-cyan transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-neon-cyan transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-neon-cyan transition-colors">IRDAI Sandbox Info</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-white/30">
        <p>© 2026 ShieldRide. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Built by Resonate 2.0 | MLSA SRM</p>
      </div>
    </footer>
  );
}
