"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [publicKey, setPublicKey] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // جلب الـ public_key
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

      // جلب أسباب الإلغاء
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

  // ✅ دالة محسّنة: تنتظر تحميل الـ Widget فعلياً
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
      <div className="min-h-screen bg-[#050410] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-emerald-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
      </div>
    );
  }

  const todayCount = events.filter(e => new Date(e.created_at).toDateString() === new Date().toDateString()).length;

  return (
    <div className="relative min-h-screen bg-[#050410] text-white font-sans overflow-x-hidden">

      {/* 🌌 الخلفية الفضائية — توهجات متحركة */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-30%] left-[-15%] w-[700px] h-[700px] bg-violet-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute top-[40%] right-[-20%] w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-[120px] animate-pulse-slow-delay"></div>
        <div className="absolute bottom-[-30%] left-[30%] w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[140px] animate-pulse-slow-delay-2"></div>
        {/* شبكة خفيفة */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-10">

        {/* ═══ الهيدر ═══ */}
        <header className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-emerald-400 rounded-xl blur-md opacity-50"></div>
                  <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-emerald-400 flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl font-bold">C</span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-violet-200 via-white to-emerald-200 bg-clip-text text-transparent">
                    Dashboard
                  </span>
                </h1>
              </div>
              <p className="text-slate-400 text-sm ml-14">
                Welcome back, <span className="text-violet-300 font-mono">{user?.email}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3 ml-14 md:ml-0">
              <Link href="/dashboard/embed">
                <button className="group relative px-5 py-2.5 rounded-xl text-sm font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 flex items-center gap-2">
                  <span>🚀</span>
                  <span>Install Widget</span>
                </button>
              </Link>

              <button
                onClick={simulateCancellation}
                className="group relative px-5 py-2.5 rounded-xl text-sm font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 transition-all duration-300 group-hover:from-violet-500 group-hover:to-fuchsia-500"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_30px_rgba(168,85,247,0.6)]"></div>
                <div className="relative flex items-center gap-2">
                  <span>🧪</span>
                  <span>Test Widget</span>
                  <span className="text-xs opacity-70 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>

              <button
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-xl text-sm text-slate-400 bg-white/[0.03] border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-300 transition-all duration-300"
              >
                Log Out
              </button>
            </div>
          </div>
        </header>

        {/* ═══ بطاقات الإحصائيات ═══ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

          {/* بطاقة ١ — Total */}
          <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-violet-500/40 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-violet-500/40 transition-all duration-500"></div>
            <div className="relative">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Total Cancellations</span>
                <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-lg">📉</div>
              </div>
              <p className="text-5xl font-black bg-gradient-to-br from-white to-violet-300 bg-clip-text text-transparent">{events.length}</p>
              <p className="text-xs text-slate-500 mt-2">All-time cancellations</p>
            </div>
          </div>

          {/* بطاقة ٢ — Today */}
          <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/40 transition-all duration-500"></div>
            <div className="relative">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Today</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-lg">📅</div>
              </div>
              <p className="text-5xl font-black bg-gradient-to-br from-white to-emerald-300 bg-clip-text text-transparent">{todayCount}</p>
              <p className="text-xs text-slate-500 mt-2">Since midnight</p>
            </div>
          </div>

          {/* بطاقة ٣ — Public Key */}
          <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-cyan-500/40 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/40 transition-all duration-500"></div>
            <div className="relative">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Public Key</span>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-lg">🔑</div>
              </div>
              <p className="text-xs font-mono text-cyan-300 bg-black/40 px-3 py-2 rounded-lg border border-cyan-500/20 truncate">
                {publicKey || 'N/A'}
              </p>
              <p className="text-xs text-slate-500 mt-2">Your widget identifier</p>
            </div>
          </div>
        </div>

        {/* ═══ جدول أسباب الإلغاء ═══ */}
        <div className="relative rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] backdrop-blur-xl border border-white/10 overflow-hidden">

          {/* شريط علوي متدرج */}
          <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-emerald-400"></div>

          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📋</span>
                <h2 className="text-xl font-bold text-white">Cancellation Reasons</h2>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {events.length}
                </span>
              </div>
            </div>

            {events.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-violet-500/10 to-emerald-500/10 border border-white/10 mb-6">
                  <span className="text-4xl opacity-60">✨</span>
                </div>
                <p className="text-slate-300 font-medium text-lg">No cancellations yet</p>
                <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
                  Click the <span className="text-violet-300 font-medium">Test Widget</span> button above to see how it works.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-2">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left pb-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                      <th className="text-left pb-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Reason</th>
                      <th className="text-right pb-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr key={event.id} className="group border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors duration-200">
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-emerald-400 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-violet-500/20">
                              {event.customer_email ? event.customer_email.charAt(0).toUpperCase() : '?'}
                            </div>
                            <span className="text-slate-200 font-mono text-sm truncate max-w-[140px] md:max-w-[240px]">
                              {event.customer_email || 'Anonymous'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <span className="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-violet-500/15 to-emerald-500/15 text-violet-200 border border-violet-500/20">
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

        {/* ═══ الفوتر ═══ */}
        <footer className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs text-slate-500 tracking-widest font-mono">SECURED BY SUPABASE RLS</span>
          </div>
        </footer>
      </div>

      {/* 🎬 أنيميشنات مخصصة */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        @keyframes pulse-slow-delay {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes pulse-slow-delay-2 {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.08); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        .animate-pulse-slow-delay {
          animation: pulse-slow-delay 10s ease-in-out infinite;
        }
        .animate-pulse-slow-delay-2 {
          animation: pulse-slow-delay-2 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}