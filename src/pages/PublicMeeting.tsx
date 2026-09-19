import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LiveMeeting } from '../types';
import { LiveMeetingRoom } from '../components/LiveMeetingRoom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Video, Sparkles, GraduationCap, ArrowRight, ShieldCheck, Play, Lock } from 'lucide-react';

interface Props {
  meetingId?: string;
}

export const PublicMeetingPage: React.FC<Props> = ({ meetingId }) => {
  const { language, meetings, currentUser, showToast, navigate } = useApp();
  const [meeting, setMeeting] = useState<LiveMeeting | null>(null);
  const [loading, setLoading] = useState<boolean>(!!meetingId);
  const [inputMeetingId, setInputMeetingId] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');

  useEffect(() => {
    if (meetingId && meetingId !== 'public') {
      const foundInState = meetings.find((m) => m.id === meetingId);
      if (foundInState) {
        setMeeting(foundInState);
        setLoading(false);
      } else {
        // Fetch from Firestore directly by ID
        setLoading(true);
        getDoc(doc(db, 'meetings', meetingId))
          .then((snap) => {
            if (snap.exists()) {
              setMeeting({ id: snap.id, ...snap.data() } as LiveMeeting);
            } else {
              showToast('error', 'Meeting not found on Firestore', 'لم يتم العثور على الاجتماع في قاعدة البيانات');
            }
          })
          .catch((err) => {
            console.error('Error fetching meeting from Firestore:', err);
          })
          .finally(() => setLoading(false));
      }
    } else {
      setMeeting(null);
      setLoading(false);
    }
  }, [meetingId, meetings]);

  const handleJoinById = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMeetingId.trim()) return;

    const cleanId = inputMeetingId.trim();
    navigate(`/meeting/${cleanId}`);
  };

  const createInstantPublicMeeting = () => {
    const instantId = 'public_' + Date.now().toString().slice(-6);
    const mockPublicMeeting: LiveMeeting = {
      id: instantId,
      title: 'Public Open Live Class Room',
      subject: 'General',
      teacherId: 'guest_teacher',
      teacherName: guestName.trim() || 'Guest Educator',
      assignedStudentIds: ['public_guest_1', 'public_guest_2'],
      startTime: 'Live Now',
      durationMinutes: 60,
      link: `/meeting/${instantId}`,
      status: 'live',
      isTeacherInRoom: true,
      isPublic: true
    };
    setMeeting(mockPublicMeeting);
  };

  if (meeting) {
    return (
      <LiveMeetingRoom
        meeting={meeting}
        onClose={() => {
          setMeeting(null);
          navigate('/meeting/public');
        }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-[2.5rem] p-8 sm:p-12 text-white shadow-2xl border border-white/10 glow-card relative overflow-hidden">
        
        {/* Header */}
        <div className="relative z-10 text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Public Open Access • No Login Required</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {language === 'ar' ? 'الانضمام لاجتماع مباشر مفتوح' : 'Join a Public Live Meeting'}
          </h1>
          <p className="text-sm text-purple-200 leading-relaxed">
            {language === 'ar'
              ? 'أدخل رمز الاجتماع المخزن في Firestore للانضمام مباشرة دون الحاجة لتسجيل الدخول.'
              : 'Enter any meeting ID stored on Firestore to join live video, chat, and whiteboard instantly without signing in.'}
          </p>
        </div>

        {/* Join Form */}
        <div className="mt-8 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Enter Meeting ID */}
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 space-y-4">
            <div className="flex items-center gap-3 text-amber-300 font-bold">
              <Video className="w-6 h-6" />
              <h3>{language === 'ar' ? 'الانضمام عبر معرف الاجتماع' : 'Join via Meeting ID'}</h3>
            </div>

            <form onSubmit={handleJoinById} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1">
                  Firestore Meeting ID
                </label>
                <input
                  type="text"
                  value={inputMeetingId}
                  onChange={(e) => setInputMeetingId(e.target.value)}
                  placeholder="e.g. meet_172674823"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-purple-400/40 text-white placeholder-slate-400 text-sm font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all glow-btn"
              >
                <span>{language === 'ar' ? 'انضمام الآن' : 'Join Meeting Now'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </form>
          </div>

          {/* Card 2: Instant Guest Room */}
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 space-y-4">
            <div className="flex items-center gap-3 text-emerald-300 font-bold">
              <Play className="w-6 h-6" />
              <h3>{language === 'ar' ? 'غرفة حية فورية للزوار' : 'Instant Public Live Stream'}</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1">
                  Your Name / Display Name
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Guest Student"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-purple-400/40 text-white placeholder-slate-400 text-sm font-semibold focus:outline-none focus:border-emerald-400"
                />
              </div>

              <button
                onClick={createInstantPublicMeeting}
                className="w-full py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all glow-btn"
              >
                <Sparkles className="w-4 h-4" />
                <span>{language === 'ar' ? 'بدء جلسة حية مفتوحة' : 'Launch Open Public Room'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Public Meetings List from Firestore */}
        {meetings.filter((m) => m.isPublic || m.status === 'live').length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10 relative z-10 space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              {language === 'ar' ? 'الاجتماعات المباشرة القائمة في Firestore:' : 'Live Public Meetings on Firestore:'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {meetings.map((m) => (
                <div
                  key={m.id}
                  onClick={() => navigate(`/meeting/${m.id}`)}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-amber-400 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div>
                    <h5 className="text-sm font-bold text-white group-hover:text-amber-300">{m.title}</h5>
                    <p className="text-xs text-slate-400">{m.subject} • Host: {m.teacherName}</p>
                    <span className="text-[10px] text-purple-300 font-mono">ID: {m.id}</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    Join
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
