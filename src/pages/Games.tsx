import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import confetti from 'canvas-confetti';
import {
  Gamepad2,
  Calculator,
  BookOpen,
  Languages,
  Trophy,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  Zap
} from 'lucide-react';

export const Games: React.FC = () => {
  const { language, showToast } = useApp();
  const t = translations[language];

  const [activeGame, setActiveGame] = useState<'math' | 'arabic' | 'english'>('math');
  
  // Math Game State
  const [mathScore, setMathScore] = useState(0);
  const [mathStreak, setMathStreak] = useState(0);
  const [numA, setNumA] = useState(7);
  const [numB, setNumB] = useState(8);
  const [op, setOp] = useState<'+' | '*' | '-' | '/'>('*');
  const [mathInput, setMathInput] = useState('');

  // Arabic Game State
  const [arabicScore, setArabicScore] = useState(0);
  const [arabicIndex, setArabicIndex] = useState(0);

  // English Game State
  const [englishScore, setEnglishScore] = useState(0);
  const [englishIndex, setEnglishIndex] = useState(0);

  // Math Game Logic
  const correctMathAnswer =
    op === '+' ? numA + numB : op === '*' ? numA * numB : numA - numB;

  const handleMathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(mathInput.trim()) === correctMathAnswer) {
      setMathScore((prev) => prev + 10);
      setMathStreak((prev) => prev + 1);
      showToast('success', '+10 Points! Correct Answer!', '+10 نقاط! إجابة صحيحة!');
      
      if ((mathStreak + 1) % 3 === 0) {
        confetti({ particleCount: 50, spread: 60 });
      }

      // Next math problem
      const ops: Array<'+' | '*' | '-'> = ['+', '*', '-'];
      const newOp = ops[Math.floor(Math.random() * ops.length)];
      setOp(newOp);
      setNumA(Math.floor(Math.random() * 12) + 2);
      setNumB(Math.floor(Math.random() * 12) + 2);
      setMathInput('');
    } else {
      setMathStreak(0);
      showToast('error', 'Incorrect! Try again.', 'إجابة خاطئة! حاول مجدداً.');
      setMathInput('');
    }
  };

  const arabicGameData = [
    { word: 'كتاب', question: 'ما هو جمع الكلمة؟', options: ['كتب', 'كاتب', 'مكتبة'], correct: 0 },
    { word: 'العلم', question: 'ما هو مضاد كلمة "العلم"؟', options: ['الجهل', 'القوة', 'العمل'], correct: 0 },
    { word: 'الشمس', question: 'نوع اللام في كلمة "الشمس":', options: ['شمسية', 'قمرية', 'أصلية'], correct: 0 },
    { word: 'الحديقة', question: 'علامة التأنيث في الكلمة هي:', options: ['التاء المربوطة', 'الألف المقبورة', 'الياء'], correct: 0 }
  ];

  const englishGameData = [
    { question: 'Fill in the blank: "An apple a day keeps the doctor ______."', options: ['away', 'near', 'happy'], correct: 0 },
    { question: 'Choose the correct synonym for "Enormous":', options: ['Huge', 'Tiny', 'Quiet'], correct: 0 },
    { question: 'Select the past tense of "Swim":', options: ['Swam', 'Swimed', 'Swimming'], correct: 0 },
    { question: 'Which word is an adjective?', options: ['Beautiful', 'Quickly', 'Run'], correct: 0 }
  ];

  const handleArabicAnswer = (optIndex: number) => {
    if (optIndex === arabicGameData[arabicIndex].correct) {
      setArabicScore((prev) => prev + 15);
      showToast('success', '+15 Points! Excellent Arabic Skill!', '+15 نقطة! ممتاز جداً!');
      confetti({ particleCount: 40, spread: 50 });
      setArabicIndex((prev) => (prev + 1) % arabicGameData.length);
    } else {
      showToast('error', 'Wrong choice! Try again.', 'خيار خاطئ! حاول مجدداً.');
    }
  };

  const handleEnglishAnswer = (optIndex: number) => {
    if (optIndex === englishGameData[englishIndex].correct) {
      setEnglishScore((prev) => prev + 15);
      showToast('success', '+15 Points! Outstanding English!', '+15 Points! أحسنت!');
      confetti({ particleCount: 40, spread: 50 });
      setEnglishIndex((prev) => (prev + 1) % englishGameData.length);
    } else {
      showToast('error', 'Wrong answer, try again!', 'إجابة خاطئة! حاول مجدداً.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden glow-card text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow">
          <Gamepad2 className="w-4 h-4" />
          <span>{t.educationalGames}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black">
          {language === 'ar' ? 'ألعاب الأكاديمية التفاعلية' : 'Learn Educational Game Arena'}
        </h1>

        <p className="text-sm text-indigo-100 max-w-xl mx-auto font-medium">
          {language === 'ar'
            ? 'تحدَّ نفسك في ألعاب الرياضيات واللغتين العربية والإنجليزية واجمع النقاط والشارات!'
            : 'Boost your calculation speed, vocabulary, and grammar rules through fun interactive gameplay.'}
        </p>

        {/* Game Selector Tabs */}
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => setActiveGame('math')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all glow-btn ${
              activeGame === 'math'
                ? 'bg-amber-400 text-slate-950 shadow-lg font-black'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Math Ninja</span>
          </button>

          <button
            onClick={() => setActiveGame('arabic')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all glow-btn ${
              activeGame === 'arabic'
                ? 'bg-emerald-400 text-slate-950 shadow-lg font-black'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>تحدي العربية</span>
          </button>

          <button
            onClick={() => setActiveGame('english')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all glow-btn ${
              activeGame === 'english'
                ? 'bg-indigo-400 text-slate-950 shadow-lg font-black'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Languages className="w-4 h-4" />
            <span>English Quest</span>
          </button>
        </div>
      </div>

      {/* GAME 1: MATH SPEED NINJA */}
      {activeGame === 'math' && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-amber-200 max-w-2xl mx-auto space-y-6 glow-card text-center">
          <div className="flex items-center justify-between bg-amber-50 p-4 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              <span className="font-extrabold text-slate-800 text-sm">
                Score: <strong className="text-amber-600 text-xl">{mathScore}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1 bg-amber-200 px-3 py-1 rounded-full text-xs font-black text-amber-900">
              <Zap className="w-4 h-4 text-amber-600 fill-amber-600" />
              <span>Streak: {mathStreak}</span>
            </div>
          </div>

          <div className="py-8 bg-slate-900 text-white rounded-3xl border-2 border-amber-400 shadow-inner">
            <span className="text-xs text-amber-300 font-extrabold uppercase tracking-widest block mb-2">
              Solve Problem
            </span>
            <span className="text-4xl sm:text-5xl font-black tracking-wider text-amber-300">
              {numA} {op} {numB} = ?
            </span>
          </div>

          <form onSubmit={handleMathSubmit} className="space-y-4">
            <input
              type="number"
              value={mathInput}
              onChange={(e) => setMathInput(e.target.value)}
              placeholder="Enter answer..."
              autoFocus
              className="w-full text-center text-2xl font-black py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:border-amber-500 glow-input"
            />

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base shadow-xl transition-all glow-btn"
            >
              Submit Answer!
            </button>
          </form>
        </div>
      )}

      {/* GAME 2: ARABIC CHALLENGE */}
      {activeGame === 'arabic' && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-emerald-200 max-w-2xl mx-auto space-y-6 glow-card text-center">
          <div className="flex items-center justify-between bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-emerald-600" />
              <span className="font-extrabold text-slate-800 text-sm">
                النقاط: <strong className="text-emerald-600 text-xl">{arabicScore}</strong>
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-200 px-3 py-1 rounded-full">
              السؤال {arabicIndex + 1} من {arabicGameData.length}
            </span>
          </div>

          <div className="py-6 bg-emerald-950 text-white rounded-3xl border-2 border-emerald-400">
            <h3 className="text-2xl font-black text-amber-300 mb-1">
              "{arabicGameData[arabicIndex].word}"
            </h3>
            <p className="text-sm text-emerald-200 font-bold">
              {arabicGameData[arabicIndex].question}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {arabicGameData[arabicIndex].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleArabicAnswer(idx)}
                className="py-4 px-3 rounded-2xl bg-emerald-50 hover:bg-emerald-500 hover:text-white border border-emerald-200 font-bold text-slate-800 text-sm transition-all glow-btn"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GAME 3: ENGLISH QUEST */}
      {activeGame === 'english' && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-indigo-200 max-w-2xl mx-auto space-y-6 glow-card text-center">
          <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-2xl border border-indigo-200">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-indigo-600" />
              <span className="font-extrabold text-slate-800 text-sm">
                Score: <strong className="text-indigo-600 text-xl">{englishScore}</strong>
              </span>
            </div>
            <span className="text-xs font-bold text-indigo-800 bg-indigo-200 px-3 py-1 rounded-full">
              Question {englishIndex + 1} of {englishGameData.length}
            </span>
          </div>

          <div className="py-6 bg-indigo-950 text-white rounded-3xl border-2 border-indigo-400">
            <p className="text-lg font-bold text-indigo-100">
              {englishGameData[englishIndex].question}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {englishGameData[englishIndex].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleEnglishAnswer(idx)}
                className="py-4 px-3 rounded-2xl bg-indigo-50 hover:bg-indigo-600 hover:text-white border border-indigo-200 font-bold text-slate-800 text-sm transition-all glow-btn"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
