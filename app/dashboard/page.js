"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// --- SVG Icons ---
const IconTrend = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);
const IconSpark = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364 6.364l-2.121-2.121M8.757 8.757L6.636 6.636m12.728 0l-2.121 2.121M8.757 15.243l-2.121 2.121" />
  </svg>
);
const IconKey = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);
const IconCopy = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);
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
const IconLogout = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);
const IconShield = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const IconInbox = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </svg>
);
const IconWarning = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [publicKey, setPublicKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const [accountStatus, setAccountStatus] = useState(null);
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

      // Fetch events
      const { data: eventsData, error } = await supabase
        .from('cancellation_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setEvents(eventsData || []);

      // Fetch account status
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const res = await fetch('/api/account/status', {
            headers: { Authorization: `Bearer ${session.access_token}` },
          });
          if (res.ok) {
            const statusData = await res.json();
            setAccountStatus(statusData);
          }
        }
      } catch (err) {
        console.error('Failed to fetch account status:', err);
      }

      setLoading(false);
    };

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const copyPublicKey = () => {
    if (!publicKey) return;
    navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulateCancellation = () => {
    if (!publicKey) {
      alert('Public key not found.');
      return;
    }
    window.ChurnGuardConfig = {
      publicKey: publicKey,
      customerEmail: 'demo@customer.com',
      cancelUrl: '/dashboard',
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
    script.onerror = () => alert('Failed to load widget.js.');
    document.body.appendChild(script);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05050c] flex items-center justify-center">
        <div className="w-12 h-12 border-[3px] border-violet-500/20 border-t-violet-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  const todayCount = events.filter(
    (e) => new Date(e.created_at).toDateString() === new Date().toDateString()
  ).length;

  const access = accountStatus?.access || { canAccess: true, reason: 'new', daysLeft: 0 };
  const plan = accountStatus?.account?.subscription_plan || 'starter';
  const status = accountStatus?.account?.subscription_status || 'trialing';
  const isTrialExpired = access.reason === 'trial_expired';
  const isTrial = status === 'trialing' && !isTrialExpired;
  const showTrialWarning = isTrial && access.daysLeft > 0 && access.daysLeft <= 7;

  return (
    <div className="relative min-h-screen bg-[#05050c] text-white font-sans antialiased overflow-x-hidden">

      {/* Background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-violet-600/[0.13] rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-30%] left-[-10%] w-[600px] h-[600px] bg-fuchsia-600/[0.07] rounded-full blur-[130px]"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:px-10 md:py-16">

        {/* ═══ Trial Banner (Warning) ═══ */}
        {showTrialWarning && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-amber-400 flex-shrink-0">
                <IconWarning />
              </span>
              <div>
                <p className="text-sm font-semibold text-amber-100">
                  Trial ends in {access.daysLeft} {access.daysLeft === 1 ? 'day' : 'days'}
                </p>
                <p className="text-xs text-amber-200/70 mt-0.5">
                  Upgrade now to keep access to your dashboard.
                </p>
              </div>
            </div>
            <Link href="/pricing">
              <button className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all flex-shrink-0">
                Upgrade →
              </button>
            </Link>
          </div>
        )}

        {/* ═══ Trial Expired Banner ═══ */}
        {isTrialExpired && (
          <div className="mb-8 p-4 rounded-2xl bg-red-500/[0.08] border border-red-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-red-400 flex-shrink-0">
                <IconWarning />
              </span>
              <div>
                <p className="text-sm font-semibold text-red-100">
                  Your trial has expired
                </p>
                <p className="text-xs text-red-200/70 mt-0.5">
                  Upgrade to continue using your dashboard. Your widget is still collecting data.
                </p>
              </div>
            </div>
            <Link href="/pricing">
              <button className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white text-xs font-bold transition-all flex-shrink-0">
                Upgrade →
              </button>
            </Link>
          </div>
        )}

        {/* ═══ Header ═══ */}
        <header className="mb-14">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl blur-lg opacity-40"></div>
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 via-violet-600 to-fuchsia-500 flex items-center justify-center shadow-xl">
                  <span className="text-white text-xl font-black tracking-tight">C</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent">
                    ChurnGuard
                  </h1>
                  {isTrial && (
                    <span className="px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-[10px] font-bold uppercase tracking-wider">
                      Trial
                    </span>
                  )}
                  {status === 'active' && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                      {plan}
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-sm mt-0.5 font-mono">{user?.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Link href="/dashboard/embed">
                <button className="group px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] hover:text-white transition-all duration-200 flex items-center gap-2">
                  <span>Install Widget</span>
                  <IconArrowRight />
                </button>
              </Link>

              <button
                onClick={simulateCancellation}
                className="relative px-5 py-2.5 rounded-xl text-sm font-semibold text-white overflow-hidden group transition-transform duration-200 hover:scale-[1.02] active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-500"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 transition-opacity duration-300"></div>
                <div className="absolute inset-0 rounded-xl shadow-lg shadow-violet-500/30"></div>
                <span className="relative">Test Widget</span>
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl text-sm text-slate-500 bg-transparent border border-white/[0.06] hover:bg-white/[0.03] hover:text-slate-300 transition-all duration-200 flex items-center gap-2"
                title="Log Out"
              >
                <IconLogout />
              </button>
            </div>
          </div>
        </header>

        {/* ═══ Stats ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-violet-500/30 transition-colors duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/[0.08] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-violet-500/[0.15] transition-all duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.15em]">
                  Total Cancellations
                </span>
                <div className="w-9 h-9 rounded-lg bg-violet-500/[0.08] border border-violet-500/15 flex items-center justify-center text-violet-300">
                  <IconTrend />
                </div>
              </div>
              <p className="text-4xl font-bold tracking-tight text-white">{events.length}</p>
              <p className="text-xs text-slate-500 mt-1">All time</p>
            </div>
          </div>

          <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/30 transition-colors duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/[0.08] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/[0.15] transition-all duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.15em]">
                  Today
                </span>
                <div className="w-9 h-9 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/15 flex items-center justify-center text-emerald-300">
                  <IconSpark />
                </div>
              </div>
              <p className="text-4xl font-bold tracking-tight text-white">{todayCount}</p>
              <p className="text-xs text-slate-500 mt-1">Since midnight</p>
            </div>
          </div>

          <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-amber-500/30 transition-colors duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/[0.06] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/[0.12] transition-all duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.15em]">
                  Public Key
                </span>
                <div className="w-9 h-9 rounded-lg bg-amber-500/[0.08] border border-amber-500/15 flex items-center justify-center text-amber-300">
                  <IconKey />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-mono text-slate-300 bg-black/30 px-3 py-2 rounded-lg border border-white/[0.06] truncate flex-1">
                  {publicKey || 'N/A'}
                </p>
                <button
                  onClick={copyPublicKey}
                  className={`p-2 rounded-lg border transition-all duration-200 flex-shrink-0 ${
                    copied
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                  title="Copy"
                >
                  {copied ? <IconCheck /> : <IconCopy />}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {copied ? 'Copied to clipboard' : 'Your widget identifier'}
              </p>
            </div>
          </div>
        </div>

        {/* ═══ Events Table ═══ */}
        <div className="relative rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
          <div className="h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"></div>
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-slate-400">
                  <IconInbox />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white tracking-tight">Cancellation Reasons</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {events.length === 0 ? 'No feedback yet' : `${events.length} total`}
                  </p>
                </div>
              </div>
            </div>

            {events.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.06] mb-5">
                  <IconInbox />
                </div>
                <p className="text-slate-300 font-medium">No cancellations recorded</p>
                <p className="text-slate-500 text-sm mt-1.5 max-w-sm mx-auto">
                  Try the <span className="text-violet-300">Test Widget</span> button above to simulate one.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-2">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left pb-3 px-2 text-[10px] font-semibold text-slate-500 uppercase tracking-[0.15em]">Customer</th>
                      <th className="text-left pb-3 px-2 text-[10px] font-semibold text-slate-500 uppercase tracking-[0.15em]">Reason</th>
                      <th className="text-right pb-3 px-2 text-[10px] font-semibold text-slate-500 uppercase tracking-[0.15em]">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr key={event.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors duration-150">
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold text-white">
                              {event.customer_email ? event.customer_email.charAt(0).toUpperCase() : '?'}
                            </div>
                            <span className="text-slate-200 font-mono text-xs truncate max-w-[140px] md:max-w-[220px]">
                              {event.customer_email || 'Anonymous'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <span className="inline-block px-3 py-1.5 rounded-md text-xs font-medium bg-white/[0.03] text-slate-200 border border-white/[0.06]">
                            {event.initial_reason || event.reason || 'N/A'}
                          </span>
                          {event.offer_accepted !== null && (
                            <span className={`ml-2 inline-block px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                              event.offer_accepted
                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                                : 'bg-slate-500/15 text-slate-400 border border-slate-500/20'
                            }`}>
                              {event.offer_accepted ? 'Saved' : 'Cancelled'}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-2 text-right">
                          <span className="text-xs text-slate-500 font-mono">
                            {new Date(event.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ═══ Footer ═══ */}
        <footer className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70 animate-pulse"></span>
          <IconShield />
          <span className="tracking-[0.15em] font-mono uppercase">Secured by Supabase RLS</span>
        </footer>
      </div>
    </div>
  );
}