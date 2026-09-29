import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Trophy,
  ArrowRight,
  ArrowLeft,
  RotateCcw
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

interface QuizPlayerModalProps {
  quiz: TeacherQuiz;
  onClose: () => void;
}

export const QuizPlayerModal: React.FC<QuizPlayerModalProps> = ({ quiz, onClose }) => {
  const { language, currentUser, showToast } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState((quiz.time_limit_minutes || 10) * 60);
  const [isFinished, setIsFinished] = useState(false);
  const [scoreResult, setScoreResult] = useState<{ score: number; totalScore: number; percentage: number } | null>(null);

  const questions = quiz.questions || [];
  const currentQ = questions[currentIndex];

  // Timer countdown
  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isFinished, selectedAnswers]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSelectOption = (qId: string, optIndex: number) => {
    if (isFinished) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIndex }));
  };

  const handleSubmitQuiz = async () => {
    if (isFinished) return;
    setIsFinished(true);

    try {
      const res = await fetch(`/api/quizzes/${quiz.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentUser?.id || 'guest_student',
          studentName: currentUser?.name || 'Student',
          answers: selectedAnswers
        })
      });

      const data = await res.json();
      if (data.success && data.submission) {
        setScoreResult({
          score: data.submission.score,
          totalScore: data.submission.totalScore,
          percentage: data.submission.percentage
        });

        if (data.submission.percentage >= 70) {
          confetti({ particleCount: 70, spread: 80 });
          showToast('success', `Quiz Completed! You scored ${data.submission.percentage}%!`, `أحسنت! نتيجتك في الاختبار: ${data.submission.percentage}%!`);
        } else {
          showToast('info', `Quiz Completed: ${data.submission.percentage}%`, `انتهى الاختبار: نتيجتك ${data.submission.percentage}%`);
        }
      }
    } catch {
      // Fallback calculation in case of network issue
      let score = 0;
      let total = 0;
      questions.forEach((q) => {
        const pts = q.points || 10;
        total += pts;
        if (selectedAnswers[q.id] === q.correctIndex) {
          score += pts;
        }
      });
      const pct = total > 0 ? Math.round((score / total) * 100) : 0;
      setScoreResult({ score, totalScore: total, percentage: pct });
    }
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-50 text-indigo-700">
              {quiz.subject}
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900">{quiz.title}</h3>
          </div>

          <div className="flex items-center gap-3">
            {!isFinished && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold ${
                timeLeft < 60 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-slate-100 text-slate-700'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Finished / Result Screen */}
        {isFinished && scoreResult ? (
          <div className="text-center py-6 space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-xl">
              <Trophy className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h4 className="text-2xl font-black text-slate-900">
                {language === 'ar' ? 'تم إنهاء الاختبار وتسجيل النتيجة في SQLite!' : 'Quiz Complete & Saved to SQLite!'}
              </h4>
              <p className="text-xs text-slate-500">
                {language === 'ar'
                  ? `أجبت على ${answeredCount} من أصل ${questions.length} أسئلة`
                  : `Answered ${answeredCount} of ${questions.length} questions`}
              </p>
            </div>

            <div className="inline-block p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
              <div className="text-4xl font-black text-indigo-600">{scoreResult.percentage}%</div>
              <div className="text-xs font-bold text-slate-500 mt-1">
                {scoreResult.score} / {scoreResult.totalScore} {language === 'ar' ? 'نقطة' : 'points'}
              </div>
            </div>

            {/* Questions Review with Explanations */}
            <div className="text-left space-y-3 pt-4 border-t border-slate-100">
              <h5 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                {language === 'ar' ? 'مراجعة الإجابات وشروحات المعلم:' : 'Question Review & Explanations:'}
              </h5>
              {questions.map((q, idx) => {
                const userAns = selectedAnswers[q.id];
                const isCorrect = userAns === q.correctIndex;
                return (
                  <div key={q.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-900">#{idx + 1}. {q.question}</span>
                      {isCorrect ? (
                        <span className="text-emerald-600 flex items-center gap-1 font-black">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                        </span>
                      ) : (
                        <span className="text-rose-600 flex items-center gap-1 font-black">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect
                        </span>
                      )}
                    </div>
                    <div className="text-slate-600">
                      <span>Correct: <strong>{q.options[q.correctIndex]}</strong></span>
                    </div>
                    {q.explanation && (
                      <p className="text-[11px] text-indigo-700 bg-indigo-50/70 p-2 rounded-xl border border-indigo-100">
                        💡 {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow cursor-pointer"
            >
              {language === 'ar' ? 'إغلاق' : 'Close Review'}
            </button>
          </div>
        ) : currentQ ? (
          /* Active Question View */
          <div className="space-y-6">
            
            {/* Progress indicators */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>{language === 'ar' ? `السؤال ${currentIndex + 1} من ${questions.length}` : `Question ${currentIndex + 1} of ${questions.length}`}</span>
                <span>{answeredCount} / {questions.length} {language === 'ar' ? 'مكتمل' : 'Answered'}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
              <h4 className="text-sm sm:text-base font-black text-slate-900 leading-relaxed">
                {currentQ.question}
              </h4>
              <span className="text-[11px] text-indigo-600 font-bold mt-1 inline-block">
                +{currentQ.points || 10} {language === 'ar' ? 'نقاط' : 'pts'}
              </span>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQ.id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-md font-bold'
                        : 'border-slate-200 hover:border-indigo-300 bg-white text-slate-800'
                    }`}
                  >
                    <span>{opt}</span>
                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                      isSelected ? 'border-white text-white' : 'border-slate-300 text-slate-400'
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold disabled:opacity-30 cursor-pointer"
              >
                {language === 'ar' ? 'السابق' : 'Previous'}
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow cursor-pointer"
                >
                  {language === 'ar' ? 'السؤال التالي' : 'Next Question'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow cursor-pointer"
                >
                  {language === 'ar' ? 'تسليم الاختبار الآن' : 'Submit Quiz Now'}
                </button>
              )}
            </div>
          </div>
        ) : null}

      </div>
    </div>
  );
};
