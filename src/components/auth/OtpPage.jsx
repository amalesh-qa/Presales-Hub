import React, { useState, useEffect } from 'react';
import { KeyRound, ArrowLeft, CheckCircle2, AlertCircle, Copy, Zap } from 'lucide-react';
import { requestOtp, verifyOtp } from '../../services/authService';

export default function OtpPage({ email, onBack, onLoginSuccess }) {
  const [otpCode, setOtpCode] = useState('');
  const [activeCode, setActiveCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  // Generate OTP on component mount
  useEffect(() => {
    generateNewOtp();
  }, [email]);

  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const generateNewOtp = () => {
    try {
      const result = requestOtp(email);
      setActiveCode(result.code);
      setError('');
      setResendTimer(30);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerify = (e) => {
    e?.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setError('Please enter a valid 6-digit OTP code.');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      const result = verifyOtp(email, otpCode);
      setLoading(false);

      if (!result.success) {
        setError(result.message);
      } else {
        onLoginSuccess(result.user);
      }
    }, 400);
  };

  const handleAutoFill = () => {
    if (activeCode) {
      setOtpCode(activeCode);
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Email Step</span>
        </button>

        {/* OTP Card */}
        <div className="glass-card rounded-2xl p-8 shadow-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <KeyRound className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              Step 2 of 2
            </span>
          </div>

          <h2 className="text-xl font-bold text-white mb-1">Verify Security Code</h2>
          <p className="text-slate-400 text-xs mb-6 leading-relaxed">
            We sent a One-Time Password to <span className="font-semibold text-indigo-300">{email}</span>. Please enter the 6-digit code below.
          </p>

          {/* Interactive Simulated OTP Notification Toast */}
          {activeCode && (
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-indigo-950/60 border border-emerald-500/30 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Demo Mail Simulation</div>
                  <div className="text-sm font-mono font-bold text-white tracking-widest mt-0.5">{activeCode}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAutoFill}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition flex items-center gap-1 shadow cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Auto-fill</span>
              </button>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-300 font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                6-Digit Security OTP
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value.replace(/[^0-9]/g, ''));
                  setError('');
                }}
                placeholder="123456"
                className="w-full text-center text-2xl font-mono tracking-[0.5em] py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-indigo-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otpCode.length < 6}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span>Verify & Continue</span>
              )}
            </button>
          </form>

          {/* Resend Code Section */}
          <div className="mt-6 text-center text-xs">
            {resendTimer > 0 ? (
              <span className="text-slate-500">
                Resend code in <span className="font-mono text-indigo-400 font-semibold">{resendTimer}s</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={generateNewOtp}
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition cursor-pointer underline"
              >
                Resend OTP Code
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
