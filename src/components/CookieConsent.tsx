import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Cookie, ShieldCheck, Check, X, Settings2, Info } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const { language, navigate } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  // Preference toggles
  const [preferences, setPreferences] = useState({
    essential: true, // always required
    analytics: true,
    preferences: true
  });

  useEffect(() => {
    const consent = localStorage.getItem('learn_cookie_consent');
    if (!consent) {
      // Delay slightly for smoother entrance
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      'learn_cookie_consent',
      JSON.stringify({
        essential: true,
        analytics: true,
        preferences: true,
        timestamp: Date.now()
      })
    );
    setIsOpen(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem(
      'learn_cookie_consent',
      JSON.stringify({
        essential: true,
        analytics: false,
        preferences: false,
        timestamp: Date.now()
      })
    );
    setIsOpen(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem(
      'learn_cookie_consent',
      JSON.stringify({
        ...preferences,
        essential: true,
        timestamp: Date.now()
      })
    );
    setIsOpen(false);
    setShowPreferences(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed bottom-3 sm:bottom-6 inset-x-3 sm:inset-x-auto sm:right-6 sm:max-w-xl z-50 animate-in slide-in-from-bottom-5 duration-300"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="bg-slate-950/95 backdrop-blur-md text-white rounded-3xl p-5 sm:p-6 border border-amber-400/40 shadow-2xl space-y-4 glow-card">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30 shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-amber-300">
                {language === 'ar' ? 'ملفات تعريف الارتباط والخصوصية' : 'Cookie & Privacy Preferences'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Learn Academy • LearnAcademy.dpdns.org
              </p>
            </div>
          </div>

          <button
            onClick={handleAcceptEssential}
            className="text-slate-400 hover:text-white p-1 rounded-xl transition-colors cursor-pointer"
            title={language === 'ar' ? 'إغلاق وقبول الضروري فقط' : 'Close and accept essential only'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {!showPreferences ? (
          <p className="text-xs text-slate-300 leading-relaxed">
            {language === 'ar'
              ? 'نحن نستخدم ملفات تعريف الارتباط والذاكرة المحلية لتأمين تسجيل الدخول، وحفظ تقدمك في اختبارات تحديد المستوى، ومشاريع سكراتش، وإعدادات الصوت واللغة لتقديم أفضل تجربة تعليمية.'
              : 'We use cookies and local storage to keep you securely signed in, preserve your quiz progress and diagnostic levels, remember Scratch projects, and save your audio and language preferences.'}
          </p>
        ) : (
          <div className="space-y-3 bg-white/5 p-3.5 rounded-2xl border border-white/10 text-xs">
            {/* Essential */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-200">
                  {language === 'ar' ? 'الضرورية والأمان (إجباري)' : 'Strictly Essential (Required)'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {language === 'ar' ? 'جلسات الدخول وحفظ البيانات الأساسية' : 'User authentication and database session caching'}
                </div>
              </div>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md">
                {language === 'ar' ? 'نشط دائماً' : 'Always Active'}
              </span>
            </div>

            {/* Preferences */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div>
                <div className="font-bold text-slate-200">
                  {language === 'ar' ? 'التفضيلات والألعاب' : 'Preferences & Game Audio'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {language === 'ar' ? 'أصوات الألعاب، اللغة، واحتفالات الإنجاز' : 'Remember sound effects, celebration confetti, and language'}
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.preferences}
                onChange={(e) => setPreferences({ ...preferences, preferences: e.target.checked })}
                className="w-4 h-4 rounded text-amber-400 focus:ring-amber-400 cursor-pointer"
              />
            </div>

            {/* Analytics & Quizzes */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div>
                <div className="font-bold text-slate-200">
                  {language === 'ar' ? 'سجلات الاختبارات والتقييم' : 'Quiz & Diagnostic Analytics'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {language === 'ar' ? 'حفظ إحصائيات لوحة المتصدرين والدرجات' : 'Track leaderboard ranking points and test streaks'}
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                className="w-4 h-4 rounded text-amber-400 focus:ring-amber-400 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="text-[11px] text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>
              {showPreferences
                ? (language === 'ar' ? 'العودة للنص البسيط' : 'Simple View')
                : (language === 'ar' ? 'تخصيص الخيارات' : 'Customize Preferences')}
            </span>
          </button>

          <div className="flex items-center gap-2">
            {!showPreferences ? (
              <>
                <button
                  onClick={handleAcceptEssential}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer"
                >
                  {language === 'ar' ? 'الضرورية فقط' : 'Essential Only'}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-1 cursor-pointer glow-btn"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'قبول الكل' : 'Accept All'}</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleSavePreferences}
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-1 cursor-pointer glow-btn"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'حفظ خياراتي' : 'Save Choices'}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
