import React, { useEffect } from 'react';
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
import { CommunicationHub } from './pages/CommunicationHub';
import { MyBadges } from './pages/MyBadges';
import { MyPortfolio } from './pages/MyPortfolio';
import { Settings } from './pages/Settings';
import { Help } from './pages/Help';
import { BadgesGuide } from './pages/BadgesGuide';
import { Payments } from './pages/Payments';
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

  // Redirect /meeting/public or /meeting to homepage
  useEffect(() => {
    const p = currentPath.toLowerCase().replace(/\/+$/, '');
    if (p === '/meeting/public' || p === '/meeting') {
      navigate('/');
    }
  }, [currentPath, navigate]);

  const renderRoute = () => {
    const path = currentPath.toLowerCase();
    const cleanPath = path.replace(/\/+$/, '');

    // 1. Meeting routes
    if (cleanPath === '/meeting/public' || cleanPath === '/meeting') {
      return <Home />;
    }

    // /meeting/public/:meetingId -> "join meeting on external website (no login)"
    if (path.startsWith('/meeting/public/')) {
      const meetingId = path.substring('/meeting/public/'.length).replace(/^\/+|\/+$/g, '');
      if (!meetingId) {
        return <Home />;
      }
      return <PublicMeetingPage meetingId={meetingId} isPublicMeetingRoute={true} />;
    }

    // /meeting/:meetingId -> "join meeting on external website"
    if (path.startsWith('/meeting/')) {
      const meetingId = path.substring('/meeting/'.length).replace(/^\/+|\/+$/g, '');
      if (!meetingId || meetingId === 'public') {
        return <Home />;
      }
      return <PublicMeetingPage meetingId={meetingId} isPublicMeetingRoute={false} />;
    }

    // 2. Login Routes
    if (
      path === '/login' ||
      path === '/login/student' ||
      path === '/login/teacher' ||
      path === '/login/coordinator' ||
      path === '/login/admin'
    ) {
      return <LoginChoice />;
    }

    // 3. Communication Hub Routes (/ask/* & /talk/*)
    if (
      path === '/ask/admin' ||
      path === '/ask/teacher' ||
      path === '/ask/student' ||
      path === '/talk/admin' ||
      path === '/talk/teacher' ||
      path === '/talk/student'
    ) {
      return <CommunicationHub />;
    }

    // 4. Public pages
    if (path === '/ads' || path === '/register') {
      return <Ads />;
    }
    if (path === '/careers') {
      return <Careers />;
    }
    if (path === '/games') {
      return <Games />;
    }
    if (path === '/my-badges') {
      return <MyBadges />;
    }
    if (path === '/my-portfolio') {
      return <MyPortfolio />;
    }
    if (path === '/settings') {
      return <Settings />;
    }
    if (path === '/help') {
      return <Help />;
    }
    if (path === '/badges-guide') {
      return <BadgesGuide />;
    }
    if (path === '/payments') {
      return <Payments />;
    }

    // 5. Authenticated-only Routes (Dashboard, Notifications)
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
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-gradient-to-b from-[#5b51d8] via-[#4f46e5] to-[#3730a3] text-slate-800 font-sans selection:bg-amber-300 selection:text-slate-900">
      
      {/* Toast Overlay */}
      <ToastContainer />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 min-w-0">
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
              <span>Domain:</span>
              <a
                href="https://LearnAcademy.dpdns.org"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-amber-200 flex items-center gap-0.5 text-amber-400 font-extrabold"
              >
                LearnAcademy.dpdns.org <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1 text-slate-300 font-semibold">
              <span>Mirror:</span>
              <a
                href="https://learn-academy-platform.surge.sh"
                target="_blank"
                rel="noreferrer"
                className="hover:underline flex items-center gap-0.5 text-slate-300"
              >
                Surge CDN <ExternalLink className="w-3 h-3" />
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
            <p>Learn Academy — Open Educational Learning Platform</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Math • Arabic • English Interactive Platform
            </p>
          </div>
        </div>

        {/* DigitalPlat FreeDomain Integration */}
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <a
              href="https://dashboard.digitalplat.org/signup?ref=seRKf8j6Tx"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                border: '1px solid #1e293b',
                borderRadius: '12px',
                background: '#0f172a',
                color: '#f8fafc',
                textDecoration: 'none',
                font: "500 13px/1.25 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
                boxShadow: '0 1px 2px rgba(15,23,42,0.22)'
              }}
              className="hover:border-slate-700 transition-colors"
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px 8px',
                  borderRadius: '9999px',
                  background: '#1e293b',
                  color: '#93c5fd',
                  font: "600 11px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase'
                }}
              >
                DigitalPlat
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                <span style={{ fontWeight: 600 }}>This Website is Powered by DigitalPlat FreeDomain</span>
                <span style={{ color: '#cbd5e1' }}>Get a free domain from DigitalPlat.</span>
              </span>
            </a>

            <a
              href="https://dashboard.digitalplat.org/signup?ref=seRKf8j6Tx"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-90 transition-opacity inline-flex items-center"
            >
              <img
                src="https://img.shields.io/badge/DigitalPlat-Get%20a%20free%20domain%20from%20DigitalPlat.-111827?style=flat-square&logo=databricks&logoColor=93c5fd"
                alt="This Website is Powered by DigitalPlat FreeDomain Get a free domain from DigitalPlat."
                className="h-[34px] rounded-md shadow-sm"
                referrerPolicy="no-referrer"
              />
            </a>
          </div>

          <div className="text-xs text-slate-400 text-center sm:text-right">
            <span className="text-slate-400">Sponsored by </span>
            <a
              href="https://dashboard.digitalplat.org/signup?ref=seRKf8j6Tx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline inline-flex items-center gap-1"
            >
              DigitalPlat FreeDomain <ExternalLink className="w-3 h-3 inline" />
            </a>
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
