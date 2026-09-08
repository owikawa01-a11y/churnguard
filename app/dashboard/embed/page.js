"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EmbedPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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

      // نجيب الـ public_key
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

  const copyToClipboard = () => {
    if (!publicKey) return;
    const code = getEmbedCode(publicKey);
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const getEmbedCode = (key) => {
    return `<!-- ChurnGuard Widget -->
<script>
  window.ChurnGuardConfig = {
    publicKey: "${key}",
    customerEmail: null, // اختياري: لو عايز تعرف إيميل الزبون اللي بلغي
    cancelUrl: "/cancel" // الـ URL اللي هيتحول له الزبون بعد الإلغاء
  };
</script>
<script src="https://churnguard.vercel.app/widget.js" async></script>
<!-- End ChurnGuard Widget -->`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        
        {/* رجوع للـ Dashboard */}
        <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-2 mb-6 transition">
          ← Back to Dashboard
        </Link>

        {/* العنوان */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
            🚀 Install Widget
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Copy and paste this code into your website to start collecting cancellation reasons.
          </p>
        </div>

        {/* بطاقة الـ Public Key */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl shadow-black/20 mb-6">
          <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">Your Public Key</p>
          <div className="flex items-center gap-4">
            <code className="bg-black/50 px-4 py-2 rounded-lg text-emerald-300 font-mono text-sm border border-emerald-500/20 flex-1 truncate">
              {publicKey || 'Loading...'}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(publicKey || '');
                alert('Public key copied!');
              }}
              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-sm text-slate-300 transition border border-slate-600/30"
            >
              📋 Copy
            </button>
          </div>
        </div>

        {/* كود التثبيت */}
        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl shadow-black/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span>📄 Embed Code</span>
            </h2>
            <button
              onClick={copyToClipboard}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                copied 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/20'
              }`}
            >
              {copied ? '✅ Copied!' : '📋 Copy Code'}
            </button>
          </div>

          {/* عرض الكود */}
          <div className="bg-black/60 rounded-xl p-4 overflow-x-auto border border-slate-700/30">
            <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap">
              {publicKey ? getEmbedCode(publicKey) : 'Loading...'}
            </pre>
          </div>

          {/* تعليمات */}
          <div className="mt-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
            <h3 className="text-sm font-semibold text-white mb-2">📖 How to install:</h3>
            <ol className="text-sm text-slate-400 space-y-2 list-decimal list-inside">
              <li>Copy the code above.</li>
              <li>Paste it into your website's <code className="bg-black/50 px-1.5 py-0.5 rounded text-emerald-300 text-xs">&lt;head&gt;</code> or right before the closing <code className="bg-black/50 px-1.5 py-0.5 rounded text-emerald-300 text-xs">&lt;/body&gt;</code> tag.</li>
              <li>Add <code className="bg-black/50 px-1.5 py-0.5 rounded text-emerald-300 text-xs">data-churnguard-trigger</code> to your cancel button:</li>
            </ol>
            <div className="mt-2 bg-black/50 rounded-lg p-3">
              <code className="text-xs text-slate-300">
                &lt;button data-churnguard-trigger&gt;Cancel Subscription&lt;/button&gt;
              </code>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              💡 <span className="text-emerald-400">Tip:</span> Test it by clicking the <span className="text-indigo-300">"Test Widget"</span> button in your Dashboard.
            </p>
          </div>
        </div>

        {/* رجوع للـ Dashboard */}
        <div className="mt-6 text-center">
          <Link href="/dashboard" className="text-slate-500 hover:text-slate-400 text-sm transition">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}