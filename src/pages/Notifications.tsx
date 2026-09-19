import React from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { Bell, CheckCheck, Video } from 'lucide-react';

export const Notifications: React.FC = () => {
  const { language, notifications, markAllNotificationsRead, meetings, setActiveMeetingRoom } =
    useApp();
  const t = translations[language];

  const handleAction = (meetingId?: string) => {
    if (meetingId) {
      const foundMeeting = meetings.find((m) => m.id === meetingId);
      if (foundMeeting) {
        setActiveMeetingRoom(foundMeeting);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-100 glow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-black">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">{t.notifications}</h1>
            <p className="text-xs text-slate-500">Live Meeting Alerts & Group Announcements</p>
          </div>
        </div>

        {notifications.some((n) => !n.read) && (
          <button
            onClick={markAllNotificationsRead}
            className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center gap-1.5 transition-all glow-btn self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            <span>{t.markAllRead}</span>
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-400 font-medium shadow-md">
            {t.noNotifications}
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 rounded-2xl bg-white border transition-all glow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !n.read ? 'border-amber-400 bg-amber-50/20 shadow-md' : 'border-slate-100'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {!n.read && (
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  )}
                  <h3 className="text-base font-bold text-slate-800">
                    {language === 'ar' && n.titleAr ? n.titleAr : n.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-semibold">{n.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'ar' && n.messageAr ? n.messageAr : n.message}
                </p>
              </div>

              {n.meetingId && (
                <button
                  onClick={() => handleAction(n.meetingId)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow flex items-center gap-1.5 transition-all glow-btn shrink-0 self-start sm:self-auto"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join Live</span>
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
