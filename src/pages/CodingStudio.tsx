import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Code,
  Sparkles,
  ExternalLink,
  Play,
  FolderPlus,
  Upload,
  Layers,
  Zap,
  Gamepad2,
  BookOpen,
  ArrowRight,
  Maximize2,
  RefreshCw,
  Terminal,
  HelpCircle,
  CheckCircle2,
  Flame,
  Globe2,
  Wand2
} from 'lucide-react';

interface ProjectTemplate {
  id: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  scratchId: string;
  category: 'game' | 'animation' | 'music' | 'story';
  difficultyEn: 'Beginner' | 'Intermediate' | 'Advanced';
  difficultyAr: 'مبتدئ' | 'متوسط' | 'متقدم';
}

const TEMPLATES: ProjectTemplate[] = [
  {
    id: 'tpl_space',
    titleEn: 'Space Asteroid Shooter',
    titleAr: 'مغامرة الفضاء وصائد الكويكبات',
    descEn: 'Classic arcade shooter with score tracking, spaceship controls, and laser firing.',
    descAr: 'لعبة أركيد فضائية كلاسيكية مع إطلاق ليزر وحساب النقاط.',
    scratchId: '10128407',
    category: 'game',
    difficultyEn: 'Beginner',
    difficultyAr: 'مبتدئ'
  },
  {
    id: 'tpl_platformer',
    titleEn: 'Geometry Dash & Gravity Run',
    titleAr: 'قفز المنصات وتحدي الجاذبية',
    descEn: 'Platformer physics engine with jump physics, speed variables, and obstacles.',
    descAr: 'محرك ألعاب منصات مع محاكاة الجاذبية وسرعة القفز والحواجز.',
    scratchId: '60917032',
    category: 'game',
    difficultyEn: 'Intermediate',
    difficultyAr: 'متوسط'
  },
  {
    id: 'tpl_piano',
    titleEn: 'Virtual Piano & Beat Synthesizer',
    titleAr: 'بيانو تفاعلي ومؤثرات صوتية',
    descEn: 'Musical instrument using Scratch sound blocks and keyboard event listeners.',
    descAr: 'آلة موسيقية تفاعلية تعزف النغمات والإيقاعات باستخدام لوحة المفاتيح.',
    scratchId: '104',
    category: 'music',
    difficultyEn: 'Beginner',
    difficultyAr: 'مبتدئ'
  },
  {
    id: 'tpl_maze',
    titleEn: 'Maze Runner & Key Collector',
    titleAr: 'متاهة الألغاز وجمع المفاتيح',
    descEn: 'Collision detection, color sensing, and multi-level maze navigation.',
    descAr: 'استشعار ملامسة الجدران، وتخطي المراحل وجمع الكنوز.',
    scratchId: '11656832',
    category: 'game',
    difficultyEn: 'Intermediate',
    difficultyAr: 'متوسط'
  }
];

export const CodingStudio: React.FC = () => {
  const { language, navigate, showToast } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('10128407');
  const [customScratchInput, setCustomScratchInput] = useState<string>('');
  const [activeEmbedTab, setActiveEmbedTab] = useState<'turbowarp' | 'scratch'>('turbowarp');
  const [isFullscreenEmbed, setIsFullscreenEmbed] = useState<boolean>(false);
  const [uploadedSb3Name, setUploadedSb3Name] = useState<string | null>(null);

  const handleLoadCustomProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customScratchInput.trim()) return;

    // Extract ID from URL or numeric string
    const match = customScratchInput.match(/projects\/(\d+)/) || customScratchInput.match(/^(\d+)$/);
    if (match && match[1]) {
      setSelectedProjectId(match[1]);
      showToast('success', `Loaded Scratch Project #${match[1]}!`, `تم تحميل مشروع سكراتش #${match[1]}!`);
    } else {
      showToast('error', 'Please enter a valid Scratch URL or Project ID.', 'يرجى إدخال رابط سكراتش صحيح أو رقم المشروع.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.sb3')) {
        showToast('error', 'Only .sb3 files are supported for Scratch 3.0', 'فقط ملفات .sb3 مدعومة لمشاريع سكراتش 3');
        return;
      }
      setUploadedSb3Name(file.name);
      showToast('success', `File "${file.name}" ready! Go to /my-portfolio to save it permanently.`, `الملف "${file.name}" جاهز! يمكنك حفظه في ملفك عبر /my-portfolio`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-indigo-600 text-white p-6 sm:p-10 shadow-2xl border border-white/10">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>{language === 'ar' ? 'استوديو البرمجة التفاعلي' : 'Interactive Coding Studio'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {language === 'ar' ? 'استوديو سكراتش و تيربو وورب' : 'Scratch & TurboWarp Studio'}
            </h1>
            <p className="text-sm sm:text-base text-amber-50 font-medium leading-relaxed">
              {language === 'ar'
                ? 'أنشئ ألعابك، واختبر أكوادك، وبرمج شخصياتك باستخدام محرر سكراتش الرسمي ومحرك تيربو وورب فائق السرعة (60 إطار في الثانية). احفظ أعمالك مباشرة في ملفك الأكاديمي!'
                : 'Build games, animations, and interactive stories with official Scratch MIT and ultra-fast TurboWarp 60 FPS compiler. Upload .sb3 files and showcase them in your portfolio!'}
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap lg:flex-col gap-3 shrink-0">
            <a
              href="https://turbowarp.org/editor"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-slate-950/80 hover:bg-slate-950 text-white font-black text-xs sm:text-sm shadow-xl hover:scale-105 transition-all border border-white/15"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{language === 'ar' ? 'فتح محرر TurboWarp' : 'Open TurboWarp Editor'}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <a
              href="https://scratch.mit.edu/projects/editor/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-white text-slate-900 font-black text-xs sm:text-sm shadow-xl hover:scale-105 transition-all"
            >
              <Code className="w-4 h-4 text-orange-600" />
              <span>{language === 'ar' ? 'موقع Scratch MIT الرسمي' : 'Scratch MIT Official'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <div className="flex gap-2">
              <button
                onClick={() => navigate('/my-portfolio')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-700/80 hover:bg-indigo-700 text-white font-bold text-xs shadow transition-all cursor-pointer"
              >
                <FolderPlus className="w-4 h-4 text-indigo-200" />
                <span>{language === 'ar' ? 'ملفي الأكاديمي' : 'My Portfolio'}</span>
              </button>
              <button
                onClick={() => navigate('/play')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-700/80 hover:bg-emerald-700 text-white font-bold text-xs shadow transition-all cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4 text-emerald-200" />
                <span>{language === 'ar' ? 'صالة الألعاب' : 'Play Arcade'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Interactive Player & Switcher */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {language === 'ar' ? 'مشغّل ومحرر الأكواد المباشر' : 'Live Interactive Runner & SandBox'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                  TurboWarp 60 FPS
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {language === 'ar'
                  ? 'يعمل مباشرة عبر محاكي تيربو وورب السريع، متوافق مع كافة مشاريع سكراتش 3'
                  : 'Embedded high-performance runner with 60 FPS, high-res canvas, and zero latency'}
              </p>
            </div>
          </div>

          {/* Engine Selector */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveEmbedTab('turbowarp')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeEmbedTab === 'turbowarp'
                  ? 'bg-white text-indigo-700 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>TurboWarp (Fast)</span>
            </button>
            <button
              onClick={() => setActiveEmbedTab('scratch')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeEmbedTab === 'scratch'
                  ? 'bg-white text-indigo-700 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-orange-500" />
              <span>Scratch Embed</span>
            </button>
          </div>
        </div>

        {/* Load Project by ID or URL Input */}
        <form onSubmit={handleLoadCustomProject} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={customScratchInput}
              onChange={(e) => setCustomScratchInput(e.target.value)}
              placeholder={
                language === 'ar'
                  ? 'الصق رابط مشروع سكراتش أو رقم المشروع (مثال: 10128407 أو https://scratch.mit.edu/projects/...)'
                  : 'Paste Scratch URL or Project ID (e.g. 10128407 or https://scratch.mit.edu/projects/...)'
              }
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50/50"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{language === 'ar' ? 'تشغيل المشروع' : 'Load Project'}</span>
          </button>
        </form>

        {/* Embedded Runner Canvas */}
        <div className={`relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner flex flex-col items-center justify-center ${
          isFullscreenEmbed ? 'fixed inset-4 z-50 bg-black' : 'h-[500px] sm:h-[580px] w-full'
        }`}>
          {isFullscreenEmbed && (
            <button
              onClick={() => setIsFullscreenEmbed(false)}
              className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 cursor-pointer shadow-lg"
            >
              ✕ {language === 'ar' ? 'إغلاق ملء الشاشة' : 'Close Fullscreen'}
            </button>
          )}

          <iframe
            src={
              activeEmbedTab === 'turbowarp'
                ? `https://turbowarp.org/${selectedProjectId}/embed?fps=60&turbo=false`
                : `https://scratch.mit.edu/projects/${selectedProjectId}/embed`
            }
            allow="fullscreen; autoplay; gamepad"
            className="w-full h-full border-0"
            title="Scratch Interactive Player"
          />

          {/* Quick Player Bar */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-white text-xs">
            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Project #{selectedProjectId}</span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`https://turbowarp.org/editor?project_url=https://scratch.mit.edu/projects/${selectedProjectId}`}
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
              >
                <span>{language === 'ar' ? 'تعديل الكود في TurboWarp' : 'Remix in TurboWarp'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => setIsFullscreenEmbed(!isFullscreenEmbed)}
                className="text-slate-300 hover:text-white p-1 hover:bg-white/10 rounded-lg cursor-pointer"
                title="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Upload .sb3 File Area */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">
                {language === 'ar' ? 'هل قمت ببرمجة مشروع وحفظته بصيغة .sb3؟' : 'Have a local Scratch (.sb3) file?'}
              </h4>
              <p className="text-xs text-slate-600">
                {uploadedSb3Name
                  ? (language === 'ar' ? `الملف المحدد: ${uploadedSb3Name}` : `Selected: ${uploadedSb3Name}`)
                  : (language === 'ar'
                    ? 'يمكنك رفعه مباشرة وحفظه في ملفك الأكاديمي لعرضه أمام المعلم وزملائك.'
                    : 'Upload your .sb3 project file to store it permanently in SQLite and your academic portfolio.')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <label className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow cursor-pointer transition-all flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'اختر ملف .sb3' : 'Select .sb3 File'}</span>
              <input type="file" accept=".sb3" onChange={handleFileUpload} className="hidden" />
            </label>
            <button
              onClick={() => navigate('/my-portfolio')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow cursor-pointer transition-all flex items-center gap-1.5"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'إضافة للملف' : 'Go to Portfolio'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Starter Templates & Project Inspirations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-300" />
              <span>{language === 'ar' ? 'قوالب سكراتش الجاهزة للتعديل' : 'Starter Project Templates'}</span>
            </h3>
            <p className="text-xs text-amber-100 font-medium">
              {language === 'ar'
                ? 'اختر مشروعاً جاهزاً للتعلم منه وتعديل أكواده مباشرة'
                : 'Click any template to load it instantly in the live runner and learn its code'}
            </p>
          </div>

          <button
            onClick={() => navigate('/play')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10"
          >
            <span>{language === 'ar' ? 'عرض صالة الألعاب' : 'View Game Arcade'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              className={`bg-white rounded-2xl p-5 border shadow-md transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between space-y-4 ${
                selectedProjectId === tpl.scratchId ? 'ring-2 ring-orange-500 border-orange-300' : 'border-slate-200'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-50 text-indigo-700">
                    {language === 'ar' ? tpl.difficultyAr : tpl.difficultyEn}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">#{tpl.scratchId}</span>
                </div>
                <h4 className="text-sm font-black text-slate-900">
                  {language === 'ar' ? tpl.titleAr : tpl.titleEn}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {language === 'ar' ? tpl.descAr : tpl.descEn}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setSelectedProjectId(tpl.scratchId);
                    showToast('info', `Loaded ${tpl.titleEn}!`, `تم تحميل ${tpl.titleAr}!`);
                  }}
                  className="flex-1 px-3 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-orange-600 text-orange-600" />
                  <span>{language === 'ar' ? 'تجربة' : 'Run'}</span>
                </button>

                <a
                  href={`https://turbowarp.org/editor?project_url=https://scratch.mit.edu/projects/${tpl.scratchId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
                  title="Edit code in TurboWarp"
                >
                  <Code className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Code Blocks & Learning Cheat-Sheet */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              {language === 'ar' ? 'دليل مكعبات البرمجة الأساسية في سكراتش' : 'Scratch 3.0 Essential Block Reference'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'ar'
                ? 'تعرف على وظائف المكعبات لتطوير ألعابك الخاصة بسرعة وبدون أخطاء'
                : 'Key block groups for creating physics, movement, score systems, and game loops'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
            <div className="flex items-center gap-2 text-blue-700 font-black text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span>{language === 'ar' ? 'مكعبات الحركة (Motion)' : 'Motion Blocks'}</span>
            </div>
            <p className="text-xs text-slate-600">
              {language === 'ar'
                ? 'تتحكم في موقع الكائن: move (10) steps، go to x: y:، change x by (10)، point towards mouse-pointer.'
                : 'Controls coordinates and orientation: move steps, go to x/y, glide to position, bounce on edge.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-700 font-black text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
              <span>{language === 'ar' ? 'مكعبات الأحداث (Events)' : 'Event Blocks'}</span>
            </div>
            <p className="text-xs text-slate-600">
              {language === 'ar'
                ? 'بداية تشغيل الكود: when green flag clicked، when key space pressed، broadcast message، when this sprite clicked.'
                : 'Triggering code: when green flag clicked, key pressed, sprite clicked, and broadcast messages.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-2">
            <div className="flex items-center gap-2 text-orange-700 font-black text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span>
              <span>{language === 'ar' ? 'مكعبات التحكم والتكرار (Control)' : 'Control & Loops'}</span>
            </div>
            <p className="text-xs text-slate-600">
              {language === 'ar'
                ? 'الحلقات والشروط: forever، repeat (10)، if <condition> then، wait (1) seconds، create clone of myself.'
                : 'Forever loops, repeat counts, if-then conditionals, waits, and sprite cloning for bullets/enemies.'}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
