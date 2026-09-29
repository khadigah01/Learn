import React, { useState, useEffect } from 'react';
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
  Copy,
  Code,
  Upload,
  Plus,
  Play,
  Trash2,
  ExternalLink,
  Heart,
  Gamepad2,
  Download,
  X,
  FileCode,
  HelpCircle,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CertificateManager } from '../components/CertificateManager';

interface PortfolioProject {
  id: string;
  student_id: string;
  student_name: string;
  title: string;
  description: string;
  project_type: string; // 'sb3' | 'scratch_link' | 'turbowarp_link'
  scratch_url: string;
  scratch_project_id: string;
  sb3_data?: string | null;
  sb3_filename?: string | null;
  instructions: string;
  category: string;
  likes: number;
  created_at: number;
}

export const MyPortfolio: React.FC = () => {
  const { language, currentUser, groups, meetings, setActiveTestSubject, navigate, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  // SQLite Projects State
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [activePlayModalProject, setActivePlayModalProject] = useState<PortfolioProject | null>(null);

  // Form states for adding a new project
  const [addMode, setAddMode] = useState<'link' | 'sb3'>('link');
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projLink, setProjLink] = useState('');
  const [projInstructions, setProjInstructions] = useState('');
  const [projCategory, setProjCategory] = useState<'game' | 'animation' | 'music' | 'story' | 'math'>('game');
  const [sb3FileData, setSb3FileData] = useState<string | null>(null);
  const [sb3FileName, setSb3FileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch portfolio projects from SQLite
  const fetchProjects = () => {
    setLoadingProjects(true);
    const url = currentUser ? `/api/portfolio?studentId=${currentUser.id}` : '/api/portfolio';
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.projects)) {
          setProjects(data.projects);
        }
      })
      .catch((err) => {
        console.warn('[Portfolio] Could not fetch projects from SQLite:', err);
      })
      .finally(() => setLoadingProjects(false));
  };

  useEffect(() => {
    fetchProjects();
  }, [currentUser]);

  // Handle .sb3 file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.sb3')) {
      showToast('error', 'Please select a valid Scratch 3.0 (.sb3) file.', 'يرجى اختيار ملف سكراتش بصيغة .sb3');
      return;
    }

    setSb3FileName(file.name);
    if (!projTitle) {
      setProjTitle(file.name.replace(/\.sb3$/i, ''));
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSb3FileData(reader.result as string);
      showToast('success', `File "${file.name}" loaded successfully!`, `تم تجهيز الملف "${file.name}" بنجاح!`);
    };
    reader.readAsDataURL(file);
  };

  // Submit new project to SQLite backend
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) {
      showToast('error', 'Please provide a project title', 'يرجى كتابة عنوان للمشروع');
      return;
    }

    if (addMode === 'link' && !projLink.trim()) {
      showToast('error', 'Please enter a Scratch URL or project ID', 'يرجى إدخال رابط أو رقم مشروع سكراتش');
      return;
    }

    if (addMode === 'sb3' && !sb3FileData) {
      showToast('error', 'Please upload an .sb3 file', 'يرجى رفع ملف .sb3');
      return;
    }

    setIsSubmitting(true);

    try {
      const studentId = currentUser?.id || 'guest_student';
      const studentName = currentUser?.name || 'Student';

      // Extract project ID if link mode
      let scratchProjectId = '';
      if (addMode === 'link') {
        const match = projLink.match(/projects\/(\d+)/) || projLink.match(/^(\d+)$/);
        if (match && match[1]) {
          scratchProjectId = match[1];
        }
      }

      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          studentName,
          title: projTitle.trim(),
          description: projDesc.trim(),
          projectType: addMode === 'sb3' ? 'sb3' : 'scratch_link',
          scratchUrl: projLink.trim(),
          scratchProjectId,
          sb3Data: sb3FileData,
          sb3Filename: sb3FileName,
          instructions: projInstructions.trim(),
          category: projCategory
        })
      });

      const data = await res.json();
      if (data.success && data.project) {
        setProjects((prev) => [data.project, ...prev]);
        showToast('success', 'Project added to SQLite Portfolio!', 'تم حفظ المشروع في ملفك الأكاديمي وقاعدة بيانات SQLite بنجاح!');
        confetti({ particleCount: 40, spread: 60 });
        
        // Reset form
        setShowAddProjectModal(false);
        setProjTitle('');
        setProjDesc('');
        setProjLink('');
        setProjInstructions('');
        setSb3FileData(null);
        setSb3FileName(null);
      } else {
        showToast('error', data.error || 'Failed to add project', 'تعذر إضافة المشروع');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Network error', 'خطأ في الاتصال بالخادم');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete project from SQLite
  const handleDeleteProject = async (id: string, title: string) => {
    try {
      await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showToast('info', `Project "${title}" deleted from SQLite`, `تم حذف المشروع "${title}" من قاعدة البيانات`);
    } catch {
      showToast('error', 'Failed to delete project', 'تعذر حذف المشروع');
    }
  };

  // Like project
  const handleLikeProject = async (id: string) => {
    try {
      const res = await fetch(`/api/portfolio/${id}/like`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, likes: data.likes } : p))
        );
        confetti({ particleCount: 20, spread: 40 });
      }
    } catch {
      // optimistic
    }
  };

  // Download .sb3 file
  const handleDownloadSb3 = (project: PortfolioProject) => {
    if (!project.sb3_data) return;
    const a = document.createElement('a');
    a.href = project.sb3_data;
    a.download = project.sb3_filename || `${project.title}.sb3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('success', 'Downloading .sb3 file...', 'جاري تحميل ملف سكراتش...');
  };

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

  // Math, Arabic, English, Scratch stats
  const mathLevel = currentUser?.levelMath || (language === 'ar' ? 'لم يتم الاختبار بعد' : 'Not Evaluated');
  const arabicLevel = currentUser?.levelArabic || (language === 'ar' ? 'لم يتم الاختبار بعد' : 'Not Evaluated');
  const englishLevel = currentUser?.levelEnglish || (language === 'ar' ? 'لم يتم الاختبار بعد' : 'Not Evaluated');
  const scratchLevel = currentUser?.levelScratch || (language === 'ar' ? 'لم يتم الاختبار بعد' : 'Not Evaluated');

  const mathScore = currentUser?.scoreMath ?? null;
  const arabicScore = currentUser?.scoreArabic ?? null;
  const englishScore = currentUser?.scoreEnglish ?? null;
  const scratchScore = currentUser?.scoreScratch ?? null;

  const completedTestsCount =
    (mathScore !== null ? 1 : 0) +
    (arabicScore !== null ? 1 : 0) +
    (englishScore !== null ? 1 : 0) +
    (scratchScore !== null ? 1 : 0);

  const averageScore =
    completedTestsCount > 0
      ? Math.round(
          ((mathScore || 0) + (arabicScore || 0) + (englishScore || 0) + (scratchScore || 0)) /
            completedTestsCount
        )
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
💻 Scratch Coding: ${scratchLevel} (${scratchScore !== null ? `${scratchScore}%` : 'Pending'})
Projects Published: ${projects.length}
Average Score: ${averageScore}%
Verified at: LearnAcademy.dpdns.org`;

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl glow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-amber-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
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
              <span>•</span>
              <span>{language === 'ar' ? `المشاريع: ${projects.length}` : `Projects: ${projects.length}`}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowAddProjectModal(true)}
            className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ar' ? 'إضافة مشروع سكراتش (.sb3 أو رابط)' : 'Add Scratch Project'}</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200 flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
            <span>{copied ? (language === 'ar' ? 'تم النسخ!' : 'Copied!') : (language === 'ar' ? 'نسخ التقرير' : 'Copy Summary')}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all shadow flex items-center gap-1.5 cursor-pointer"
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
              {language === 'ar' ? 'أنت تستعرض ملف الطالب بوضع الضيف' : 'Viewing Guest Student Portfolio Preview'}
            </h3>
            <p className="text-xs text-slate-600">
              {language === 'ar'
                ? 'سجل دخولك كطالب لربط مشاريعك وحصصك واختباراتك بحسابك الرسمي.'
                : 'Log in as a student to permanently connect your Scratch projects, grades, and schedule.'}
            </p>
          </div>

          <button
            onClick={() => navigate('/login/student')}
            className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shrink-0 transition-all shadow cursor-pointer"
          >
            {language === 'ar' ? 'دخول بوابة الطلاب' : 'Student Portal Login'}
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCRATCH PROJECTS & CREATIVE SHOWCASE (SQLite Database)   */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200 shrink-0">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {language === 'ar' ? 'معرض مشاريع البرمجة وسكراتش (SQLite)' : 'Scratch & Coding Showcase (SQLite)'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-orange-800">
                  {projects.length} {language === 'ar' ? 'مشاريع' : 'Projects'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {language === 'ar'
                  ? 'المشاريع المنشورة وملفات .sb3 المحفوظة في قاعدة بيانات SQLite مع تشغيل فوري عبر TurboWarp'
                  : 'Student coding projects and .sb3 files stored in SQLite with instantaneous TurboWarp execution'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddProjectModal(true)}
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ar' ? 'إضافة مشروع جديد' : 'New Project'}</span>
            </button>
            <button
              onClick={() => navigate('/play')}
              className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Gamepad2 className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ar' ? 'صالة الألعاب' : 'Play Arcade'}</span>
            </button>
          </div>
        </div>

        {/* Project List */}
        {loadingProjects ? (
          <div className="p-8 text-center text-slate-400 text-xs font-bold">
            {language === 'ar' ? 'جاري تحميل المشاريع من SQLite...' : 'Loading projects from SQLite...'}
          </div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-orange-50/50 border border-dashed border-orange-200 space-y-3">
            <Code className="w-10 h-10 text-orange-400 mx-auto" />
            <h4 className="text-sm font-black text-slate-800">
              {language === 'ar' ? 'لم تقم بإضافة مشاريع برمجية بعد' : 'No Scratch projects added yet'}
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {language === 'ar'
                ? 'يمكنك إضافة مشاريعك إما برفع ملف .sb3 من حاسوبك أو بلصق رابط مشروعك من موقع Scratch MIT أو TurboWarp.'
                : 'Publish your work by uploading an .sb3 file directly or by pasting your Scratch MIT / TurboWarp project link!'}
            </p>
            <button
              onClick={() => setShowAddProjectModal(true)}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow cursor-pointer transition-all"
            >
              {language === 'ar' ? 'أضف أول مشروع لك الآن' : 'Add Your First Project'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((proj) => {
              const projId = proj.scratch_project_id || '10128407';
              return (
                <div
                  key={proj.id}
                  className="bg-slate-50/70 hover:bg-white rounded-2xl p-5 border border-slate-200 hover:border-orange-300 hover:shadow-lg transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-orange-100 text-orange-800">
                        {proj.project_type === 'sb3' ? '.sb3 File' : 'Scratch Link'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLikeProject(proj.id)}
                          className="flex items-center gap-1 text-xs text-rose-500 font-bold hover:scale-105 cursor-pointer"
                        >
                          <Heart className="w-3.5 h-3.5 fill-rose-500" />
                          <span>{proj.likes}</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id, proj.title)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-lg cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-sm font-black text-slate-900">{proj.title}</h4>
                    {proj.description && (
                      <p className="text-xs text-slate-600 line-clamp-2">{proj.description}</p>
                    )}
                    {proj.instructions && (
                      <p className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200 line-clamp-2">
                        💡 {proj.instructions}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setActivePlayModalProject(proj)}
                      className="flex-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer shadow"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{language === 'ar' ? 'تشغيل' : 'Play'}</span>
                    </button>

                    {proj.sb3_data && (
                      <button
                        onClick={() => handleDownloadSb3(proj)}
                        className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all cursor-pointer"
                        title="Download .sb3 File"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}

                    <a
                      href={
                        proj.scratch_url ||
                        `https://turbowarp.org/editor?project_url=https://scratch.mit.edu/projects/${projId}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all cursor-pointer"
                      title="Open in TurboWarp"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Diagnostic Level Gauges (Math, Arabic, English, Scratch) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span>{language === 'ar' ? 'التقييمات التشخيصية ومستوى المواد' : 'Diagnostic Level Mastery'}</span>
          </h2>
          <span className="text-xs text-slate-500 font-bold">
            {completedTestsCount} / 4 {language === 'ar' ? 'اختبارات مكتملة' : 'Tests Completed'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Math Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                mathScore !== null ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-500'
              }`}>
                {mathScore !== null ? `${mathScore}%` : (language === 'ar' ? 'معلق' : 'Pending')}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">{language === 'ar' ? 'الرياضيات' : 'Mathematics'}</h3>
              <p className="text-xs text-slate-500 font-bold">{mathLevel}</p>
            </div>
            <button
              onClick={() => setActiveTestSubject('math')}
              className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              {mathScore !== null ? (language === 'ar' ? 'إعادة الاختبار' : 'Retake Test') : (language === 'ar' ? 'بدء التقييم' : 'Take Test')}
            </button>
          </div>

          {/* Arabic Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                arabicScore !== null ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
              }`}>
                {arabicScore !== null ? `${arabicScore}%` : (language === 'ar' ? 'معلق' : 'Pending')}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">{language === 'ar' ? 'اللغة العربية' : 'Arabic'}</h3>
              <p className="text-xs text-slate-500 font-bold">{arabicLevel}</p>
            </div>
            <button
              onClick={() => setActiveTestSubject('arabic')}
              className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              {arabicScore !== null ? (language === 'ar' ? 'إعادة الاختبار' : 'Retake Test') : (language === 'ar' ? 'بدء التقييم' : 'Take Test')}
            </button>
          </div>

          {/* English Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Languages className="w-5 h-5" />
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                englishScore !== null ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-500'
              }`}>
                {englishScore !== null ? `${englishScore}%` : (language === 'ar' ? 'معلق' : 'Pending')}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">{language === 'ar' ? 'اللغة الإنجليزية' : 'English'}</h3>
              <p className="text-xs text-slate-500 font-bold">{englishLevel}</p>
            </div>
            <button
              onClick={() => setActiveTestSubject('english')}
              className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              {englishScore !== null ? (language === 'ar' ? 'إعادة الاختبار' : 'Retake Test') : (language === 'ar' ? 'بدء التقييم' : 'Take Test')}
            </button>
          </div>

          {/* Scratch Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Code className="w-5 h-5" />
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                scratchScore !== null ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-500'
              }`}>
                {scratchScore !== null ? `${scratchScore}%` : (language === 'ar' ? 'معلق' : 'Pending')}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">{language === 'ar' ? 'برمجة سكراتش' : 'Scratch Coding'}</h3>
              <p className="text-xs text-slate-500 font-bold">{scratchLevel}</p>
            </div>
            <button
              onClick={() => setActiveTestSubject('scratch')}
              className="w-full py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              {scratchScore !== null ? (language === 'ar' ? 'إعادة الاختبار' : 'Retake Test') : (language === 'ar' ? 'بدء التقييم' : 'Take Test')}
            </button>
          </div>
        </div>
      </div>

      {/* Official Academic Certificates & Honors (SQLite) */}
      <CertificateManager filterStudentId={currentUser?.id} />

      {/* Classroom Schedule & Live Sessions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4">
        <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
          <Video className="w-5 h-5 text-indigo-600" />
          <span>{language === 'ar' ? 'الحصص المباشرة والجدول الأسبوعي' : 'Live Interactive Classroom Meetings'}</span>
        </h3>

        {studentMeetings.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
            {language === 'ar' ? 'لا توجد حصص مباشرة مجدولة حالياً' : 'No upcoming live meetings scheduled right now.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {studentMeetings.map((m) => (
              <div key={m.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{m.title}</h4>
                  <p className="text-xs text-slate-500">{m.subject} • {m.startTime}</p>
                </div>
                <button
                  onClick={() => navigate(`/meeting/${m.id}`)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
                >
                  {language === 'ar' ? 'دخول الغرفة' : 'Join'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL: ADD SCRATCH PROJECT (.sb3 or Link)                */}
      {/* ======================================================== */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {language === 'ar' ? 'إضافة مشروع سكراتش إلى ملفك الأكاديمي' : 'Add Scratch Project to Portfolio'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'ar' ? 'يتم الحفظ في قاعدة بيانات SQLite مع مشغّل TurboWarp' : 'Persisted in SQLite database with TurboWarp runner'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddProjectModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-4">
              
              {/* Method Toggle: Link vs SB3 File */}
              <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
                <button
                  type="button"
                  onClick={() => setAddMode('link')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    addMode === 'link' ? 'bg-white text-orange-700 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'رابط سكراتش أو تيربو وورب' : 'Scratch / TurboWarp Link'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAddMode('sb3')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    addMode === 'sb3' ? 'bg-white text-orange-700 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'رفع ملف سكراتش (.sb3)' : 'Upload .sb3 File'}</span>
                </button>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  {language === 'ar' ? 'عنوان المشروع *' : 'Project Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: مغامرة الفضاء أو لعبة المتاهة' : 'e.g. Space Odyssey or Maze Quest'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              {/* Mode: Link Input */}
              {addMode === 'link' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'ar' ? 'رابط المشروع أو رقمه *' : 'Scratch Project URL or ID *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={projLink}
                    onChange={(e) => setProjLink(e.target.value)}
                    placeholder="https://scratch.mit.edu/projects/10128407/ or 10128407"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-500">
                    {language === 'ar'
                      ? 'يمكنك نسخ الرابط مباشرة من متصفحك عند فتح مشروعك على سكراتش'
                      : 'Copy and paste the URL directly from your browser when editing on Scratch MIT'}
                  </p>
                </div>
              )}

              {/* Mode: .sb3 Upload */}
              {addMode === 'sb3' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'ar' ? 'ملف سكراتش (.sb3) *' : 'Select .sb3 File *'}
                  </label>
                  <div className="p-4 rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/50 text-center space-y-2">
                    <FileCode className="w-8 h-8 text-orange-500 mx-auto" />
                    <p className="text-xs text-slate-700 font-bold">
                      {sb3FileName || (language === 'ar' ? 'اضغط لاختيار ملف .sb3 من جهازك' : 'Click to select .sb3 project file')}
                    </p>
                    <label className="inline-block px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow">
                      <span>{language === 'ar' ? 'تصفح الملفات' : 'Browse Files'}</span>
                      <input type="file" accept=".sb3" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                </div>
              )}

              {/* Category */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'ar' ? 'التصنيف' : 'Category'}
                  </label>
                  <select
                    value={projCategory}
                    onChange={(e: any) => setProjCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none"
                  >
                    <option value="game">{language === 'ar' ? 'لعبة تفاعلية' : 'Interactive Game'}</option>
                    <option value="animation">{language === 'ar' ? 'رسوم متحركة' : 'Animation'}</option>
                    <option value="music">{language === 'ar' ? 'موسيقى وأصوات' : 'Music & Sound'}</option>
                    <option value="story">{language === 'ar' ? 'قصة مصورة' : 'Interactive Story'}</option>
                    <option value="math">{language === 'ar' ? 'لعبة رياضيات وذكاء' : 'Math & Logic'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'ar' ? 'المطور / الطالب' : 'Author'}
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.name || 'Student'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 text-slate-600"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  {language === 'ar' ? 'وصف المشروع فكرة اللعبة' : 'Project Description'}
                </label>
                <textarea
                  rows={2}
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  placeholder={language === 'ar' ? 'نبذة قصيرة عن فكرة المشروع والهدف منه...' : 'Short overview of the project concept...'}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              {/* Instructions */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  {language === 'ar' ? 'تعليمات اللعب وأزرار التحكم' : 'Instructions & Controls'}
                </label>
                <input
                  type="text"
                  value={projInstructions}
                  onChange={(e) => setProjInstructions(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: الأسهم للحركة، المسطرة للقفز، انقر للبدء' : 'e.g. Arrow keys to move, spacebar to jump, click green flag'}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isSubmitting ? (language === 'ar' ? 'جاري الحفظ في SQLite...' : 'Saving to SQLite...') : (language === 'ar' ? 'حفظ المشروع' : 'Save Project')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: LIVE PLAY SCRATCH PROJECT (TurboWarp Embed)        */}
      {/* ======================================================== */}
      {activePlayModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{activePlayModalProject.title}</h3>
                  <p className="text-xs text-slate-500">
                    {language === 'ar' ? `المطور: ${activePlayModalProject.student_name}` : `Author: ${activePlayModalProject.student_name}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/play')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  {language === 'ar' ? 'فتح في صالة الألعاب' : 'Open in Arcade'}
                </button>
                <button
                  onClick={() => setActivePlayModalProject(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Embedded TurboWarp player */}
            <div className="h-[460px] sm:h-[520px] rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-inner">
              <iframe
                src={`https://turbowarp.org/${activePlayModalProject.scratch_project_id || '10128407'}/embed?fps=60&turbo=false`}
                allow="fullscreen; autoplay; gamepad"
                className="w-full h-full border-0"
                title={activePlayModalProject.title}
              />
            </div>

            {/* Instructions Bar */}
            {activePlayModalProject.instructions && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span><strong>{language === 'ar' ? 'التعليمات:' : 'Controls:'}</strong> {activePlayModalProject.instructions}</span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
