import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import {
  GraduationCap,
  Globe2,
  Gamepad2,
  Briefcase,
  Bell,
  LayoutDashboard,
  LogIn,
  LogOut,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Video
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    currentUser,
    setCurrentUser,
    notifications,
    navigate,
    currentPath,
    showToast
  } = useApp();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);

  const t = translations[language];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNav = (path: string) => {
    navigate(path);
    setMenuOpen(false);
    setLoginDropdownOpen(false);
  };

  const handleSectionNav = (sectionId: string) => {
    setMenuOpen(false);
    setLoginDropdownOpen(false);
    if (currentPath !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('info', 'Logged out successfully', 'تم تسجيل الخروج بنجاح');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#4f46e5] border-b border-white/10 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Toggle - VISIBLE ON ALL DEVICES (Desktop & Mobile) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all glow-btn cursor-pointer"
            title="Open Navigation Menu"
            aria-label="Open Navigation Menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo & Name */}
          <div
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 cursor-pointer group glow-element"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-400 flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap className="w-7 h-7 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  {t.academyName}
                </span>
              </div>
              <p className="text-[11px] text-amber-300 font-bold hidden sm:block">
                Navigation Menu
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Quick Nav Shortcuts */}
        <nav className="hidden lg:flex items-center gap-1.5">
          <button
            onClick={() => handleNav('/')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all glow-btn ${
              currentPath === '/'
                ? 'bg-white/20 text-white shadow'
                : 'text-indigo-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            {t.home}
          </button>

          <button
            onClick={() => handleNav('/games')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all glow-btn ${
              currentPath === '/games'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-amber-300 hover:bg-amber-400/20'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            {t.games}
          </button>

          <button
            onClick={() => handleNav('/meeting/public')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all glow-btn ${
              currentPath.startsWith('/meeting')
                ? 'bg-purple-500 text-white shadow'
                : 'text-purple-200 hover:bg-purple-500/20 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'اجتماع مفتوح' : 'Public Meeting'}</span>
          </button>

          <button
            onClick={() => handleNav('/careers')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all glow-btn ${
              currentPath === '/careers'
                ? 'bg-emerald-400 text-slate-950 shadow'
                : 'text-emerald-300 hover:bg-emerald-500/20'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>{t.careers}</span>
          </button>

          {/* Partner Surge Platform Link */}
          <a
            href="https://korasty-kids.surge.sh/"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 hover:bg-amber-400 hover:text-slate-950 transition-all flex items-center gap-1 glow-btn"
            title="Partner Platform: korasty-kids.surge.sh"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>korasty-kids.surge.sh</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
          </a>
        </nav>

        {/* Right Actions: Language Switcher, Notifications, Login/Dashboard */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all glow-btn cursor-pointer"
            title="Switch Language / تغيير اللغة"
          >
            <Globe2 className="w-4 h-4 text-amber-300" />
            <span>{language === 'en' ? 'العربية' : 'English'}</span>
          </button>

          {/* Notifications Icon with Badge */}
          <button
            onClick={() => handleNav('/notifications')}
            className="relative p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all glow-btn cursor-pointer"
            title={t.notifications}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse shadow">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Logged In vs Logged Out State */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNav('/dashboard')}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all glow-btn ${
                  currentPath === '/dashboard'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'bg-white text-indigo-900 hover:bg-amber-300'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
                <span className="px-1.5 py-0.5 text-[10px] uppercase bg-indigo-900/10 text-indigo-950 rounded font-black">
                  {currentUser.role}
                </span>
              </button>

              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-200 hover:text-white transition-all glow-btn cursor-pointer"
                title={t.logout}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Register Now CTA */}
              <button
                onClick={() => handleNav('/ads')}
                className="hidden sm:flex px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 text-sm font-black items-center gap-1.5 shadow-lg transition-all glow-btn cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{language === 'ar' ? 'سجّل الآن' : 'Register Now'}</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-bold flex items-center gap-1.5 shadow-md transition-all glow-btn cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.login}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Login Options Dropdown */}
                {loginDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 text-slate-800 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      Select Portal / اختر البوابة
                    </div>
                    <button
                      onClick={() => handleNav('/login/student')}
                      className="w-full text-left rtl:text-right px-4 py-2.5 text-sm font-semibold hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-between"
                    >
                      <span>{t.studentLogin}</span>
                      <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Student</span>
                    </button>
                    <button
                      onClick={() => handleNav('/login/teacher')}
                      className="w-full text-left rtl:text-right px-4 py-2.5 text-sm font-semibold hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-between"
                    >
                      <span>{t.teacherLogin}</span>
                      <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Teacher</span>
                    </button>
                    <button
                      onClick={() => handleNav('/login/coordinator')}
                      className="w-full text-left rtl:text-right px-4 py-2.5 text-sm font-semibold hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-between"
                    >
                      <span>{t.coordinatorLogin}</span>
                      <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Coordinator</span>
                    </button>
                    <button
                      onClick={() => handleNav('/login/admin')}
                      className="w-full text-left rtl:text-right px-4 py-2.5 text-sm font-semibold hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-between border-t border-slate-100"
                    >
                      <span>{t.adminLogin}</span>
                      <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Admin</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DOWNWARD EXPANDING NAVIGATION MENU */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-[#3730a3] animate-in slide-in-from-top duration-200 shadow-2xl">
          {/* Top Header Bar inside Expanded Menu (Matching RTC screenshot format) */}
          <div className="bg-[#2e268a] px-4 sm:px-8 py-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-black text-xl text-white block leading-tight">{t.academyName}</span>
                <span className="text-xs text-amber-300 font-extrabold block">Navigation Menu</span>
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-xl bg-white/15 text-white hover:bg-white/30 transition-colors cursor-pointer"
              title="Close Menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Clean Light Background Container for Vertical Menu Items */}
          <div className="bg-white text-slate-800 py-4 px-4 sm:px-8 max-w-xl">
            <div className="space-y-1 divide-y divide-slate-100">
              
              {/* Programs */}
              <div className="py-2.5">
                <button
                  onClick={() => handleSectionNav('programs')}
                  className="w-full text-left rtl:text-right text-slate-800 hover:text-indigo-600 font-extrabold text-base sm:text-lg transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>{language === 'ar' ? 'البرامج التعليمية' : 'Programs'}</span>
                </button>
              </div>

              {/* Stages */}
              <div className="py-2.5">
                <button
                  onClick={() => handleSectionNav('stages')}
                  className="w-full text-left rtl:text-right text-slate-800 hover:text-indigo-600 font-extrabold text-base sm:text-lg transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>{language === 'ar' ? 'المراحل الدراسية' : 'Stages'}</span>
                </button>
              </div>

              {/* Outcomes */}
              <div className="py-2.5">
                <button
                  onClick={() => handleSectionNav('outcomes')}
                  className="w-full text-left rtl:text-right text-slate-800 hover:text-indigo-600 font-extrabold text-base sm:text-lg transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>{language === 'ar' ? 'مخرجات التعلم' : 'Outcomes'}</span>
                </button>
              </div>

              {/* For Parents */}
              <div className="py-2.5">
                <button
                  onClick={() => handleSectionNav('for-parents')}
                  className="w-full text-left rtl:text-right text-slate-800 hover:text-indigo-600 font-extrabold text-base sm:text-lg transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>{language === 'ar' ? 'لأولياء الأمور' : 'For Parents'}</span>
                </button>
              </div>

              {/* Success Stories */}
              <div className="py-2.5">
                <button
                  onClick={() => handleSectionNav('success-stories')}
                  className="w-full text-left rtl:text-right text-slate-800 hover:text-indigo-600 font-extrabold text-base sm:text-lg transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>{language === 'ar' ? 'قصص النجاح' : 'Success Stories'}</span>
                </button>
              </div>

              {/* FAQ */}
              <div className="py-2.5">
                <button
                  onClick={() => handleSectionNav('faq')}
                  className="w-full text-left rtl:text-right text-slate-800 hover:text-indigo-600 font-extrabold text-base sm:text-lg transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>{language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}</span>
                </button>
              </div>

              {/* Contact */}
              <div className="py-2.5">
                <button
                  onClick={() => handleSectionNav('contact')}
                  className="w-full text-left rtl:text-right text-slate-800 hover:text-indigo-600 font-extrabold text-base sm:text-lg transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>{language === 'ar' ? 'تواصل معنا' : 'Contact'}</span>
                </button>
              </div>

              {/* Careers */}
              <div className="py-2.5">
                <button
                  onClick={() => handleNav('/careers')}
                  className="w-full text-left rtl:text-right text-slate-800 hover:text-emerald-600 font-extrabold text-base sm:text-lg transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>{language === 'ar' ? 'الوظائف' : 'Careers'}</span>
                </button>
              </div>

            </div>

            {/* Quick Action Buttons in Menu Footnote */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap gap-3">
              <a
                href="https://korasty-kids.surge.sh/"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow flex items-center gap-1.5 cursor-pointer glow-btn"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>korasty-kids.surge.sh</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => handleNav('/ads')}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xs shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{language === 'ar' ? 'سجّل الآن (/ads)' : 'Register Now'}</span>
              </button>

              <button
                onClick={() => handleNav('/games')}
                className="px-4 py-3 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>{t.games}</span>
              </button>

              <button
                onClick={() => handleNav('/meeting/public')}
                className="px-4 py-3 rounded-xl bg-purple-600 text-white font-extrabold text-xs shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>{language === 'ar' ? 'اجتماع مفتوح' : 'Public Meeting'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
