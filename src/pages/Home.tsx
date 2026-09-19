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
  const { language, setActiveTestSubject, navigate, currentUser } = useApp();
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
                href="https://korasty-kids.surge.sh/"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-xl flex items-center gap-2 transition-all glow-btn"
              >
                <span>https://korasty-kids.surge.sh</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href="https://korasty.surge.sh/"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center gap-1.5 transition-all glow-btn"
              >
                <span>korasty.surge.sh</span>
                <ExternalLink className="w-3.5 h-3.5" />
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
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-4 glow-card text-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-black">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              {language === 'ar' ? 'برنامج تميز الرياضيات' : 'Math Excellence Program'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'تطوير التفكير المنطقي، الحساب السريع، حل المسائل الكلامية، والمفاهيم الهندسية من البداية حتى الاحتراف.'
                : 'Develop logical reasoning, mental math velocity, word problem solving, and spatial geometry.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/ads')}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow flex items-center justify-center gap-2 glow-btn cursor-pointer"
              >
                <span>{language === 'ar' ? 'انضم للبرنامج' : 'Join Program'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-4 glow-card text-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              {language === 'ar' ? 'برنامج إتقان اللغة العربية' : 'Arabic Mastery Program'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'القواعد والنحو، القراءة السليمة مع التشكيل، التعبير الكتابي، وإتقان مفردات اللغة العربية الفصحى.'
                : 'Comprehensive Arabic grammar, vocalized reading, creative writing, and classical vocabulary enhancement.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/ads')}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs shadow flex items-center justify-center gap-2 glow-btn cursor-pointer"
              >
                <span>{language === 'ar' ? 'انضم للبرنامج' : 'Join Program'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-4 glow-card text-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">
              <Languages className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              {language === 'ar' ? 'برنامج الطلاقة الإنجليزية' : 'English Fluency Program'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'المحادثة والتواصل المباشر، القواعد الإنجليزية النحوية، تحسين النطق والتعبير الكتابي السليم.'
                : 'Interactive conversation practice, grammar rules, pronunciation coaching, and reading comprehension.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/ads')}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow flex items-center justify-center gap-2 glow-btn cursor-pointer"
              >
                <span>{language === 'ar' ? 'انضم للبرنامج' : 'Join Program'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
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

      {/* SUCCESS STORIES SECTION */}
      <section id="success-stories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-200 text-xs font-bold">
            <Star className="w-4 h-4 text-amber-300" />
            <span>{language === 'ar' ? 'قصص النجاح' : 'Success Stories'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            {language === 'ar' ? 'ماذا يقول طلابنا وأولياء الأمور' : 'What Our Students & Parents Say'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 text-slate-800 space-y-4 glow-card">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
              "تحسن مستوى ابني في الرياضيات بشكل ملحوظ بعد 3 أسابيع فقط مع أكاديمية Learn. الجلسات التفاعلية ممتازة جداً!"
            </p>
            <div>
              <div className="font-extrabold text-slate-900 text-sm">أحمد المصرى (ولي أمر)</div>
              <div className="text-[11px] text-slate-500 font-semibold">طالب في المرحلة الثانية</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 text-slate-800 space-y-4 glow-card">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
              "كنت أواجه صعوبة كبيرة في المحادثة باللغة الإنجليزية، والآن أستطيع التحدث بثقة كبيرة مع معلمي والمجموعة!"
            </p>
            <div>
              <div className="font-extrabold text-slate-900 text-sm">مريم حسن (طالبة)</div>
              <div className="text-[11px] text-slate-500 font-semibold">برنامج الطلاقة الإنجليزية</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 text-slate-800 space-y-4 glow-card">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
              "المنصة ممتازة وسهلة الاستخدام، وتقارير المتابعة الدورية توفر لنا راحة بال كاملة كأولياء أمور."
            </p>
            <div>
              <div className="font-extrabold text-slate-900 text-sm">سارة الخالد (ولية أمر)</div>
              <div className="text-[11px] text-slate-500 font-semibold">طالب في برنامج العربية</div>
            </div>
          </div>
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
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6 glow-card text-center sm:text-left">
          <div className="max-w-3xl space-y-4 mx-auto sm:mx-0">
            <span className="px-3.5 py-1.5 bg-white/20 text-white font-extrabold text-xs rounded-full uppercase">
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black">
              {language === 'ar' ? 'هل لديك أي استفسارات؟ تواصل معنا اليوم' : 'Have Questions? Get in Touch with Learn Academy'}
            </h2>
            <p className="text-sm text-emerald-100 leading-relaxed">
              {language === 'ar'
                ? 'فريق المنسقين والدعم الفني متواجد لمساعدتك في التسجيل وتحديد المواعيد المناسبة لطفلك.'
                : 'Our academic coordinators are available to answer your questions and schedule your free session.'}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2">
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
