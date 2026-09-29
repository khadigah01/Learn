import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CertificateItem } from '../types';
import {
  Award,
  Plus,
  Trash2,
  Printer,
  Sparkles,
  X,
  CheckCircle2,
  Calendar,
  User,
  GraduationCap,
  ShieldCheck,
  Download,
  Share2,
  Code,
  Calculator,
  BookOpen,
  Languages
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CertificateManagerProps {
  filterStudentId?: string;
  isReadOnly?: boolean;
}

export const CertificateManager: React.FC<CertificateManagerProps> = ({
  filterStudentId,
  isReadOnly = false
}) => {
  const { language, currentUser, users, showToast } = useApp();
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [activePrintCert, setActivePrintCert] = useState<CertificateItem | null>(null);

  // Form State
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [certTitle, setCertTitle] = useState('Certificate of Excellence in Scratch Programming & Game Design');
  const [certTitleAr, setCertTitleAr] = useState('شهادة تميز في برمجة سكراتش وتطوير الألعاب التفاعلية');
  const [certSubject, setCertSubject] = useState('Scratch');
  const [certDistinction, setCertDistinction] = useState('With Distinction (امتياز مع مرتبة الشرف)');
  const [teacherSignatory, setTeacherSignatory] = useState(currentUser?.name || 'Instructor');
  const [issueDate, setIssueDate] = useState(
    new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  );
  const [certNotes, setCertNotes] = useState('');
  const [certTheme, setCertTheme] = useState<'gold' | 'emerald' | 'purple' | 'amber' | 'blue'>('gold');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isTeacherOrAdmin =
    currentUser?.role === 'teacher' ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'coordinator';

  const studentsList = users.filter((u) => u.role === 'student');

  const fetchCertificates = () => {
    setLoading(true);
    const url = filterStudentId ? `/api/certificates?studentId=${filterStudentId}` : '/api/certificates';
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.certificates)) {
          setCertificates(data.certificates);
        }
      })
      .catch((err) => {
        console.warn('[Certificates] Fetch error:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCertificates();
    if (studentsList.length > 0 && !selectedStudentId) {
      setSelectedStudentId(studentsList[0].id);
    }
  }, [filterStudentId, users]);

  const handleTemplatePreset = (subjectKey: string) => {
    setCertSubject(subjectKey);
    if (subjectKey === 'Scratch') {
      setCertTitle('Certificate of Excellence in Scratch Programming & Game Design');
      setCertTitleAr('شهادة تميز في برمجة سكراتش وتطوير الألعاب التفاعلية');
      setCertTheme('amber');
    } else if (subjectKey === 'Math') {
      setCertTitle('Mastery Award in Mental Arithmetic & Applied Mathematics');
      setCertTitleAr('شهادة تفوق وإتقان في الحساب الذهني والرياضيات التطبيقية');
      setCertTheme('gold');
    } else if (subjectKey === 'Arabic') {
      setCertTitle('Honors Award in Arabic Fluency, Grammar & Expression');
      setCertTitleAr('شهادة إتقان في فصاحة اللغة العربية والنحو والتعبير');
      setCertTheme('emerald');
    } else if (subjectKey === 'English') {
      setCertTitle('Advanced Proficiency Award in English Communication & Writing');
      setCertTitleAr('شهادة كفاءة متقدمة في التواصل والكتابة باللغة الإنجليزية');
      setCertTheme('blue');
    } else {
      setCertTitle('Academic Honor Roll & Outstanding Achievement Award');
      setCertTitleAr('شهادة لوحة الشرف الأكاديمية والإنجاز المتميز');
      setCertTheme('purple');
    }
  };

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !certTitle.trim()) {
      showToast('error', 'Please select a student and certificate title', 'يرجى اختيار الطالب وعنوان الشهادة');
      return;
    }

    const studentObj = users.find((u) => u.id === selectedStudentId);
    const studentName = studentObj ? studentObj.name : 'Student';

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudentId,
          studentName,
          teacherId: currentUser?.id || 'teacher_admin',
          teacherName: teacherSignatory.trim() || currentUser?.name || 'Teacher',
          title: certTitle.trim(),
          titleAr: certTitleAr.trim(),
          subject: certSubject,
          distinction: certDistinction,
          issueDate: issueDate.trim(),
          notes: certNotes.trim(),
          theme: certTheme
        })
      });

      const data = await res.json();
      if (data.success && data.certificate) {
        setCertificates((prev) => [data.certificate, ...prev]);
        showToast(
          'success',
          `Certificate awarded to ${studentName}!`,
          `تم منح الشهادة للطالب ${studentName} بنجاح!`
        );
        confetti({ particleCount: 60, spread: 70 });
        setShowIssueModal(false);
      } else {
        showToast('error', data.error || 'Failed to issue certificate', 'تعذر إصدار الشهادة');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Error issuing certificate', 'خطأ أثناء إصدار الشهادة');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCertificate = async (id: string, title: string) => {
    try {
      await fetch(`/api/certificates/${id}`, { method: 'DELETE' });
      setCertificates((prev) => prev.filter((c) => c.id !== id));
      showToast('info', `Certificate "${title}" revoked`, `تم إلغاء الشهادة "${title}"`);
    } catch {
      showToast('error', 'Failed to delete certificate', 'تعذر إلغاء الشهادة');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {language === 'ar' ? 'الشهادات والجوائز الأكاديمية (SQLite)' : 'Academic Certificates & Honors (SQLite)'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
                {certificates.length} {language === 'ar' ? 'شهادات' : 'Certificates'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {language === 'ar'
                ? 'يمكن للمعلمين والإدارة منح شهادات التميز الأكاديمية للطلاب مع إمكانية الطباعة والتحميل'
                : 'Teachers and Admins can award accredited achievement certificates to students with print & PDF export'}
            </p>
          </div>
        </div>

        {isTeacherOrAdmin && !isReadOnly && (
          <button
            onClick={() => setShowIssueModal(true)}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 glow-btn"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ar' ? 'منح شهادة جديدة لطالب' : 'Award New Certificate'}</span>
          </button>
        )}
      </div>

      {/* Certificates List */}
      {loading ? (
        <div className="p-8 text-center text-xs font-bold text-slate-400">
          {language === 'ar' ? 'جاري تحميل الشهادات...' : 'Loading certificates...'}
        </div>
      ) : certificates.length === 0 ? (
        <div className="p-8 text-center rounded-3xl bg-amber-50/50 border border-dashed border-amber-200 space-y-3">
          <Award className="w-10 h-10 text-amber-400 mx-auto" />
          <h4 className="text-sm font-black text-slate-800">
            {language === 'ar' ? 'لا توجد شهادات مسجلة حالياً' : 'No certificates awarded yet'}
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {language === 'ar'
              ? 'يمكن للمعلمين والإدارة منح شهادات إتقان وتميز في سكراتش والرياضيات واللغات.'
              : 'Teachers and Admins can issue accredited awards for milestone completions and academic excellence.'}
          </p>
          {isTeacherOrAdmin && !isReadOnly && (
            <button
              onClick={() => setShowIssueModal(true)}
              className="px-5 py-2.5 bg-amber-500 text-slate-950 rounded-xl text-xs font-black cursor-pointer shadow"
            >
              {language === 'ar' ? 'منح أول شهادة الآن' : 'Award First Certificate'}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((cert) => {
            const themeBg =
              cert.theme === 'emerald'
                ? 'from-emerald-500/10 via-teal-500/5 to-white border-emerald-200'
                : cert.theme === 'purple'
                ? 'from-purple-500/10 via-indigo-500/5 to-white border-purple-200'
                : cert.theme === 'amber'
                ? 'from-orange-500/10 via-amber-500/5 to-white border-amber-200'
                : cert.theme === 'blue'
                ? 'from-blue-500/10 via-indigo-500/5 to-white border-blue-200'
                : 'from-amber-400/15 via-yellow-500/5 to-white border-amber-300';

            return (
              <div
                key={cert.id}
                className={`bg-gradient-to-br ${themeBg} rounded-3xl p-6 border shadow-md hover:shadow-xl transition-all space-y-4 flex flex-col justify-between`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-white/90 text-slate-800 border border-slate-200 shadow-sm">
                      {cert.subject}
                    </span>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                      {cert.distinction}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-900 leading-snug">{cert.title}</h3>
                    {cert.titleAr && language === 'ar' && (
                      <p className="text-xs text-slate-600 font-bold">{cert.titleAr}</p>
                    )}
                  </div>

                  <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-700 font-bold">
                      <span>{language === 'ar' ? 'الطالب المكرم:' : 'Honored Student:'}</span>
                      <span className="text-indigo-700 font-black">{cert.studentName}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>{language === 'ar' ? 'المعلم المشرف:' : 'Instructor:'} {cert.teacherName}</span>
                      <span>{cert.issueDate}</span>
                    </div>
                  </div>

                  {cert.notes && (
                    <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                      "{cert.notes}"
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActivePrintCert(cert)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-black shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'عرض وطباعة الشهادة' : 'View & Print Certificate'}</span>
                  </button>

                  {isTeacherOrAdmin && !isReadOnly && (
                    <button
                      onClick={() => handleDeleteCertificate(cert.id, cert.title)}
                      className="p-2.5 rounded-xl bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-400 border border-slate-200 transition-all cursor-pointer shadow-sm"
                      title={language === 'ar' ? 'إلغاء الشهادة' : 'Revoke Certificate'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ISSUE NEW CERTIFICATE (Teacher / Admin)           */}
      {/* ======================================================== */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {language === 'ar' ? 'منح شهادة أكاديمية لطالب' : 'Award Student Academic Certificate'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'ar' ? 'تمنح الشهادة رسمياً وتظهر في ملف الطالب الأكاديمي مع إمكانية الطباعة' : 'Formally issue an accredited certificate saved in SQLite database'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowIssueModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueCertificate} className="space-y-4">
              
              {/* Preset Subject Buttons */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">
                  {language === 'ar' ? 'قوالب سريعة للمواد:' : 'Quick Subject Presets:'}
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleTemplatePreset('Scratch')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      certSubject === 'Scratch' ? 'bg-orange-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>Scratch Coding</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTemplatePreset('Math')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      certSubject === 'Math' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Mathematics</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTemplatePreset('Arabic')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      certSubject === 'Arabic' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Arabic Language</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTemplatePreset('English')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      certSubject === 'English' ? 'bg-blue-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Languages className="w-3.5 h-3.5" />
                    <span>English Language</span>
                  </button>
                </div>
              </div>

              {/* Student Select */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  {language === 'ar' ? 'اختر الطالب المستحق *' : 'Select Honored Student *'}
                </label>
                <select
                  required
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                >
                  {studentsList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (@{s.username}) - {s.groupName || 'No Group'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'ar' ? 'عنوان الشهادة بالإنجليزية *' : 'Certificate Title (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={certTitle}
                    onChange={(e) => setCertTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'ar' ? 'عنوان الشهادة بالعربية' : 'Certificate Title (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={certTitleAr}
                    onChange={(e) => setCertTitleAr(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Distinction & Signatory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'ar' ? 'درجة التقدير والتميز' : 'Distinction / Grade'}
                  </label>
                  <select
                    value={certDistinction}
                    onChange={(e) => setCertDistinction(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                  >
                    <option value="With Distinction (امتياز مع مرتبة الشرف)">With Distinction (امتياز مع مرتبة الشرف)</option>
                    <option value="Excellence (ممتاز)">Excellence (ممتاز)</option>
                    <option value="Honor Roll (لوحة الشرف)">Honor Roll (لوحة الشرف)</option>
                    <option value="Outstanding Creative Mastery (إتقان إبداعي متميز)">Outstanding Creative Mastery (إتقان إبداعي متميز)</option>
                    <option value="Young Innovator (المبتكر الصغير)">Young Innovator (المبتكر الصغير)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'ar' ? 'اسم المعلم الموقع' : 'Teacher / Signatory Name'}
                  </label>
                  <input
                    type="text"
                    value={teacherSignatory}
                    onChange={(e) => setTeacherSignatory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Issue Date & Theme */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'ar' ? 'تاريخ المنح' : 'Issue Date'}
                  </label>
                  <input
                    type="text"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'ar' ? 'طابع ولون الشهادة' : 'Certificate Visual Theme'}
                  </label>
                  <select
                    value={certTheme}
                    onChange={(e: any) => setCertTheme(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                  >
                    <option value="gold">Royal Gold (ذهبي ملكي)</option>
                    <option value="emerald">Emerald Honor (زمردي)</option>
                    <option value="purple">Imperial Purple (بنفسجي)</option>
                    <option value="amber">Cyber Scratch Amber (برتقالي)</option>
                    <option value="blue">Sapphire Blue (أزرق)</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  {language === 'ar' ? 'كلمة تقدير وتشجيع للطالب' : 'Commendation / Dedication Message'}
                </label>
                <textarea
                  rows={2}
                  value={certNotes}
                  onChange={(e) => setCertNotes(e.target.value)}
                  placeholder={language === 'ar' ? 'تقديراً لتفوقه وإبداعه المتميز في إنجاز المشاريع والاختبارات...' : 'In recognition of exceptional effort, project mastery, and outstanding performance...'}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-slate-950 text-xs font-black shadow cursor-pointer transition-all flex items-center gap-1.5 glow-btn"
                >
                  <Award className="w-4 h-4" />
                  <span>{isSubmitting ? (language === 'ar' ? 'جار الحفظ في SQLite...' : 'Saving to SQLite...') : (language === 'ar' ? 'منح الشهادة رسمياً' : 'Issue Certificate')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: OFFICIAL PRINTABLE CERTIFICATE VIEW (Gold & Seal)  */}
      {/* ======================================================== */}
      {activePrintCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 border border-slate-200 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Controls */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 print:hidden">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  {language === 'ar' ? 'معاينة الشهادة الرسمية' : 'Official Certificate Preview'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-black shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'طباعة / حفظ PDF' : 'Print / Save PDF'}</span>
                </button>
                <button
                  onClick={() => setActivePrintCert(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* THE OFFICIAL CERTIFICATE TEMPLATE */}
            <div className="relative bg-gradient-to-br from-amber-50 via-white to-amber-50/40 p-8 sm:p-14 rounded-3xl border-8 border-double border-amber-400 shadow-2xl text-center space-y-6 overflow-hidden">
              
              {/* Background Ornamental Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <Award className="w-96 h-96 text-amber-700" />
              </div>

              {/* Certificate Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-amber-700 font-black tracking-widest text-xs uppercase">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Learn Academy of Mathematics, Languages & Computer Science</span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <h1 className="text-3xl sm:text-5xl font-serif font-black text-slate-900 tracking-tight">
                  CERTIFICATE OF ACHIEVEMENT
                </h1>
                <p className="text-sm font-serif italic text-amber-800">
                  شهادة إنجاز وتفوق أكاديمي معتمدة
                </p>
              </div>

              {/* Presented To */}
              <div className="space-y-2 py-4 border-y border-amber-200/80 max-w-2xl mx-auto">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  This Certificate is Proudly Awarded To:
                </p>
                <h2 className="text-2xl sm:text-4xl font-serif font-black text-slate-950 underline decoration-amber-400 decoration-2 underline-offset-8">
                  {activePrintCert.studentName}
                </h2>
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider pt-2">
                  {activePrintCert.distinction}
                </p>
              </div>

              {/* Description & Achievement */}
              <div className="max-w-xl mx-auto space-y-2 text-slate-700 text-xs sm:text-sm leading-relaxed">
                <p className="font-bold text-slate-900 text-base sm:text-lg">
                  {activePrintCert.title}
                </p>
                {activePrintCert.titleAr && (
                  <p className="font-bold text-amber-900 text-xs sm:text-sm">
                    {activePrintCert.titleAr}
                  </p>
                )}
                {activePrintCert.notes && (
                  <p className="italic text-slate-600 text-xs pt-1">
                    "{activePrintCert.notes}"
                  </p>
                )}
              </div>

              {/* Signatures & Seal */}
              <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-2xl mx-auto border-t border-amber-200/80">
                
                {/* Teacher Signatory */}
                <div className="text-center space-y-1">
                  <div className="font-serif italic font-black text-slate-900 text-sm border-b border-slate-400 pb-1 px-6">
                    {activePrintCert.teacherName}
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Supervising Instructor</p>
                </div>

                {/* Golden Seal */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 text-slate-950 flex flex-col items-center justify-center shadow-lg border-4 border-white font-black text-[10px] uppercase">
                  <Award className="w-7 h-7 mb-0.5" />
                  <span>OFFICIAL</span>
                </div>

                {/* Date & Accreditation */}
                <div className="text-center space-y-1">
                  <div className="font-serif font-bold text-slate-900 text-sm border-b border-slate-400 pb-1 px-6">
                    {activePrintCert.issueDate}
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Accredited Date</p>
                </div>
              </div>

              <div className="pt-2 text-[10px] font-mono text-slate-400">
                Official Verification ID: {activePrintCert.id} • LearnAcademy.dpdns.org
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
