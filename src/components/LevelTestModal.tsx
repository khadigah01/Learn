import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SubjectType } from '../types';
import { mathQuestions, arabicQuestions, englishQuestions } from '../data/levelTestsData';
import { translations } from '../utils/translations';
import confetti from 'canvas-confetti';
import {
  X,
  Award,
  CheckCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Calculator,
  BookOpen,
  Languages
} from 'lucide-react';

interface Props {
  subject: SubjectType;
  onClose: () => void;
}

export const LevelTestModal: React.FC<Props> = ({ subject, onClose }) => {
  const { language, currentUser, updateStudentLevel, showToast } = useApp();
  const t = translations[language];

  const questions =
    subject === 'math'
      ? mathQuestions
      : subject === 'arabic'
      ? arabicQuestions
      : englishQuestions;

  const subjectTitle =
    subject === 'math'
      ? t.mathTest
      : subject === 'arabic'
      ? t.arabicTest
      : t.englishTest;

  const subjectIcon =
    subject === 'math' ? (
      <Calculator className="w-6 h-6 text-amber-500" />
    ) : subject === 'arabic' ? (
      <BookOpen className="w-6 h-6 text-emerald-500" />
    ) : (
      <Languages className="w-6 h-6 text-indigo-500" />
    );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [assignedLevel, setAssignedLevel] = useState('');

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optIndex: number) => {
    const updated = [...selectedAnswers];
    updated[currentIndex] = optIndex;
    setSelectedAnswers(updated);
  };

  const handleNext = () => {
    if (selectedAnswers[currentIndex] === undefined) {
      showToast('error', 'Please select an answer first', 'يرجى اختيار إجابة أولاً');
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Calculate score
      let correct = 0;
      selectedAnswers.forEach((ans, idx) => {
        if (ans === questions[idx].correctIndex) {
          correct += 1;
        }
      });

      const pct = Math.round((correct / questions.length) * 100);
      let lvl = 'Beginner';
      let lvlAr = 'مبتدئ';

      if (pct >= 80) {
        lvl = 'Advanced';
        lvlAr = 'متقدم';
      } else if (pct >= 50) {
        lvl = 'Intermediate';
        lvlAr = 'متوسط';
      }

      const displayLevel = language === 'ar' ? lvlAr : lvl;

      setFinalScore(pct);
      setAssignedLevel(displayLevel);
      setIsCompleted(true);

      if (currentUser) {
        updateStudentLevel(currentUser.id, subject, pct, displayLevel);
      }

      // Celebrate with confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      showToast(
        'success',
        `Test Completed! Level: ${displayLevel} (${pct}%)`,
        `تم إكمال الاختبار! المستوى: ${displayLevel} (${pct}%)`
      );
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswers([]);
    setIsCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100 glow-card max-h-[90vh] flex flex-col my-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white p-4 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-2 bg-white/20 rounded-xl shrink-0">{subjectIcon}</div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-black truncate">{subjectTitle}</h3>
              <p className="text-xs text-indigo-100 hidden sm:block">
                {language === 'ar'
                  ? 'اختبار تفاعلي تقييمي لتحديد مستواك الأكاديمي'
                  : 'Interactive diagnostic test to evaluate your academic proficiency'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1">
          {!isCompleted ? (
            <div>
              {/* Question Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                  <span>
                    {language === 'ar'
                      ? `السؤال ${currentIndex + 1} من ${questions.length}`
                      : `Question ${currentIndex + 1} of ${questions.length}`}
                  </span>
                  <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-purple-600 transition-all duration-300"
                    style={{
                      width: `${((currentIndex + 1) / questions.length) * 100}%`
                    }}
                  />
                </div>
              </div>

              {/* Question Box */}
              <div className="bg-purple-50/50 rounded-2xl p-6 mb-6 border border-purple-100">
                <h4 className="text-lg md:text-xl font-bold text-slate-800 leading-snug">
                  {language === 'ar' ? currentQ.questionAr : currentQ.questionEn}
                </h4>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {questions[currentIndex][
                  language === 'ar' ? 'optionsAr' : 'optionsEn'
                ].map((opt, idx) => {
                  const isSelected = selectedAnswers[currentIndex] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`p-4 rounded-2xl border text-left rtl:text-right font-semibold text-sm transition-all flex items-center justify-between glow-btn ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-600 shadow-lg scale-[1.02]'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:bg-purple-50/30'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <CheckCircle className="w-5 h-5 text-amber-300 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Action */}
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg flex items-center gap-2 transition-all glow-btn"
                >
                  <span>
                    {currentIndex === questions.length - 1
                      ? language === 'ar'
                        ? 'إنهاء الاختبار'
                        : 'Finish Test'
                      : language === 'ar'
                      ? 'السؤال التالي'
                      : 'Next Question'}
                  </span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="text-center py-4 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-tr from-amber-400 to-purple-500 flex items-center justify-center text-white shadow-xl">
                <Award className="w-10 h-10" />
              </div>

              <h4 className="text-2xl font-black text-slate-800 mb-1">
                {language === 'ar' ? 'تهانينا! اكتمل الاختبار' : 'Congratulations! Test Complete'}
              </h4>

              <p className="text-sm text-slate-500 mb-6">
                {language === 'ar'
                  ? 'تم تقييم إجاباتك وحفظ مستواك الأكاديمي بنجاح'
                  : 'Your answers have been evaluated and your level has been updated successfully.'}
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    {language === 'ar' ? 'النتيجة' : 'Score'}
                  </span>
                  <p className="text-3xl font-black text-purple-600">{finalScore}%</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    {language === 'ar' ? 'المستوى المعتمد' : 'Assigned Level'}
                  </span>
                  <p className="text-lg font-extrabold text-amber-700">{assignedLevel}</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 flex items-center gap-2 transition-all glow-btn"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{language === 'ar' ? 'إعادة الاختبار' : 'Retake Test'}</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition-all glow-btn"
                >
                  {language === 'ar' ? 'إغلاق ومتابعة' : 'Close & Continue'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
