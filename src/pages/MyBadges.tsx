import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  Trophy,
  Star,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Flame,
  BookOpen,
  Calculator,
  Languages,
  Users,
  Compass,
  Zap,
  Gamepad2,
  HelpCircle,
  Share2
} from 'lucide-react';

interface BadgeDefinition {
  id: string;
  category: 'diagnostic' | 'academic' | 'games' | 'honors';
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  icon: React.ElementType;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  xp: number;
  isUnlocked: boolean;
  progressTextEn: string;
  progressTextAr: string;
  actionType?: 'test-math' | 'test-arabic' | 'test-english' | 'games' | 'login' | 'ask';
}

export const MyBadges: React.FC = () => {
  const { language, currentUser, setActiveTestSubject, navigate, showToast } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unlocked' | 'diagnostic' | 'games' | 'academic'>('all');
  const [selectedBadge, setSelectedBadge] = useState<BadgeDefinition | null>(null);

  // Compute unlock conditions based on current user data
  const hasMath = Boolean(currentUser?.levelMath || (currentUser?.scoreMath && currentUser.scoreMath > 0));
  const hasArabic = Boolean(currentUser?.levelArabic || (currentUser?.scoreArabic && currentUser.scoreArabic > 0));
  const hasEnglish = Boolean(currentUser?.levelEnglish || (currentUser?.scoreEnglish && currentUser.scoreEnglish > 0));
  const hasAllTests = hasMath && hasArabic && hasEnglish;
  const isEnrolled = Boolean(currentUser?.groupName || (currentUser && currentUser.role === 'student'));
  const isRegisteredUser = Boolean(currentUser);

  const badges: BadgeDefinition[] = [
    {
      id: 'math-scholar',
      category: 'diagnostic',
      titleEn: 'Math Scholar',
      titleAr: 'عالم الرياضيات',
      descEn: 'Completed the adaptive Mathematics diagnostic assessment and earned your academic grade level.',
      descAr: 'أكملت بنجاح اختبار تحديد المستوى الذكي في الرياضيات وحصلت على تصنيفك الأكاديمي.',
      icon: Calculator,
      tier: 'gold',
      xp: 250,
      isUnlocked: hasMath,
      progressTextEn: hasMath ? `Completed: ${currentUser?.levelMath || 'Passed'}` : 'Take Math Diagnostic Test',
      progressTextAr: hasMath ? `مكتمل: ${currentUser?.levelMath || 'ناجح'}` : 'ابدأ اختبار الرياضيات',
      actionType: 'test-math'
    },
    {
      id: 'arabic-linguist',
      category: 'diagnostic',
      titleEn: 'Arabic Linguist',
      titleAr: 'فصيح الضاد',
      descEn: 'Mastered the Arabic diagnostic evaluation covering grammar (Nahu), vocabulary, and text comprehension.',
      descAr: 'اجتزت اختبار اللغة العربية التقييمي في النحو والمفردات والقراءة التحليلية.',
      icon: BookOpen,
      tier: 'gold',
      xp: 250,
      isUnlocked: hasArabic,
      progressTextEn: hasArabic ? `Completed: ${currentUser?.levelArabic || 'Passed'}` : 'Take Arabic Diagnostic Test',
      progressTextAr: hasArabic ? `مكتمل: ${currentUser?.levelArabic || 'ناجح'}` : 'ابدأ اختبار العربية',
      actionType: 'test-arabic'
    },
    {
      id: 'english-polyglot',
      category: 'diagnostic',
      titleEn: 'English Polyglot',
      titleAr: 'متقن الإنجليزية',
      descEn: 'Successfully evaluated English vocabulary, communicative reading fluency, and grammatical structure.',
      descAr: 'حققت تقييماً معتمداً في المفردات وقواعد اللغة الإنجليزية ومهارات الفهم.',
      icon: Languages,
      tier: 'gold',
      xp: 250,
      isUnlocked: hasEnglish,
      progressTextEn: hasEnglish ? `Completed: ${currentUser?.levelEnglish || 'Passed'}` : 'Take English Diagnostic Test',
      progressTextAr: hasEnglish ? `مكتمل: ${currentUser?.levelEnglish || 'ناجح'}` : 'ابدأ اختبار الإنجليزية',
      actionType: 'test-english'
    },
    {
      id: 'triple-crown',
      category: 'diagnostic',
      titleEn: 'Triple Crown Scholar',
      titleAr: 'وسام التاج الثلاثي',
      descEn: 'Achieved mastery across all three core academy subjects: Math, Arabic, and English.',
      descAr: 'أتممت الاختبارات التقييمية الثلاثة كاملة: الرياضيات واللغة العربية والإنجليزية.',
      icon: Trophy,
      tier: 'diamond',
      xp: 500,
      isUnlocked: hasAllTests,
      progressTextEn: hasAllTests ? 'All 3 Diagnostics Mastered' : `${(hasMath ? 1 : 0) + (hasArabic ? 1 : 0) + (hasEnglish ? 1 : 0)} / 3 tests completed`,
      progressTextAr: hasAllTests ? 'أتممت الاختبارات الثلاثة' : `${(hasMath ? 1 : 0) + (hasArabic ? 1 : 0) + (hasEnglish ? 1 : 0)} من 3 مكتملة`
    },
    {
      id: 'active-learner',
      category: 'academic',
      titleEn: 'Enrolled Scholar',
      titleAr: 'عضو الأكاديمية الرسمي',
      descEn: 'Officially authenticated student with active academic profile and assigned cohort group.',
      descAr: 'طالب مسجل رسمي في أكاديمية Learn مع ملف أكاديمي ومجموعة مخصصة.',
      icon: Users,
      tier: 'silver',
      xp: 150,
      isUnlocked: isRegisteredUser,
      progressTextEn: isRegisteredUser ? 'Account Active' : 'Sign in or register to unlock',
      progressTextAr: isRegisteredUser ? 'الحساب نشط' : 'سجل الدخول للتفعيل',
      actionType: 'login'
    },
    {
      id: 'speed-calculator',
      category: 'games',
      titleEn: 'Speed Math Challenger',
      titleAr: 'فارس الحساب السريع',
      descEn: 'Practiced arithmetic operations and multiplication challenges in educational games.',
      descAr: 'خاض تحديات العمليات الحسابية السريعة في قسم الألعاب التعليمية التفاعلية.',
      icon: Zap,
      tier: 'silver',
      xp: 120,
      isUnlocked: true,
      progressTextEn: 'Play in Games Arena',
      progressTextAr: 'العب في قسم الألعاب',
      actionType: 'games'
    },
    {
      id: 'word-wizard',
      category: 'games',
      titleEn: 'Vocabulary Wizard',
      titleAr: 'ساحر الكلمات',
      descEn: 'Discovered linguistic definitions and vocabulary antonyms through engaging educational play.',
      descAr: 'اكتشف معاني المفردات والترادفات والضد عبر الألعاب اللغوية التفاعلية.',
      icon: Gamepad2,
      tier: 'bronze',
      xp: 100,
      isUnlocked: true,
      progressTextEn: 'Available in Games',
      progressTextAr: 'متاح في الألعاب',
      actionType: 'games'
    },
    {
      id: 'inquiry-seeker',
      category: 'academic',
      titleEn: 'Curious Mind',
      titleAr: 'شعلة الفضول المعرفي',
      descEn: 'Actively engaged with academy mentors, teachers, or advisors via direct inquiry channels.',
      descAr: 'تواصل مع المعلمين وإدارة الأكاديمية عبر قنوات الاستفسارات المباشرة.',
      icon: HelpCircle,
      tier: 'bronze',
      xp: 100,
      isUnlocked: true,
      progressTextEn: 'Submit an inquiry',
      progressTextAr: 'تواصل واسأل الإدارة',
      actionType: 'ask'
    },
    {
      id: 'early-pioneer',
      category: 'honors',
      titleEn: 'Learn Academy Pioneer',
      titleAr: 'رائد أكاديمية Learn',
      descEn: 'Recognized foundation member learning on the unified modern academy platform.',
      descAr: 'عضو تأسيسي بارز في المنصة الرقمية الموحدة لأكاديمية Learn.',
      icon: Star,
      tier: 'diamond',
      xp: 350,
      isUnlocked: true,
      progressTextEn: 'Academy Pioneer Status',
      progressTextAr: 'عضوية ريادية معتمدة'
    }
  ];

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;
  const totalXp = badges
    .filter((b) => b.isUnlocked)
    .reduce((acc, curr) => acc + curr.xp, 0);

  // Filtered badges
  const filteredBadges = badges.filter((b) => {
    if (selectedFilter === 'unlocked') return b.isUnlocked;
    if (selectedFilter === 'diagnostic') return b.category === 'diagnostic';
    if (selectedFilter === 'games') return b.category === 'games';
    if (selectedFilter === 'academic') return b.category === 'academic';
    return true;
  });

  const getTierColor = (tier: BadgeDefinition['tier']) => {
    switch (tier) {
      case 'diamond':
        return {
          border: 'border-cyan-400',
          bg: 'bg-gradient-to-br from-cyan-50 to-blue-100',
          badge: 'bg-cyan-500 text-white',
          glow: 'shadow-cyan-200/50'
        };
      case 'gold':
        return {
          border: 'border-amber-400',
          bg: 'bg-gradient-to-br from-amber-50 to-yellow-100',
          badge: 'bg-amber-500 text-white',
          glow: 'shadow-amber-200/50'
        };
      case 'silver':
        return {
          border: 'border-slate-300',
          bg: 'bg-gradient-to-br from-slate-50 to-slate-200',
          badge: 'bg-slate-700 text-white',
          glow: 'shadow-slate-200/50'
        };
      case 'bronze':
      default:
        return {
          border: 'border-orange-300',
          bg: 'bg-gradient-to-br from-orange-50 to-amber-100',
          badge: 'bg-orange-600 text-white',
          glow: 'shadow-orange-200/50'
        };
    }
  };

  const handleAction = (action?: BadgeDefinition['actionType']) => {
    if (!action) return;
    if (action === 'test-math') setActiveTestSubject('math');
    if (action === 'test-arabic') setActiveTestSubject('arabic');
    if (action === 'test-english') setActiveTestSubject('english');
    if (action === 'games') navigate('/games');
    if (action === 'login') navigate('/login');
    if (action === 'ask') navigate('/ask/admin');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner & Stats Card */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-indigo-700/50 relative overflow-hidden glow-card">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <Award className="w-4 h-4" />
              <span>{language === 'ar' ? 'سجل الأوسمة والشارات' : 'Official Honors & Badges'}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {language === 'ar' ? 'شاراتي وإنجازاتي الأكاديمية' : 'My Badges & Achievements'}
            </h1>
            
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              {language === 'ar'
                ? 'احتفل بتقدمك التعليمي! اكسب الأوسمة الرسمية عند اجتياز اختبارات تحديد المستوى والمشاركة في الحصص التفاعلية وممارسة الألعاب المعرفية.'
                : 'Celebrate your academic progress! Earn verified academy badges by taking diagnostic tests, attending live classes, and playing educational games.'}
            </p>

            {/* Quick Navigation Links */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <button
                onClick={() => navigate('/badges-guide')}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow transition-all flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'دليل الشارات والنقاط' : 'Badges Guide'}</span>
              </button>

              <button
                onClick={() => navigate('/my-portfolio')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'ملفي الأكاديمي' : 'My Portfolio'}</span>
              </button>

              <button
                onClick={() => navigate('/games')}
                className="px-4 py-2 bg-purple-500/30 hover:bg-purple-500/50 text-purple-200 hover:text-white text-xs font-bold rounded-xl border border-purple-400/30 transition-all flex items-center gap-1.5"
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'الألعاب التعليمية' : 'Play Games'}</span>
              </button>
            </div>
          </div>

          {/* User Achievement Stats */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 min-w-[240px] space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="text-xs font-semibold text-indigo-200">
                {language === 'ar' ? 'المستخدم الحالي' : 'Learner'}
              </div>
              <div className="text-xs font-black text-amber-300">
                {currentUser?.name || (language === 'ar' ? 'مستكشف زائر' : 'Guest Explorer')}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-2xl font-black text-amber-300">{unlockedCount} / {badges.length}</div>
                <div className="text-[11px] text-indigo-200 font-bold mt-0.5">
                  {language === 'ar' ? 'شارات مفعّلة' : 'Badges Earned'}
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-2xl font-black text-emerald-300">{totalXp} XP</div>
                <div className="text-[11px] text-indigo-200 font-bold mt-0.5">
                  {language === 'ar' ? 'مجموع النقاط' : 'Total XP'}
                </div>
              </div>
            </div>

            {/* Rank Badge */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-indigo-200">{language === 'ar' ? 'الرتبة الأكاديمية:' : 'Scholar Rank:'}</span>
              <span className="font-extrabold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                {totalXp >= 800
                  ? language === 'ar' ? '💎 عالم متميز' : '💎 Diamond Scholar'
                  : totalXp >= 400
                  ? language === 'ar' ? '🥇 متفوق أكاديمي' : '🥇 Gold Achiever'
                  : language === 'ar' ? '🥈 باحث مجتهد' : '🥈 Silver Explorer'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Notice if not logged in */}
      {!currentUser && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-slate-800">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-700 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base text-slate-900">
                {language === 'ar' ? 'هل تريد حفظ شاراتك ونقاطك بشكل دائم؟' : 'Want to save your badges permanently?'}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                {language === 'ar'
                  ? 'سجّل الدخول إلى حسابك أو خُض اختبارات المستوى الآن لتثبيت أوسمتك في ملفك الأكاديمي.'
                  : 'Log in to your student account or complete level tests now to lock badges into your permanent portfolio.'}
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0 transition-all shadow"
          >
            {language === 'ar' ? 'تسجيل الدخول' : 'Go to Login'}
          </button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { id: 'all', labelEn: 'All Badges', labelAr: 'جميع الشارات' },
              { id: 'unlocked', labelEn: 'Unlocked', labelAr: 'المفعّلة' },
              { id: 'diagnostic', labelEn: 'Level Tests', labelAr: 'اختبارات المستوى' },
              { id: 'games', labelEn: 'Games & Practice', labelAr: 'الألعاب والتطبيقات' },
              { id: 'academic', labelEn: 'Academics', labelAr: 'المسار الأكاديمي' }
            ] as const
          ).map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === filter.id
                  ? 'bg-slate-900 text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {language === 'ar' ? filter.labelAr : filter.labelEn}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-semibold px-2">
          {language === 'ar' ? `${filteredBadges.length} شارة معروضة` : `${filteredBadges.length} badges displayed`}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBadges.map((badge) => {
          const IconComp = badge.icon;
          const tierStyle = getTierColor(badge.tier);

          return (
            <div
              key={badge.id}
              className={`rounded-3xl p-6 border transition-all duration-200 relative flex flex-col justify-between glow-card ${
                badge.isUnlocked
                  ? 'bg-white border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1'
                  : 'bg-slate-50 border-slate-200/80 opacity-80'
              }`}
            >
              <div className="space-y-4">
                {/* Header: Icon & Tier Badge */}
                <div className="flex items-start justify-between">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm ${
                      badge.isUnlocked ? tierStyle.bg + ' ' + tierStyle.border : 'bg-slate-200 border-slate-300'
                    }`}
                  >
                    <IconComp
                      className={`w-7 h-7 ${
                        badge.isUnlocked
                          ? badge.tier === 'diamond'
                            ? 'text-cyan-600'
                            : badge.tier === 'gold'
                            ? 'text-amber-600'
                            : badge.tier === 'silver'
                            ? 'text-slate-700'
                            : 'text-orange-600'
                          : 'text-slate-400'
                      }`}
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        tierStyle.badge
                      }`}
                    >
                      {badge.tier}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      +{badge.xp} XP
                    </span>
                  </div>
                </div>

                {/* Badge Info */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">
                      {language === 'ar' ? badge.titleAr : badge.titleEn}
                    </h3>
                    {badge.isUnlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {language === 'ar' ? badge.descAr : badge.descEn}
                  </p>
                </div>
              </div>

              {/* Footer Status & Action Button */}
              <div className="pt-5 border-t border-slate-100 mt-4 flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold text-slate-500">
                  {language === 'ar' ? badge.progressTextAr : badge.progressTextEn}
                </span>

                {badge.actionType && (
                  <button
                    onClick={() => handleAction(badge.actionType)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                      badge.isUnlocked
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow'
                    }`}
                  >
                    <span>
                      {badge.isUnlocked
                        ? language === 'ar' ? 'عرض / فتح' : 'Open'
                        : language === 'ar' ? 'ابدأ الآن' : 'Start Now'}
                    </span>
                    <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA Guide Link */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md text-center sm:text-left rtl:sm:text-right flex flex-col sm:flex-row items-center justify-between gap-6 glow-card">
        <div className="space-y-1.5 max-w-xl">
          <h4 className="text-base sm:text-lg font-black text-slate-900">
            {language === 'ar' ? 'كيف ترتقي برتبتك وتكسب شارات أكثر؟' : 'How to rank up and earn more badges?'}
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {language === 'ar'
              ? 'تصفح دليل الشارات الشامل للاطلاع على شروط الحصول على أوسمة الإتقان الأكاديمي، ونظام النقاط التراكمي.'
              : 'Read the comprehensive Badges Guide to learn criteria for diagnostic mastery, punctuality awards, and cumulative XP honors.'}
          </p>
        </div>

        <button
          onClick={() => navigate('/badges-guide')}
          className="px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-black shadow transition-all flex items-center gap-2 shrink-0"
        >
          <span>{language === 'ar' ? 'عرض دليل الشارات' : 'Open Badges Guide'}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </button>
      </div>

    </div>
  );
};
