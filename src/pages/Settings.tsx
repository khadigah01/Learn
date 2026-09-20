import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings as SettingsIcon,
  Globe2,
  Volume2,
  VolumeX,
  Bell,
  Sparkles,
  Shield,
  User,
  Key,
  RotateCcw,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Save,
  Moon,
  Smartphone
} from 'lucide-react';

export const Settings: React.FC = () => {
  const {
    language,
    setLanguage,
    currentUser,
    setCurrentUser,
    updateUser,
    showToast,
    navigate
  } = useApp();

  // Local settings state with localStorage fallback
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('learn_sound_fx') !== 'false';
  });

  const [confettiEnabled, setConfettiEnabled] = useState<boolean>(() => {
    return localStorage.getItem('learn_confetti_enabled') !== 'false';
  });

  const [meetingAlerts, setMeetingAlerts] = useState<boolean>(() => {
    return localStorage.getItem('learn_notif_meetings') !== 'false';
  });

  const [whatsappAlerts, setWhatsappAlerts] = useState<boolean>(() => {
    return localStorage.getItem('learn_notif_whatsapp') !== 'false';
  });

  // Account editing form state
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingUser, setIsSavingUser] = useState(false);

  // Modals for confirmations (in HTML, no browser alert/prompt)
  const [showResetScoresModal, setShowResetScoresModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name);
    }
  }, [currentUser]);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem('learn_sound_fx', String(next));
    showToast('info', next ? 'Sound effects enabled' : 'Sound effects muted', next ? 'تم تفعيل المؤثرات الصوتية' : 'تم كتم المؤثرات الصوتية');
  };

  const handleToggleConfetti = () => {
    const next = !confettiEnabled;
    setConfettiEnabled(next);
    localStorage.setItem('learn_confetti_enabled', String(next));
    showToast('info', next ? 'Celebrations enabled' : 'Celebrations disabled', next ? 'تم تفعيل الاحتفالات' : 'تم تعطيل الاحتفالات');
  };

  const handleToggleMeetingAlerts = () => {
    const next = !meetingAlerts;
    setMeetingAlerts(next);
    localStorage.setItem('learn_notif_meetings', String(next));
    showToast('info', 'Preference saved', 'تم حفظ التفضيل');
  };

  const handleToggleWhatsappAlerts = () => {
    const next = !whatsappAlerts;
    setWhatsappAlerts(next);
    localStorage.setItem('learn_notif_whatsapp', String(next));
    showToast('info', 'Preference saved', 'تم حفظ التفضيل');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!editName.trim()) {
      showToast('error', 'Name cannot be empty', 'لا يمكن ترك الاسم فارغاً');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      showToast('error', 'Passwords do not match', 'كلمات المرور غير متطابقة');
      return;
    }

    try {
      setIsSavingUser(true);
      const updates: any = { name: editName.trim() };
      if (newPassword) {
        updates.password = newPassword;
      }
      await updateUser(currentUser.id, updates);
      showToast('success', 'Profile updated successfully!', 'تم تحديث البيانات بنجاح!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast('error', 'Failed to update profile', 'تعذر تحديث البيانات');
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleResetDiagnosticScores = async () => {
    if (currentUser) {
      try {
        await updateUser(currentUser.id, {
          levelMath: undefined,
          levelArabic: undefined,
          levelEnglish: undefined,
          scoreMath: undefined,
          scoreArabic: undefined,
          scoreEnglish: undefined
        });
        showToast('success', 'Diagnostic scores reset. You can now retake all tests!', 'تمت إعادة تعيين الدرجات بنجاح');
      } catch (err) {
        showToast('error', 'Error resetting scores', 'حدث خطأ أثناء إعادة التعيين');
      }
    } else {
      showToast('success', 'Guest test cache cleared', 'تم تفريغ درجات الزائر');
    }
    setShowResetScoresModal(false);
  };

  const handleConfirmLogout = () => {
    setCurrentUser(null);
    setShowLogoutModal(false);
    showToast('info', 'Logged out successfully', 'تم تسجيل الخروج بنجاح');
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/20 pb-6 text-white">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold border border-white/10">
            <SettingsIcon className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'ar' ? 'تفضيلات المنصة' : 'Preferences'}</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            {language === 'ar' ? 'الإعدادات وتفضيلات الحساب' : 'Settings & Preferences'}
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100/90">
            {language === 'ar'
              ? 'تخصيص تجربة التعلم، إعدادات اللغة، الإشعارات، وبيانات الدخول.'
              : 'Customize your learning experience, platform language, notification alerts, and security.'}
          </p>
        </div>

        <button
          onClick={() => navigate('/help')}
          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all flex items-center gap-2 self-start sm:self-center"
        >
          <HelpCircle className="w-4 h-4 text-amber-300" />
          <span>{language === 'ar' ? 'مركز المساعدة' : 'Help Center'}</span>
        </button>
      </div>

      <div className="space-y-6">
        
        {/* 1. Language & Regional Settings */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 glow-card">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                {language === 'ar' ? 'اللغة والواجهة' : 'Language & Display'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'ar' ? 'تبديل لغة المنصة والاتجاه (RTL / LTR)' : 'Choose your preferred platform language and layout'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setLanguage('ar')}
              className={`p-4 rounded-2xl border text-right transition-all flex items-center justify-between ${
                language === 'ar'
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="font-black text-sm text-slate-900">العربية (Arabic)</div>
                <div className="text-xs text-slate-500 mt-0.5">واجهة من اليمين لليسار (RTL)</div>
              </div>
              {language === 'ar' && <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />}
            </button>

            <button
              onClick={() => setLanguage('en')}
              className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                language === 'en'
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="font-black text-sm text-slate-900">English</div>
                <div className="text-xs text-slate-500 mt-0.5">Left-to-Right interface (LTR)</div>
              </div>
              {language === 'en' && <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />}
            </button>
          </div>
        </div>

        {/* 2. Interactive Study & Audio Settings */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 glow-card">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                {language === 'ar' ? 'التأثيرات والألعاب التفاعلية' : 'Audio & Interactive Effects'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'ar' ? 'التحكم في أصوات الألعاب وتأثيرات الاحتفال' : 'Manage sound effects, confetti animations, and visual celebrations'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Sound FX Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl text-slate-700 shadow-xs border border-slate-200">
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    {language === 'ar' ? 'المؤثرات الصوتية للألعاب' : 'Game Sound Effects'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {language === 'ar' ? 'أصوات الإجابات الصحيحة والتفاعل في الألعاب' : 'Audio feedback for answers and milestone completion'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleToggleSound}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  soundEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    soundEnabled ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Confetti Celebration Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl text-amber-500 shadow-xs border border-slate-200">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    {language === 'ar' ? 'احتفالات الإنجاز (Confetti)' : 'Celebration Animations'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {language === 'ar' ? 'إطلاق قصاصات الاحتفال عند النجاح وإتمام التقييم' : 'Confetti bursts when finishing tests or achieving streaks'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleToggleConfetti}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  confettiEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    confettiEnabled ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Notifications Preferences */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 glow-card">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                {language === 'ar' ? 'تنبيهات الحصص والمجموعات' : 'Class Alerts & Reminders'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'ar' ? 'تحديد كيفية استلام إشعارات الحصص المباشرة والواجبات' : 'Control when and how you get alerted for meetings and cohorts'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl text-slate-700 shadow-xs border border-slate-200">
                  <Bell className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    {language === 'ar' ? 'تنبيه بدء الحصص المباشرة' : 'Live Class Start Alerts'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {language === 'ar' ? 'إشعار فوري عند بدء المعلم الحصة في مجموعتك' : 'Instant in-app notice when instructor launches a meeting'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleToggleMeetingAlerts}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  meetingAlerts ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    meetingAlerts ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl text-slate-700 shadow-xs border border-slate-200">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    {language === 'ar' ? 'تذكيرات واتساب للمجموعة' : 'WhatsApp Group Reminders'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {language === 'ar' ? 'استلام روابط الحصص المباشرة عبر واتساب' : 'Opt-in for direct meeting links via WhatsApp channel'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleToggleWhatsappAlerts}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  whatsappAlerts ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    whatsappAlerts ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 4. Account Profile & Password (If logged in) */}
        {currentUser && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 glow-card">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">
                  {language === 'ar' ? 'بيانات الحساب والأمان' : 'Account & Security'}
                </h2>
                <p className="text-xs text-slate-500">
                  {language === 'ar' ? 'تعديل الاسم المعروض وتعيين كلمة مرور جديدة' : 'Update your display name and change password credentials'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'ar' ? 'الاسم الكامل:' : 'Display Name:'}
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'ar' ? 'اسم المستخدم (غير قابل للتعديل):' : 'Username (Fixed):'}
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`@${currentUser.username}`}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-xs font-semibold cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'ar' ? 'كلمة المرور الجديدة (اختياري):' : 'New Password (Optional):'}
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'ar' ? 'تأكيد كلمة المرور:' : 'Confirm Password:'}
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingUser}
                  className="px-6 py-2.5 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingUser ? (language === 'ar' ? 'جار الحفظ...' : 'Saving...') : (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 5. Danger & Reset Zone */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-md space-y-6 glow-card">
          <div className="flex items-center gap-3 border-b border-rose-50 pb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                {language === 'ar' ? 'إعادة التعيين وسجلات الاختبارات' : 'Reset Actions & Testing Tools'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'ar' ? 'إعادة خوض الاختبارات التشخيصية من البداية، أو تسجيل الخروج' : 'Clear test scores to retake diagnostic evaluations, or sign out'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900">
                {language === 'ar' ? 'إعادة ضبط درجات اختبار تحديد المستوى' : 'Reset Diagnostic Test Scores'}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {language === 'ar'
                  ? 'يسمح لك بخوض اختبارات الرياضيات والعربية والإنجليزية من جديد واحتساب مستوى جديد.'
                  : 'Resets your evaluation so you can retake diagnostic assessments from scratch.'}
              </div>
            </div>

            <button
              onClick={() => setShowResetScoresModal(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{language === 'ar' ? 'إعادة تعيين الدرجات' : 'Reset Scores'}</span>
            </button>
          </div>

          {currentUser && (
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  {language === 'ar' ? 'تسجيل الخروج من الحساب' : 'Sign Out of Account'}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {language === 'ar' ? 'إنهاء الجلسة الحالية على هذا الجهاز.' : 'Terminate current session securely.'}
                </div>
              </div>

              <button
                onClick={() => setShowLogoutModal(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow flex items-center justify-center gap-1.5 shrink-0"
              >
                <LogOut className="w-4 h-4" />
                <span>{language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Styled HTML Modal: Reset Scores Confirmation (No browser alert/prompt) */}
      {showResetScoresModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-black text-slate-900">
                {language === 'ar' ? 'هل أنت متأكد من إعادة تعيين الدرجات؟' : 'Confirm Scores Reset'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'ar'
                  ? 'سيتم مسح درجاتك في اختبارات الرياضيات واللغة العربية والإنجليزية، وستتمكن من خوضها مرة أخرى فوراً.'
                  : 'This will reset your current diagnostic grades for Math, Arabic, and English so you can take them again.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowResetScoresModal(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-all"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleResetDiagnosticScores}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow"
              >
                {language === 'ar' ? 'نعم، أعد التعيين' : 'Yes, Reset'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styled HTML Modal: Logout Confirmation (No browser alert/prompt) */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
              <LogOut className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-black text-slate-900">
                {language === 'ar' ? 'تأكيد تسجيل الخروج' : 'Confirm Sign Out'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'ar'
                  ? 'هل تريد بالتأكيد تسجيل الخروج من حسابك؟ يمكنك العودة وتسجيل الدخول في أي وقت.'
                  : 'Are you sure you want to sign out of your account? You can log back in at any time.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-all"
              >
                {language === 'ar' ? 'البقاء في الحساب' : 'Stay Signed In'}
              </button>
              <button
                onClick={handleConfirmLogout}
                className="py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow"
              >
                {language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
