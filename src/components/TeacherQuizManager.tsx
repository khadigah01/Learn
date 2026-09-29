import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Users,
  Award,
  BookOpen,
  Sparkles,
  X,
  Play,
  Eye,
  FileQuestion,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
}

interface TeacherQuiz {
  id: string;
  teacher_id: string;
  teacher_name: string;
  title: string;
  description: string;
  subject: string;
  target_group: string;
  time_limit_minutes: number;
  questions: QuizQuestion[];
  created_at: number;
}

interface QuizSubmission {
  id: string;
  quiz_id: string;
  student_id: string;
  student_name: string;
  score: number;
  total_score: number;
  percentage: number;
  submitted_at: number;
}

interface TeacherQuizManagerProps {
  onTakeQuiz?: (quiz: TeacherQuiz) => void;
}

export const TeacherQuizManager: React.FC<TeacherQuizManagerProps> = ({ onTakeQuiz }) => {
  const { language, currentUser, groups, showToast } = useApp();
  const [quizzes, setQuizzes] = useState<TeacherQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedQuizSubmissions, setSelectedQuizSubmissions] = useState<{ quizTitle: string; subs: QuizSubmission[] } | null>(null);

  // Quiz Builder Form State
  const [quizTitle, setQuizTitle] = useState('');
  const [quizSubject, setQuizSubject] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [quizTargetGroup, setQuizTargetGroup] = useState('All');
  const [timeLimit, setTimeLimit] = useState(10);
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q_' + Date.now(),
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: '',
      points: 20
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchQuizzes = () => {
    setLoading(true);
    fetch('/api/quizzes')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.quizzes)) {
          setQuizzes(data.quizzes);
        }
      })
      .catch((err) => {
        console.warn('[Quizzes] Fetch error:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: 'q_' + Date.now() + Math.random().toString(36).substring(2, 5),
        question: '',
        options: ['', '', '', ''],
        correctIndex: 0,
        explanation: '',
        points: 20
      }
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) {
      showToast('info', 'A quiz must contain at least 1 question', 'يجب أن يحتوي الاختبار على سؤال واحد على الأقل');
      return;
    }
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleQuestionChange = (idx: number, field: string, value: any) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleOptionChange = (qIdx: number, optIdx: number, value: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      const opts = [...copy[qIdx].options];
      opts[optIdx] = value;
      copy[qIdx] = { ...copy[qIdx], options: opts };
      return copy;
    });
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle.trim() || !quizSubject.trim()) {
      showToast('error', 'Please fill in quiz title and subject', 'يرجى كتابة عنوان الاختبار والمادة');
      return;
    }

    // Validate that questions have content and options
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        showToast('error', `Question #${i + 1} has no text`, `السؤال #${i + 1} فارغ`);
        return;
      }
      const validOptions = q.options.filter((o) => o.trim().length > 0);
      if (validOptions.length < 2) {
        showToast('error', `Question #${i + 1} must have at least 2 options`, `السؤال #${i + 1} يحتاج إلى خيارين على الأقل`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: currentUser?.id || 'teacher_general',
          teacherName: currentUser?.name || 'Teacher',
          title: quizTitle.trim(),
          description: quizDescription.trim(),
          subject: quizSubject.trim(),
          targetGroup: quizTargetGroup,
          timeLimitMinutes: Number(timeLimit) || 10,
          questions
        })
      });

      const data = await res.json();
      if (data.success && data.quiz) {
        setQuizzes((prev) => [data.quiz, ...prev]);
        showToast('success', `Quiz "${quizTitle}" created in SQLite!`, `تم إنشاء الاختبار "${quizTitle}" في قاعدة بيانات SQLite بنجاح!`);
        confetti({ particleCount: 40, spread: 60 });

        // Reset
        setShowCreateModal(false);
        setQuizTitle('');
        setQuizSubject('');
        setQuizDescription('');
        setQuizTargetGroup('All');
        setTimeLimit(10);
        setQuestions([
          {
            id: 'q_' + Date.now(),
            question: '',
            options: ['', '', '', ''],
            correctIndex: 0,
            explanation: '',
            points: 20
          }
        ]);
      } else {
        showToast('error', data.error || 'Failed to create quiz', 'تعذر إنشاء الاختبار');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Error creating quiz', 'خطأ أثناء إنشاء الاختبار');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuiz = async (quizId: string, title: string) => {
    try {
      await fetch(`/api/quizzes/${quizId}`, { method: 'DELETE' });
      setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
      showToast('info', `Quiz "${title}" deleted`, `تم حذف الاختبار "${title}"`);
    } catch {
      showToast('error', 'Failed to delete quiz', 'تعذر حذف الاختبار');
    }
  };

  const handleViewSubmissions = async (quiz: TeacherQuiz) => {
    try {
      const res = await fetch(`/api/quizzes/${quiz.id}/submissions`);
      const data = await res.json();
      if (data.success) {
        setSelectedQuizSubmissions({ quizTitle: quiz.title, subs: data.submissions || [] });
      }
    } catch {
      showToast('error', 'Could not load submissions', 'تعذر تحميل إجابات الطلاب');
    }
  };

  const isTeacherOrAdmin = currentUser?.role === 'teacher' || currentUser?.role === 'admin' || currentUser?.role === 'coordinator';

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200 shrink-0">
            <FileQuestion className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {language === 'ar' ? 'نظام الاختبارات والتقييمات المخصصة' : 'Teacher Assigned Quizzes (SQLite)'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800">
                {quizzes.length} {language === 'ar' ? 'اختبارات' : 'Quizzes'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {language === 'ar'
                ? 'يمكن للمعلمين إنشاء وتعيين اختبارات عن أي موضوع (سكراتش، رياضيات، إنجليزي، لغة عربية، ذكاء)'
                : 'Teachers can create, assign, and grade quizzes about ANY subject or curriculum topic'}
            </p>
          </div>
        </div>

        {isTeacherOrAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ar' ? 'إنشاء اختبار جديد' : 'Create New Quiz'}</span>
          </button>
        )}
      </div>

      {/* Quizzes List */}
      {loading ? (
        <div className="p-8 text-center text-xs font-bold text-slate-400">
          {language === 'ar' ? 'جاري تحميل الاختبارات من SQLite...' : 'Loading quizzes from SQLite...'}
        </div>
      ) : quizzes.length === 0 ? (
        <div className="p-8 text-center rounded-3xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="text-sm font-black text-slate-800">
            {language === 'ar' ? 'لا توجد اختبارات مخصصة حالياً' : 'No teacher quizzes created yet'}
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {language === 'ar'
              ? 'يمكن للمعلم إنشاء اختبار وتحديد الأسئلة والخيارات والوقت المتاح للطلاب.'
              : 'Teachers can construct multi-question quizzes with timers and automated grading.'}
          </p>
          {isTeacherOrAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              {language === 'ar' ? 'إنشاء أول اختبار' : 'Create First Quiz'}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {quiz.subject}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{quiz.time_limit_minutes} {language === 'ar' ? 'دقيقة' : 'min'}</span>
                  </div>
                </div>

                <h3 className="text-base font-black text-slate-900 leading-snug">{quiz.title}</h3>
                
                {quiz.description && (
                  <p className="text-xs text-slate-600 line-clamp-2">{quiz.description}</p>
                )}

                <div className="pt-1 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>{language === 'ar' ? `المعلم: ${quiz.teacher_name}` : `Teacher: ${quiz.teacher_name}`}</span>
                  <span>{quiz.questions?.length || 0} {language === 'ar' ? 'أسئلة' : 'Questions'}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onTakeQuiz && onTakeQuiz(quiz)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{language === 'ar' ? 'بدء الاختبار' : 'Take Quiz'}</span>
                </button>

                {isTeacherOrAdmin && (
                  <>
                    <button
                      onClick={() => handleViewSubmissions(quiz)}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
                      title={language === 'ar' ? 'نتائج الطلاب' : 'View Submissions'}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id, quiz.title)}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition-all cursor-pointer"
                      title={language === 'ar' ? 'حذف الاختبار' : 'Delete Quiz'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CREATE QUIZ (Teacher Builder)                      */}
      {/* ======================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FileQuestion className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {language === 'ar' ? 'إنشاء اختبار مخصص جديد (SQLite)' : 'Create Custom Quiz (SQLite)'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'ar' ? 'يمكنك وضع أسئلة حول أي مادة أو موضوع تعليمي' : 'Author questions on any subject with automated grading'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuiz} className="space-y-5">
              
              {/* Basic Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'ar' ? 'عنوان الاختبار *' : 'Quiz Title *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder={language === 'ar' ? 'مثال: اختبار مفاهيم سكراتش والألعاب' : 'e.g. Scratch Loops & Game Mechanics'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'ar' ? 'الموضوع أو المادة *' : 'Subject / Topic *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={quizSubject}
                    onChange={(e) => setQuizSubject(e.target.value)}
                    placeholder={language === 'ar' ? 'مثال: سكراتش، رياضيات، لغة عربية، برمجة' : 'e.g. Scratch, Math, Arabic, English'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'ar' ? 'المجموعة المستهدفة' : 'Target Group'}
                  </label>
                  <select
                    value={quizTargetGroup}
                    onChange={(e) => setQuizTargetGroup(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                  >
                    <option value="All">{language === 'ar' ? 'جميع الطلاب' : 'All Students'}</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.name}>{g.name} ({g.subject})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'ar' ? 'المدة الزمنية (بالدقائق)' : 'Time Limit (minutes)'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  {language === 'ar' ? 'وصف الاختبار وملاحظات للمعلم' : 'Description'}
                </label>
                <textarea
                  rows={2}
                  value={quizDescription}
                  onChange={(e) => setQuizDescription(e.target.value)}
                  placeholder={language === 'ar' ? 'تعليمات وإرشادات للطلاب قبل البدء...' : 'Instructions or background context for students...'}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              {/* Dynamic Questions Builder */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900">
                    {language === 'ar' ? `الأسئلة (${questions.length})` : `Questions (${questions.length})`}
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'إضافة سؤال' : 'Add Question'}</span>
                  </button>
                </div>

                {questions.map((q, qIdx) => (
                  <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-700">
                        {language === 'ar' ? `السؤال #${qIdx + 1}` : `Question #${qIdx + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIdx)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      required
                      value={q.question}
                      onChange={(e) => handleQuestionChange(qIdx, 'question', e.target.value)}
                      placeholder={language === 'ar' ? 'اكتب نص السؤال هنا...' : 'Enter question text here...'}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                    />

                    {/* Options */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500">
                        {language === 'ar' ? 'الخيارات (حدد الدائرة بجانب الإجابة الصحيحة):' : 'Options (select radio for correct answer):'}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                            <input
                              type="radio"
                              name={`correct_${q.id}`}
                              checked={q.correctIndex === optIdx}
                              onChange={() => handleQuestionChange(qIdx, 'correctIndex', optIdx)}
                              className="accent-emerald-600 cursor-pointer"
                            />
                            <input
                              type="text"
                              required
                              value={opt}
                              onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                              placeholder={`${language === 'ar' ? 'الخيار' : 'Option'} ${optIdx + 1}`}
                              className="w-full text-xs font-medium focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Explanation */}
                    <input
                      type="text"
                      value={q.explanation}
                      onChange={(e) => handleQuestionChange(qIdx, 'explanation', e.target.value)}
                      placeholder={language === 'ar' ? 'شرح أو تبرير الإجابة الصحيحة للطلاب (اختياري)...' : 'Explanation shown to students after answering (optional)...'}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] font-medium bg-white"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold shadow cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isSubmitting ? (language === 'ar' ? 'جار الحفظ في SQLite...' : 'Saving in SQLite...') : (language === 'ar' ? 'حفظ ونشر الاختبار' : 'Publish Quiz')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: VIEW STUDENT SUBMISSIONS (Teacher Analytics)       */}
      {/* ======================================================== */}
      {selectedQuizSubmissions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 border border-slate-200 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {selectedQuizSubmissions.quizTitle}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'ar' ? `إجمالي المشاركات: ${selectedQuizSubmissions.subs.length}` : `Total Submissions: ${selectedQuizSubmissions.subs.length}`}
                </p>
              </div>
              <button
                onClick={() => setSelectedQuizSubmissions(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedQuizSubmissions.subs.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                {language === 'ar' ? 'لم يقم أي طالب بتقديم هذا الاختبار بعد' : 'No students have completed this quiz yet.'}
              </div>
            ) : (
              <div className="space-y-2">
                {selectedQuizSubmissions.subs.map((s) => (
                  <div key={s.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{s.student_name}</h4>
                      <p className="text-[11px] text-slate-400">{new Date(s.submitted_at).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                        s.percentage >= 80 ? 'bg-emerald-100 text-emerald-800' : s.percentage >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {s.percentage}% ({s.score}/{s.total_score} pts)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
