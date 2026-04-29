import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Check, ShieldAlert, Globe } from 'lucide-react';
import { clsx } from 'clsx';
import { useAppStore } from '../store/useStore';

const Login = () => {
  const { login: storeLogin } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({ email: false, password: false });
  const [loginError, setLoginError] = useState('');

  // Ticker items
  const tickerItems = ['Page Designing', 'Content Marketing', 'Branding', 'Social Media Marketing', 'SEO', 'SEM', 'Website Development', 'Performance Marketing', 'Video Production', 'Brand Strategy'];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    let hasError = false;
    const newErrors = { email: false, password: false };

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = true;
      hasError = true;
    }
    if (password.length < 6) {
      newErrors.password = true;
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    setLoading(true);
    const result = await storeLogin({ email, password });
    setLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setLoginError(result.message || 'Invalid email or password');
    }
  };

  return (
    <div className="login-page relative min-h-screen w-full bg-[#050505] overflow-hidden font-['DM_Sans'] text-white">
      {/* Static Premium Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(245,200,66,0.05)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,_rgba(232,117,42,0.05)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-[0.03]" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row min-h-screen w-full items-center justify-center px-6">
        <div className="flex flex-col md:flex-row w-full max-w-[1000px] items-center justify-center gap-8 md:gap-16 lg:gap-24">
          
          {/* Left Content - Brand Identity */}
          <div className="hidden md:flex flex-1 flex-col items-center md:items-start text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
              <span className="w-1.5 h-1.5 bg-[#f5c842] rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Admin Portal v2.0</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-['Syne'] leading-[1.1] mb-6 tracking-tight">
              Marketing <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5c842] to-[#e8752a]">Masterminds</span>
            </h1>
            <p className="text-white/45 text-[15px] max-w-md leading-relaxed mb-8">
              Welcome back to the Inbounderz HQ. Access your dashboard to manage enquiries, track careers, and scale your brand identity with data-driven insights.
            </p>
            
            {/* Simple Ticker */}
            <div className="w-full overflow-hidden relative h-6">
              <div className="flex gap-6 animate-marquee whitespace-nowrap">
                {tickerItems.map((item, i) => (
                  <span key={i} className="text-[11px] font-bold uppercase tracking-widest text-white/20">{item}</span>
                ))}
                {tickerItems.map((item, i) => (
                  <span key={`dup-${i}`} className="text-[11px] font-bold uppercase tracking-widest text-white/20">{item}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="w-full max-w-[420px] shrink-0">
            <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
              {/* Card Decor */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f5c842]/10 blur-[60px] -mr-16 -mt-16" />
              
              <div className="relative z-10 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-[#f5c842] to-[#e8752a] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
                  <Globe className="text-black w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold font-['Syne'] tracking-tight mb-2">Secure Access</h2>
                <p className="text-white/40 text-sm">Enter your credentials to continue to Nexus.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5 relative z-10">
                <div className="space-y-2">
                  <label className="block text-[12px] font-medium text-white/45 uppercase tracking-wider">Work Email</label>
                  <div className="relative flex items-center group">
                    <Mail className={clsx(
                      "absolute left-3.5 w-3.5 h-3.5 transition-colors",
                      errors.email ? "text-red-500" : "text-white/30 group-focus-within:text-[#f5c842]"
                    )} />
                    <input
                      type="email"
                      placeholder="name@inbounderz.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: false })) }}
                      className={clsx(
                        "w-full bg-white/[0.04] border rounded-xl py-3.5 pl-10 pr-4 text-[14px] outline-none transition-all placeholder:text-white/20",
                        errors.email ? "border-red-500/50" : "border-white/10 focus:border-[#f5c842]/50 focus:bg-white/10"
                      )}
                    />
                  </div>
                  {errors.email && <div className="text-[11px] text-red-400 mt-1">Please enter a valid email.</div>}
                </div>

                <div className="space-y-2">
                  <label className="block text-[12px] font-medium text-white/45 uppercase tracking-wider">Password</label>
                  <div className="relative flex items-center group">
                    <Lock className={clsx(
                      "absolute left-3.5 w-3.5 h-3.5 transition-colors",
                      errors.password ? "text-red-500" : "text-white/30 group-focus-within:text-[#f5c842]"
                    )} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: false })) }}
                      className={clsx(
                        "w-full bg-white/[0.04] border rounded-xl py-3.5 pl-10 pr-11 text-[14px] outline-none transition-all placeholder:text-white/20",
                        errors.password ? "border-red-500/50" : "border-white/10 focus:border-[#f5c842]/50 focus:bg-white/10"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-white/30 hover:text-[#f5c842] transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <div className="text-[11px] text-red-400 mt-1">Password must be at least 6 characters.</div>}
                </div>

                <div className="flex items-center justify-between pb-2">
                  <label className="flex items-center gap-2 cursor-pointer text-[13px] text-white/40">
                    <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 accent-[#f5c842]" />
                    Remember me
                  </label>
                  <a href="#" className="text-[13px] text-[#f5c842] hover:underline">Forgot?</a>
                </div>

                {loginError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[12px] flex items-center gap-2">
                    <ShieldAlert size={14} />
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || success}
                  className={clsx(
                    "w-full py-4 rounded-xl bg-gradient-to-br from-[#f5c842] to-[#e8752a] text-[#1a0e00] font-['Syne'] font-bold text-[15px] tracking-wide transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center",
                    success ? "bg-green-500" : "hover:shadow-[0_8px_30px_rgba(245,200,66,0.3)]"
                  )}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </div>
                  ) : success ? (
                    <div className="flex items-center gap-2">
                      <Check size={18} />
                      <span>Authenticated</span>
                    </div>
                  ) : (
                    "Sign In to Nexus"
                  )}
                </button>
              </form>
            </div>
            
            <p className="mt-8 text-center text-white/20 text-[11px] uppercase tracking-[0.2em] font-bold">
              © 2026 Inbounderz Global • All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
