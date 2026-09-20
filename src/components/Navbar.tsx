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
  Video,
  MessageSquare,
  Phone,
  BookOpen,
  Layers,
  Award,
  HelpCircle,
  Users,
  Search,
  CheckCircle2,
  FileText,
  Settings,
  Trophy,
  CreditCard
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
    showToast,
    setActiveTestSubject
  } = useApp();

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');
  const [menuFilter, setMenuFilter] = useState<'all' | 'academic' | 'interactive' | 'communication' | 'portals'>('all');

  const t = translations[language];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNav = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleSectionNav = (sectionId: string) => {
    setMenuOpen(false);
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

  const handleStartTest = (subject: 'math' | 'arabic' | 'english') => {
    setMenuOpen(false);
    if (currentPath !== '/') {
      navigate('/');
    }
    setTimeout(() => {
      setActiveTestSubject(subject);
    }, 150);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('info', 'Logged out successfully', 'تم تسجيل الخروج بنجاح');
    navigate('/');
  };

  // Comprehensive Site Directory Data for Hamburger Menu
  const siteSections = [
    // 1. Academic & Curriculum
    {
      category: 'academic',
      titleEn: 'Home Overview',
      titleAr: 'الصفحة الرئيسية',
      descEn: 'Hero, interactive level test cards, stats, and academy introduction',
      descAr: 'الواجهة الرئيسية وبطاقات تحديد المستوى والمقدمة',
      route: '/',
      icon: GraduationCap,
      action: () => handleNav('/')
    },
    {
      category: 'academic',
      titleEn: 'Educational Programs',
      titleAr: 'البرامج التعليمية',
      descEn: 'Math, Arabic, and English interactive curricula',
      descAr: 'مناهج الرياضيات واللغة العربية والإنجليزية',
      route: '#programs',
      icon: BookOpen,
      action: () => handleSectionNav('programs')
    },
    {
      category: 'academic',
      titleEn: 'Academic Stages',
      titleAr: 'المراحل الدراسية',
      descEn: 'Foundation, Primary, and Middle School pathways',
      descAr: 'مسارات التأسيس والمرحلة الابتدائية والإعدادية',
      route: '#stages',
      icon: Layers,
      action: () => handleSectionNav('stages')
    },
    {
      category: 'academic',
      titleEn: 'Learning Outcomes',
      titleAr: 'مخرجات التعلم',
      descEn: 'Measurable mastery goals and skill development matrix',
      descAr: 'أهداف الإتقان ومصفوفة تطوير المهارات',
      route: '#outcomes',
      icon: Award,
      action: () => handleSectionNav('outcomes')
    },
    {
      category: 'academic',
      titleEn: 'For Parents',
      titleAr: 'لأولياء الأمور',
      descEn: 'Live tracking, weekly reports, and transparent academic monitoring',
      descAr: 'متابعة حية وتقارير دورية وإشراف أكاديمي مباشر',
      route: '#for-parents',
      icon: Users,
      action: () => handleSectionNav('for-parents')
    },
    {
      category: 'academic',
      titleEn: 'Success Stories & Reviews',
      titleAr: 'قصص النجاح والتقييمات',
      descEn: 'Check reviews and success stories status',
      descAr: 'متابعة حالة التقييمات وقصص النجاح',
      route: '#success-stories',
      icon: CheckCircle2,
      action: () => handleSectionNav('success-stories')
    },
    {
      category: 'academic',
      titleEn: 'Frequently Asked Questions',
      titleAr: 'الأسئلة الشائعة',
      descEn: 'Answers regarding enrollment, placement, and schedules',
      descAr: 'إجابات حول التسجيل وتحديد المستوى والمواعيد',
      route: '#faq',
      icon: HelpCircle,
      action: () => handleSectionNav('faq')
    },
    {
      category: 'academic',
      titleEn: 'Contact Us',
      titleAr: 'تواصل معنا',
      descEn: 'Direct message form, email, and phone contact',
      descAr: 'نموذج التواصل السريع والبريد الإلكتروني والهاتف',
      route: '#contact',
      icon: Phone,
      action: () => handleSectionNav('contact')
    },

    // 2. Interactive & Live Classrooms
    {
      category: 'interactive',
      titleEn: 'Educational Games',
      titleAr: 'الألعاب التعليمية',
      descEn: 'Math Speed Challenge, Arabic Word Builder, English Vocabulary Match',
      descAr: 'تحدي الحساب السريع، تركيب الكلمات العربية، ومطابقة الإنجليزية',
      route: '/games',
      icon: Gamepad2,
      badge: 'Interactive',
      action: () => handleNav('/games')
    },
    {
      category: 'interactive',
      titleEn: 'Math Diagnostic Test',
      titleAr: 'اختبار تحديد مستوى الرياضيات',
      descEn: '10 adaptive questions to determine student mathematical level',
      descAr: '10 أسئلة تقييمية لتحديد المستوى الأكاديمي في الرياضيات',
      route: 'Test: Math',
      icon: Sparkles,
      badge: 'Modal Test',
      action: () => handleStartTest('math')
    },
    {
      category: 'interactive',
      titleEn: 'Arabic Diagnostic Test',
      titleAr: 'اختبار تحديد مستوى اللغة العربية',
      descEn: 'Interactive test assessing grammar, vocabulary, and reading skills',
      descAr: 'اختبار تفاعلي يقيس مهارات النحو والمفردات والقراءة',
      route: 'Test: Arabic',
      icon: Sparkles,
      badge: 'Modal Test',
      action: () => handleStartTest('arabic')
    },
    {
      category: 'interactive',
      titleEn: 'English Diagnostic Test',
      titleAr: 'اختبار تحديد مستوى اللغة الإنجليزية',
      descEn: 'Adaptive assessment evaluating comprehension and vocabulary',
      descAr: 'تقييم ذكي يقيس الاستيعاب اللغوي والمفردات',
      route: 'Test: English',
      icon: Sparkles,
      badge: 'Modal Test',
      action: () => handleStartTest('english')
    },

    // 3. Communication Channels & Inquiries
    {
      category: 'communication',
      titleEn: 'Communication Hub (/ask/admin)',
      titleAr: 'مركز الاستفسارات - الإدارة',
      descEn: 'Direct channel to school administration and inquiries log',
      descAr: 'قناة مباشرة للتواصل مع إدارة الأكاديمية وسجل الاستفسارات',
      route: '/ask/admin',
      icon: MessageSquare,
      badge: '+20 15 50128876',
      action: () => handleNav('/ask/admin')
    },
    {
      category: 'communication',
      titleEn: 'Ask Teacher Channel (/ask/teacher)',
      titleAr: 'قناة استفسارات المعلمين',
      descEn: 'Send questions regarding assignments, lessons, and schedules',
      descAr: 'إرسال أسئلة حول الواجبات والدروس والمواعيد',
      route: '/ask/teacher',
      icon: MessageSquare,
      action: () => handleNav('/ask/teacher')
    },
    {
      category: 'communication',
      titleEn: 'Ask Student/Coordinator (/ask/student)',
      titleAr: 'قناة استفسارات الطلاب والمنسق',
      descEn: 'Coordinate academic matters, group placements, and support',
      descAr: 'تنسيق شؤون المجموعات والتوزيع الأكاديمي والدعم',
      route: '/ask/student',
      icon: MessageSquare,
      action: () => handleNav('/ask/student')
    },
    {
      category: 'communication',
      titleEn: 'WhatsApp Support (+20 15 50128876)',
      titleAr: 'محادثة واتساب الرسمية',
      descEn: 'Instant customer service and advisor chat on WhatsApp',
      descAr: 'خدمة عملاء فورية واستشارات عبر واتساب مباشرة',
      route: 'WhatsApp Direct',
      icon: Phone,
      badge: 'Click to Chat',
      action: () => window.open('https://wa.me/201550128876', '_blank')
    },

    // 4. Admissions & Opportunities
    {
      category: 'academic',
      titleEn: 'Student Registration (/ads & /register)',
      titleAr: 'تسجيل الطلاب والتجربة المجانية',
      descEn: 'Apply for admission and book free trial introductory session',
      descAr: 'التقديم للالتحاق وحجز حصة تجريبية مجانية',
      route: '/ads',
      icon: Sparkles,
      badge: 'Free Trial',
      action: () => handleNav('/ads')
    },
    {
      category: 'academic',
      titleEn: 'Careers (/careers)',
      titleAr: 'الوظائف والشواغر (/careers)',
      descEn: 'Check current openings and recruitment status at Learn Academy',
      descAr: 'متابعة حالة الوظائف والشواغر في أكاديمية ليرن',
      route: '/careers',
      icon: Briefcase,
      badge: 'No Openings',
      action: () => handleNav('/careers')
    },
    {
      category: 'academic',
      titleEn: 'Surge Platform (learn-academy-platform.surge.sh)',
      titleAr: 'منصة سيرج الرسمية',
      descEn: 'Official high-speed mirror deployment on Surge CDN',
      descAr: 'النسخة الرسمية السريعة المستضافة على شبكة سيرج',
      route: 'External Surge Link',
      icon: ExternalLink,
      badge: 'Official Mirror',
      action: () => window.open('https://learn-academy-platform.surge.sh', '_blank')
    },
    {
      category: 'academic',
      titleEn: 'Partner: Korasty Kids (korasty-kids.surge.sh)',
      titleAr: 'الشريك التعليمي: كراستي كيدز',
      descEn: 'Children foundation educational worksheets and partner resources',
      descAr: 'أوراق عمل وأنشطة تأسيسية للأطفال مع الشريك التعليمي',
      route: 'External Partner Link',
      icon: ExternalLink,
      badge: 'Partner',
      action: () => window.open('https://korasty-kids.surge.sh/', '_blank')
    },

    // 5. Portals & Authentication
    {
      category: 'portals',
      titleEn: '/login',
      titleAr: 'تسجيل الدخول (/login)',
      descEn: 'Sign in to your Learn Academy account',
      descAr: 'تسجيل الدخول إلى حسابك في أكاديمية ليرن',
      route: '/login',
      icon: LogIn,
      action: () => handleNav('/login')
    },
    {
      category: 'portals',
      titleEn: 'Dashboard (/dashboard)',
      titleAr: 'لوحة التحكم الأكاديمية',
      descEn: 'Personalized control panel matching your logged-in role',
      descAr: 'لوحة التحكم والمتابعة المخصصة بحسب رتبتك في المنصة',
      route: '/dashboard',
      icon: LayoutDashboard,
      badge: 'Protected',
      action: () => handleNav('/dashboard')
    },
    {
      category: 'portals',
      titleEn: 'Notifications Center (/notifications)',
      titleAr: 'مركز الإشعارات والتنبيهات',
      descEn: 'Live meeting reminders, inquiry updates, and academic alerts',
      descAr: 'تنبيهات الحصص المباشرة ومستجدات الاستفسارات والتنبيهات الأكاديمية',
      route: '/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? `${unreadCount} New` : undefined,
      action: () => handleNav('/notifications')
    },
    {
      category: 'interactive',
      titleEn: 'My Badges & Honors (/my-badges)',
      titleAr: 'شاراتي وإنجازاتي الأكاديمية (/my-badges)',
      descEn: 'Earned honors, diagnostic test badges, and XP points progression',
      descAr: 'الأوسمة المحققة وشارات اختبارات المستوى ورتبة الطالب ونقاط XP',
      route: '/my-badges',
      icon: Award,
      badge: 'XP & Honors',
      action: () => handleNav('/my-badges')
    },
    {
      category: 'portals',
      titleEn: 'My Academic Portfolio (/my-portfolio)',
      titleAr: 'ملفي الأكاديمي وسجل إنجازاتي (/my-portfolio)',
      descEn: 'Comprehensive student profile, diagnostic levels, cohort, and schedule',
      descAr: 'السجل الأكاديمي الشامل للطالب ودرجات التقييم والمجموعة والحصص',
      route: '/my-portfolio',
      icon: GraduationCap,
      badge: 'Passport',
      action: () => handleNav('/my-portfolio')
    },
    {
      category: 'portals',
      titleEn: 'Settings & Preferences (/settings)',
      titleAr: 'الإعدادات وتفضيلات الحساب (/settings)',
      descEn: 'Language toggle, game sound effects, notifications, and security',
      descAr: 'تبديل اللغة، المؤثرات الصوتية، تنبيهات الحصص، وتعديل بيانات الدخول',
      route: '/settings',
      icon: Settings,
      badge: 'Preferences',
      action: () => handleNav('/settings')
    },
    {
      category: 'communication',
      titleEn: 'Help Center & FAQs (/help)',
      titleAr: 'مركز المساعدة والأسئلة الشائعة (/help)',
      descEn: 'Step-by-step guides, searchable FAQs, and direct concierge support',
      descAr: 'دليل الاستخدام الشامل والأسئلة الشائعة والدعم الفني المباشر',
      route: '/help',
      icon: HelpCircle,
      badge: 'Support & FAQs',
      action: () => handleNav('/help')
    },
    {
      category: 'interactive',
      titleEn: 'Badges & Honors Guide (/badges-guide)',
      titleAr: 'دليل الشارات ونظام الأوسمة الأكاديمية (/badges-guide)',
      descEn: 'Complete catalog of all earnable badges, criteria, and XP rewards',
      descAr: 'الدليل الكامل لكافة الشارات ومعايير استحقاقها ونقاط الخبرة',
      route: '/badges-guide',
      icon: Trophy,
      badge: 'Criteria & XP',
      action: () => handleNav('/badges-guide')
    },
    {
      category: 'academic',
      titleEn: 'Tuition & Payments (/payments)',
      titleAr: 'بوابة الدفع والاشتراك في البرامج (/payments)',
      descEn: 'Program packages, tuition rates, bank transfer, and receipt submission',
      descAr: 'باقات الاشتراك وأسعار البرامج وبيانات التحويل البنكي وتأكيد السداد',
      route: '/payments',
      icon: CreditCard,
      badge: 'Tuition & Fees',
      action: () => handleNav('/payments')
    }
  ];

  const filteredSections = siteSections.filter((item) => {
    const matchesFilter = menuFilter === 'all' || item.category === menuFilter;
    if (!matchesFilter) return false;

    if (!menuSearch.trim()) return true;
    const query = menuSearch.toLowerCase().trim();
    return (
      item.titleEn.toLowerCase().includes(query) ||
      item.titleAr.includes(query) ||
      item.descEn.toLowerCase().includes(query) ||
      item.descAr.includes(query) ||
      item.route.toLowerCase().includes(query)
    );
  });

  return (
    <header className="sticky top-0 z-50 bg-[#4f46e5] border-b border-white/10 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Toggle - Accessible on All Devices */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`p-2.5 rounded-2xl transition-all cursor-pointer flex items-center gap-2 ${
              menuOpen
                ? 'bg-amber-400 text-slate-950 shadow-lg ring-2 ring-white/50'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="Open Site Directory & Menu"
            aria-label="Open Site Directory & Menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            <span className="hidden sm:inline font-extrabold text-xs">
              {language === 'ar' ? 'القائمة الشاملة' : 'Site Directory'}
            </span>
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
                Math • Arabic • English
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
            onClick={() => handleNav('/ask/admin')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all glow-btn ${
              currentPath.startsWith('/ask') || currentPath.startsWith('/talk')
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-amber-200 hover:bg-amber-400/20 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'ar' ? 'تواصل واسأل' : 'Ask & Talk'}</span>
          </button>

          <button
            onClick={() => handleNav('/my-badges')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all glow-btn ${
              currentPath === '/my-badges' || currentPath === '/badges-guide'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-amber-200 hover:bg-amber-400/20 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'ar' ? 'الشارات' : 'Badges'}</span>
          </button>

          <button
            onClick={() => handleNav('/payments')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all glow-btn ${
              currentPath === '/payments'
                ? 'bg-emerald-400 text-slate-950 shadow'
                : 'text-emerald-200 hover:bg-emerald-500/20 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-300" />
            <span>{language === 'ar' ? 'الرسوم' : 'Tuition'}</span>
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

          {/* Official Surge Platform Link */}
          <a
            href="https://learn-academy-platform.surge.sh"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all flex items-center gap-1 glow-btn shadow"
            title="Official Surge Platform: learn-academy-platform.surge.sh"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Surge Mirror</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
          </a>
        </nav>

        {/* Right Actions: Language Switcher, Notifications, Settings, Help, Login/Dashboard */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* Help Center Icon */}
          <button
            onClick={() => handleNav('/help')}
            className={`p-2.5 rounded-xl border transition-all glow-btn cursor-pointer ${
              currentPath === '/help'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow'
                : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
            }`}
            title={language === 'ar' ? 'مركز المساعدة والأسئلة الشائعة' : 'Help Center & FAQs'}
          >
            <HelpCircle className="w-4 h-4 text-amber-300" />
          </button>

          {/* Settings Icon */}
          <button
            onClick={() => handleNav('/settings')}
            className={`p-2.5 rounded-xl border transition-all glow-btn cursor-pointer ${
              currentPath === '/settings'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow'
                : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
            }`}
            title={language === 'ar' ? 'الإعدادات وتفضيلات الحساب' : 'Settings & Preferences'}
          >
            <Settings className="w-4 h-4 text-indigo-200" />
          </button>

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

              <button
                onClick={() => handleNav('/login')}
                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-bold flex items-center gap-1.5 shadow-md transition-all glow-btn cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span className="font-mono font-black">/login</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* COMPREHENSIVE ALL-ROUTES HAMBURGER MENU */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-[#312e81] shadow-2xl animate-in slide-in-from-top-3 duration-200">
          
          {/* Top Bar inside Menu */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-white/10 bg-[#25216b] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-black text-lg sm:text-xl text-white block leading-tight">
                    {t.academyName} — {language === 'ar' ? 'الدليل الشامل لكافة صفحات ومسارات الموقع' : 'Complete Site Directory'}
                  </span>
                  <span className="text-xs text-amber-300 font-extrabold block">
                    {language === 'ar'
                      ? 'جميع المسارات والأقسام والبوابات والاختبارات التفاعلية'
                      : 'All routes, portals, sections, tests & live communication'}
                  </span>
                </div>
              </div>

              {/* Close Button on Mobile */}
              <button
                onClick={() => setMenuOpen(false)}
                className="md:hidden p-2 rounded-xl bg-white/15 text-white hover:bg-white/30 transition-colors"
                title="Close Menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Quick Search inside Menu */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  placeholder={language === 'ar' ? 'ابحث في كل مسارات وصفحات الموقع...' : 'Search all routes, sections & pages...'}
                  className="w-full bg-white text-slate-800 text-xs font-bold pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-slate-400"
                />
                {menuSearch && (
                  <button
                    onClick={() => setMenuSearch('')}
                    className="absolute right-2.5 rtl:left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>

              <button
                onClick={() => setMenuOpen(false)}
                className="hidden md:flex p-2.5 rounded-xl bg-white/15 text-white hover:bg-white/30 transition-colors cursor-pointer"
                title="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Categories Chips */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar border-b border-white/5 bg-[#2c2779]">
            {[
              { id: 'all', labelEn: 'All Directory Items', labelAr: 'الكل' },
              { id: 'academic', labelEn: 'Curriculum & Sections', labelAr: 'المناهج والأقسام' },
              { id: 'interactive', labelEn: 'Games & Live Classrooms', labelAr: 'الألعاب والفصول المباشرة' },
              { id: 'communication', labelEn: 'Communication Channels', labelAr: 'قنوات التواصل' },
              { id: 'portals', labelEn: 'Portals & Accounts', labelAr: 'البوابات والحسابات' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setMenuFilter(cat.id as any)}
                className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  menuFilter === cat.id
                    ? 'bg-amber-400 text-slate-950 shadow'
                    : 'bg-white/10 text-indigo-100 hover:bg-white/20'
                }`}
              >
                {language === 'ar' ? cat.labelAr : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Grid of All Site Items */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 max-h-[70vh] overflow-y-auto">
            {filteredSections.length === 0 ? (
              <div className="py-12 text-center text-indigo-200">
                <Search className="w-10 h-10 mx-auto text-indigo-300/60 mb-2" />
                <p className="font-extrabold text-sm">
                  {language === 'ar' ? 'لا توجد عناصر مطابقة لبحثك' : 'No directory items matching your search.'}
                </p>
                <button
                  onClick={() => {
                    setMenuSearch('');
                    setMenuFilter('all');
                  }}
                  className="mt-3 px-4 py-1.5 rounded-xl bg-white/20 text-white font-bold text-xs hover:bg-white/30"
                >
                  {language === 'ar' ? 'إعادة ضبط البحث' : 'Reset Search'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredSections.map((item, idx) => {
                  const IconComp = item.icon;
                  const isActive = currentPath === item.route;

                  return (
                    <button
                      key={idx}
                      onClick={item.action}
                      className={`text-left rtl:text-right p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                        isActive
                          ? 'bg-white text-slate-900 border-amber-400 ring-2 ring-amber-400 shadow-xl'
                          : 'bg-white/95 hover:bg-white text-slate-800 border-slate-100 hover:border-amber-300 shadow-md hover:shadow-lg'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center transition-colors">
                            <IconComp className="w-5 h-5" />
                          </div>

                          <div className="flex items-center gap-1.5">
                            {item.badge && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black">
                                {item.badge}
                              </span>
                            )}
                            <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                              {item.route}
                            </span>
                          </div>
                        </div>

                        <h3 className="font-black text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {language === 'ar' ? item.titleAr : item.titleEn}
                        </h3>

                        <p className="text-[11px] text-slate-500 font-semibold mt-1 line-clamp-2 leading-relaxed">
                          {language === 'ar' ? item.descAr : item.descEn}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-indigo-600 group-hover:text-indigo-800">
                        <span>{language === 'ar' ? 'فتح الرابط مباشرة ←' : 'Open destination →'}</span>
                        {isActive && (
                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-black text-[10px]">
                            {language === 'ar' ? 'الصفحة الحالية' : 'Current Page'}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Quick Action Footer inside Expanded Menu */}
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 text-indigo-200">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Learn Academy — Math • Arabic • English Platform</span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="https://wa.me/201550128876"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-black flex items-center gap-1.5 shadow"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp: +20 15 50128876</span>
                </a>

                <a
                  href="https://learn-academy-platform.surge.sh"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black flex items-center gap-1.5 shadow"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>learn-academy-platform.surge.sh</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      )}
    </header>
  );
};

