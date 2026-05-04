import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, ArrowRight, UserPlus, Globe } from 'lucide-react';
import { clsx } from 'clsx';
import { useAppStore } from '../store/useStore';

const Login = () => {
  const { login: storeLogin, setActivePage } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');

  // Auto-focus email on load
  const emailRef = React.useRef<HTMLInputElement>(null);
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setEmailError('');
    setPasswordError('');

    if (!validateEmail(email)) {
      setEmailError('Enter a valid email address');
      return;
    }
    if (password.length < 1) {
      setPasswordError('Password is required');
      return;
    }

    setLoading(true);
    const result = await storeLogin({ email, password });
    setLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setLoginError(result.message || 'Email or password is incorrect');
    }
  };

  const isFormValid = validateEmail(email) && password.length >= 6;

  return (
    <div className="min-h-screen w-full bg-[#050505] font-['DM_Sans'] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Immersive Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#f7c32e]/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#f7c32e]/5 rounded-full blur-[100px] animate-pulse delay-700" />

      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="w-full max-w-[440px] relative z-10 animate-in fade-in zoom-in-95 duration-700">
        {/* Glass Card */}
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.7)] relative overflow-hidden">
          {/* Subtle top highlight */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#f7c32e]/30 to-transparent" />

          <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#f7c32e] to-[#d4a017] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#f7c32e]/20">
              <Globe className="text-black w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold font-['Syne'] tracking-tight mb-2">Welcome back</h2>
            <p className="text-white/40 text-sm font-medium">Sign in to manage your enquiries and leads</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Email address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20 group-focus-within:text-[#f7c32e] transition-colors" />
                <input
                  ref={emailRef}
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
                  className={clsx(
                    "w-full bg-black/60 border rounded-xl py-4 pl-12 pr-4 text-[15px] text-white outline-none transition-all placeholder:text-white/30",
                    "autofill:shadow-[0_0_0_1000px_#050505_inset_!important] [text-fill-color:white_!important] [-webkit-text-fill-color:white_!important]",
                    emailError ? "border-red-500/50 bg-red-500/5" : "border-white/10 focus:border-[#f7c32e]/50 focus:bg-black/80"
                  )}
                />
              </div>
              {emailError && <p className="text-[11px] text-red-500 font-bold ml-1">{emailError}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="block text-[11px] font-bold text-white/30 uppercase tracking-[0.2em]">Password</label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20 group-focus-within:text-[#f7c32e] transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPasswordError('') }}
                  className={clsx(
                    "w-full bg-black/60 border rounded-xl py-4 pl-12 pr-12 text-[15px] text-white outline-none transition-all placeholder:text-white/30",
                    "autofill:shadow-[0_0_0_1000px_#050505_inset_!important] [text-fill-color:white_!important] [-webkit-text-fill-color:white_!important]",
                    passwordError ? "border-red-500/50 bg-red-500/5" : "border-white/10 focus:border-[#f7c32e]/50 focus:bg-black/80"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#f7c32e] transition-all z-10 p-1"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <div className='w-full flex justify-end m-auto mt-2'>
                  <button
                    type="button"
                    onClick={() => setActivePage('forgot-password')}
                    className="text-[11px] font-bold text-[#f7c32e] hover:text-[#f7c32e]/80 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
              {passwordError && <p className="text-[11px] text-red-500 font-bold ml-1">{passwordError}</p>}
            </div>

            {loginError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[12px] flex items-center gap-3 animate-in fade-in zoom-in-95">
                <ShieldAlert size={16} className="shrink-0" />
                <span className="font-bold">{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || success || !isFormValid}
              className={clsx(
                "w-full py-4 rounded-xl text-black font-bold text-[15px] tracking-wide transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed group relative overflow-hidden",
                success ? "bg-green-600 text-white" : "bg-[#f7c32e] hover:bg-[#f7c32e]/90 shadow-xl shadow-[#f7c32e]/10"
              )}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? "Signing in..." : success ? "Verified" : "Sign in"}
                {!loading && !success && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-white/5" />
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">or continue with</span>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              className="py-3 border border-white/5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-colors flex items-center justify-center gap-2 group"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#f7c32e"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#f7c32e"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#f7c32e"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#f7c32e"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-[13px] font-semibold">Google</span>
            </button>
            {/* <button
              type="button"
              className="py-3 border border-white/5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-colors flex items-center justify-center gap-2 group"
            >
              <span className="text-[13px] font-semibold">LinkedIn</span>
            </button> */}
          </div>

          <div className="mt-8 text-center">
            {/* <button 
              onClick={() => setActivePage('register')}
              className="text-[13px] font-medium text-white/40 hover:text-white transition-colors"
            >
              Don't have an account? <span className="text-[#f7c32e] font-bold">Sign up free</span>
            </button> */}
          </div>
        </div>

        <footer className="mt-12 text-center text-white/10 text-[10px] uppercase tracking-[0.4em] font-bold">
          Nexus Secure Protocol • © 2026
        </footer>
      </div>
    </div>
  );
};

export default Login;
