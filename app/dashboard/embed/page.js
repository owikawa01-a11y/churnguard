"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ===========================================
//  SVG Icons
// ===========================================
const IconBack = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const IconCopy = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const IconKey = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

const IconCode = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const IconBook = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const IconWarning = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const IconSparkle = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

// ===========================================
//  Main Component
// ===========================================
export default function EmbedPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publicKey, setPublicKey] = useState(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // Fetch public key
      const { data: widgetData } = await supabase
        .from('widgets')
        .select('public_key')
        .eq('account_id', user.id)
        .single();

      if (widgetData) {
        setPublicKey(widgetData.public_key);
      } else {
        const { data: accData } = await supabase
          .from('accounts')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (accData) {
          const { data: wData } = await supabase
            .from('widgets')
            .select('public_key')
            .eq('account_id', accData.id)
            .single();
          if (wData) setPublicKey(wData.public_key);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [router]);

  const getEmbedCode = (key) => {
    return `<!-- ChurnGuard Widget -->
<script>
  window.ChurnGuardConfig = {
    publicKey: "${key}",

    // OPTIONAL: Average monthly revenue per customer.
    // Used to calculate "Recovered Revenue" in your dashboard.
    // If not set, we default to $50.
    customerMrr: 49,

    // REQUIRED: This function runs when the customer confirms cancellation.
    // Replace the console.log with your actual cancellation logic.
    onCancelConfirmed: function() {
      // Example:
      // fetch('/api/cancel-subscription', { method: 'POST' });
      console.log('Cancel confirmed - run your cancel logic here');
    },

    // OPTIONAL: Called when the customer accepts the retention offer.
    // Apply the discount/pause in your billing system here.
    onOfferAccepted: function() {
      // Example:
      // fetch('/api/apply-discount', { method: 'POST' });
      console.log('Offer accepted - apply the discount here');
    }
  };
</script>
<script src="https://churnguard-sandy.vercel.app/widget.js" async></script>
<button data-churnguard-trigger>Cancel subscription</button>
<!-- End ChurnGuard Widget -->`;
  };

  const copyToClipboard = async (text, setter) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05050c] flex items-center justify-center">
        <div className="w-12 h-12 border-[3px] border-violet-500/20 border-t-violet-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  const embedCode = publicKey ? getEmbedCode(publicKey) : '';

  return (
    <div className="relative min-h-screen bg-[#05050c] text-white font-sans antialiased overflow-x-hidden">
      
      {/* Background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-violet-600/[0.13] rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-30%] left-[-10%] w-[600px] h-[600px] bg-fuchsia-600/[0.07] rounded-full blur-[130px]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:px-10 md:py-16">
        
        {/* Back link */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm mb-8 transition-colors">
          <IconBack />
          <span>Back to Dashboard</span>
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <IconCode />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Install Widget
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Add ChurnGuard to your product in under 5 minutes
              </p>
            </div>
          </div>
        </header>

        {/* Public Key Card */}
        <section className="mb-8">
          <div className="relative rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/[0.06] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-amber-300">
                    <IconKey />
                  </span>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-[0.15em]">
                    Your Public Key
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm font-mono text-amber-200 bg-black/40 px-4 py-3 rounded-xl border border-amber-500/20 truncate">
                  {publicKey || 'Loading...'}
                </code>
                <button
                  onClick={() => copyToClipboard(publicKey || '', setCopiedKey)}
                  className={`p-3 rounded-xl border transition-all duration-200 flex-shrink-0 ${
                    copiedKey
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                  title="Copy Public Key"
                >
                  {copiedKey ? <IconCheck /> : <IconCopy />}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                {copiedKey ? '✓ Copied to clipboard' : 'Keep this key safe. It identifies your account.'}
              </p>
            </div>
          </div>
        </section>

        {/* Embed Code Card */}
        <section className="mb-8">
          <div className="relative rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
            <div className="h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"></div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-violet-300">
                    <IconCode />
                  </span>
                  <h2 className="text-lg font-semibold tracking-tight">Embed Code</h2>
                </div>
                <button
                  onClick={() => copyToClipboard(embedCode, setCopiedCode)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    copiedCode
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:scale-[1.02]'
                  }`}
                >
                  {copiedCode ? (
                    <>
                      <IconCheck />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <IconCopy />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code block */}
              <div className="bg-black/60 rounded-xl border border-white/[0.06] overflow-hidden">
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60"></div>
                  <span className="ml-3 text-xs text-slate-500 font-mono">embed.html</span>
                </div>
                <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed whitespace-pre">
                  {embedCode || 'Loading...'}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Warning Box */}
        <section className="mb-8">
          <div className="relative rounded-2xl bg-amber-500/[0.04] border border-amber-500/20 p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300">
                <IconWarning />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-100 mb-2">Required: Add your cancel logic</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  The <code className="text-amber-300 bg-black/30 px-1.5 py-0.5 rounded text-xs font-mono">onCancelConfirmed</code> callback is <strong className="text-amber-200">required</strong>. 
                  Without it, the widget will ask for feedback but <strong className="text-amber-200">won't actually cancel the subscription</strong> in your system. 
                  Replace the example code with your own API call.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Installation Steps */}
        <section className="mb-8">
          <div className="relative rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-emerald-300">
                <IconBook />
              </span>
              <h2 className="text-lg font-semibold tracking-tight">How to Install</h2>
            </div>

            <div className="space-y-5">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-300 text-sm font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Copy the code above</h3>
                  <p className="text-sm text-slate-500">Use the Copy button or select manually.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-300 text-sm font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Paste into your app</h3>
                  <p className="text-sm text-slate-500">
                    Add it right before the closing <code className="text-violet-300 bg-black/30 px-1.5 py-0.5 rounded text-xs font-mono">&lt;/body&gt;</code> tag, 
                    or in your main layout component.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-300 text-sm font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Add the cancel button</h3>
                  <p className="text-sm text-slate-500 mb-2">
                    Add the <code className="text-violet-300 bg-black/30 px-1.5 py-0.5 rounded text-xs font-mono">data-churnguard-trigger</code> attribute 
                    to your existing cancel button.
                  </p>
                  <div className="bg-black/40 rounded-lg p-3 border border-white/[0.06]">
                    <code className="text-xs text-slate-300 font-mono">
                      &lt;button data-churnguard-trigger&gt;Cancel Subscription&lt;/button&gt;
                    </code>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-300 text-sm font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Test it</h3>
                  <p className="text-sm text-slate-500">
                    Click your cancel button and verify the widget appears. 
                    Use the <span className="text-violet-300 font-medium">Test Widget</span> button in your Dashboard to preview.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="mb-10">
          <div className="relative rounded-2xl bg-gradient-to-br from-violet-500/[0.06] to-fuchsia-500/[0.03] border border-violet-500/20 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-violet-300">
                <IconSparkle />
              </span>
              <h2 className="font-semibold tracking-tight">Pro Tips</h2>
            </div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex gap-2">
                <span className="text-violet-400">•</span>
                <span>Set <code className="text-violet-300 bg-black/30 px-1.5 py-0.5 rounded text-xs font-mono">customerMrr</code> to your average monthly revenue per customer to unlock accurate "Recovered Revenue" tracking.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-violet-400">•</span>
                <span>Use <code className="text-violet-300 bg-black/30 px-1.5 py-0.5 rounded text-xs font-mono">onOfferAccepted</code> to auto-apply discounts in your billing system (Stripe, Chargebee, etc).</span>
              </li>
              <li className="flex gap-2">
                <span className="text-violet-400">•</span>
                <span>The widget loads asynchronously - it won't slow down your app.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-violet-400">•</span>
                <span>All data is securely stored and scoped to your account (RLS-protected).</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 text-center">
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