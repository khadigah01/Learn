import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  Trophy,
  Star,
  Sparkles,
  Calculator,
  BookOpen,
  Languages,
  Zap,
  Gamepad2,
  CheckCircle2,
  Clock,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Flame,
  Users,
  Compass
} from 'lucide-react';

interface GuideBadge {
  id: string;
  category: 'diagnostic' | 'academic' | 'games' | 'honors';
  titleEn: string;
  titleAr: string;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  xp: number;
  icon: React.ElementType;
  criteriaEn: string;
  criteriaAr: string;
  benefitEn: string;
  benefitAr: string;
}

export const BadgesGuide: React.FC = () => {
  const { language, navigate, setActiveTestSubject } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'diagnostic' | 'academic' | 'games' | 'honors'>('all');

  const guideBadges: GuideBadge[] = [
    {
      id: 'math-scholar',
      category: 'diagnostic',
      titleEn: 'Math Scholar',
      titleAr: 'عالم الرياضيات',
      tier: 'gold',
      xp: 250,
      icon: Calculator,
      criteriaEn: 'Complete the adaptive 10-question Mathematics Diagnostic Assessment with a passing score.',
      criteriaAr: 'اجتياز اختبار تحديد المستوى الذكي في الرياضيات (10 أسئلة) بنتيجة نجاح.',
      benefitEn: 'Unlocks advanced problem-solving tracks and Math group placement.',
      benefitAr: 'يؤهل الطالب لمسارات التفكير العليا والتسكين في مجموعة الرياضيات المناسبة.'
    },
    {
      id: 'arabic-linguist',
      category: 'diagnostic',
      titleEn: 'Arabic Linguist',
      titleAr: 'فصيح الضاد',
      tier: 'gold',
      xp: 250,
      icon: BookOpen,
      criteriaEn: 'Complete the Arabic Diagnostic Assessment evaluating grammar (Nahu), syntax, and text comprehension.',
      criteriaAr: 'إكمال اختبار اللغة العربية التقييمي في النحو، الإملاء، والاستيعاب القرائي.',
      benefitEn: 'Displays verified Arabic literacy level on student academic portfolio.',
      benefitAr: 'يوثق مستوى الطلاقة القرائية والنحوية في ملف الطالب الأكاديمي.'
    },
    {
      id: 'english-polyglot',
      category: 'diagnostic',
      titleEn: 'English Polyglot',
      titleAr: 'متقن الإنجليزية',
      tier: 'gold',
      xp: 250,
      icon: Languages,
      criteriaEn: 'Complete the English Diagnostic Assessment assessing vocabulary and grammatical structures.',
      criteriaAr: 'اجتياز اختبار اللغة الإنجليزية في القواعد، المفردات، والمحادثة الوظيفية.',
      benefitEn: 'Certifies communicative foundation and places student in level-matched English cohort.',
      benefitAr: 'يعتمد الكفاءة التأسيسية للتسكين في المستوى المناسب بالإنجليزية.'
    },
    {
      id: 'triple-crown',
      category: 'diagnostic',
      titleEn: 'Triple Crown Scholar',
      titleAr: 'وسام التاج الثلاثي',
      tier: 'diamond',
      xp: 500,
      icon: Trophy,
      criteriaEn: 'Complete all three diagnostic assessments (Math, Arabic, and English).',
      criteriaAr: 'إتمام الاختبارات التشخيصية الثلاثة كاملة (الرياضيات، العربية، والإنجليزية).',
      benefitEn: 'Diamond-tier achievement highlighting well-rounded multi-disciplinary excellence.',
      benefitAr: 'وسام شرف ماسي يبرز الشمولية الأكاديمية والتفوق المتكامل.'
    },
    {
      id: 'enrolled-scholar',
      category: 'academic',
      titleEn: 'Enrolled Scholar',
      titleAr: 'عضو الأكاديمية الرسمي',
      tier: 'silver',
      xp: 150,
      icon: Users,
      criteriaEn: 'Register or log in with verified student credentials and get assigned to an academic group.',
      criteriaAr: 'التسجيل وتفعيل حساب الطالب الرسمي والتسكين في مجموعة دراسية معتمدة.',
      benefitEn: 'Access to teacher office hours, assignments, and cohort chat channels.',
      benefitAr: 'حضور الحصص التفاعلية، استلام الواجبات، والتواصل مع المعلم.'
    },
    {
      id: 'attendance-star',
      category: 'academic',
      titleEn: 'Punctual Attendance Star',
      titleAr: 'نجم الالتزام والحضور',
      tier: 'silver',
      xp: 200,
      icon: Clock,
      criteriaEn: 'Attend live classroom meetings promptly as scheduled by the course instructor.',
      criteriaAr: 'حضور الحصص المباشرة في موعدها المحدد وفق الجدول الأسبوعي للمجموعة.',
      benefitEn: 'Boosts academic discipline ranking and counts towards term certificate eligibility.',
      benefitAr: 'يرفع تصنيف الانضباط الأكاديمي ويؤهل لاستلام شهادة إتمام البرنامج.'
    },
    {
      id: 'curious-mind',
      category: 'academic',
      titleEn: 'Curious Mind',
      titleAr: 'شعلة الفضول المعرفي',
      tier: 'bronze',
      xp: 100,
      icon: HelpCircle,
      criteriaEn: 'Submit an academic question or constructive inquiry to teachers or academy mentors.',
      criteriaAr: 'إرسال سؤال تعليمي أو استفسار بنّاء للمعلم أو الإدارة عبر قنوات التواصل.',
      benefitEn: 'Encourages proactive inquiry-based learning and direct mentorship.',
      benefitAr: 'يعزز مهارة التفكير التساؤلي والتواصل المباشر مع المرشدين.'
    },
    {
      id: 'speed-calculator',
      category: 'games',
      titleEn: 'Speed Math Challenger',
      titleAr: 'فارس الحساب السريع',
      tier: 'silver',
      xp: 120,
      icon: Zap,
      criteriaEn: 'Score 50+ points in the interactive mental math arithmetic game.',
      criteriaAr: 'تحقيق 50 نقطة فأكثر في لعبة الحساب الذهني التفاعلية.',
      benefitEn: 'Sharpens arithmetic agility and quick numerical mental processing.',
      benefitAr: 'يطور سرعة البديهة والقدرة على حل العمليات الحسابية ذهنياً.'
    },
    {
      id: 'word-wizard',
      category: 'games',
      titleEn: 'Vocabulary Wizard',
      titleAr: 'ساحر الكلمات والمفردات',
      tier: 'bronze',
      xp: 100,
      icon: Gamepad2,
      criteriaEn: 'Solve vocabulary definitions and linguistic antonyms in the English educational game arena.',
      criteriaAr: 'حل تحديات المفردات والترادفات في ألعاب اللغة الإنجليزية التعليمية.',
      benefitEn: 'Broadens practical lexicon and contextual word recognition.',
      benefitAr: 'يثري الحصيلة اللغوية والقدرة على توظيف المفردات في سياقها الصحيح.'
    },
    {
      id: 'streak-master',
      category: 'games',
      titleEn: 'Streak Master',
      titleAr: 'سيد التتابع والإتقان',
      tier: 'gold',
      xp: 200,
      icon: Flame,
      criteriaEn: 'Achieve a continuous 5-correct answer streak without mistakes in educational games.',
      criteriaAr: 'تحقيق سلسلة إجابات صحيحة متتالية (5 أسئلة متتالية بدون خطأ) في الألعاب.',
      benefitEn: 'Awards bonus celebratory confetti and showcases focus consistency.',
      benefitAr: 'يمنح احتفالاً بصرياً ويبرز دقة التركيز والاستمرارية.'
    },
    {
      id: 'early-pioneer',
      category: 'honors',
      titleEn: 'Learn Academy Pioneer',
      titleAr: 'رائد أكاديمية Learn',
      tier: 'diamond',
      xp: 350,
      icon: Star,
      criteriaEn: 'Awarded to early foundational scholars pioneering digital education at Learn Academy.',
      criteriaAr: 'يُمنح للأعضاء والطلاب الرواد المشاركين في المنصة الرقمية الموحدة للأكاديمية.',
      benefitEn: 'Permanent founder status badge visible on student passport.',
      benefitAr: 'شارة عضوية دائمة ومميزة في السجل الأكاديمي وجواز التعلم.'
    }
  ];

  const filteredBadges = guideBadges.filter((b) => {
    if (selectedCategory === 'all') return true;
    return b.category === selectedCategory;
  });

  const getTierBadgeStyle = (tier: GuideBadge['tier']) => {
    switch (tier) {
      case 'diamond':
        return {
          pill: 'bg-cyan-500 text-white shadow-cyan-200',
          border: 'border-cyan-300',
          bg: 'bg-gradient-to-br from-cyan-50 to-blue-50',
          iconColor: 'text-cyan-600'
        };
      case 'gold':
        return {
          pill: 'bg-amber-500 text-white shadow-amber-200',
          border: 'border-amber-300',
          bg: 'bg-gradient-to-br from-amber-50 to-yellow-50',
          iconColor: 'text-amber-600'
        };
      case 'silver':
        return {
          pill: 'bg-slate-700 text-white shadow-slate-200',
          border: 'border-slate-300',
          bg: 'bg-gradient-to-br from-slate-50 to-slate-100',
          iconColor: 'text-slate-700'
        };
      case 'bronze':
      default:
        return {
          pill: 'bg-orange-600 text-white shadow-orange-200',
          border: 'border-orange-300',
          bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
          iconColor: 'text-orange-600'
        };
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-indigo-700/50 space-y-4 glow-card text-center sm:text-left rtl:sm:text-right">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
          <Compass className="w-4 h-4" />
          <span>{language === 'ar' ? 'الدليل الرسمي لمنظومة التكريم' : 'Official Honors Directory'}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          {language === 'ar' ? 'دليل الشارات ونظام الأوسمة الأكاديمية' : 'Academy Badges & Honors Guide'}
        </h1>

        <p className="text-sm sm:text-base text-indigo-100/90 max-w-2xl leading-relaxed">
          {language === 'ar'
            ? 'تعرّف على شروط ومعايير الحصول على كل وسام أكاديمي في أكاديمية Learn، وكيف تجمع نقاط الخبرة (XP) لترتقي برتبتك التعليمية وتوثق تميزك.'
            : 'Explore the criteria and requirements for every academic badge in Learn Academy, and learn how to collect XP points to ascend through the scholar ranks.'}
        </p>

        {/* Action CTAs */}
        <div className="pt-2 flex flex-wrap gap-3 justify-center sm:justify-start rtl:sm:justify-start">
          <button
            onClick={() => navigate('/my-badges')}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all shadow flex items-center gap-1.5"
          >
            <Award className="w-4 h-4" />
            <span>{language === 'ar' ? 'استعراض شاراتي الحالية' : 'Check My Badges'}</span>
          </button>

          <button
            onClick={() => navigate('/my-portfolio')}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>{language === 'ar' ? 'الملف الأكاديمي' : 'My Portfolio'}</span>
          </button>

          <button
            onClick={() => navigate('/games')}
            className="px-5 py-2.5 rounded-xl bg-purple-500/30 hover:bg-purple-500/50 text-purple-200 hover:text-white text-xs font-bold transition-all border border-purple-400/30 flex items-center gap-1.5"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>{language === 'ar' ? 'خوض تحديات الألعاب' : 'Play Games'}</span>
          </button>
        </div>
      </div>

      {/* 4 Tier Explanation Cards */}
      <div className="space-y-3">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <span>{language === 'ar' ? 'مستويات الأوسمة والرتب' : 'Badge Tiers & Ranking Hierarchy'}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-orange-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-orange-600 text-white">
                Bronze
              </span>
              <span className="text-xs font-bold text-orange-600">100 XP</span>
            </div>
            <div className="font-extrabold text-sm text-slate-900">
              {language === 'ar' ? 'المستوى البرونزي (الاستكشاف)' : 'Bronze Tier (Explorer)'}
            </div>
            <div className="text-xs text-slate-500 leading-relaxed">
              {language === 'ar' ? 'شارات المبادرة والمشاركة والبداية الإيجابية في المنصة.' : 'Foundational badges for early exploration and active participation.'}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-300 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-700 text-white">
                Silver
              </span>
              <span className="text-xs font-bold text-slate-700">120 - 200 XP</span>
            </div>
            <div className="font-extrabold text-sm text-slate-900">
              {language === 'ar' ? 'المستوى الفضي (الاجتهاد)' : 'Silver Tier (Scholar)'}
            </div>
            <div className="text-xs text-slate-500 leading-relaxed">
              {language === 'ar' ? 'أوسمة الالتزام الصفي وسرعة البديهة والانتظام في الحصص.' : 'Badges for consistent attendance, mental arithmetic, and cohort involvement.'}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-amber-300 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500 text-white">
                Gold
              </span>
              <span className="text-xs font-bold text-amber-600">250 XP</span>
            </div>
            <div className="font-extrabold text-sm text-slate-900">
              {language === 'ar' ? 'المستوى الذهبي (الإتقان)' : 'Gold Tier (Mastery)'}
            </div>
            <div className="text-xs text-slate-500 leading-relaxed">
              {language === 'ar' ? 'اجتياز اختبارات تحديد المستوى الأكاديمية بنجاح واعتماد الدرجة.' : 'Rigorous diagnostic mastery across core subjects (Math, Arabic, English).'}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-cyan-300 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-cyan-500 text-white">
                Diamond
              </span>
              <span className="text-xs font-bold text-cyan-600">350 - 500 XP</span>
            </div>
            <div className="font-extrabold text-sm text-slate-900">
              {language === 'ar' ? 'المستوى الماسي (الريادة)' : 'Diamond Tier (Grandmaster)'}
            </div>
            <div className="text-xs text-slate-500 leading-relaxed">
              {language === 'ar' ? 'إتمام الاختبارات الثلاثة كاملة وحمل أرفع أوسمة الأكاديمية.' : 'Highest academic distinctions recognizing multi-subject tri-mastery.'}
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {(
          [
            { id: 'all', labelEn: 'All Badges', labelAr: 'جميع الشارات' },
            { id: 'diagnostic', labelEn: 'Diagnostic Mastery', labelAr: 'اختبارات المستوى' },
            { id: 'academic', labelEn: 'Academics & Classroom', labelAr: 'التميز الصفي' },
            { id: 'games', labelEn: 'Games & Quick Thinking', labelAr: 'الألعاب والسرعة الذهنية' },
            { id: 'honors', labelEn: 'Academy Honors', labelAr: 'الأوسمة الخاصة' }
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === tab.id
                ? 'bg-slate-900 text-white shadow'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {language === 'ar' ? tab.labelAr : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Badges Catalog List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredBadges.map((badge) => {
          const IconComp = badge.icon;
          const tierStyle = getTierBadgeStyle(badge.tier);

          return (
            <div
              key={badge.id}
              className={`rounded-3xl p-6 border shadow-sm space-y-4 glow-card flex flex-col justify-between bg-white ${tierStyle.border}`}
            >
              <div className="space-y-3">
                {/* Header: Icon, Title & Tier */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs ${tierStyle.bg} ${tierStyle.border}`}
                    >
                      <IconComp className={`w-6 h-6 ${tierStyle.iconColor}`} />
                    </div>

                    <div>
                      <h3 className="font-black text-base text-slate-900">
                        {language === 'ar' ? badge.titleAr : badge.titleEn}
                      </h3>
                      <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                        {badge.category}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${tierStyle.pill}`}>
                      {badge.tier}
                    </span>
                    <span className="text-xs font-bold text-slate-600">
                      +{badge.xp} XP
                    </span>
                  </div>
                </div>

                {/* Criteria */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    {language === 'ar' ? 'معيار الاستحقاق:' : 'How to Earn:'}
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed font-semibold">
                    {language === 'ar' ? badge.criteriaAr : badge.criteriaEn}
                  </div>
                </div>

                {/* Academic Benefit */}
                <div className="text-xs text-slate-500 leading-relaxed flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-700">{language === 'ar' ? 'الميزة الأكاديمية: ' : 'Benefit: '}</strong>
                    {language === 'ar' ? badge.benefitAr : badge.benefitEn}
                  </span>
                </div>
              </div>

              {/* Action trigger */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                {badge.category === 'diagnostic' && (
                  <button
                    onClick={() => {
                      if (badge.id.includes('math')) setActiveTestSubject('math');
                      else if (badge.id.includes('arabic')) setActiveTestSubject('arabic');
                      else if (badge.id.includes('english')) setActiveTestSubject('english');
                      else navigate('/my-badges');
                    }}
                    className="text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>{language === 'ar' ? 'خوض الاختبار الآن' : 'Take Test Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                )}

                {badge.category === 'games' && (
                  <button
                    onClick={() => navigate('/games')}
                    className="text-xs font-black text-purple-600 hover:text-purple-800 flex items-center gap-1"
                  >
                    <span>{language === 'ar' ? 'الانتقال للألعاب' : 'Play in Arena'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                )}

                {badge.category !== 'diagnostic' && badge.category !== 'games' && (
                  <button
                    onClick={() => navigate('/my-badges')}
                    className="text-xs font-black text-slate-700 hover:text-slate-900 flex items-center gap-1"
                  >
                    <span>{language === 'ar' ? 'عرض في شاراتي' : 'Check Status'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 glow-card">
        <div className="space-y-1 text-center sm:text-left rtl:sm:text-right">
          <h3 className="font-black text-base sm:text-lg text-slate-900">
            {language === 'ar' ? 'جاهز لاختبار معلوماتك وكسب الأوسمة؟' : 'Ready to test your skills and earn honors?'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'ar'
              ? 'ابدأ باختبارات تحديد المستوى الآن لمعرفة درجتك والحصول على أول وسام ذهبي.'
              : 'Begin with diagnostic level assessments to uncover your grade and claim your first Gold honor.'}
          </p>
        </div>

        <button
          onClick={() => setActiveTestSubject('math')}
          className="px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-black shadow transition-all shrink-0 flex items-center gap-2"
        >
          <span>{language === 'ar' ? 'بدء اختبار الرياضيات' : 'Start Math Test'}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </button>
      </div>

    </div>
  );
};
