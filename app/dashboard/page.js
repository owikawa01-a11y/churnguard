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

  // 1. جلب البيانات
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

  const simulateCancellation = () => {
    if (!publicKey) {
      alert('Public key not found. Please log in again.');
      return;
    }
    const script = document.createElement('script');
    script.src = '/widget.js';
    document.body.appendChild(script);
    setTimeout(() => {
      window.ChurnGuardConfig = {
        publicKey: publicKey,
        customerEmail: 'demo@customer.com',
        cancelUrl: '/dashboard'
      };
      if (window.ChurnGuard) window.ChurnGuard.show();
      else alert('Widget not loaded yet.');
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // ===========================================================
  // الواجهة الرئيسية
  // ===========================================================
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans overflow-x-hidden">
      
      {/* تأثيرات الخلفية */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-10">
        
        {/* الهيدر */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-300 via-white to-purple-300 bg-clip-text text-transparent">
              📊 Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Welcome back, <span className="text-indigo-300 font-mono">{user?.email}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {/* زر Install Widget (جديد) */}
            <Link href="/dashboard/embed">
              <button className="px-5 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-xl text-sm text-emerald-300 transition-all duration-300 flex items-center gap-2">
                🚀 Install Widget
              </button>
            </Link>
            
            {/* زر Test Widget */}
            <button
              onClick={simulateCancellation}
              className="group relative px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2 border border-white/10"
            >
              <span>🧪 Test Widget</span>
              <span className="text-xs opacity-60 group-hover:opacity-100 transition">→</span>
            </button>
            
            {/* زر Log Out */}
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 rounded-xl text-sm text-slate-300 hover:text-red-300 transition-all duration-300"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl shadow-black/20 hover:border-indigo-500/30 transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Total Cancellations</p>
                <p className="text-4xl font-extrabold text-white mt-2 group-hover:text-indigo-300 transition-colors">{events.length}</p>
              </div>
              <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <span className="text-xl">📉</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl shadow-black/20 hover:border-purple-500/30 transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Today</p>
                <p className="text-4xl font-extrabold text-white mt-2 group-hover:text-purple-300 transition-colors">
                  {events.filter(e => new Date(e.created_at).toDateString() === new Date().toDateString()).length}
                </p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <span className="text-xl">📅</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl shadow-black/20 hover:border-emerald-500/30 transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Your Public Key</p>
                <p className="text-xs font-mono text-emerald-300 mt-2 truncate max-w-[150px] sm:max-w-[200px] bg-black/30 px-2 py-1 rounded border border-emerald-500/20">
                  {publicKey || 'N/A'}
                </p>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <span className="text-xl">🔑</span>
              </div>
            </div>
          </div>
        </div>

        {/* جدول الأسباب */}
        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl shadow-black/30">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span>📋 Cancellation Reasons</span>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/20">{events.length}</span>
            </h2>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-700/50 rounded-xl">
              <div className="text-5xl mb-4 opacity-50">🔮</div>
              <p className="text-slate-400 font-medium">No cancellations recorded yet.</p>
              <p className="text-slate-500 text-sm mt-1">Press the <span className="text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Test Widget</span> button to simulate one.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700/70">
                    <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer</th>
                    <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Reason</th>
                    <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {events.map((event) => (
                    <tr key={event.id} className="group hover:bg-white/5 transition-all duration-200">
                      <td className="py-4 pr-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/5 text-xs font-bold text-indigo-300">
                            {event.customer_email ? event.customer_email.charAt(0).toUpperCase() : '?'}
                          </div>
                          <span className="text-slate-200 font-mono text-xs truncate max-w-[120px] md:max-w-[200px]">
                            {event.customer_email || 'Anonymous'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-sm text-white/90">
                        <span className="bg-slate-700/30 px-3 py-1 rounded-full text-xs border border-white/5">
                          {event.reason}
                        </span>
                      </td>
                      <td className="py-4 text-xs text-slate-400 font-mono text-right">
                        {new Date(event.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-slate-600/50 text-xs text-center mt-8 tracking-widest">
          🔒 SECURED BY SUPABASE RLS
        </p>
      </div>
    </div>
  );
}