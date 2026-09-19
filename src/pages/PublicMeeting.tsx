import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LiveMeeting } from '../types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  Video,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Calendar,
  Clock,
  User,
  BookOpen,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

interface Props {
  meetingId: string;
  isPublicMeetingRoute?: boolean; // true for /meeting/public/:meetingId, false for /meeting/:meetingId
}

export const PublicMeetingPage: React.FC<Props> = ({ meetingId, isPublicMeetingRoute = false }) => {
  const { language, meetings, showToast, navigate } = useApp();
  const [meeting, setMeeting] = useState<LiveMeeting | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const cleanId = (meetingId || '').trim();

  useEffect(() => {
    if (!cleanId || cleanId === 'public') {
      navigate('/');
      return;
    }

    // Try finding in current state first
    const found = meetings.find((m) => m.id.toLowerCase() === cleanId.toLowerCase());
    if (found) {
      setMeeting(found);
      setLoading(false);
      return;
    }

    // Otherwise look up directly in Firestore
    setLoading(true);
    getDoc(doc(db, 'meetings', cleanId))
      .then((snap) => {
        if (snap.exists()) {
          setMeeting({ id: snap.id, ...snap.data() } as LiveMeeting);
        } else {
          // Meeting ID is custom/external
          setMeeting(null);
        }
      })
      .catch((err) => {
        console.error('Error fetching meeting:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [cleanId, meetings, navigate]);

  // Determine external meeting URL
  const externalMeetingUrl =
    meeting?.link && meeting.link.startsWith('http')
      ? meeting.link
      : `https://meet.jit.si/LearnAcademy_${encodeURIComponent(cleanId)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(externalMeetingUrl);
    setCopied(true);
    showToast(
      'success',
      'Meeting link copied to clipboard',
      'تم نسخ رابط الاجتماع إلى الحافظة'
    );
    setTimeout(() => setCopied(false), 2500);
  };

  const handleJoinExternal = () => {
    window.open(externalMeetingUrl, '_blank', 'noopener,noreferrer');
  };

  // Exact phrases specified by the user:
  // /meeting/public/meetingID -> "join meeting on external website (no login)"
  // /meeting/meetingID -> "join meeting on external website"
  const mainHeading = isPublicMeetingRoute
    ? (language === 'ar' ? 'الانضمام إلى الاجتماع على موقع خارجي (بدون تسجيل دخول)' : 'join meeting on external website (no login)')
    : (language === 'ar' ? 'الانضمام إلى الاجتماع على موقع خارجي' : 'join meeting on external website');

  const buttonLabel = isPublicMeetingRoute
    ? (language === 'ar' ? 'الانضمام إلى الاجتماع على موقع خارجي (بدون تسجيل دخول)' : 'join meeting on external website (no login)')
    : (language === 'ar' ? 'الانضمام إلى الاجتماع على موقع خارجي' : 'join meeting on external website');

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-white/10 glow-card relative overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs font-bold">
            <Video className="w-4 h-4 text-amber-400" />
            <span>
              {isPublicMeetingRoute
                ? (language === 'ar' ? 'اجتماع خارجي مباشر • بدون تسجيل دخول' : 'External Live Meeting • No Login Required')
                : (language === 'ar' ? 'اجتماع خارجي مباشر' : 'External Live Meeting')}
            </span>
          </div>

          {/* Main User Requested Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug capitalize">
            {mainHeading}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            {isPublicMeetingRoute
              ? (language === 'ar'
                  ? 'يمكنك الانضمام مباشرة إلى جلسة الفيديو الحية على المنصة الخارجية كزائر دون الحاجة لتسجيل حساب أو إدخال كلمة مرور.'
                  : 'You can connect directly to this live video session on the external meeting platform as a guest. No login, password, or account is needed.')
              : (language === 'ar'
                  ? 'اضغط أدناه للانتقال إلى منصة الاجتماعات الخارجية وبدء حصتك المباشرة.'
                  : 'Click below to connect to your live video session on the external meeting platform.')}
          </p>

          {/* Meeting Info Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/15 rounded-2xl p-6 text-start max-w-xl mx-auto space-y-4 shadow-inner">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                {language === 'ar' ? 'معرّف الاجتماع' : 'Meeting ID'}
              </span>
              <span className="font-mono text-sm sm:text-base font-extrabold text-amber-300 bg-amber-400/10 px-3 py-1 rounded-lg border border-amber-400/30">
                {cleanId}
              </span>
            </div>

            {loading ? (
              <div className="py-4 text-center text-xs text-slate-400 animate-pulse">
                {language === 'ar' ? 'جاري التحقق من بيانات الاجتماع...' : 'Checking meeting details...'}
              </div>
            ) : meeting ? (
              <div className="space-y-2 text-sm text-slate-200">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold text-white">{meeting.title}</span>
                  <span className="text-xs text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full">
                    {meeting.subject}
                  </span>
                </div>
                {meeting.teacherName && (
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <User className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'ar' ? 'المعلم:' : 'Teacher:'} {meeting.teacherName}</span>
                  </div>
                )}
                {meeting.startTime && (
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span>{language === 'ar' ? 'الموعد:' : 'Time:'} {meeting.startTime}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>
                  {language === 'ar'
                    ? 'غرفة اجتماعات خارجية مخصصة ومحمية جاهزة للاتصال الفوري.'
                    : 'Secure external meeting room ready for instant connection.'}
                </span>
              </div>
            )}

            {/* External URL Display & Copy */}
            <div className="pt-2">
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5">
                {language === 'ar' ? 'رابط المنصة الخارجية:' : 'External Platform Link:'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={externalMeetingUrl}
                  className="flex-1 px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-xl text-slate-300 font-mono truncate focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  title="Copy link"
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/10"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ' : 'Copy')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={handleJoinExternal}
              className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base shadow-xl flex items-center justify-center gap-2.5 transition-all glow-btn capitalize"
            >
              <span>{buttonLabel}</span>
              <ExternalLink className="w-5 h-5 shrink-0" />
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 border border-white/10"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>{language === 'ar' ? 'الرئيسية' : 'Homepage'}</span>
            </button>
          </div>

          {/* Trust notice */}
          <p className="text-[11px] text-slate-400 pt-2">
            {isPublicMeetingRoute
              ? (language === 'ar'
                  ? 'لا يتطلب هذا الرابط أي تسجيل دخول في المنصة. سيتم فتح منصة الاجتماع الخارجية في نافذة جديدة.'
                  : 'This link requires no login on this platform. The external meeting service will open in a new tab.')
              : (language === 'ar'
                  ? 'سيتم فتح منصة الاجتماع الخارجية في نافذة جديدة.'
                  : 'The external meeting platform will open in a new tab.')}
          </p>

        </div>
      </div>
    </div>
  );
};
