import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LiveMeeting } from '../types';
import { translations } from '../utils/translations';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Users,
  MessageSquare,
  Share2,
  PenTool,
  Maximize2,
  Send,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface Props {
  meeting: LiveMeeting;
  onClose: () => void;
}

export const LiveMeetingRoom: React.FC<Props> = ({ meeting, onClose }) => {
  const { language, currentUser, showToast } = useApp();
  const t = translations[language];

  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'whiteboard' | 'participants'>('chat');
  const [chatMessages, setChatMessages] = useState([
    { sender: meeting.teacherName, text: 'Welcome everyone to our live session! Let us begin.', time: '10:00 AM' },
    { sender: 'Ahmad Ali', text: 'Hello teacher! Ready to learn.', time: '10:01 AM' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatMessages([
      ...chatMessages,
      {
        sender: currentUser ? currentUser.name : 'Guest',
        text: inputMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInputMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col animate-in fade-in duration-300">
      
      {/* Top Meeting Bar */}
      <div className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-base md:text-lg font-bold text-white truncate max-w-md">
            {meeting.title}
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 hidden sm:inline">
            {meeting.subject}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 hidden md:inline">
            Teacher: <strong className="text-slate-200">{meeting.teacherName}</strong>
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Room Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left: Video & Whiteboard Stage */}
        <div className="flex-1 p-4 flex flex-col gap-4 bg-slate-950 overflow-y-auto">
          
          {/* Main Video Screen */}
          <div className="relative aspect-video bg-gradient-to-tr from-indigo-950 via-slate-900 to-purple-950 rounded-3xl border border-slate-800 shadow-2xl flex items-center justify-center overflow-hidden group">
            
            {/* Simulated Live Stream Content */}
            <div className="text-center p-6 max-w-lg z-10">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 p-1 shadow-2xl animate-pulse">
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-2xl font-black text-amber-300">
                  {meeting.teacherName.charAt(0)}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{meeting.teacherName}</h3>
              <p className="text-xs text-purple-300 font-medium mb-3">
                Live Teaching Stream • {meeting.subject} Masterclass
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Learn Academy Educator</span>
              </div>
            </div>

            {/* Student Pip (My Camera) */}
            <div className="absolute bottom-4 right-4 w-36 h-24 md:w-48 md:h-32 bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex items-center justify-center">
              {videoOn ? (
                <div className="w-full h-full bg-gradient-to-br from-purple-900 to-slate-900 flex flex-col items-center justify-center text-center p-2">
                  <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xs mb-1">
                    {currentUser ? currentUser.name.charAt(0) : 'S'}
                  </div>
                  <span className="text-[11px] font-bold text-slate-200 truncate w-full px-1">
                    {currentUser ? currentUser.name : 'You'}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <VideoOff className="w-6 h-6 mb-1" />
                  <span className="text-[10px]">Camera Off</span>
                </div>
              )}
            </div>
          </div>

          {/* Room Toolbar */}
          <div className="h-16 bg-slate-900 rounded-2xl border border-slate-800 px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMicOn(!micOn)}
                className={`p-3 rounded-xl transition-all ${
                  micOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'
                }`}
                title={micOn ? 'Mute Mic' : 'Unmute Mic'}
              >
                {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setVideoOn(!videoOn)}
                className={`p-3 rounded-xl transition-all ${
                  videoOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'
                }`}
                title={videoOn ? 'Turn Off Camera' : 'Turn On Camera'}
              >
                {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => {
                  setActiveTab('whiteboard');
                  showToast('info', 'Interactive Whiteboard opened', 'تم فتح السبورة التفاعلية');
                }}
                className={`p-3 rounded-xl transition-all ${
                  activeTab === 'whiteboard'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title="Interactive Whiteboard"
              >
                <PenTool className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-all"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Leave Class</span>
            </button>
          </div>
        </div>

        {/* Right Panel: Chat / Participants / Whiteboard */}
        <div className="w-full lg:w-80 bg-slate-900 border-l border-slate-800 flex flex-col">
          
          {/* Panel Selector Tabs */}
          <div className="flex border-b border-slate-800 p-2 gap-1 bg-slate-950">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'chat'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('participants')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'participants'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Classmates ({meeting.assignedStudentIds.length + 1})</span>
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {activeTab === 'chat' && (
              <div className="flex flex-col h-full justify-between gap-4">
                <div className="space-y-3 overflow-y-auto pr-1">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/50">
                      <div className="flex items-center justify-between text-[11px] text-purple-300 font-bold mb-1">
                        <span>{msg.sender}</span>
                        <span className="text-slate-500">{msg.time}</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'participants' && (
              <div className="space-y-2">
                <div className="p-3 bg-purple-900/30 border border-purple-500/30 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xs">
                      T
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{meeting.teacherName}</p>
                      <span className="text-[10px] text-amber-300">Host • Educator</span>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>

                {meeting.assignedStudentIds.map((sId) => (
                  <div key={sId} className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                        {sId.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-semibold text-slate-200">{sId}</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'whiteboard' && (
              <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 text-center space-y-3">
                <PenTool className="w-8 h-8 text-amber-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Live Whiteboard Active</h4>
                <p className="text-xs text-slate-400">
                  Teacher is demonstrating math equations & grammar notes live.
                </p>
                <div className="p-4 bg-white text-slate-900 rounded-xl font-mono text-sm shadow">
                  {meeting.subject === 'Math' && '3x + 12 = 27  =>  x = 5'}
                  {meeting.subject === 'Arabic' && 'الجملة الاسمية: المبتدأ (مرفوع) + الخبر (مرفوع)'}
                  {meeting.subject === 'English' && 'Subject + Verb (Present Continuous) => She is reading'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
