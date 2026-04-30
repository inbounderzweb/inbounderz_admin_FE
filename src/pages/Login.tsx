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
    <div className="login-page relative min-h-screen w-full bg-[#050505] overflow-hidden font-['DM_Sans'] text-white flex flex-col items-center justify-center">
      {/* Static Subtle Background */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,_#111111_0%,_#050505_100%)]" />

      <div className="relative z-10 w-full max-w-[420px] px-6">
        <div className="bg-[#111111] border border-white/5 rounded-[24px] p-8 md:p-10 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/20">
              <Globe className="text-white w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold font-['Syne'] tracking-tight mb-2">Nexus Login</h2>
            <p className="text-white/40 text-sm">Sign in to the Inbounderz Admin Portal.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-white/30 uppercase tracking-widest">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-4 h-4 text-white/20" />
                <input
                  type="email"
                  placeholder="admin@inbounderz.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: false })) }}
                  className={clsx(
                    "w-full bg-white/[0.03] border rounded-xl py-3.5 pl-12 pr-4 text-[14px] outline-none transition-all placeholder:text-white/10",
                    errors.email ? "border-red-500/50" : "border-white/5 focus:border-blue-600/50"
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-white/30 uppercase tracking-widest">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-4 h-4 text-white/20" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: false })) }}
                  className={clsx(
                    "w-full bg-white/[0.03] border rounded-xl py-3.5 pl-12 pr-12 text-[14px] outline-none transition-all placeholder:text-white/10",
                    errors.password ? "border-red-500/50" : "border-white/5 focus:border-blue-600/50"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-white/20 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[12px] flex items-center gap-3">
                <ShieldAlert size={16} />
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || success}
              className={clsx(
                "w-full py-4 rounded-xl bg-blue-600 text-white font-['Syne'] font-bold text-[15px] tracking-wide transition-all active:scale-[0.98] disabled:opacity-70",
                success ? "bg-green-600" : "hover:bg-blue-700 shadow-lg shadow-blue-600/20"
              )}
            >
              {loading ? "Authenticating..." : success ? "Welcome Back" : "Sign In"}
            </button>
          </form>
        </div>
        
        <p className="mt-8 text-center text-white/10 text-[10px] uppercase tracking-[0.3em] font-bold">
          Nexus Secure System • © 2026
        </p>
      </div>
    </div>
  );
};

export default Login;
