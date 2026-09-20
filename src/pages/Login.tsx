import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User as UserType } from '../types';
import { User, Lock, Eye, EyeOff, LogIn, GraduationCap, ArrowRight, AlertCircle } from 'lucide-react';

export const LoginChoice: React.FC = () => {
  const { registerOrLoginUser, users, showToast, navigate } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      setErrorMessage('Please enter both username and password.');
      showToast('error', 'Please enter username and password', 'يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    setLoading(true);

    try {
      const cleanLower = cleanUsername.toLowerCase();

      // 1. Default system administrator account (admin / admin)
      if (cleanLower === 'admin' && cleanPassword === 'admin') {
        const adminUser: UserType = {
          id: 'admin',
          username: 'admin',
          password: 'admin',
          name: 'System Administrator',
          role: 'admin',
          groupName: ''
        };
        await registerOrLoginUser(adminUser);
        showToast('success', `Welcome back, ${adminUser.name}!`, `مرحباً بعودتك، ${adminUser.name}!`);
        navigate('/dashboard');
        return;
      }

      // 2. Real account authentication: Check against registered users in Firestore
      const existingUser = users.find(
        (u) =>
          (u.username && u.username.toLowerCase() === cleanLower) ||
          (u.id && u.id.toLowerCase() === cleanLower)
      );

      // Verify user exists in the database
      if (existingUser) {
        // Verify password matches the stored password
        if (existingUser.password === cleanPassword) {
          await registerOrLoginUser(existingUser);
          showToast('success', `Welcome back, ${existingUser.name}!`, `مرحباً بعودتك، ${existingUser.name}!`);
          navigate('/dashboard');
          return;
        } else {
          // Password mismatch
          setErrorMessage('Invalid credentials. The password you entered is incorrect.');
          showToast('error', 'Invalid credentials', 'بيانات الدخول غير صحيحة');
          return;
        }
      }

      // 3. User does NOT exist in real database: Reject with invalid credentials
      setErrorMessage('Invalid credentials. Account does not exist in the system.');
      showToast('error', 'Invalid credentials', 'بيانات الدخول غير صحيحة');
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('Invalid credentials or system connection error.');
      showToast('error', 'Invalid credentials', 'بيانات الدخول غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[440px] bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-300">
        
        {/* Top Floating White Badge with Learn Academy Logo */}
        <div className="w-24 h-24 mx-auto mb-5 rounded-full bg-white shadow-xl flex items-center justify-center border border-slate-100 p-1.5 overflow-hidden">
          <img
            src="/logo.png"
            alt="Learn Academy"
            className="w-full h-full object-contain rounded-full shadow-inner"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Header Title - Prominently says /login and NOT student login, without role switcher */}
        <div className="text-center mb-7">
          <h1 className="text-3xl sm:text-4xl font-black text-[#584ee4] tracking-tight mb-1 font-mono">
            /login
          </h1>
          <p className="text-[#6f7e8c] font-extrabold text-sm">
            Learn Academy
          </p>
        </div>

        {/* Inline Error Message Banner */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1 leading-snug">
              <p>{errorMessage}</p>
              <p className="text-[11px] text-rose-500 font-semibold mt-0.5" dir="rtl">بيانات الدخول غير صحيحة أو الحساب غير موجود في النظام</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Username Input with Border Label */}
          <div className="relative">
            <label className="absolute -top-2.5 left-5 px-1.5 bg-white text-[12px] font-bold text-[#6f7e8c] z-10 pointer-events-none">
              Username *
            </label>
            <div className="relative rounded-[1.8rem] border border-[#d1d7de] focus-within:border-[#584ee4] focus-within:ring-2 focus-within:ring-[#584ee4]/20 bg-white px-4 py-3.5 flex items-center transition-all">
              <div className="w-7 h-7 rounded-full bg-[#584ee4]/10 text-[#584ee4] flex items-center justify-center shrink-0 mr-3 rtl:ml-3 rtl:mr-0">
                <User className="w-4 h-4 fill-[#584ee4]" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Enter your username"
                required
                className="w-full bg-transparent text-slate-800 font-bold text-sm focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>
          </div>

          {/* Password Input with Border Label */}
          <div className="relative">
            <label className="absolute -top-2.5 left-5 px-1.5 bg-white text-[12px] font-bold text-[#6f7e8c] z-10 pointer-events-none">
              Password *
            </label>
            <div className="relative rounded-[1.8rem] border border-[#d1d7de] focus-within:border-[#584ee4] focus-within:ring-2 focus-within:ring-[#584ee4]/20 bg-white px-4 py-3.5 flex items-center transition-all">
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mr-3 rtl:ml-3 rtl:mr-0">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Enter your password"
                required
                className="w-full bg-transparent text-slate-800 font-bold text-sm focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#6f7e8c] hover:text-slate-800 transition-colors ml-2 rtl:mr-2 rtl:ml-0 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-[2rem] bg-gradient-to-r from-[#594ee3] via-[#6d50db] to-[#805ad5] hover:from-[#4c41d1] hover:to-[#7042c9] active:scale-[0.99] text-white font-black text-base shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 glow-btn"
          >
            <LogIn className="w-5 h-5" />
            <span>{loading ? 'Connecting...' : '/login'}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </form>

        {/* Register Now Redirect Link/Button */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center space-y-2">
          <p className="text-xs font-bold text-slate-500">Don't have an account yet?</p>
          <button
            onClick={() => navigate('/ads')}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all glow-btn cursor-pointer"
          >
            <span>Register Now / سجّل الآن</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

      </div>
    </div>
  );
};
