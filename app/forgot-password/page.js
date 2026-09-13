"use client";

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f1a] to-[#1f2942] flex items-center justify-center p-4">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-white text-center mb-2">Reset Password</h2>
        <p className="text-indigo-200/70 text-center text-sm mb-6">
          Enter your email and we'll send you a reset link
        </p>

        {sent ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-white font-medium mb-2">Check your email</p>
            <p className="text-slate-400 text-sm">
              We sent a password reset link to <span className="text-violet-300">{email}</span>
            </p>
            <Link href="/login" className="inline-block mt-6 text-violet-300 hover:text-violet-200 text-sm">
              ← Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white/70 text-sm block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="you@company.com"
                required
              />
            </div>

            {error && <p className="text-red-400 text-sm bg-red-500/10 p-2 rounded-lg">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3.5 rounded-2xl transition-all disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <p className="text-white/40 text-sm text-center mt-4">
              <Link href="/login" className="text-indigo-300 hover:text-indigo-200">
                ← Back to login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}