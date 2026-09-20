import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  GraduationCap,
  BookOpen,
  Calculator,
  Languages,
  Award,
  Calendar,
  Clock,
  Printer,
  Share2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Video,
  FileText,
  Copy
} from 'lucide-react';

export const MyPortfolio: React.FC = () => {
  const { language, currentUser, groups, meetings, setActiveTestSubject, navigate, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  // Determine student group info
  const studentGroup = groups.find(
    (g) =>
      (currentUser && g.studentIds.includes(currentUser.id)) ||
      (currentUser?.groupName && g.name.toLowerCase() === currentUser.groupName.toLowerCase())
  );

  // Student upcoming meetings
  const studentMeetings = meetings.filter(
    (m) =>
      (currentUser && m.assignedStudentIds.includes(currentUser.id)) ||
      (studentGroup && m.groupId === studentGroup.id) ||
      (currentUser?.groupName && m.groupName === currentUser.groupName)
  );

  // Math, Arabic, English stats
  const mathLevel = currentUser?.levelMath || (language === 'ar' ? 'لم يتم الاختبار بعد' : 'Not Evaluated');
  const arabicLevel = currentUser?.levelArabic || (language === 'ar' ? 'لم يتم الاختبار بعد' : 'Not Evaluated');
  const englishLevel = currentUser?.levelEnglish || (language === 'ar' ? 'لم يتم الاختبار بعد' : 'Not Evaluated');

  const mathScore = currentUser?.scoreMath ?? null;
  const arabicScore = currentUser?.scoreArabic ?? null;
  const englishScore = currentUser?.scoreEnglish ?? null;

  const completedTestsCount = (mathScore !== null ? 1 : 0) + (arabicScore !== null ? 1 : 0) + (englishScore !== null ? 1 : 0);
  const averageScore =
    completedTestsCount > 0
      ? Math.round(((mathScore || 0) + (arabicScore || 0) + (englishScore || 0)) / completedTestsCount)
      : 0;

  const handleCopySummary = () => {
    const text = `🎓 Learn Academy - Academic Portfolio
Learner: ${currentUser?.name || 'Student'}
Role: ${currentUser?.role || 'Student'}
Group: ${studentGroup?.name || currentUser?.groupName || 'General Cohort'}
-----------------------
📐 Mathematics: ${mathLevel} (${mathScore !== null ? `${mathScore}%` : 'Pending'})
📖 Arabic: ${arabicLevel} (${arabicScore !== null ? `${arabicScore}%` : 'Pending'})
🌐 English: ${englishLevel} (${englishScore !== null ? `${englishScore}%` : 'Pending'})
Average Score: ${averageScore}%
Verified at: learn-academy-portal.vercel.app`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      showToast('success', 'Portfolio summary copied to clipboard!', 'تم نسخ ملخص الملف الأكاديمي!');
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl glow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
            {currentUser?.name ? currentUser.name[0].toUpperCase() : <GraduationCap className="w-8 h-8" />}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {currentUser?.name || (language === 'ar' ? 'ملف الطالب الأكاديمي' : 'Student Academic Portfolio')}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-100 text-indigo-800 border border-indigo-200 uppercase">
                {currentUser?.role || (language === 'ar' ? 'طالب' : 'Student')}
              </span>
            </div>

            <div className="text-xs text-slate-500 font-semibold flex items-center gap-3 flex-wrap">
              <span>{language === 'ar' ? 'اسم المستخدم:' : 'Username:'} @{currentUser?.username || 'learner'}</span>
              <span>•</span>
              <span>{language === 'ar' ? 'المجموعة:' : 'Group:'} {studentGroup?.name || currentUser?.groupName || (language === 'ar' ? 'الفوج العام' : 'General Cohort')}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleCopySummary}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200 flex items-center gap-1.5"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
            <span>{copied ? (language === 'ar' ? 'تم النسخ!' : 'Copied!') : (language === 'ar' ? 'نسخ التقرير' : 'Copy Summary')}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all shadow flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'ar' ? 'طباعة الملف' : 'Print Portfolio'}</span>
          </button>
        </div>
      </div>

      {/* Guest Notice if not logged in */}
      {!currentUser && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              {language === 'ar' ? 'أنت تستعرض نسخة تجريبية من الملف الأكاديمي' : 'Viewing Guest Academic Portfolio Preview'}
            </h3>
            <p className="text-xs text-slate-600">
              {language === 'ar'
                ? 'سجل دخولك كطالب لعرض تقاريرك الدقيقة ومجموعتك الدراسية وحصصك المباشرة.'
                : 'Log in as an authenticated student to see your real classroom assignments, grades, and schedule.'}
            </p>
          </div>

          <button
            onClick={() => navigate('/login/student')}
            className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shrink-0 transition-all shadow"
          >
            {language === 'ar' ? 'دخول بوابة الطلاب' : 'Student Portal Login'}
          </button>
        </div>
      )}

      {/* 3 Core Diagnostic Level Gauges */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span>{language === 'ar' ? 'التقييمات التشخيصية والمستوى الأكاديمي' : 'Diagnostic Levels & Skill Mastery'}</span>
          </h2>
          <span className="text-xs text-slate-500 font-bold">
            {completedTestsCount} / 3 {language === 'ar' ? 'اختبارات مكتملة' : 'Tests Completed'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Math Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4 glow-card flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <Calculator className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800">
                  {mathLevel}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {language === 'ar' ? 'الرياضيات' : 'Mathematics'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'ar' ? 'الحساب، الهندسة، الجبر، والتفكير المنطقي' : 'Arithmetic, Algebra, Geometry & Logic'}
                </p>
              </div>

              {/* Score bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{language === 'ar' ? 'الدرجة:' : 'Score:'}</span>
                  <span>{mathScore !== null ? `${mathScore}%` : (language === 'ar' ? 'غير مقيّم' : 'Not Tested')}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${mathScore || 0}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTestSubject('math')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow flex items-center justify-center gap-2"
            >
              <span>{mathScore !== null ? (language === 'ar' ? 'إعادة الاختبار' : 'Retake Test') : (language === 'ar' ? 'بدء التقييم' : 'Take Test')}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          {/* Arabic Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4 glow-card flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                  {arabicLevel}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {language === 'ar' ? 'اللغة العربية' : 'Arabic Language'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'ar' ? 'النحو، الإملاء، البلاغة، والقراءة الفاحصة' : 'Grammar, Reading Fluency & Vocabulary'}
                </p>
              </div>

              {/* Score bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{language === 'ar' ? 'الدرجة:' : 'Score:'}</span>
                  <span>{arabicScore !== null ? `${arabicScore}%` : (language === 'ar' ? 'غير مقيّم' : 'Not Tested')}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${arabicScore || 0}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTestSubject('arabic')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow flex items-center justify-center gap-2"
            >
              <span>{arabicScore !== null ? (language === 'ar' ? 'إعادة الاختبار' : 'Retake Test') : (language === 'ar' ? 'بدء التقييم' : 'Take Test')}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          {/* English Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4 glow-card flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Languages className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800">
                  {englishLevel}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {language === 'ar' ? 'اللغة الإنجليزية' : 'English Language'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'ar' ? 'المفردات، القواعد، المحادثة، والاستيعاب' : 'Vocabulary, Grammar, Reading & Fluency'}
                </p>
              </div>

              {/* Score bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{language === 'ar' ? 'الدرجة:' : 'Score:'}</span>
                  <span>{englishScore !== null ? `${englishScore}%` : (language === 'ar' ? 'غير مقيّم' : 'Not Tested')}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${englishScore || 0}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTestSubject('english')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow flex items-center justify-center gap-2"
            >
              <span>{englishScore !== null ? (language === 'ar' ? 'إعادة الاختبار' : 'Retake Test') : (language === 'ar' ? 'بدء التقييم' : 'Take Test')}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>

      {/* Cohort & Schedule Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cohort Group Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md space-y-4 glow-card">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <span>{language === 'ar' ? 'المجموعة التعليمية المخصصة' : 'Enrolled Cohort Group'}</span>
            </h3>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {studentGroup?.subject || 'All Subjects'}
            </span>
          </div>

          <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">{language === 'ar' ? 'اسم المجموعة:' : 'Group Name:'}</span>
              <span className="font-extrabold">{studentGroup?.name || currentUser?.groupName || 'Primary Scholars'}</span>
            </div>

            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">{language === 'ar' ? 'المعلم المشرف:' : 'Assigned Teacher:'}</span>
              <span className="font-extrabold">{studentGroup?.teacherName || (language === 'ar' ? 'معلم أكاديمية معتمد' : 'Lead Instructor')}</span>
            </div>

            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">{language === 'ar' ? 'الجدول الأسبوعي:' : 'Schedule:'}</span>
              <span className="font-extrabold">{studentGroup?.schedule || 'Sun/Tue/Thu 5:00 PM'}</span>
            </div>

            <div className="flex justify-between pt-1">
              <span className="text-slate-500">{language === 'ar' ? 'حالة القيد:' : 'Enrollment Status:'}</span>
              <span className="font-extrabold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'نشط ومعتمد' : 'Active & Verified'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Live Classes Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md space-y-4 glow-card flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Video className="w-5 h-5 text-purple-600" />
                <span>{language === 'ar' ? 'الحصص المباشرة والجدول' : 'Live Meeting Schedule'}</span>
              </h3>
              <span className="text-xs font-bold text-slate-500">
                {studentMeetings.length} {language === 'ar' ? 'حصص مجدولة' : 'Sessions'}
              </span>
            </div>

            {studentMeetings.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
                <Clock className="w-5 h-5 text-slate-400 mx-auto" />
                <div className="text-xs font-bold text-slate-700">
                  {language === 'ar' ? 'لا توجد حصص مباشرة جارية حالياً' : 'No live sessions scheduled right now'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {language === 'ar'
                    ? 'سيتم إشعارك فور قيام المعلم بتفعيل الحصة، أو عبر رابط واتساب.'
                    : 'Your teacher will assign meeting links or share them directly in your WhatsApp group.'}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {studentMeetings.slice(0, 2).map((m) => (
                  <div key={m.id} className="p-3 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-xs text-purple-950">{m.title}</div>
                      <div className="text-[11px] text-purple-700 font-semibold">{m.teacherName} • {m.startTime}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-200 text-purple-900">
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200 flex items-center justify-center gap-1.5 mt-2"
          >
            <span>{language === 'ar' ? 'الانتقال إلى لوحة التحكم' : 'Go to Full Dashboard'}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* Quick Navigation Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <button
          onClick={() => navigate('/my-badges')}
          className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 shadow-sm text-left rtl:text-right transition-all flex items-center gap-3.5 group"
        >
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 group-hover:scale-105 transition-transform">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="font-black text-xs text-slate-900">{language === 'ar' ? 'شاراتي وأوسمتي' : 'My Badges'}</div>
            <div className="text-[11px] text-slate-500">{language === 'ar' ? 'عرض الأوسمة المكتسبة' : 'View earned badges'}</div>
          </div>
        </button>

        <button
          onClick={() => navigate('/badges-guide')}
          className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 shadow-sm text-left rtl:text-right transition-all flex items-center gap-3.5 group"
        >
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="font-black text-xs text-slate-900">{language === 'ar' ? 'دليل الشارات' : 'Badges Guide'}</div>
            <div className="text-[11px] text-slate-500">{language === 'ar' ? 'شروط ومعايير النقاط' : 'Earning criteria'}</div>
          </div>
        </button>

        <button
          onClick={() => navigate('/payments')}
          className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 shadow-sm text-left rtl:text-right transition-all flex items-center gap-3.5 group"
        >
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="font-black text-xs text-slate-900">{language === 'ar' ? 'الاشتراكات والمدفوعات' : 'Tuition & Plans'}</div>
            <div className="text-[11px] text-slate-500">{language === 'ar' ? 'باقات البرامج والرسوم' : 'Pricing & Enrollment'}</div>
          </div>
        </button>
      </div>

    </div>
  );
};
