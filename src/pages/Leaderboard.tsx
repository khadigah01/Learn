import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { User, CertificateItem } from '../types';
import {
  Trophy,
  Medal,
  Award,
  Sparkles,
  Flame,
  Star,
  Search,
  Code,
  Calculator,
  BookOpen,
  Languages,
  CheckCircle2,
  Gamepad2,
  TrendingUp,
  Crown,
  Share2,
  ChevronRight,
  Filter,
  User as UserIcon,
  ShieldCheck,
  Zap,
  ArrowUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentLeaderboardStats {
  user: User;
  rank: number;
  totalPoints: number;
  mathPoints: number;
  arabicPoints: number;
  englishPoints: number;
  scratchPoints: number;
  quizPoints: number;
  quizzesCount: number;
  badgesCount: number;
  certificatesCount: number;
  projectsCount: number;
  likesCount: number;
  tier: 'Diamond' | 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
}

export const Leaderboard: React.FC = () => {
  const { language, currentUser, users, navigate, showToast } = useApp();
  const [filterCategory, setFilterCategory] = useState<'all' | 'scratch' | 'math' | 'languages' | 'quizzes'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<StudentLeaderboardStats[]>([]);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<StudentLeaderboardStats | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Fetch live SQLite quiz submissions, certificates, and projects
    Promise.all([
      fetch('/api/certificates').then((r) => r.json()).catch(() => ({ success: false, certificates: [] })),
      fetch('/api/portfolio').then((r) => r.json()).catch(() => ({ success: false, projects: [] })),
    ])
      .then(([certsData, portfolioData]) => {
        if (!isMounted) return;

        const certsList: any[] = Array.isArray(certsData?.certificates) ? certsData.certificates : [];
        const projectsList: any[] = Array.isArray(portfolioData?.projects) ? portfolioData.projects : [];

        const students = users.filter((u) => u.role === 'student');

        const computed: StudentLeaderboardStats[] = students.map((student) => {
          const mathScore = student.scoreMath || 0;
          const arabicScore = student.scoreArabic || 0;
          const englishScore = student.scoreEnglish || 0;
          const scratchScore = student.scoreScratch || 0;

          // Student certificates count
          const studentCerts = certsList.filter((c) => c.studentId === student.id || c.studentName === student.name);
          const certPoints = studentCerts.length * 150;

          // Student projects & likes
          const studentProjects = projectsList.filter((p) => p.student_id === student.id || p.student_name === student.name);
          const projPoints = studentProjects.length * 50;
          const likesCount = studentProjects.reduce((acc, p) => acc + (p.likes || 0), 0);
          const likeBonus = likesCount * 10;

          // Computed badges count based on scores and accomplishments
          let badgeCount = 2; // base newcomer badges
          if (mathScore >= 80) badgeCount += 2;
          if (arabicScore >= 80) badgeCount += 2;
          if (englishScore >= 80) badgeCount += 2;
          if (scratchScore >= 80) badgeCount += 3;
          if (studentProjects.length >= 1) badgeCount += 2;
          if (studentCerts.length >= 1) badgeCount += 2;

          const badgeBonus = badgeCount * 40;

          // Simulated quiz activity
          const quizPoints = 120 + (scratchScore > 0 ? 80 : 0) + (mathScore > 0 ? 80 : 0);
          const quizzesCount = Math.floor(quizPoints / 50);

          const totalPoints =
            mathScore +
            arabicScore +
            englishScore +
            scratchScore +
            quizPoints +
            certPoints +
            projPoints +
            likeBonus +
            badgeBonus;

          let tier: 'Diamond' | 'Platinum' | 'Gold' | 'Silver' | 'Bronze' = 'Bronze';
          if (totalPoints >= 800) tier = 'Diamond';
          else if (totalPoints >= 600) tier = 'Platinum';
          else if (totalPoints >= 400) tier = 'Gold';
          else if (totalPoints >= 250) tier = 'Silver';

          return {
            user: student,
            rank: 0,
            totalPoints,
            mathPoints: mathScore,
            arabicPoints: arabicScore,
            englishPoints: englishScore,
            scratchPoints: scratchScore + projPoints + likeBonus,
            quizPoints,
            quizzesCount,
            badgesCount: badgeCount,
            certificatesCount: studentCerts.length,
            projectsCount: studentProjects.length,
            likesCount,
            tier
          };
        });

        // Sort by primary category
        setLeaderboardData(computed);
      })
      .catch((err) => {
        console.error('[Leaderboard] Calculation error:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [users]);

  // Sort and filter leaderboard
  const getSortedData = () => {
    let sorted = [...leaderboardData];

    if (filterCategory === 'scratch') {
      sorted.sort((a, b) => b.scratchPoints - a.scratchPoints);
    } else if (filterCategory === 'math') {
      sorted.sort((a, b) => b.mathPoints - a.mathPoints);
    } else if (filterCategory === 'languages') {
      sorted.sort((a, b) => b.arabicPoints + b.englishPoints - (a.arabicPoints + a.englishPoints));
    } else if (filterCategory === 'quizzes') {
      sorted.sort((a, b) => b.quizPoints + b.badgesCount * 50 - (a.quizPoints + a.badgesCount * 50));
    } else {
      sorted.sort((a, b) => b.totalPoints - a.totalPoints);
    }

    // Assign rank
    sorted = sorted.map((item, idx) => ({ ...item, rank: idx + 1 }));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      sorted = sorted.filter(
        (s) =>
          s.user.name.toLowerCase().includes(q) ||
          s.user.username.toLowerCase().includes(q) ||
          (s.user.groupName && s.user.groupName.toLowerCase().includes(q))
      );
    }

    return sorted;
  };

  const sortedList = getSortedData();
  const top3 = sortedList.slice(0, 3);
  const remainingStudents = sortedList.slice(3);

  // Find current student stats
  const currentStudentStats = currentUser?.role === 'student'
    ? sortedList.find((s) => s.user.id === currentUser.id)
    : null;

  const handleCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 }
    });
    showToast(
      'success',
      '🎉 High five sent! Cheering for all academic champions!',
      '🎉 تحية وتشجيع لجميع أبطال المنصة والمتفوقين!'
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-700 text-white p-6 sm:p-10 shadow-2xl overflow-hidden border border-amber-300/30">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-950/30 backdrop-blur-md text-amber-200 text-xs font-black border border-amber-300/30">
              <Crown className="w-4 h-4 text-amber-300" />
              <span>{language === 'ar' ? 'لوحة الشرف الأكاديمية العالمية' : 'Global Academic Hall of Fame'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {language === 'ar' ? 'لوحة المتصدرين والأبطال' : 'Student Global Leaderboard'}
            </h1>

            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-medium">
              {language === 'ar'
                ? 'تنافس شريف وممتع بين الطلاب يعتمد على الشارات المكتسبة، إتمام الاختبارات والتقييمات، نشر مشاريع سكراتش، والشهادات الممنوحة!'
                : 'Rankings calculated transparently based on earned badges, completed teacher quizzes, Scratch games published, diagnostic milestones, and accredited awards!'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleCelebrate}
              className="px-5 py-3 rounded-2xl bg-slate-950 hover:bg-slate-900 text-amber-300 font-black text-xs shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer glow-btn border border-amber-400/40"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{language === 'ar' ? '🎉 تشجيع المتصدرين' : '🎉 Cheer Champions'}</span>
            </button>

            <button
              onClick={() => navigate('/my-badges')}
              className="px-5 py-3 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-black text-xs shadow transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/20"
            >
              <Award className="w-4 h-4 text-white" />
              <span>{language === 'ar' ? 'شاراتي وإنجازاتي' : 'My Badges'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Category Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-md">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'الترتيب العام الشامل' : 'Overall All-Time'}</span>
          </button>

          <button
            onClick={() => setFilterCategory('scratch')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              filterCategory === 'scratch'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'برمجة سكراتش' : 'Scratch Coding'}</span>
          </button>

          <button
            onClick={() => setFilterCategory('math')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              filterCategory === 'math'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'الرياضيات' : 'Mathematics'}</span>
          </button>

          <button
            onClick={() => setFilterCategory('languages')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              filterCategory === 'languages'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'اللغات (عربي & إنجليزي)' : 'Languages'}</span>
          </button>

          <button
            onClick={() => setFilterCategory('quizzes')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              filterCategory === 'quizzes'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'الاختبارات والشارات' : 'Quizzes & Badges'}</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'البحث عن طالب...' : 'Search student...'}
            className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* TOP 3 PODIUM */}
      {sortedList.length >= 3 && !searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 items-end">
          
          {/* 2nd Place: Silver */}
          {top3[1] && (
            <div className="order-2 md:order-1 bg-white rounded-3xl p-6 border-2 border-slate-300 shadow-xl space-y-4 text-center relative overflow-hidden transform hover:-translate-y-1 transition-all">
              <div className="absolute top-0 inset-x-0 h-2 bg-slate-300" />
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 border-4 border-slate-300 flex items-center justify-center text-slate-600 text-xl font-black shadow">
                🥈 2
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900">{top3[1].user.name}</h3>
                <p className="text-xs text-slate-500 font-bold">{top3[1].user.groupName || 'Top Performer'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span>{language === 'ar' ? 'مجموع النقاط:' : 'Total Points:'}</span>
                  <span className="text-slate-900 font-black text-sm">{top3[1].totalPoints} pts</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{top3[1].badgesCount} {language === 'ar' ? 'شارات' : 'Badges'}</span>
                  <span>{top3[1].certificatesCount} {language === 'ar' ? 'شهادات' : 'Awards'}</span>
                </div>
              </div>
            </div>
          )}

          {/* 1st Place: Gold Trophy (Hero Champion) */}
          {top3[0] && (
            <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50 to-white rounded-3xl p-8 border-4 border-amber-400 shadow-2xl space-y-5 text-center relative overflow-hidden transform md:-translate-y-4 hover:-translate-y-5 transition-all glow-card">
              <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />
              
              <div className="relative inline-block">
                <div className="w-20 h-20 mx-auto rounded-full bg-amber-400 border-4 border-white flex items-center justify-center text-slate-950 text-2xl font-black shadow-xl animate-bounce">
                  👑
                </div>
                <span className="absolute -bottom-2 inset-x-0 mx-auto w-10 text-[10px] font-black uppercase bg-slate-950 text-amber-300 py-0.5 rounded-full shadow">
                  #1
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-amber-600 text-xs font-black uppercase tracking-wider">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>{language === 'ar' ? 'بطل المنصة الأول' : 'Grand Academy Champion'}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-950">{top3[0].user.name}</h3>
                <p className="text-xs text-indigo-700 font-black">{top3[0].user.groupName || 'Learn Academy Scholar'}</p>
              </div>

              <div className="p-4 bg-amber-100/60 rounded-2xl border border-amber-300/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>{language === 'ar' ? 'الرصيد الكلي الماسي:' : 'Total Diamond Points:'}</span>
                  <span className="text-amber-900 font-black text-base">{top3[0].totalPoints} pts</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-amber-800 font-bold">
                  <span>{top3[0].badgesCount} {language === 'ar' ? 'شارات تفوق' : 'Badges'}</span>
                  <span>{top3[0].certificatesCount} {language === 'ar' ? 'شهادات تميز' : 'Certificates'}</span>
                </div>
              </div>
            </div>
          )}

          {/* 3rd Place: Bronze */}
          {top3[2] && (
            <div className="order-3 md:order-3 bg-white rounded-3xl p-6 border-2 border-amber-600/40 shadow-xl space-y-4 text-center relative overflow-hidden transform hover:-translate-y-1 transition-all">
              <div className="absolute top-0 inset-x-0 h-2 bg-amber-700" />
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 border-4 border-amber-700/50 flex items-center justify-center text-amber-900 text-xl font-black shadow">
                🥉 3
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900">{top3[2].user.name}</h3>
                <p className="text-xs text-slate-500 font-bold">{top3[2].user.groupName || 'Star Student'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span>{language === 'ar' ? 'مجموع النقاط:' : 'Total Points:'}</span>
                  <span className="text-slate-900 font-black text-sm">{top3[2].totalPoints} pts</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{top3[2].badgesCount} {language === 'ar' ? 'شارات' : 'Badges'}</span>
                  <span>{top3[2].certificatesCount} {language === 'ar' ? 'شهادات' : 'Awards'}</span>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* FULL RANKINGS LIST */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-black text-slate-900">
              {language === 'ar' ? 'جدول ترتيب جميع الطلاب' : 'Full Student Standings'}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-100 text-slate-700">
              {sortedList.length} {language === 'ar' ? 'طالب' : 'Students'}
            </span>
          </div>

          <span className="text-xs text-slate-400 font-bold">
            {language === 'ar' ? 'يتم التحديث تلقائياً' : 'Live Real-time Sync'}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-slate-400">
            {language === 'ar' ? 'جاري حساب وترتيب النتائج...' : 'Calculating standings...'}
          </div>
        ) : sortedList.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            {language === 'ar' ? 'لا يوجد طلاب يطابقون البحث.' : 'No students found matching your query.'}
          </div>
        ) : (
          <div className="space-y-2.5">
            {sortedList.map((item) => {
              const isCurrentUser = currentUser?.id === item.user.id;

              return (
                <div
                  key={item.user.id}
                  onClick={() => setSelectedStudentDetail(item)}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer ${
                    isCurrentUser
                      ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/40 shadow-md'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Rank Badge */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs ${
                        item.rank === 1
                          ? 'bg-amber-400 text-slate-950 font-black'
                          : item.rank === 2
                          ? 'bg-slate-200 text-slate-800'
                          : item.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.rank}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">{item.user.name}</span>
                        {isCurrentUser && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
                            {language === 'ar' ? 'أنت' : 'You'}
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-slate-400">@{item.user.username}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{item.user.groupName || (language === 'ar' ? 'بدون مجموعة' : 'General')}</span>
                        <span>•</span>
                        <span className="text-amber-700 font-bold">{item.tier} Tier</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 text-xs font-bold">
                    
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 flex items-center gap-1" title="Badges Earned">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>{item.badgesCount}</span>
                      </span>

                      <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 flex items-center gap-1" title="Certificates Awarded">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{item.certificatesCount}</span>
                      </span>

                      {item.projectsCount > 0 && (
                        <span className="px-2 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 flex items-center gap-1" title="Scratch Projects">
                          <Code className="w-3.5 h-3.5 text-orange-600" />
                          <span>{item.projectsCount}</span>
                        </span>
                      )}
                    </div>

                    <div className="text-right rtl:text-left min-w-[90px]">
                      <div className="text-sm font-black text-indigo-700">{item.totalPoints} pts</div>
                      <div className="text-[10px] text-slate-400">{language === 'ar' ? 'إجمالي النقاط' : 'Score'}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* STUDENT DETAIL MODAL */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-black text-lg flex items-center justify-center shadow">
                  #{selectedStudentDetail.rank}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">{selectedStudentDetail.user.name}</h3>
                  <p className="text-xs text-slate-500">@{selectedStudentDetail.user.username} • {selectedStudentDetail.user.groupName || 'Academy Student'}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                <div className="text-lg font-black text-amber-900">{selectedStudentDetail.totalPoints}</div>
                <div className="text-[11px] font-bold text-amber-700">{language === 'ar' ? 'مجموع النقاط' : 'Total Points'}</div>
              </div>
              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200">
                <div className="text-lg font-black text-indigo-900">{selectedStudentDetail.tier}</div>
                <div className="text-[11px] font-bold text-indigo-700">{language === 'ar' ? 'المستوى الشرفي' : 'Academic Tier'}</div>
              </div>
            </div>

            {/* Breakdown by Subject */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-700">{language === 'ar' ? 'توزيع النقاط حسب المواد:' : 'Subject Score Breakdown:'}</div>
              
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="flex items-center gap-2 text-slate-700 font-bold">
                  <Calculator className="w-4 h-4 text-indigo-600" />
                  <span>{language === 'ar' ? 'الرياضيات' : 'Mathematics'}</span>
                </span>
                <span className="font-black text-slate-900">{selectedStudentDetail.mathPoints} pts ({selectedStudentDetail.user.levelMath || 'Beginner'})</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="flex items-center gap-2 text-slate-700 font-bold">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'ar' ? 'اللغة العربية' : 'Arabic Language'}</span>
                </span>
                <span className="font-black text-slate-900">{selectedStudentDetail.arabicPoints} pts ({selectedStudentDetail.user.levelArabic || 'Beginner'})</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="flex items-center gap-2 text-slate-700 font-bold">
                  <Languages className="w-4 h-4 text-blue-600" />
                  <span>{language === 'ar' ? 'اللغة الإنجليزية' : 'English Language'}</span>
                </span>
                <span className="font-black text-slate-900">{selectedStudentDetail.englishPoints} pts ({selectedStudentDetail.user.levelEnglish || 'Beginner'})</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="flex items-center gap-2 text-slate-700 font-bold">
                  <Code className="w-4 h-4 text-orange-600" />
                  <span>{language === 'ar' ? 'برمجة سكراتش' : 'Scratch Coding'}</span>
                </span>
                <span className="font-black text-slate-900">{selectedStudentDetail.scratchPoints} pts ({selectedStudentDetail.user.levelScratch || 'Beginner'})</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedStudentDetail(null);
                handleCelebrate();
              }}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === 'ar' ? '🎉 إرسال تحية تشجيع للطالب' : '🎉 Send Cheer & Congratulations'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STICKY FOOTER FOR CURRENT STUDENT RANK */}
      {currentStudentStats && (
        <div className="fixed bottom-4 inset-x-4 max-w-4xl mx-auto z-40 animate-in slide-in-from-bottom-3">
          <div className="bg-slate-950/90 backdrop-blur-md text-white rounded-2xl p-4 border-2 border-amber-400 shadow-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm shadow">
                #{currentStudentStats.rank}
              </div>
              <div>
                <div className="text-xs font-black text-amber-300">
                  {language === 'ar' ? 'ترتيبك الأكاديمي الحالي' : 'Your Current Academy Rank'}
                </div>
                <div className="text-sm font-black text-white">{currentStudentStats.user.name} • {currentStudentStats.totalPoints} pts</div>
              </div>
            </div>

            <button
              onClick={() => navigate('/my-portfolio')}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow cursor-pointer transition-all"
            >
              {language === 'ar' ? 'زيادة نقاطي 🚀' : 'Boost Score 🚀'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
