import React, { useState } from 'react';
import { Mail, ArrowLeft, ShieldCheck, ShieldAlert, Globe, KeyRound } from 'lucide-react';
import { useAppStore } from '../store/useStore';
import { clsx } from 'clsx';

const ForgotPassword = () => {
  const { forgotPassword, resetPassword, setActivePage } = useAppStore();
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'info' as 'success' | 'error' | 'info' });

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    const res = await forgotPassword(email);
    setLoading(false);

    if (res.success) {
      setMessage({ text: res.message || 'OTP sent to your email', type: 'success' });
      setStep('reset');
      // In dev mode, the token is returned. We can pre-fill it for convenience
      if ((res as any).devToken) {
        setToken((res as any).devToken);
      }
    } else {
      setMessage({ text: res.message || 'Failed to send reset request', type: 'error' });
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newPassword) return;

    setLoading(true);
    const res = await resetPassword({ token, newPassword });
    setLoading(false);

    if (res.success) {
      setMessage({ text: 'Password reset successfully! Redirecting to login...', type: 'success' });
      setTimeout(() => setActivePage('login'), 2000);
    } else {
      setMessage({ text: res.message || 'Failed to reset password', type: 'error' });
    }
  };

  return (
    <div className="login-page relative min-h-screen w-full bg-[#050505] overflow-hidden font-['DM_Sans'] text-white flex flex-col items-center justify-center">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,_#111111_0%,_#050505_100%)]" />

      <div className="relative z-10 w-full max-w-[420px] px-6">
        <div className="bg-[#111111] border border-white/5 rounded-[24px] p-8 md:p-10 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/20">
              <KeyRound className="text-white w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold font-['Syne'] tracking-tight mb-2">
              {step === 'request' ? 'Reset Password' : 'Enter OTP'}
            </h2>
            <p className="text-white/40 text-sm">
              {step === 'request' 
                ? 'Enter your email to receive a password reset token.' 
                : 'Enter the 6-digit token and your new password.'}
            </p>
          </div>

          {message.text && (
            <div className={clsx(
              "mb-6 p-4 border rounded-xl text-[12px] flex items-center gap-3",
              message.type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-400" : 
              message.type === 'error' ? "bg-red-500/10 border-red-500/20 text-red-400" :
              "bg-blue-500/10 border-blue-500/20 text-blue-400"
            )}>
              {message.type === 'error' ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
              {message.text}
            </div>
          )}

          {step === 'request' ? (
            <form onSubmit={handleRequest} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-white/30 uppercase tracking-widest">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 w-4 h-4 text-white/20" />
                  <input
                    type="email"
                    placeholder="admin@inbounderz.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-[14px] outline-none focus:border-blue-600/50 transition-all placeholder:text-white/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-['Syne'] font-bold text-[15px] tracking-wide transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-blue-600/20"
              >
                {loading ? "Sending..." : "Send Reset Token"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-white/30 uppercase tracking-widest">Reset Token</label>
                <input
                  type="text"
                  placeholder="6-digit OTP"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                  maxLength={6}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3.5 px-4 text-center text-[20px] font-bold tracking-[0.5em] outline-none focus:border-blue-600/50 transition-all placeholder:text-white/10"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-white/30 uppercase tracking-widest">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3.5 px-4 text-[14px] outline-none focus:border-blue-600/50 transition-all placeholder:text-white/10"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-['Syne'] font-bold text-[15px] tracking-wide transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-blue-600/20"
              >
                {loading ? "Resetting..." : "Update Password"}
              </button>
            </form>
          )}

          <button
            onClick={() => step === 'reset' ? setStep('request') : setActivePage('login')}
            className="w-full mt-6 flex items-center justify-center gap-2 text-white/30 hover:text-white transition-colors text-[12px] font-medium"
          >
            <ArrowLeft size={14} />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
