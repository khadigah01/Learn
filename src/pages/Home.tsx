import React from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { SubjectType } from '../types';
import {
  Calculator,
  BookOpen,
  Languages,
  Sparkles,
  ExternalLink,
  Gamepad2,
  GraduationCap,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Star,
  Play
} from 'lucide-react';

export const Home: React.FC = () => {
  const { language, setActiveTestSubject, navigate, currentUser, programs } = useApp();
  const t = translations[language];

  const handleStartTest = (subject: SubjectType) => {
    setActiveTestSubject(subject);
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#4f46e5] via-[#5b51d8] to-[#6366f1] text-white py-16 px-4 sm:px-6 lg:px-8 rounded-b-[3rem] shadow-2xl">
        {/* Glow backdrop circles */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs sm:text-sm font-black shadow-inner backdrop-blur-md glow-element">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{t.welcomeMessage}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto text-white">
            {t.heroTitle}
          </h1>

          <p className="text-base sm:text-lg text-indigo-100 max-w-2xl mx-auto font-medium leading-relaxed">
            {t.heroDesc}
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="https://learn-academy-platform.surge.sh"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base shadow-xl flex items-center gap-2 transition-all glow-btn"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>learn-academy-platform.surge.sh</span>
              <ExternalLink className="w-5 h-5" />
            </a>

            <button
              onClick={() => navigate('/ads')}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-base shadow-xl flex items-center gap-2 transition-all glow-btn"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>{language === 'ar' ? 'سجّل الآن (/ads)' : 'Register Now'}</span>
              <ArrowRight className="w-5 h-5 rtl:rotate-180" />
            </button>

            <button
              onClick={() => handleStartTest('math')}
              className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-base shadow-lg flex items-center gap-2 backdrop-blur-md transition-all glow-btn"
            >
              <Calculator className="w-5 h-5 text-amber-300" />
              <span>{t.mathTest}</span>
            </button>
          </div>
        </div>
      </section>

      {/* THREE CORE LEVEL TESTS SECTION (Directly on Homepage as requested) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300 text-amber-200 text-xs font-bold">
            <GraduationCap className="w-4 h-4" />
            <span>{t.levelTests}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            {language === 'ar'
              ? 'اختبارات تحديد المستوى المباشرة'
              : 'Interactive Diagnostic Level Tests'}
          </h2>
          <p className="text-sm sm:text-base text-indigo-100 max-w-xl mx-auto">
            {language === 'ar'
              ? 'حدد مستواك في المواد الأساسية الثلاث للحصول على توصيات دراسية مخصصة'
              : 'Evaluate your current level in our three core academy subjects to unlock tailored live group sessions'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Math Level Test Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-purple-100 flex flex-col justify-between glow-card relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
                <Calculator className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-800">{t.mathTest}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t.testDescMath}</p>
              <ul className="space-y-2 text-xs font-semibold text-slate-500 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Numbers & Arithmetic</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Algebraic Equations & Geometry</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleStartTest('math')}
                className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all glow-btn"
              >
                <span>{t.startTest}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>

          {/* Arabic Level Test Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-purple-100 flex flex-col justify-between glow-card relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-800">{t.arabicTest}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t.testDescArabic}</p>
              <ul className="space-y-2 text-xs font-semibold text-slate-500 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>القواعد والإعراب والنحو</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>الفهم والاستيعاب والمفردات</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleStartTest('arabic')}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all glow-btn"
              >
                <span>{t.startTest}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>

          {/* English Level Test Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-purple-100 flex flex-col justify-between glow-card relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm">
                <Languages className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-800">{t.englishTest}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t.testDescEnglish}</p>
              <ul className="space-y-2 text-xs font-semibold text-slate-500 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Grammar & Verb Tenses</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Vocabulary & Reading Comprehension</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleStartTest('english')}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all glow-btn"
              >
                <span>{t.startTest}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* PARTNER PLATFORM SECTION (Korasty as explicitly requested) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden glow-card">
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-2xl" />

          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 border border-white/30 text-emerald-100 text-xs font-black">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t.partnerNotice}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black leading-snug">
              {language === 'ar'
                ? 'شراكة أكاديمية رسمية مع منصة كراستي (Korasty Kids)'
                : 'Official Partnership with Korasty Kids Educational Platform'}
            </h2>

            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed font-medium">
              {language === 'ar'
                ? 'نفخر بدمج الموارد والأنشطة التفاعلية لمنصة كراستي كشريك استراتيجي في دعم طلابنا في مهارات الرياضيات واللغات.'
                : 'We are proud to partner with Korasty to deliver enriched interactive workbooks and fun educational activities for kids.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://LearnAcademy.dpdns.org"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-xl flex items-center gap-2 transition-all glow-btn"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>LearnAcademy.dpdns.org</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href="https://learn-academy-platform.surge.sh"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs border border-white/30 flex items-center gap-1.5 transition-all glow-btn"
              >
                <span>Surge Platform Mirror</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://korasty-kids.surge.sh/"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center gap-1.5 transition-all glow-btn"
              >
                <span>https://korasty-kids.surge.sh</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://dashboard.digitalplat.org/signup?ref=seRKf8j6Tx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-semibold border border-slate-700 shadow-md transition-all"
              >
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px] uppercase tracking-wider">
                  DigitalPlat
                </span>
                <span>FreeDomain Provider</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* EDUCATIONAL GAMES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-bold mb-2">
              <Gamepad2 className="w-4 h-4" />
              <span>{t.games}</span>
            </div>
            <h2 className="text-3xl font-black text-white">{t.educationalGames}</h2>
          </div>

          <button
            onClick={() => navigate('/games')}
            className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow flex items-center gap-2 transition-all glow-btn self-start sm:self-auto"
          >
            <span>{t.playNow}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => navigate('/games')}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-white cursor-pointer hover:bg-white/20 transition-all glow-card"
          >
            <span className="px-3 py-1 bg-amber-400 text-slate-950 font-extrabold text-[10px] rounded-full uppercase">
              Math Game
            </span>
            <h3 className="text-xl font-bold mt-3 mb-2">Speed Arithmetic Ninja</h3>
            <p className="text-xs text-indigo-100">
              Solve fast addition, multiplication, and geometry puzzles against the clock!
            </p>
          </div>

          <div
            onClick={() => navigate('/games')}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-white cursor-pointer hover:bg-white/20 transition-all glow-card"
          >
            <span className="px-3 py-1 bg-emerald-400 text-slate-950 font-extrabold text-[10px] rounded-full uppercase">
              Arabic Game
            </span>
            <h3 className="text-xl font-bold mt-3 mb-2">تحدي الكلمات والحروف</h3>
            <p className="text-xs text-indigo-100">
              لعبة تفاعلية لمطابقة المفردات العربية، تركيب الجمل، واكتساب قواعد النحو.
            </p>
          </div>

          <div
            onClick={() => navigate('/games')}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-white cursor-pointer hover:bg-white/20 transition-all glow-card"
          >
            <span className="px-3 py-1 bg-indigo-400 text-slate-950 font-extrabold text-[10px] rounded-full uppercase">
              English Game
            </span>
            <h3 className="text-xl font-bold mt-3 mb-2">Vocabulary Builder Quest</h3>
            <p className="text-xs text-indigo-100">
              Match English antonyms, complete sentences, and boost spelling accuracy!
            </p>
          </div>
        </div>
      </section>

      {/* PROGRAMS SECTION */}
      <section id="programs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-bold">
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span>{language === 'ar' ? 'البرامج التعليمية' : 'Academy Programs'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            {language === 'ar' ? 'برامجنا الأكاديمية الشاملة' : 'Our Specialized Learning Programs'}
          </h2>
          <p className="text-sm sm:text-base text-indigo-100 max-w-2xl mx-auto">
            {language === 'ar'
              ? 'مناهج متكاملة في الرياضيات واللغة العربية واللغة الإنجليزية مصممة لتطوير المهارات الذهنية والتواصل اللغوي'
              : 'Tailored live interactive curricula designed to build problem solving, literacy, and fluency.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programs.map((prog) => {
            const isMath = prog.subject === 'Math';
            const isArabic = prog.subject === 'Arabic';
            const themeColor = isMath
              ? { bg: 'bg-amber-100', text: 'text-amber-600', btn: 'bg-amber-400 hover:bg-amber-300 text-slate-950' }
              : isArabic
              ? { bg: 'bg-emerald-100', text: 'text-emerald-600', btn: 'bg-emerald-500 hover:bg-emerald-400 text-white' }
              : { bg: 'bg-indigo-100', text: 'text-indigo-600', btn: 'bg-indigo-600 hover:bg-indigo-500 text-white' };

            return (
              <div
                key={prog.id}
                className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col justify-between space-y-5 glow-card text-slate-800 relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${themeColor.bg} ${themeColor.text} flex items-center justify-center font-black`}>
                      {isMath ? <Calculator className="w-6 h-6" /> : isArabic ? <BookOpen className="w-6 h-6" /> : <Languages className="w-6 h-6" />}
                    </div>
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {prog.schedule}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      {language === 'ar' ? prog.stageAr : prog.stage} • {prog.ageRange}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 leading-snug">
                      {language === 'ar' ? prog.titleAr : prog.titleEn}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {language === 'ar' ? prog.descriptionAr : prog.descriptionEn}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    {(language === 'ar' ? prog.featuresAr : prog.featuresEn).slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {prog.price}
                  </div>
                  <button
                    onClick={() => navigate('/ads')}
                    className={`py-2.5 px-4 rounded-xl font-extrabold text-xs shadow flex items-center gap-1.5 glow-btn cursor-pointer ${themeColor.btn}`}
                  >
                    <span>{language === 'ar' ? 'انضم الآن' : 'Join Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* STAGES SECTION */}
      <section id="stages" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-200 text-xs font-bold">
            <GraduationCap className="w-4 h-4 text-amber-300" />
            <span>{language === 'ar' ? 'المراحل الدراسية' : 'Learning Stages'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            {language === 'ar' ? 'المراحل العمرية والدراسية' : 'Tailored Academic Stages'}
          </h2>
          <p className="text-sm sm:text-base text-indigo-100 max-w-xl mx-auto">
            {language === 'ar'
              ? 'مجموعات دراسية مقسمة بدقة حسب العمر والمستوى لضمان التجانس والتفاعل الفعّال'
              : 'Structured peer groups matched by age and diagnostic ability for optimal growth.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-white space-y-3 glow-card">
            <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-[11px] rounded-full uppercase">
              {language === 'ar' ? 'المرحلة الأولى' : 'Stage 1 (Ages 6-9)'}
            </span>
            <h3 className="text-2xl font-black">
              {language === 'ar' ? 'مرحلة التاسيس والتأسيس المبكر' : 'Foundation & Discovery Stage'}
            </h3>
            <p className="text-xs text-indigo-100 leading-relaxed">
              {language === 'ar'
                ? 'بناء الأساس في القراءة والكتابة والعمليات الحسابية البسيطة من خلال الألعاب التفاعلية والصور.'
                : 'Interactive game-based learning for core reading, phonics, numbers, and basic math.'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-white space-y-3 glow-card">
            <span className="px-3 py-1 bg-emerald-400 text-slate-950 font-black text-[11px] rounded-full uppercase">
              {language === 'ar' ? 'المرحلة الثانية' : 'Stage 2 (Ages 10-13)'}
            </span>
            <h3 className="text-2xl font-black">
              {language === 'ar' ? 'مرحلة التطوير والتمكين' : 'Intermediate Mastery Stage'}
            </h3>
            <p className="text-xs text-indigo-100 leading-relaxed">
              {language === 'ar'
                ? 'التمكن من قواعد اللغة، الحل المتقدم للمسائل الحسابية، والمحادثة بثقة في اللغة الإنجليزية.'
                : 'Advanced problem solving, grammar mastery, reading analysis, and English discussions.'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-white space-y-3 glow-card">
            <span className="px-3 py-1 bg-purple-400 text-slate-950 font-black text-[11px] rounded-full uppercase">
              {language === 'ar' ? 'المرحلة الثالثة' : 'Stage 3 (Ages 14-18)'}
            </span>
            <h3 className="text-2xl font-black">
              {language === 'ar' ? 'مرحلة التفوق والاستعداد الاختباري' : 'Advanced Excellence Stage'}
            </h3>
            <p className="text-xs text-indigo-100 leading-relaxed">
              {language === 'ar'
                ? 'الاستعداد المتقدم للامتحانات، التحليل الأدبي، الرياضيات المتقدمة، وطلاقة التحدث اللغوي.'
                : 'Exam preparation, analytical writing, advanced algebra, geometry, and fluent speech.'}
            </p>
          </div>
        </div>
      </section>

      {/* OUTCOMES SECTION */}
      <section id="outcomes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-100 text-slate-800 space-y-8 glow-card">
          <div className="text-center space-y-2">
            <span className="px-3.5 py-1 bg-indigo-100 text-indigo-700 font-extrabold text-xs rounded-full uppercase">
              {language === 'ar' ? 'نتائج التعلم' : 'Expected Outcomes'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              {language === 'ar' ? 'مخرجات التعلم والنتائج الملموسة' : 'Key Student Educational Outcomes'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                <Star className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg">
                {language === 'ar' ? 'ارتفاع الدرجات' : 'Higher Grades'}
              </h4>
              <p className="text-xs text-slate-600">
                {language === 'ar'
                  ? 'تحسن ملحوظ في درجات المدارس والامتحانات الرسمية خلال 4 أسابيع.'
                  : 'Noticeable grade boosts in school exams within the first 4 weeks.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-400 text-slate-950 flex items-center justify-center font-black">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg">
                {language === 'ar' ? 'الطلاقة اللغوية' : 'Language Fluency'}
              </h4>
              <p className="text-xs text-slate-600">
                {language === 'ar'
                  ? 'التحدث والتعبير بثقة وبطلاقة باللغتين العربية والإنجليزية.'
                  : 'Confident, articulate expression in both Arabic and English.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-400 text-slate-950 flex items-center justify-center font-black">
                <Calculator className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg">
                {language === 'ar' ? 'سرعة التفكير' : 'Mental Speed'}
              </h4>
              <p className="text-xs text-slate-600">
                {language === 'ar'
                  ? 'سرعة فائقة في حل العمليات الحسابية وتفكيك المسائل الرياضية.'
                  : 'Rapid mental math calculation and logical problem breakdown.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-400 text-slate-950 flex items-center justify-center font-black">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg">
                {language === 'ar' ? 'التفاعل الجماعي' : 'Active Participation'}
              </h4>
              <p className="text-xs text-slate-600">
                {language === 'ar'
                  ? 'التفاعل الإيجابي مع المعلمين والزملاء في مجموعات دراسية تشجيعية.'
                  : 'Enthusiastic engagement in live group collaborative sessions.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOR PARENTS SECTION */}
      <section id="for-parents" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6 glow-card">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black">
            <Users className="w-4 h-4" />
            <span>{language === 'ar' ? 'خدمات أولياء الأمور' : 'For Parents'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black">
            {language === 'ar' ? 'متابعة شفافة وشاملة لولي الأمر' : 'Complete Peace of Mind & Parent Oversight'}
          </h2>

          <p className="text-sm sm:text-base text-indigo-100 max-w-2xl leading-relaxed">
            {language === 'ar'
              ? 'نحرص على تزويد أولياء الأمور بفرص متابعة دورية وشاملة لمستوى أبنائهم الحقيقي من خلال تقارير أسبوعية وتواصل مباشر مع المنسقين.'
              : 'We empower parents with transparent weekly progress tracking, teacher feedback summaries, and instant WhatsApp support.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-5 rounded-2xl bg-white/10 border border-white/20">
              <h4 className="font-bold text-amber-300 text-base mb-1">
                {language === 'ar' ? 'تقارير الحضور والغياب' : 'Attendance Reports'}
              </h4>
              <p className="text-xs text-indigo-100">
                {language === 'ar' ? 'إشعارات فورية عند دخول الطالب واستكمال الجلسة' : 'Real-time notifications for live session entry and participation.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 border border-white/20">
              <h4 className="font-bold text-emerald-300 text-base mb-1">
                {language === 'ar' ? 'درجات الاختبارات' : 'Exam Score Tracking'}
              </h4>
              <p className="text-xs text-indigo-100">
                {language === 'ar' ? 'متابعة مستمرة لنتائج اختبارات تحديد المستوى والتقييمات' : 'Comprehensive view of all diagnostic and periodic assessment scores.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 border border-white/20">
              <h4 className="font-bold text-purple-300 text-base mb-1">
                {language === 'ar' ? 'دعم الواتساب المباشر' : 'Direct Coordinator Line'}
              </h4>
              <p className="text-xs text-indigo-100">
                {language === 'ar' ? 'تواصل دائم مع منسق المجموعات للإجابة على جميع الاستفسارات' : 'Direct access to your dedicated academic group coordinator.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SUCCESS STORIES AND REVIEWS SECTION */}
      <section id="success-stories" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-24">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-200 text-xs font-bold">
            <Star className="w-4 h-4 text-amber-300" />
            <span>{language === 'ar' ? 'قصص النجاح والتقييمات' : 'Success Stories & Reviews'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {language === 'ar' ? 'قصص النجاح والتقييمات' : 'Success Stories & Reviews'}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100 text-center space-y-4 glow-card">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-amber-400 shadow-sm">
            <Star className="w-7 h-7 fill-amber-300/40 text-amber-500" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {language === 'ar' ? 'لا توجد تقييمات متاحة حالياً' : 'No reviews available'}
          </h3>

          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
            {language === 'ar'
              ? 'لا توجد أي مراجعات أو تقييمات منشورة في الوقت الحالي. يمكنك استكشاف برامجنا التعليمية واختبارات المستوى والتواصل مع الإدارة لأي استفسار.'
              : 'There are currently no reviews or success stories published. Feel free to explore our educational curricula, take level assessment tests, or reach out to our team.'}
          </p>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-400/20 border border-purple-300/30 text-purple-200 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            {language === 'ar' ? 'الأسئلة الأكثر تكراراً' : 'Frequently Asked Questions'}
          </h2>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 text-slate-800 space-y-2">
            <h4 className="font-extrabold text-slate-900 text-base">
              {language === 'ar' ? 'كيف يتم تحديد مستوى الطالب في المواد؟' : 'How is the student level evaluated?'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'يخضع الطالب لاختبار تحديد مستوى أونلاين مجاني في الرياضيات أو اللغة العربية أو الإنجليزية لتحديد المجموعة المناسبة لمستواه الحقيقي.'
                : 'Students take a free online diagnostic test in Math, Arabic, or English to identify their precise peer group level.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 text-slate-800 space-y-2">
            <h4 className="font-extrabold text-slate-900 text-base">
              {language === 'ar' ? 'كيف تعمل الحصص والجلسات المباشرة؟' : 'How do live group meetings work?'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'يلتحق الطالب بمجموعته الدراسية وينضم إلى رابط الاجتماع المباشر مع معلم المادة المخصص لمجموعته عبر منصة Learn.'
                : 'Students access live meetings directly from their group dashboard to interact with dedicated teachers.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 text-slate-800 space-y-2">
            <h4 className="font-extrabold text-slate-900 text-base">
              {language === 'ar' ? 'هل يمكن حجز حصة تجريبية مجانية؟' : 'Can I book a free trial session?'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'نعم! يمكنك الضغط على "سجّل الآن" وتعبئة النموذج لحجز جلسة مجانية وتحديد موعد مع المنسق.'
                : 'Yes! Simply click "Register Now" to fill in the quick reservation form and schedule a free intro session.'}
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8 glow-card">
          <div className="max-w-3xl space-y-4">
            <span className="px-3.5 py-1.5 bg-white/20 text-white font-extrabold text-xs rounded-full uppercase">
              {language === 'ar' ? 'تواصل معنا مباشرة' : 'Direct Communication Channels'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black">
              {language === 'ar' ? 'تواصل مع إدارة ومعلمي أكاديمية Learn' : 'Contact Us on WhatsApp & Academy Channels'}
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              {language === 'ar'
                ? 'فريق الأكاديمية والمنسقين والإدارة متواجدون للرد على جميع استفسارات أولياء الأمور والطلاب والمعلمين.'
                : 'Direct channels are open for all inquiries, direct communication with administration, teachers, and students.'}
            </p>
          </div>

          {/* WhatsApp & Phone Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://wa.me/201550128876"
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-between transition-all group cursor-pointer"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-200 block">
                  {language === 'ar' ? 'رقم الهاتف والواتساب المباشر' : 'Direct Phone & WhatsApp'}
                </span>
                <span className="text-xl font-black text-amber-300 group-hover:underline">
                  +20 15 50128876
                </span>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow">
                WhatsApp Chat
              </span>
            </a>

            <a
              href="https://wa.me/201550128876?text=Hello%20Eman"
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-between transition-all group cursor-pointer"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-200 block">
                  {language === 'ar' ? 'اسم مستخدم الواتساب' : 'WhatsApp Username'}
                </span>
                <span className="text-xl font-black text-amber-300 group-hover:underline">
                  Eman.AH18
                </span>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-black shadow">
                @Eman.AH18
              </span>
            </a>
          </div>

          {/* Quick Communication Hub Routes (/ask/* & /talk/*) */}
          <div className="space-y-3 pt-4 border-t border-white/20">
            <span className="text-xs font-black text-amber-200 uppercase tracking-wider block">
              {language === 'ar' ? 'قنوات الاستفسار والمحادثة السريعة (Ask & Talk Channels)' : 'Ask & Talk Fast Channels'}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              <button
                onClick={() => navigate('/ask/admin')}
                className="p-3 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-slate-950 transition-all text-xs font-extrabold text-center border border-white/15"
              >
                /ask/admin
              </button>
              <button
                onClick={() => navigate('/ask/teacher')}
                className="p-3 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-slate-950 transition-all text-xs font-extrabold text-center border border-white/15"
              >
                /ask/teacher
              </button>
              <button
                onClick={() => navigate('/ask/student')}
                className="p-3 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-slate-950 transition-all text-xs font-extrabold text-center border border-white/15"
              >
                /ask/student
              </button>
              <button
                onClick={() => navigate('/talk/admin')}
                className="p-3 rounded-xl bg-white/10 hover:bg-emerald-400 hover:text-slate-950 transition-all text-xs font-extrabold text-center border border-white/15"
              >
                /talk/admin
              </button>
              <button
                onClick={() => navigate('/talk/teacher')}
                className="p-3 rounded-xl bg-white/10 hover:bg-emerald-400 hover:text-slate-950 transition-all text-xs font-extrabold text-center border border-white/15"
              >
                /talk/teacher
              </button>
              <button
                onClick={() => navigate('/talk/student')}
                className="p-3 rounded-xl bg-white/10 hover:bg-emerald-400 hover:text-slate-950 transition-all text-xs font-extrabold text-center border border-white/15"
              >
                /talk/student
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => navigate('/ads')}
              className="px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base shadow-xl flex items-center gap-2 transition-all glow-btn cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>{language === 'ar' ? 'سجّل الآن لحجز جلسة مجانية (/ads)' : 'Register Now (/ads)'}</span>
              <ArrowRight className="w-5 h-5 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </section>

      {/* QUICK LOGIN PORTALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-white text-center space-y-6 glow-card">
          <h3 className="text-2xl font-black">
            {language === 'ar' ? 'بوابات الدخول السريع للأكاديمية' : 'Quick Access Portals'}
          </h3>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-lg mx-auto">
            {language === 'ar'
              ? 'سجل دخولك كطالب، معلم، منسق، أو مدير نظام متابعة المجموعات والاجتماعات'
              : 'Sign in according to your role to manage groups, track test results, or launch live sessions.'}
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/login/student')}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm shadow transition-all glow-btn"
            >
              {t.studentLogin}
            </button>
            <button
              onClick={() => navigate('/login/teacher')}
              className="px-5 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm transition-all glow-btn"
            >
              {t.teacherLogin}
            </button>
            <button
              onClick={() => navigate('/login/coordinator')}
              className="px-5 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm transition-all glow-btn"
            >
              {t.coordinatorLogin}
            </button>
            <button
              onClick={() => navigate('/login/admin')}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow transition-all glow-btn"
            >
              {t.adminLogin} ({t.adminPasswordNote})
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
