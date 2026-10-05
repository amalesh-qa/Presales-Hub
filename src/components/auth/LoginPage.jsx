import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, AlertCircle, Building2 } from 'lucide-react';
import { validateEmail } from '../../services/authService';

export default function LoginPage({ onProceedToOtp, availableUsers = [] }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const result = validateEmail(email);
      setLoading(false);

      if (!result.success) {
        setError(result.message);
      } else {
        onProceedToOtp(result.user.email);
      }
    }, 400);
  };

  const handleQuickSelect = (userEmail) => {
    setEmail(userEmail);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 shadow-lg shadow-indigo-500/25 mb-4 border border-indigo-400/30">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Presales Tracker</h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">Enterprise QE Proposal & Analytics Portal</p>
        </div>

        {/* Login Form Card */}
        <div className="glass-card rounded-2xl p-8 shadow-2xl border border-slate-800">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-1">Corporate Single Sign-On</h2>
            <p className="text-slate-400 text-xs">Enter your registered company email address to receive a secure OTP code.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-300 font-medium leading-relaxed">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Work Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. amalesh@qburst.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Send OTP Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts Helper */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Registered Demo Accounts:</span>
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickSelect('amalesh@qburst.com')}
                className="w-full px-3 py-2 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-800/40 text-left transition flex items-center justify-between group text-xs cursor-pointer"
              >
                <div>
                  <span className="font-semibold text-slate-200">amalesh@qburst.com</span>
                  <span className="ml-2 text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-mono">Admin</span>
                </div>
                <span className="text-[11px] text-indigo-400 group-hover:underline">Select</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('amaleshravi05@gmail.com')}
                className="w-full px-3 py-2 rounded-lg bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800 text-left transition flex items-center justify-between group text-xs cursor-pointer"
              >
                <div>
                  <span className="font-semibold text-slate-200">amaleshravi05@gmail.com</span>
                  <span className="ml-2 text-[10px] bg-slate-700/50 text-slate-300 px-1.5 py-0.5 rounded font-mono">User</span>
                </div>
                <span className="text-[11px] text-slate-400 group-hover:underline">Select</span>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-slate-500">
          Presales Tracker Dashboard &copy; 2026 Enterprise QE Division
        </div>
      </div>
    </div>
  );
}
