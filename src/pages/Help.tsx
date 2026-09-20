import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HelpCircle,
  Search,
  MessageSquare,
  Phone,
  BookOpen,
  Calculator,
  Languages,
  Award,
  Video,
  CreditCard,
  ExternalLink,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'tests' | 'meetings' | 'badges' | 'payments' | 'general';
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
}

export const Help: React.FC = () => {
  const { language, navigate } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'tests' | 'meetings' | 'badges' | 'payments' | 'general'>('all');
  const [expandedFaq, setExpandedFaq] = useState<string | null>('tests-1');

  const faqs: FaqItem[] = [
    {
      id: 'tests-1',
      category: 'tests',
      questionEn: 'How do the diagnostic level tests work?',
      questionAr: 'كيف تعمل اختبارات تحديد المستوى في الأكاديمية؟',
      answerEn:
        'Our diagnostic assessments in Mathematics, Arabic, and English present 10 adaptive questions that gauge your foundational knowledge, problem-solving, grammar, and reading comprehension. Upon completion, you are automatically assigned an academic proficiency level (Beginner, Intermediate, or Advanced) and awarded your subject mastery badge.',
      answerAr:
        'تتكون اختبارات تحديد المستوى في الرياضيات واللغة العربية واللغة الإنجليزية من 10 أسئلة ذكية ومتدرجة تقيس المهارات التأسيسية والفهم القرائي وحل المشكلات. عند الانتهاء، يتم تحديد مستواك الأكاديمي فوراً (مبتدئ، متوسط، أو متقدم) وتفعيل وسام الإتقان في ملفك الأكاديمي.'
    },
    {
      id: 'tests-2',
      category: 'tests',
      questionEn: 'Can I retake a diagnostic test if I want to improve my score?',
      questionAr: 'هل يمكنني إعادة خوض اختبار المستوى إذا تحسنت مهاراتي؟',
      answerEn:
        'Yes! You can retake any assessment at any time from your Portfolio, Badges page, or Settings. Your newest score will be updated automatically in your student profile and reflected in your teacher dashboard.',
      answerAr:
        'نعم بالتأكيد! يمكنك إعادة الاختبار في أي وقت من صفحة ملفي الأكاديمي (/my-portfolio) أو الإعدادات (/settings). سيتم تحديث نتيجتك ومستواك الجديد تلقائياً في ملفك وتظهر لمعلمك المشرف.'
    },
    {
      id: 'meetings-1',
      category: 'meetings',
      questionEn: 'How do I join my scheduled live video class?',
      questionAr: 'كيف أنضم إلى الحصة التفاعلية المباشرة؟',
      answerEn:
        'When logged into your student portal, active meetings will appear in your Dashboard and Notifications. When the teacher begins the class, simply click "Join Meeting". You can also join via external direct links shared by your instructor or via WhatsApp.',
      answerAr:
        'عند تسجيل دخولك كطالب، تظهر الحصص المجدولة في لوحة التحكم وقسم الإشعارات. فور قيام المعلم ببدء الحصة، اضغط على زر "الانضمام للاجتماع". كما يمكنك الانضمام مباشرة عبر الروابط المباشرة التي يرسلها المعلم في مجموعة واتساب.'
    },
    {
      id: 'meetings-2',
      category: 'meetings',
      questionEn: 'Do students or parents need an account to join a public meeting?',
      questionAr: 'هل يحتاج الطالب أو ولي الأمر لحساب للانضمام لاجتماع عام؟',
      answerEn:
        'No! Public introductory meetings and free trial webinars can be joined without logging in via the direct link (/meeting/public/:id). Simply open the link and type your name.',
      answerAr:
        'لا! الحصص التعريفية العامة وحصص التجربة المجانية يمكن حضورها دون تسجيل دخول عبر الرابط المباشر (/meeting/public/:id). كل ما عليك هو فتح الرابط وكتابة اسمك للانضمام فوراً.'
    },
    {
      id: 'badges-1',
      category: 'badges',
      questionEn: 'What are badges and how do I earn XP points?',
      questionAr: 'ما هي الشارات وكيف يتم احتساب نقاط الخبرة (XP)؟',
      answerEn:
        'Badges represent verified academic achievements. You earn badges and XP by completing diagnostic tests (+250 XP each), achieving streaks in educational games (+100 XP), active cohort participation (+150 XP), and mastering all core subjects (+500 XP). Read the full Badges Guide at /badges-guide.',
      answerAr:
        'الشارات هي أوسمة أكاديمية رقمية توثق تفوقك. تكسب الشارات ونقاط الخبرة عند إتمام اختبارات المستوى (+250 نقطة لكل اختبار)، وتحقيق نتائج ممتازة في الألعاب التعليمية (+100 نقطة)، والانتظام في الحصص (+150 نقطة)، وإتقان المواد الثلاث معاً (+500 نقطة). يمكنك مطالعة التفاصيل في دليل الشارات (/badges-guide).'
    },
    {
      id: 'payments-1',
      category: 'payments',
      questionEn: 'What payment methods are accepted for tuition?',
      questionAr: 'ما هي طرق الدفع المتاحة للاشتراك في البرامج التعليمية؟',
      answerEn:
        'We accept all major debit/credit cards (Visa, Mastercard, Mada, KNET), Apple Pay, and Direct Bank Wire Transfer. You can review all tuition packages and submit payment receipts securely at /payments.',
      answerAr:
        'نقبل بطاقات الدفع الإلكتروني (فيزا، ماستركارد، مدى، كي نت)، أبل باي (Apple Pay)، والتحويل البنكي المباشر. يمكنك استعراض باقات الاشتراك وإرسال إيصال السداد عبر بوابة الدفع (/payments).'
    },
    {
      id: 'payments-2',
      category: 'payments',
      questionEn: 'Is there a free trial session before committing?',
      questionAr: 'هل تتوفر حصة تجريبية مجانية قبل الاشتراك؟',
      answerEn:
        'Yes! Every new learner is entitled to one free trial class to meet the teacher, experience our interactive methodology, and receive an personalized academic evaluation roadmap.',
      answerAr:
        'نعم! يحق لكل طالب جديد حجز حصة تجريبية مجانية للتعرف على المعلم وتجربة أسلوب الشرح التفاعلي واستلام خطة تعليمية مخصصة.'
    },
    {
      id: 'general-1',
      category: 'general',
      questionEn: 'How can parents contact the administration or teachers directly?',
      questionAr: 'كيف يمكن لأولياء الأمور التواصل مع الإدارة أو المعلمين مباشرة؟',
      answerEn:
        'You can send an official ticket via our Communication Hub at /ask/admin or /talk/admin, contact your assigned teacher via /ask/teacher, or reach our instant 24/7 WhatsApp concierge at +20 15 50128876.',
      answerAr:
        'يمكنكم التواصل رسمياً عبر مركز الاستفسارات (/ask/admin) أو التحدث مع المعلم عبر (/ask/teacher)، أو التحدث فورياً عبر واتساب الأكاديمية على الرقم +20 15 50128876.'
    }
  ];

  // Filter FAQs
  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const qText = (faq.questionEn + ' ' + faq.questionAr + ' ' + faq.answerEn + ' ' + faq.answerAr).toLowerCase();
    const matchesSearch = !searchQuery.trim() || qText.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-indigo-700/50 space-y-4 glow-card text-center sm:text-left rtl:sm:text-right">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
          <HelpCircle className="w-4 h-4" />
          <span>{language === 'ar' ? 'مركز الدعم الفني والأكاديمي' : 'Academic & Technical Support'}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          {language === 'ar' ? 'كيف يمكننا مساعدتك اليوم؟' : 'How can we help you today?'}
        </h1>

        <p className="text-sm sm:text-base text-indigo-100/90 max-w-2xl leading-relaxed">
          {language === 'ar'
            ? 'اعثر على إجابات سريعة حول اختبارات تحديد المستوى، الحصص المباشرة، الألعاب والشارات، وبوابات الدفع.'
            : 'Find immediate guidance on diagnostic assessments, joining live meetings, earning badges, and payment packages.'}
        </p>

        {/* Search Bar */}
        <div className="pt-2 max-w-xl">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ar' ? 'ابحث عن سؤالك أو موضوعك هنا...' : 'Search for questions, topics, or features...'}
              className="w-full pl-12 pr-4 rtl:pl-4 rtl:pr-12 py-3.5 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-sm font-semibold shadow-lg focus:outline-none focus:ring-4 focus:ring-amber-400/50 border border-slate-100"
            />
          </div>
        </div>
      </div>

      {/* 4 Direct Action Concierge Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* WhatsApp Card */}
        <a
          href="https://wa.me/201550128876"
          target="_blank"
          rel="noreferrer"
          className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 group glow-card"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-black text-sm text-slate-900">
              {language === 'ar' ? 'واتساب الأكاديمية' : 'WhatsApp Support'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'ar' ? 'محادثة فورية مع المستشار التعليمي' : 'Direct instant chat with student concierge'}
            </p>
          </div>
          <div className="text-xs font-black text-emerald-600 flex items-center gap-1">
            <span>+20 15 50128876</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </a>

        {/* Ask Admin Card */}
        <button
          onClick={() => navigate('/ask/admin')}
          className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 text-left rtl:text-right group glow-card"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-black text-sm text-slate-900">
              {language === 'ar' ? 'استفسار الإدارة' : 'Ask Administration'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'ar' ? 'إرسال تذكرة استفسار رسمية للإدارة' : 'Submit formal academic or schedule inquiry'}
            </p>
          </div>
          <div className="text-xs font-black text-indigo-600 flex items-center gap-1">
            <span>{language === 'ar' ? 'فتح القناة' : 'Open Channel'}</span>
            <ArrowRight className="w-3 h-3 rtl:rotate-180" />
          </div>
        </button>

        {/* Badges Guide Card */}
        <button
          onClick={() => navigate('/badges-guide')}
          className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 text-left rtl:text-right group glow-card"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-black text-sm text-slate-900">
              {language === 'ar' ? 'دليل الشارات' : 'Badges Guide'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'ar' ? 'معرفة شروط كسب الأوسمة ونقاط XP' : 'Criteria for earning badges & honors'}
            </p>
          </div>
          <div className="text-xs font-black text-amber-600 flex items-center gap-1">
            <span>{language === 'ar' ? 'استعراض الدليل' : 'View Guide'}</span>
            <ArrowRight className="w-3 h-3 rtl:rotate-180" />
          </div>
        </button>

        {/* Tuition & Payments Card */}
        <button
          onClick={() => navigate('/payments')}
          className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 text-left rtl:text-right group glow-card"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-black text-sm text-slate-900">
              {language === 'ar' ? 'الرسوم والاشتراك' : 'Tuition & Plans'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'ar' ? 'أسعار الباقات وتأكيد التحويلات' : 'Tuition rates, bank transfer & receipts'}
            </p>
          </div>
          <div className="text-xs font-black text-blue-600 flex items-center gap-1">
            <span>{language === 'ar' ? 'بوابة الدفع' : 'Payments Portal'}</span>
            <ArrowRight className="w-3 h-3 rtl:rotate-180" />
          </div>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {(
          [
            { id: 'all', labelEn: 'All FAQs', labelAr: 'جميع الأسئلة' },
            { id: 'tests', labelEn: 'Level Tests', labelAr: 'اختبارات المستوى' },
            { id: 'meetings', labelEn: 'Live Classes', labelAr: 'الحصص المباشرة' },
            { id: 'badges', labelEn: 'Badges & Games', labelAr: 'الشارات والألعاب' },
            { id: 'payments', labelEn: 'Payments & Tuition', labelAr: 'الرسوم والاشتراك' },
            { id: 'general', labelEn: 'General & Support', labelAr: 'أسئلة عامة' }
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === tab.id
                ? 'bg-slate-900 text-white shadow'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {language === 'ar' ? tab.labelAr : tab.labelEn}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 space-y-2">
            <p className="font-bold text-slate-700">
              {language === 'ar' ? 'لم يتم العثور على نتائج مطابقة لبحثك' : 'No matching questions found'}
            </p>
            <p className="text-xs text-slate-500">
              {language === 'ar' ? 'جرّب البحث بكلمات أخرى أو تواصل معنا مباشرة عبر واتساب.' : 'Try different keywords or message our WhatsApp advisor.'}
            </p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-xs glow-card"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 text-left rtl:text-right flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-black text-sm sm:text-base text-slate-900">
                    {language === 'ar' ? faq.questionAr : faq.questionEn}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform ${
                      isExpanded ? 'rotate-180 bg-indigo-50 text-indigo-600' : 'text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-150">
                    {language === 'ar' ? faq.answerAr : faq.answerEn}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still need help CTA */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left rtl:sm:text-right">
          <h3 className="text-lg font-black text-white">
            {language === 'ar' ? 'لم تجد الإجابة التي تبحث عنها؟' : 'Still have questions?'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            {language === 'ar'
              ? 'فريق الدعم التعليمي متواجد لمساعدتك والإجابة على أي استفسار حول المناهج والحصص.'
              : 'Our educational support advisors are on standby to guide you through registration and classes.'}
          </p>
        </div>

        <button
          onClick={() => navigate('/ask/admin')}
          className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow shrink-0 flex items-center gap-2"
        >
          <span>{language === 'ar' ? 'إرسال استفسار الآن' : 'Send an Inquiry'}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </button>
      </div>

    </div>
  );
};
