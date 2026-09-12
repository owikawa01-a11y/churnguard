"use client";

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// --- SVG Icons ---
const IconCheck = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const IconArrowRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const IconBack = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

// --- Pricing Plans ---
const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    description: 'For indie SaaS founders just getting started',
    features: [
      'Up to 500 cancellation events/month',
      'AI follow-up questions',
      'One retention offer per reason',
      'Basic dashboard with all reasons',
      'Email support',
    ],
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 79,
    description: 'For growing SaaS teams who want deeper insights',
    features: [
      'Unlimited cancellation events',
      'Everything in Starter',
      'Advanced analytics & trends',
      'Recovered Revenue tracking',
      'Custom retention offers',
      'Slack alerts',
      'CSV export',
      'Priority support',
    ],
    highlight: true,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubscribe = async (planId) => {
    setLoading(planId);
    setError(null);

    try {
      // --- 1. Get user session ---
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // Not logged in - redirect to login
        router.push('/login?redirect=/pricing');
        return;
      }

      // --- 2. Call checkout API ---
      const res = await fetch('/api/paddle/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ plan: planId }),
      });

      const data = await res.json();

      if (!res.ok || !data.checkout_url) {
        throw new Error(data.error || 'Failed to create checkout');
      }

      // --- 3. Redirect to Paddle checkout ---
      window.location.href = data.checkout_url;
    } catch (err) {
      console.error('[Pricing] Checkout error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#05050c] text-white font-sans antialiased overflow-x-hidden">
      {/* Background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-violet-600/[0.13] rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-30%] left-[-10%] w-[600px] h-[600px] bg-fuchsia-600/[0.07] rounded-full blur-[130px]"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:px-10 md:py-16">
        {/* Back link */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm mb-8 transition-colors">
          <IconBack />
          <span>Back to Dashboard</span>
        </Link>

        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold tracking-wider uppercase mb-6">
            14-day free trial · No credit card required
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent mb-4">
            Simple, honest pricing
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Stop losing customers silently. Start understanding why they leave, and win some of them back.
          </p>
        </header>

        {/* Error */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm text-center">
            {error}
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${
                plan.highlight
                  ? 'bg-gradient-to-br from-violet-500/[0.08] to-fuchsia-500/[0.04] border-2 border-violet-500/40 shadow-2xl shadow-violet-500/20'
                  : 'bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12]'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold tracking-wider uppercase shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                <p className="text-sm text-slate-400 leading-relaxed">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight">${plan.price}</span>
                  <span className="text-slate-400 text-sm">/month</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Billed monthly · Cancel anytime</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className={`mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-violet-400' : 'text-emerald-400'}`}>
                      <IconCheck />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading !== null}
                className={`group w-full py-4 rounded-2xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  plan.highlight
                    ? 'bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02]'
                    : 'bg-white/[0.05] text-white border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15]'
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                {loading === plan.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <span>Start 14-day free trial</span>
                    <span className="transition-transform group-hover:translate-x-1">
                      <IconArrowRight />
                    </span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ / Trust */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Common questions</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium text-white mb-1">Do I need a credit card for the trial?</p>
                <p className="text-slate-400">Paddle will ask for a card, but you won't be charged during the 14 days. Cancel anytime before trial ends.</p>
              </div>
              <div>
                <p className="font-medium text-white mb-1">Can I switch plans later?</p>
                <p className="text-slate-400">Yes, upgrade or downgrade anytime. Changes apply immediately, prorated automatically.</p>
              </div>
              <div>
                <p className="font-medium text-white mb-1">What if I don't see value?</p>
                <p className="text-slate-400">Cancel during the trial and you pay nothing. No questions, no friction.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm transition-colors"
          >
            <IconBack />
            <span>Back to Dashboard</span>
          </Link>
        </footer>
      </div>
    </div>
  );
}