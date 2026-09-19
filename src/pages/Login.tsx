import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role, User as UserType } from '../types';
import { User, Lock, Eye, EyeOff, LogIn, GraduationCap, ArrowRight } from 'lucide-react';

interface Props {
  defaultRole?: Role;
}

export const LoginChoice: React.FC<Props> = ({ defaultRole }) => {
  const { registerOrLoginUser, users, showToast, navigate } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>(defaultRole || 'student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      showToast('error', 'Please enter username and password', 'يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    setLoading(true);

    try {
      const cleanLower = cleanUsername.toLowerCase();

      // 1. Check if user is trying to log in as Admin
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

      // 2. Check if user exists in Firestore users array
      const existingUser = users.find(
        (u) => u.username.toLowerCase() === cleanLower || u.id.toLowerCase() === cleanLower
      );

      if (existingUser) {
        const expectedPassword = existingUser.password || existingUser.username;
        if (cleanPassword === expectedPassword || (cleanPassword === 'admin' && existingUser.role === 'admin')) {
          await registerOrLoginUser(existingUser);
          showToast('success', `Welcome back, ${existingUser.name}!`, `مرحباً بعودتك، ${existingUser.name}!`);
          navigate('/dashboard');
          return;
        }
      }

      // 3. Fallback check for default system accounts (teacher/teacher, coordinator/coordinator, student/student)
      if (
        (cleanLower === 'teacher' && cleanPassword === 'teacher') ||
        (cleanLower === 'coordinator' && cleanPassword === 'coordinator') ||
        (cleanLower === 'student' && cleanPassword === 'student')
      ) {
        const roleUser: UserType = {
          id: cleanLower,
          username: cleanLower,
          password: cleanPassword,
          name:
            cleanLower === 'teacher'
              ? 'Sarah Johnson'
              : cleanLower === 'coordinator'
              ? 'Academic Coordinator'
              : 'Ahmed Hassan',
          role: cleanLower as Role,
          groupName: cleanLower === 'student' ? 'Group A - Beginners' : ''
        };
        await registerOrLoginUser(roleUser);
        showToast('success', `Welcome back, ${roleUser.name}!`, `مرحباً بعودتك، ${roleUser.name}!`);
        navigate('/dashboard');
        return;
      }

      // 4. Otherwise, show Invalid credentials
      showToast('error', 'Invalid credentials', 'بيانات الدخول غير صحيحة');
    } catch (err) {
      console.error('Login error:', err);
      showToast('error', 'Invalid credentials', 'بيانات الدخول غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[440px] bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-300">
        
        {/* Top Floating White Badge with Learn Academy Logo */}
        <div className="w-24 h-24 mx-auto mb-5 rounded-full bg-white shadow-xl flex items-center justify-center border border-slate-100 p-2.5">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-400 p-1 flex items-center justify-center shadow-md">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[#584ee4]">
              <GraduationCap className="w-10 h-10 text-[#584ee4]" />
            </div>
          </div>
        </div>

        {/* Header Title */}
        <div className="text-center mb-7">
          <h1 className="text-2xl sm:text-[26px] font-black text-[#584ee4] tracking-tight mb-1">
            Learn Academy
          </h1>
          <p className="text-[#6f7e8c] font-extrabold text-base">
            {selectedRole === 'admin'
              ? 'Admin Login'
              : selectedRole === 'teacher'
              ? 'Teacher Login'
              : selectedRole === 'coordinator'
              ? 'Coordinator Login'
              : 'Student Login'}
          </p>
        </div>

        {/* Role Quick Selector Pills */}
        <div className="flex items-center justify-center gap-1.5 mb-6 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          {(['student', 'teacher', 'coordinator', 'admin'] as Role[]).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setSelectedRole(role)}
              className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold capitalize transition-all ${
                selectedRole === role
                  ? 'bg-[#584ee4] text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

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
                onChange={(e) => setUsername(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full bg-transparent text-slate-800 font-bold text-sm focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#6f7e8c] hover:text-slate-800 transition-colors ml-2 rtl:mr-2 rtl:ml-0 focus:outline-none"
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
            <span>{loading ? 'Connecting...' : 'Login'}</span>
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
