import React, { useState } from 'react';
import { Mail, ArrowLeft, ShieldCheck, ShieldAlert, KeyRound, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/useStore';
import { clsx } from 'clsx';

const ForgotPassword = () => {
  const { forgotPassword, resetPassword, setActivePage } = useAppStore();
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'info' as 'success' | 'error' | 'info' });

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    const res = await forgotPassword(email);
    setLoading(false);

    if (res.success) {
      setMessage({ text: 'Check your email for a reset link.', type: 'success' });
      setStep('reset');
      if ((res as any).devToken) setToken((res as any).devToken);
    } else {
      setMessage({ text: res.message || 'Failed to send reset link', type: 'error' });
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }
    if (newPassword.length < 8) {
      setMessage({ text: 'Password must be at least 8 characters', type: 'error' });
      return;
    }

    setLoading(true);
    const res = await resetPassword({ token, newPassword });
    setLoading(false);

    if (res.success) {
      setMessage({ text: 'Password updated. You can now sign in.', type: 'success' });
      setTimeout(() => setActivePage('login'), 2000);
    } else {
      setMessage({ text: res.message || 'Failed to update password', type: 'error' });
    }
  };

  const passwordRules = [
    { label: 'At least 8 characters', valid: newPassword.length >= 8 },
    { label: '1 uppercase, 1 number', valid: /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword) }
  ];

  return (
    <div className="min-h-screen w-full bg-[#050505] font-['Inter'] text-white flex items-center justify-center p-6">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,_#111111_0%,_#050505_100%)] opacity-50" />
      
      <div className="relative z-10 w-full max-w-[440px] animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 md:p-10 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-blue-600/10 border border-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <KeyRound className="text-blue-500 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              {step === 'request' ? 'Reset your password' : 'Create a new password'}
            </h2>
            <p className="text-white/40 text-[14px]">
              {step === 'request' 
                ? 'Enter your email and we’ll send a reset link' 
                : 'Please set a secure password for your account'}
            </p>
          </div>

          {message.text && (
            <div className={clsx(
              "mb-6 p-4 rounded-2xl text-[13px] flex items-start gap-3 border animate-in slide-in-from-top-2",
              message.type === 'success' ? "bg-green-500/5 border-green-500/20 text-green-400" : 
              message.type === 'error' ? "bg-red-500/5 border-red-500/20 text-red-400" :
              "bg-blue-500/5 border-blue-500/20 text-blue-400"
            )}>
              {message.type === 'error' ? <ShieldAlert size={18} className="shrink-0" /> : <ShieldCheck size={18} className="shrink-0" />}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          {step === 'request' ? (
            <form onSubmit={handleRequest} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-[15px] outline-none focus:border-blue-600/50 focus:bg-white/[0.05] transition-all placeholder:text-white/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[15px] tracking-wide transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                {loading ? "Sending link..." : "Send reset link"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">New Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-[15px] outline-none focus:border-blue-600/50 focus:bg-white/[0.05] transition-all placeholder:text-white/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-[15px] outline-none focus:border-blue-600/50 focus:bg-white/[0.05] transition-all placeholder:text-white/10"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-3">Security Requirements</p>
                {passwordRules.map((rule, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 size={14} className={rule.valid ? "text-green-500" : "text-white/10"} />
                    <span className={clsx("text-[12px] font-medium transition-colors", rule.valid ? "text-white/80" : "text-white/30")}>
                      {rule.label}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || !passwordRules.every(r => r.valid) || newPassword !== confirmPassword}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[15px] tracking-wide transition-all active:scale-[0.98] disabled:opacity-40 shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                {loading ? "Updating..." : "Update password"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          )}

          <button
            onClick={() => step === 'reset' ? setStep('request') : setActivePage('login')}
            className="w-full mt-8 flex items-center justify-center gap-2 text-white/30 hover:text-white transition-colors text-[13px] font-bold group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
