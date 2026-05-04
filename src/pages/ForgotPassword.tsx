import React, { useState } from 'react';
import { Mail, ArrowLeft, ShieldCheck, ShieldAlert, KeyRound, Lock, CheckCircle2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAppStore } from '../store/useStore';
import { clsx } from 'clsx';

const ForgotPassword = () => {
  const { forgotPassword, resetPassword, setActivePage } = useAppStore();
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'info' as 'success' | 'error' | 'info' });

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    const res = await forgotPassword(email);
    setLoading(false);

    if (res.success) {
      setMessage({ text: 'Check your email for the reset code.', type: 'success' });
      setStep('reset');
      if ((res as any).devToken) setToken((res as any).devToken);
    } else {
      setMessage({ text: res.message || 'Failed to send reset link', type: 'error' });
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage({ text: 'Please enter the reset code', type: 'error' });
      return;
    }
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
      setMessage({ text: res.message || 'Invalid or expired code', type: 'error' });
    }
  };

  const passwordRules = [
    { label: 'At least 8 characters', valid: newPassword.length >= 8 },
    { label: '1 uppercase, 1 number', valid: /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword) }
  ];

  return (
    <div className="min-h-screen w-full bg-[#050505] font-['DM_Sans'] text-white flex items-center justify-center p-6">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,_#111111_0%,_#050505_100%)] opacity-50" />
      
      <div className="relative z-10 w-full max-w-[440px] animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.7)]">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-[#f7c32e]/10 border border-[#f7c32e]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <KeyRound className="text-[#f7c32e] w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold font-['Syne'] tracking-tight mb-2">
              {step === 'request' ? 'Reset password' : 'Set new password'}
            </h2>
            <p className="text-white/40 text-[14px]">
              {step === 'request' 
                ? 'Enter your email and we’ll send a reset code' 
                : 'Enter the code from your email to reset your password'}
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
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20 group-focus-within:text-[#f7c32e] transition-colors" />
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    className="w-full bg-black/60 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-[15px] text-white outline-none transition-all placeholder:text-white/30 autofill:shadow-[0_0_0_1000px_#050505_inset_!important] [text-fill-color:white_!important] [-webkit-text-fill-color:white_!important] focus:border-[#f7c32e]/50 focus:bg-black/80"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[#f7c32e] hover:bg-[#f7c32e]/90 text-black font-bold text-[15px] tracking-wide transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-[#f7c32e]/10 flex items-center justify-center gap-2"
              >
                {loading ? "Sending..." : "Send Reset Code"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Reset Code</label>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20 group-focus-within:text-[#f7c32e] transition-colors" />
                    <input
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      required
                      autoFocus
                      className="w-full bg-black/60 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-[15px] text-white outline-none transition-all placeholder:text-white/30 autofill:shadow-[0_0_0_1000px_#050505_inset_!important] [text-fill-color:white_!important] [-webkit-text-fill-color:white_!important] focus:border-[#f7c32e]/50 focus:bg-black/80"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">New Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20 group-focus-within:text-[#f7c32e] transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full bg-black/60 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-[15px] text-white outline-none transition-all placeholder:text-white/30 autofill:shadow-[0_0_0_1000px_#050505_inset_!important] [text-fill-color:white_!important] [-webkit-text-fill-color:white_!important] focus:border-[#f7c32e]/50 focus:bg-black/80"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#f7c32e] transition-all z-10 p-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20 group-focus-within:text-[#f7c32e] transition-colors" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full bg-black/60 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-[15px] text-white outline-none transition-all placeholder:text-white/30 autofill:shadow-[0_0_0_1000px_#050505_inset_!important] [text-fill-color:white_!important] [-webkit-text-fill-color:white_!important] focus:border-[#f7c32e]/50 focus:bg-black/80"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#f7c32e] transition-all z-10 p-1"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
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
                disabled={loading || !passwordRules.every(r => r.valid) || newPassword !== confirmPassword || !token}
                className="w-full py-4 rounded-xl bg-[#f7c32e] hover:bg-[#f7c32e]/90 text-black font-bold text-[15px] tracking-wide transition-all active:scale-[0.98] disabled:opacity-40 shadow-xl shadow-[#f7c32e]/10 flex items-center justify-center gap-2"
              >
                {loading ? "Updating..." : "Update Password"}
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
