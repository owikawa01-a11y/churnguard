"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function DemoPage() {
  const [showWidget, setShowWidget] = useState(false);

  const loadWidget = () => {
    window.ChurnGuardConfig = {
      publicKey: '3a11005ef9ac7874bd34c67a', 
      customerEmail: 'demo@customer.com',
      customerMrr: 49,
      cancelUrl: '/demo',
    };
    if (window.ChurnGuard) {
      window.ChurnGuard.show();
      return;
    }
    const script = document.createElement('script');
    script.src = '/widget.js';
    script.onload = () => {
      if (window.ChurnGuard) window.ChurnGuard.show();
    };
    document.body.appendChild(script);
  };

  return (
    <div className="min-h-screen bg-[#05050c] text-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Try ChurnGuard Live
        </h1>
        <p className="text-slate-400 text-lg mb-12">
          Click the button below to see exactly what your customers will see
          when they try to cancel.
        </p>

        <button
          onClick={loadWidget}
          className="px-10 py-5 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-bold text-lg shadow-xl hover:scale-105 transition-all mb-8"
        >
          🧪 Try It Now
        </button>

        <div className="grid grid-cols-3 gap-4 mt-16 text-left">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-3xl font-bold text-emerald-300">$98</p>
            <p className="text-xs text-slate-500 mt-1">Recovered / month</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-3xl font-bold text-violet-300">67%</p>
            <p className="text-xs text-slate-500 mt-1">Save Rate</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-3xl font-bold text-white">2</p>
            <p className="text-xs text-slate-500 mt-1">Customers Saved</p>
          </div>
        </div>

        <p className="text-slate-500 text-sm mt-12">
	    ← Live preview of the ChurnGuard dashboard
        </p>
      </div>
    </div>
  );
}