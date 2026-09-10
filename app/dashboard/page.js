"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ─── SVG Icons ─────────────────────────────────────────────
const IconTrendDown = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
);
const IconCalendar = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const IconKey = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);
const IconCopy = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);
const IconRocket = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const IconBeaker = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);
const IconLogout = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);
const IconInbox = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </svg>
);
const IconShield = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

// ─── Main Component ─────────────────────────────────────────
export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [publicKey, setPublicKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

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

      const { data: eventsData, error } = await supabase
        .from('cancellation_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setEvents(eventsData || []);
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
      alert('Public key not found. Please log in again.');
      return;
    }

    window.ChurnGuardConfig = {
      publicKey: publicKey,
      customerEmail: 'demo@customer.com',
      cancelUrl: '/dashboard'
    };

    if (window.ChurnGuard) {
      window.ChurnGuard.show();
      return;
    }

    const script = document.createElement('script');
    script.src = '/widget.js';
    script.onload = () => {
      if (window.ChurnGuard) window.ChurnGuard.show();
      else alert('Widget loaded but not initialized.');
    };
    script.onerror = () => alert('Failed to load widget.js. Check your connection.');
    document.body.appendChild(script);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c1a] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-400 rounded-full animate-spin"></div>
          <div
            className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-emerald-400 rounded-full animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
          ></div>
        </div>
      </div>
    );
  }

  const todayCount = events.filter(
    (e) => new Date(e.created_at).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="relative min-h-screen bg-[#080c1a] text-white font-sans overflow-x-hidden">
      {/* ═══════ الخلفية الهادئة ═══════ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-25%] left-[-10%] w-[700px] h-[700px] bg-amber-500/[0.07] rounded-full blur-[130px] animate-drift-1"></div>
        <div className="absolute top-[30%] right-[-15%] w-[650px] h-[650px] bg-emerald-500/[0.06] rounded-full blur-[130px] animate-drift-2"></div>
        <div className="absolute bottom-[-25%] left-[25%] w-[800px] h-[800px] bg-blue-500/[0.05] rounded-full blur-[150px] animate-drift-3"></div>

        {/* شبكة خفيفة جداً */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(251,191,36,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.4) 1px, transparent 1px)',
            backgroundSize: '70px 70px'
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-10">
        {/* ═══════ الهيدر ═══════ */}
        <header className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {/* الشعار */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-emerald-400 rounded-xl blur-md opacity-40"></div>
                  <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <span className="text-[#080c1a] text-xl font-black">C</span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-amber-100 via-white to-emerald-100 bg-clip-text text-transparent">
                    Dashboard
                  </span>
                </h1>
              </div>
              <p className="text-slate-400 text-sm ml-14">
                Welcome back, <span className="text-amber-200/90 font-mono">{user?.email}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3 ml-14 md:ml-0">
              <Link href="/dashboard/embed">
                <button className="group px-5 py-2.5 rounded-xl text-sm font-semibold text-emerald-200 bg-emerald-500/10 border border-emerald-400/25 hover:bg-emerald-500/20 hover:border-emerald-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 flex items-center gap-2">
                  <IconRocket />
                  <span>Install Widget</span>
                </button>
              </Link>

              <button
                onClick={simulateCancellation}
                className="group relative px-5 py-2.5 rounded-xl text-sm font-semibold text-[#080c1a] overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-amber-300 via-amber-200 to-emerald-300"></div>
                <div className="relative flex items-center gap-2">
                  <IconBeaker />
                  <span>Test Widget</span>
                </div>
              </button>

              <button
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-xl text-sm text-slate-400 bg-white/[0.03] border border-white/10 hover:bg-rose-500/10 hover:border-rose-400/30 hover:text-rose-200 transition-all duration-300 flex items-center gap-2"
              >
                <IconLogout />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* ═══════ بطاقات الإحصائيات ═══════ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {/* بطاقة ١ — Total */}
          <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] backdrop-blur-xl border border-white/10 hover:border-amber-400/40 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/25 transition-all duration-500"></div>
            <div className="relative">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Total Cancellations
                </span>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/25 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                  <IconTrendDown />
                </div>
              </div>
              <p className="text-5xl font-black bg-gradient-to-br from-white to-amber-200 bg-clip-text text-transparent">
                {events.length}
              </p>
              <p className="text-xs text-slate-500 mt-2">All-time cancellations</p>
            </div>
          </div>

          {/* بطاقة ٢ — Today */}
          <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] backdrop-blur-xl border border-white/10 hover:border-emerald-400/40 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/25 transition-all duration-500"></div>
            <div className="relative">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Today
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/25 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform">
                  <IconCalendar />
                </div>
              </div>
              <p className="text-5xl font-black bg-gradient-to-br from-white to-emerald-200 bg-clip-text text-transparent">
                {todayCount}
              </p>
              <p className="text-xs text-slate-500 mt-2">Since midnight</p>
            </div>
          </div>

          {/* بطاقة ٣ — Public Key */}
          <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] backdrop-blur-xl border border-white/10 hover:border-blue-400/40 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/25 transition-all duration-500"></div>
            <div className="relative">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Public Key
                </span>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/25 flex items-center justify-center text-blue-300 group-hover:scale-110 transition-transform">
                  <IconKey />
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs font-mono text-blue-200 bg-black/40 px-3 py-2 rounded-lg border border-blue-400/20 truncate flex-1">
                  {publicKey || 'N/A'}
                </p>
                <button
                  onClick={copyPublicKey}
                  className={`p-2 rounded-lg border transition-all duration-200 ${
                    copied
                      ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                      : 'bg-blue-500/10 border-blue-400/20 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400/40'
                  }`}
                  title="Copy"
                >
                  <IconCopy />
                </button>
              </div>
              <p className="text-xs text-slate-500">{copied ? '✓ Copied to clipboard' : 'Your widget identifier'}</p>
            </div>
          </div>
        </div>

        {/* ═══════ جدول أسباب الإلغاء ═══════ */}
        <div className="relative rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl shadow-black/40">
          {/* شريط علوي متدرج */}
          <div className="h-1 bg-gradient-to-r from-amber-400 via-emerald-400 to-blue-400"></div>

          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/25 flex items-center justify-center text-amber-300">
                  <IconInbox />
                </div>
                <h2 className="text-xl font-bold text-white">Cancellation Reasons</h2>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/15 text-amber-200 border border-amber-400/25">
                  {events.length}
                </span>
              </div>
            </div>

            {events.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/10 to-emerald-500/10 border border-white/10 mb-6">
                  <span className="text-4xl opacity-60">✨</span>
                </div>
                <p className="text-slate-300 font-medium text-lg">All quiet here</p>
                <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
                  Click the{' '}
                  <span className="text-amber-300 font-medium">Test Widget</span>{' '}
                  button above to see how it works.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-2">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left pb-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Customer
                      </th>
                      <th className="text-left pb-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Reason
                      </th>
                      <th className="text-right pb-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr
                        key={event.id}
                        className="group border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors duration-200"
                      >
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-emerald-400 flex items-center justify-center text-sm font-bold text-[#080c1a] shadow-lg shadow-amber-500/15">
                              {event.customer_email
                                ? event.customer_email.charAt(0).toUpperCase()
                                : '?'}
                            </div>
                            <span className="text-slate-200 font-mono text-sm truncate max-w-[140px] md:max-w-[240px]">
                              {event.customer_email || 'Anonymous'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <span className="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-500/10 to-emerald-500/10 text-amber-100 border border-amber-400/20">
                            {event.reason}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <span className="text-xs text-slate-400 font-mono">
                            {new Date(event.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
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

        {/* ═══════ الفوتر ═══════ */}
        <footer className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-300/70">
              <IconShield />
            </span>
            <span className="text-xs text-slate-500 tracking-widest font-mono">
              SECURED BY SUPABASE RLS
            </span>
          </div>
        </footer>
      </div>

      {/* ═══════ Animations ═══════ */}
      <style jsx>{`
        @keyframes drift-1 {
          0%, 100% { opacity: 0.4; transform: translate(0, 0) scale(1); }
          50% { opacity: 0.7; transform: translate(40px, -30px) scale(1.1); }
        }
        @keyframes drift-2 {
          0%, 100% { opacity: 0.3; transform: translate(0, 0) scale(1); }
          50% { opacity: 0.6; transform: translate(-30px, 40px) scale(1.08); }
        }
        @keyframes drift-3 {
          0%, 100% { opacity: 0.25; transform: translate(0, 0) scale(1); }
          50% { opacity: 0.5; transform: translate(30px, 30px) scale(1.12); }
        }
        .animate-drift-1 { animation: drift-1 14s ease-in-out infinite; }
        .animate-drift-2 { animation: drift-2 16s ease-in-out infinite; }
        .animate-drift-3 { animation: drift-3 18s ease-in-out infinite; }
      `}</style>
    </div>
  );
}