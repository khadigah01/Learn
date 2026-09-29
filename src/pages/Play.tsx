import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Gamepad2,
  Play as PlayIcon,
  Sparkles,
  Maximize2,
  ExternalLink,
  Code,
  Heart,
  Search,
  Filter,
  Flame,
  Zap,
  RotateCcw,
  Trophy,
  Share2,
  FolderPlus,
  HelpCircle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProjectItem {
  id: string;
  student_id: string;
  student_name: string;
  title: string;
  description: string;
  project_type: string;
  scratch_url: string;
  scratch_project_id: string;
  instructions: string;
  category: string;
  likes: number;
  created_at: number;
}

const FEATURED_GAMES = [
  {
    id: 'feat_space_blaster',
    title: 'Space Blaster 3000',
    titleAr: 'صائد الكويكبات الفضائي',
    author: 'Tariq Al-Mansoor',
    scratchId: '10128407',
    category: 'Action',
    likes: 42,
    description: 'Defend planet Earth against waves of rogue meteorites and alien bosses.',
    descriptionAr: 'دافع عن كوكب الأرض ضد الكويكبات الفضائية وزعماء المجرة.'
  },
  {
    id: 'feat_geometry_dash',
    title: 'Geometry Dash: Neon Rush',
    titleAr: 'اندفاع النيون والقفز السريع',
    author: 'Maya Nour',
    scratchId: '60917032',
    category: 'Rhythm',
    likes: 67,
    description: 'Jump, fly, and flip through dangerous passages and spiky obstacles.',
    descriptionAr: 'اقفز وتفادى الحواجز والمثلثات المسننة بتوقيت دقيق.'
  },
  {
    id: 'feat_pacman',
    title: 'Pac-Cat Maze Runner',
    titleAr: 'متاهة قط سكراتش',
    author: 'Learn Academy CS Club',
    scratchId: '11656832',
    category: 'Puzzle',
    likes: 35,
    description: 'Classic maze game: collect all yellow dots while evading enemy ghosts.',
    descriptionAr: 'لعبة المتاهة الكلاسيكية: اجمع كل النقاط وتفادى الأشباح.'
  },
  {
    id: 'feat_flappy_scratch',
    title: 'Flappy Cat Sky Odyssey',
    titleAr: 'مغامرة القط الطائر',
    author: 'Karim Tarek',
    scratchId: '104',
    category: 'Arcade',
    likes: 29,
    description: 'Tap spacebar to flap wings, avoid green pipes, and collect high scores.',
    descriptionAr: 'اضغط المسافة للطيران وتفادي الأنابيب لجمع أعلى النقاط.'
  }
];

export const Play: React.FC = () => {
  const { language, navigate, showToast } = useApp();
  const [activeGameId, setActiveGameId] = useState<string>('10128407');
  const [activeGameTitle, setActiveGameTitle] = useState<string>('Space Blaster 3000');
  const [activeGameAuthor, setActiveGameAuthor] = useState<string>('Tariq Al-Mansoor');
  const [communityProjects, setCommunityProjects] = useState<ProjectItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [customScratchInput, setCustomScratchInput] = useState<string>('');
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  // Fetch portfolio projects from SQLite
  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.projects)) {
          setCommunityProjects(data.projects);
        }
      })
      .catch((err) => {
        console.warn('[Play] Could not fetch projects from SQLite:', err);
      });
  }, []);

  const handlePlayCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customScratchInput.trim()) return;

    const match = customScratchInput.match(/projects\/(\d+)/) || customScratchInput.match(/^(\d+)$/);
    if (match && match[1]) {
      setActiveGameId(match[1]);
      setActiveGameTitle(`Scratch Project #${match[1]}`);
      setActiveGameAuthor('Custom Project');
      showToast('success', `Now Playing Project #${match[1]}!`, `يتم الآن تشغيل المشروع #${match[1]}!`);
    } else {
      showToast('error', 'Please enter a valid Scratch Project URL or ID', 'يرجى إدخال رابط أو رقم مشروع سكراتش صحيح');
    }
  };

  const handleLike = async (projectId: string) => {
    if (likedMap[projectId]) return;
    setLikedMap((prev) => ({ ...prev, [projectId]: true }));

    try {
      await fetch(`/api/portfolio/${projectId}/like`, { method: 'POST' });
      setCommunityProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, likes: p.likes + 1 } : p))
      );
      confetti({ particleCount: 30, spread: 50 });
      showToast('success', 'Thanks for voting!', 'شكراً لتصويتك وتشجيعك!');
    } catch {
      // optimistic
    }
  };

  const filteredCommunity = communityProjects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.student_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white p-6 sm:p-10 shadow-2xl border border-white/10">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider">
              <Gamepad2 className="w-4 h-4 text-emerald-300" />
              <span>{language === 'ar' ? 'صالة ألعاب سكراتش الأكاديمية' : 'Scratch & Arcade Game Zone'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {language === 'ar' ? 'العب، جرب وشارك ألعابك' : 'Play, Experience & Share Games'}
            </h1>
            <p className="text-sm sm:text-base text-emerald-50 font-medium leading-relaxed">
              {language === 'ar'
                ? 'استمتع بألعاب سكراتش المصممة بواسطة طلاب ومعلمي الأكاديمية. العب بسرعة 60 إطار في الثانية عبر محرك TurboWarp السريع بدون أي إعلانات!'
                : 'Play awesome student-crafted Scratch games and educational simulations. Running on TurboWarp 60 FPS engine with zero ads and zero lag!'}
            </p>
          </div>

          <div className="flex flex-wrap lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => navigate('/coding-studio')}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-900 font-black text-xs sm:text-sm shadow-xl hover:scale-105 transition-all cursor-pointer"
            >
              <Code className="w-4 h-4 text-orange-600" />
              <span>{language === 'ar' ? 'اصنع لعبتك في الاستوديو' : 'Create Game in Studio'}</span>
            </button>
            <button
              onClick={() => navigate('/my-portfolio')}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-950/80 hover:bg-slate-950 text-white font-bold text-xs sm:text-sm shadow-xl hover:scale-105 transition-all border border-white/15 cursor-pointer"
            >
              <FolderPlus className="w-4 h-4 text-amber-400" />
              <span>{language === 'ar' ? 'أضف لعبتك إلى /my-portfolio' : 'Add to /my-portfolio'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Game Screen & Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        
        {/* Game Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">{activeGameTitle}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                  Live 60 FPS
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {language === 'ar' ? `المؤلف / المبرمج: ${activeGameAuthor}` : `Created by: ${activeGameAuthor}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://turbowarp.org/editor?project_url=https://scratch.mit.edu/projects/${activeGameId}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'رؤية الكود البرمجي' : 'See Code'}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'ملء الشاشة' : 'Fullscreen'}</span>
            </button>
          </div>
        </div>

        {/* Custom Project Quick Search / Play input */}
        <form onSubmit={handlePlayCustom} className="flex gap-2">
          <input
            type="text"
            value={customScratchInput}
            onChange={(e) => setCustomScratchInput(e.target.value)}
            placeholder={
              language === 'ar'
                ? 'العب أي مشروع سكراتش بإدخال الرابط أو الرقم (مثال: 10128407 أو https://scratch.mit.edu/projects/...)'
                : 'Play any Scratch game by pasting its Project ID or URL here...'
            }
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/50"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <PlayIcon className="w-4 h-4 fill-white" />
            <span>{language === 'ar' ? 'تشغيل' : 'Launch'}</span>
          </button>
        </form>

        {/* Embedded Game Canvas */}
        <div className={`relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col items-center justify-center ${
          isFullscreen ? 'fixed inset-4 z-50 bg-black' : 'h-[500px] sm:h-[600px] w-full'
        }`}>
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 cursor-pointer shadow-lg"
            >
              ✕ {language === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          )}

          <iframe
            src={`https://turbowarp.org/${activeGameId}/embed?fps=60&turbo=false`}
            allow="fullscreen; autoplay; gamepad"
            className="w-full h-full border-0"
            title={activeGameTitle}
          />

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-white text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold text-slate-200">{activeGameTitle}</span>
              <span className="text-slate-500 text-[11px] font-mono">#{activeGameId}</span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://scratch.mit.edu"
                target="_blank"
                rel="noreferrer"
                className="text-orange-400 hover:text-orange-300 text-xs font-bold flex items-center gap-1"
              >
                <span>Scratch MIT</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://turbowarp.org"
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:text-amber-300 text-xs font-bold flex items-center gap-1"
              >
                <span>TurboWarp</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Academy Games Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-300" />
            <span>{language === 'ar' ? 'ألعاب الأكاديمية المميزة' : 'Featured Academy Games'}</span>
          </h3>
          <span className="text-xs text-amber-100 font-bold">
            {language === 'ar' ? 'اختر للعب فوراً' : 'Click to Play Instantly'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURED_GAMES.map((game) => (
            <div
              key={game.id}
              onClick={() => {
                setActiveGameId(game.scratchId);
                setActiveGameTitle(language === 'ar' ? game.titleAr : game.title);
                setActiveGameAuthor(game.author);
                window.scrollTo({ top: 300, behavior: 'smooth' });
                showToast('info', `Now Playing: ${game.title}`, `جاري تشغيل: ${game.titleAr}`);
              }}
              className={`bg-white rounded-2xl p-5 border shadow-md transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between space-y-3 ${
                activeGameId === game.scratchId ? 'ring-2 ring-emerald-500 border-emerald-300' : 'border-slate-200'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700">
                    {game.category}
                  </span>
                  <div className="flex items-center gap-1 text-rose-500 text-xs font-bold">
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    <span>{game.likes}</span>
                  </div>
                </div>

                <h4 className="text-sm font-black text-slate-900">
                  {language === 'ar' ? game.titleAr : game.title}
                </h4>

                <p className="text-xs text-slate-500 line-clamp-2">
                  {language === 'ar' ? game.descriptionAr : game.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium truncate">{game.author}</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <span>{language === 'ar' ? 'العب' : 'Play'}</span>
                  <PlayIcon className="w-3 h-3 fill-emerald-600" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Projects from SQLite Database */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                {language === 'ar' ? 'معرض مشاريع الطلاب (قاعدة بيانات SQLite)' : 'Student Community Showcase (SQLite)'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {communityProjects.length} Projects
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {language === 'ar'
                ? 'مشاريع سكراتش وملفات .sb3 التي رفعها الطلاب عبر صفحات ملفاتهم الأكاديمية'
                : 'Projects uploaded and shared by students through /my-portfolio and persisted in SQLite'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/my-portfolio')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow transition-all cursor-pointer flex items-center gap-1.5"
            >
              <FolderPlus className="w-4 h-4" />
              <span>{language === 'ar' ? 'إضافة مشروعي الآن' : 'Publish My Project'}</span>
            </button>
          </div>
        </div>

        {filteredCommunity.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
            <Gamepad2 className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-700">
              {language === 'ar' ? 'لا توجد مشاريع مضافة حتى الآن' : 'No student projects added yet'}
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {language === 'ar'
                ? 'كن أول من ينشر مشروع سكراتش أو يرفع ملف .sb3 من صفحة ملفك الأكاديمي!'
                : 'Be the first student to publish a Scratch link or upload an .sb3 file in your academic portfolio!'}
            </p>
            <button
              onClick={() => navigate('/my-portfolio')}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              {language === 'ar' ? 'الذهاب إلى الملف الأكاديمي' : 'Go to Portfolio'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCommunity.map((p) => {
              const projectId = p.scratch_project_id || '10128407';
              return (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 hover:shadow-lg transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-50 text-purple-700">
                        {p.category || 'Scratch'}
                      </span>
                      <button
                        onClick={() => handleLike(p.id)}
                        className={`flex items-center gap-1 text-xs font-bold cursor-pointer transition-all ${
                          likedMap[p.id] ? 'text-rose-600 scale-105' : 'text-slate-400 hover:text-rose-500'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${likedMap[p.id] ? 'fill-rose-600' : ''}`} />
                        <span>{p.likes}</span>
                      </button>
                    </div>

                    <h4 className="text-sm font-black text-slate-900">{p.title}</h4>
                    {p.description && (
                      <p className="text-xs text-slate-600 line-clamp-2">{p.description}</p>
                    )}
                    <p className="text-[11px] text-slate-400">
                      {language === 'ar' ? `المطور: ${p.student_name}` : `Dev: ${p.student_name}`}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setActiveGameId(projectId);
                        setActiveGameTitle(p.title);
                        setActiveGameAuthor(p.student_name);
                        window.scrollTo({ top: 250, behavior: 'smooth' });
                        showToast('success', `Loading ${p.title}!`, `جاري تشغيل ${p.title}!`);
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow"
                    >
                      <PlayIcon className="w-3.5 h-3.5 fill-white" />
                      <span>{language === 'ar' ? 'تشغيل اللعبة' : 'Play Game'}</span>
                    </button>

                    <a
                      href={`https://turbowarp.org/editor?project_url=https://scratch.mit.edu/projects/${projectId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all cursor-pointer"
                      title="Inspect code in TurboWarp"
                    >
                      <Code className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
