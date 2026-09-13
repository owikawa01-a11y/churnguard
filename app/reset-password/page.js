"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user came from reset link
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setReady(true);
      } else {
        // Wait for auth to process the hash
        setTimeout(async () => {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) setReady(true);
          else setError('Invalid or expired reset link. Please request a new one.');
        }, 1500);
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      alert('Password updated! Redirecting to dashboard...');
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f1a] to-[#1f2942] flex items-center justify-center p-4">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-white text-center mb-2">New Password</h2>
        <p className="text-indigo-200/70 text-center text-sm mb-6">
          Choose a strong password for your account
        </p>

        {!ready && !error && (
          <p className="text-slate-400 text-center py-6">Verifying link...</p>
        )}

        {error && (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <a href="/forgot-password" className="text-violet-300 hover:text-violet-200 text-sm">
              ← Request new link
            </a>
          </div>
        )}

        {ready && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white/70 text-sm block mb-1">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3.5 rounded-2xl transition-all disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}