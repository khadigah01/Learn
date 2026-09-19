import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/Toast';
import { LevelTestModal } from './components/LevelTestModal';
import { LiveMeetingRoom } from './components/LiveMeetingRoom';
import { Home } from './pages/Home';
import { LoginChoice } from './pages/Login';
import { LoginRole } from './pages/LoginRole';
import { Dashboard } from './pages/Dashboard';
import { Games } from './pages/Games';
import { Careers } from './pages/Careers';
import { Notifications } from './pages/Notifications';
import { PublicMeetingPage } from './pages/PublicMeeting';
import { Ads } from './pages/Ads';
import { translations } from './utils/translations';
import { GraduationCap, ExternalLink, Sparkles, LogIn } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    currentPath,
    currentUser,
    activeTestSubject,
    setActiveTestSubject,
    activeMeetingRoom,
    setActiveMeetingRoom,
    language,
    navigate
  } = useApp();

  const t = translations[language];

  const renderRoute = () => {
    const path = currentPath.toLowerCase();

    // 1. Public Meeting routes (/meeting/public or /meeting/:meetingId)
    if (path.startsWith('/meeting/')) {
      const meetingId = path.replace('/meeting/', '');
      return <PublicMeetingPage meetingId={meetingId} />;
    }

    // 2. Login Routes
    if (path === '/login') {
      return <LoginChoice />;
    }
    if (path === '/login/student') {
      return <LoginRole role="student" />;
    }
    if (path === '/login/teacher') {
      return <LoginRole role="teacher" />;
    }
    if (path === '/login/coordinator') {
      return <LoginRole role="coordinator" />;
    }
    if (path === '/login/admin') {
      return <LoginRole role="admin" />;
    }

    // 3. Public pages
    if (path === '/ads' || path === '/register') {
      return <Ads />;
    }
    if (path === '/careers') {
      return <Careers />;
    }
    if (path === '/games') {
      return <Games />;
    }

    // 4. Authenticated-only Routes (Dashboard, Notifications)
    if (path === '/dashboard' || path === '/notifications') {
      if (!currentUser) {
        return (
          <div className="space-y-6 max-w-xl mx-auto py-10">
            <div className="bg-amber-400 text-slate-950 font-black px-6 py-4 rounded-3xl text-center shadow-xl flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <LogIn className="w-6 h-6" />
                <span>
                  {language === 'ar'
                    ? 'يرجى تسجيل الدخول للوصول إلى لوحة التحكم'
                    : 'Please log in to access your dashboard.'}
                </span>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2 bg-slate-950 text-white rounded-2xl text-xs font-extrabold hover:bg-slate-800 transition-all"
              >
                {language === 'ar' ? 'تسجيل الدخول' : 'Go to Login'}
              </button>
            </div>
            <LoginChoice />
          </div>
        );
      }
      return path === '/dashboard' ? <Dashboard /> : <Notifications />;
    }

    // 5. Default route (Home Overview page)
    return <Home />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#5b51d8] via-[#4f46e5] to-[#3730a3] text-slate-800 font-sans selection:bg-amber-300 selection:text-slate-900">
      
      {/* Toast Overlay */}
      <ToastContainer />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderRoute()}
      </main>

      {/* Level Test Modal */}
      {activeTestSubject && (
        <LevelTestModal
          subject={activeTestSubject}
          onClose={() => setActiveTestSubject(null)}
        />
      )}

      {/* Live Meeting Room View */}
      {activeMeetingRoom && (
        <LiveMeetingRoom
          meeting={activeMeetingRoom}
          onClose={() => setActiveMeetingRoom(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-slate-950/80 backdrop-blur-md text-white border-t border-white/10 py-10 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-black text-amber-300">{t.academyName}</span>
              <p className="text-xs text-slate-400">{t.academySubtitle}</p>
            </div>
          </div>

          {/* Platform Domain & Partner Notice */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Official Platform:</span>
              <a
                href="https://learn-academy-platform.surge.sh"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-amber-200 flex items-center gap-0.5"
              >
                learn-academy-platform.surge.sh <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1 text-emerald-300 font-semibold">
              <span>Partner:</span>
              <a
                href="https://korasty-kids.surge.sh/"
                target="_blank"
                rel="noreferrer"
                className="hover:underline flex items-center gap-0.5"
              >
                Korasty Kids <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="text-xs text-slate-400 text-center md:text-right">
            <p>© 2026 Learn Academy. All rights reserved.</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Math • Arabic • English Interactive Platform • Firestore Backed
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
