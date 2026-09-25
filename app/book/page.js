"use client";

import { useState } from 'react';
import Link from 'next/link';

// ===========================================
//  Brand Logo
// ===========================================
const Logo = () => (
  <div className="flex items-center gap-2.5">
    <div className="relative w-9 h-9 rounded-[10px] bg-gradient-to-br from-violet-500 via-violet-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
      <div className="absolute inset-0 rounded-[10px] bg-gradient-to-tr from-transparent via-white/25 to-transparent"></div>
      <svg className="w-5 h-5 text-white relative" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h3l2-7 4 14 2-7h7" />
      </svg>
    </div>
    <span className="text-lg font-bold tracking-tight">
      Retain<span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Pulse</span>
    </span>
  </div>
);

// ===========================================
//  Icons
// ===========================================
const IconArrowRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const IconSpark = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

// ===========================================
//  MRR Options
// ===========================================
const MRR_OPTIONS = [
  { value: '<$1K', label: 'Less than $1K' },
  { value: '$1K-$5K', label: '$1K – $5K' },
  { value: '$5K-$20K', label: '$5K – $20K' },
  { value: '$20K+', label: '$20K+' },
];

// ===========================================
//  Main Component
// ===========================================
export default function BookPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    saas_url: '',
    mrr_range: '',
    churn_problem: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setSubmitted(true);
    } catch (err) {
      console.error('[Book] Submit failed:', err);
      setError(err.message);
      setSubmitting(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  //  SUCCESS STATE
  // ═══════════════════════════════════════════════════════════
  if (submitted) {
    return (
      <div className="relative min-h-screen bg-[#05050c] text-white font-sans antialiased overflow-x-hidden">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-25%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-emerald-600/[0.10] rounded-full blur-[150px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-violet-600/[0.08] rounded-full blur-[130px]"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-16">
          <div className="max-w-lg w-full text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center mb-8 text-emerald-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
              Got it.
            </h1>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              I'll personally review your SaaS and send you a Payoneer payment link within <strong className="text-white">24 hours</strong>.
            </p>

            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 text-left mb-8">
              <p className="text-xs font-semibold text-violet-300 uppercase tracking-[0.15em] mb-4">What happens next</p>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-300 text-xs font-bold">1</span>
                  <span>I review your SaaS and churn problem</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-300 text-xs font-bold">2</span>
                  <span>You receive a Payoneer link for <strong className="text-white">$100</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-300 text-xs font-bold">3</span>
                  <span>Once paid, I install RetainPulse on your site within <strong className="text-white">48 hours</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-300 text-xs font-bold">4</span>
                  <span>After 7 days, if you're happy, you pay the remaining <strong className="text-white">$149</strong></span>
                </li>
              </ul>
            </div>

            <Link
              href="/demo"
              className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
            >
              <span>Try the live demo while you wait</span>
              <IconArrowRight />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  //  FORM STATE
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="relative min-h-screen bg-[#05050c] text-white font-sans antialiased overflow-x-hidden">

      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-25%] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-violet-600/[0.12] rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-600/[0.08] rounded-full blur-[130px]"></div>
      </div>

      <div className="relative z-10">

        {/* Navbar */}
        <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <Link href="/">
            <button className="text-sm text-slate-400 hover:text-white transition-colors">
              ← Back to home
            </button>
          </Link>
        </nav>

        <div className="max-w-5xl mx-auto px-6 pt-8 md:pt-12 pb-24">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-6">
              <IconSpark />
              <span>Founding Members · 5 spots only</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-5">
              Let's get started.
            </h1>

            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Tell me about your SaaS. I'll personally review it and send you a Payoneer link within 24 hours.
            </p>
          </div>

          {/* Form Card */}
          <div className="max-w-2xl mx-auto">
            <div className="relative p-6 md:p-10 rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/[0.06] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              <form onSubmit={handleSubmit} className="relative space-y-6">

                {/* Name + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Your name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                      maxLength={100}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      required
                      maxLength={200}
                      placeholder="you@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* SaaS URL */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your SaaS URL
                  </label>
                  <input
                    type="url"
                    value={formData.saas_url}
                    onChange={(e) => handleChange('saas_url', e.target.value)}
                    required
                    maxLength={200}
                    placeholder="https://yourproduct.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    I'll review it before we talk.
                  </p>
                </div>

                {/* MRR Range */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Your current MRR
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {MRR_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleChange('mrr_range', opt.value)}
                        className={`px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                          formData.mrr_range === opt.value
                            ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white border border-transparent shadow-lg shadow-violet-500/25'
                            : 'bg-white/[0.03] border border-white/[0.08] text-slate-300 hover:bg-white/[0.06] hover:border-white/[0.15]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Churn Problem */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    What's your biggest churn problem?
                    <span className="text-slate-500 font-normal ml-2">(optional)</span>
                  </label>
                  <textarea
                    value={formData.churn_problem}
                    onChange={(e) => handleChange('churn_problem', e.target.value)}
                    maxLength={2000}
                    rows={4}
                    placeholder="e.g. We lose 8-10 customers a month and don't know why..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    {formData.churn_problem.length}/2000
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting || !formData.mrr_range}
                  className="group relative w-full py-4 rounded-2xl font-semibold text-white overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-2xl shadow-violet-500/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-500"></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-fuchsia-500 via-violet-500 to-violet-600 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send my request</span>
                        <IconArrowRight />
                      </>
                    )}
                  </span>
                </button>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-5 text-xs text-slate-500 pt-2">
                  <div className="flex items-center gap-1.5">
                    <IconCheck />
                    <span>No payment yet</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <IconCheck />
                    <span>Reply within 24h</span>
                  </div>
                </div>
              </form>
            </div>

            {/* Pricing reminder */}
            <div className="mt-8 text-center text-sm text-slate-500">
              <span className="text-slate-400">$100 upfront · $149 after 7 days</span>
              <span className="mx-2">·</span>
              <Link href="/pricing" className="text-violet-400 hover:text-violet-300 transition-colors">
                See full details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}