import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { CommunicationChannel, InquiryMessage } from '../types';
import { CONTACT_INFO } from '../data/contact';
import {
  MessageSquare,
  Send,
  UserCheck,
  GraduationCap,
  ShieldCheck,
  Users,
  Phone,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Trash2,
  Reply,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface Props {
  initialChannel?: CommunicationChannel;
}

export const CommunicationHub: React.FC<Props> = ({ initialChannel = 'ask_admin' }) => {
  const {
    language,
    currentUser,
    inquiries,
    submitInquiry,
    replyToInquiry,
    deleteInquiry,
    showToast,
    navigate,
    currentPath
  } = useApp();

  const t = translations[language];

  // Derive current channel from currentPath if matching, otherwise fallback
  const getActiveChannelFromPath = (): CommunicationChannel => {
    if (currentPath.includes('/ask/admin')) return 'ask_admin';
    if (currentPath.includes('/ask/teacher')) return 'ask_teacher';
    if (currentPath.includes('/ask/student')) return 'ask_student';
    if (currentPath.includes('/talk/admin')) return 'talk_admin';
    if (currentPath.includes('/talk/teacher')) return 'talk_teacher';
    if (currentPath.includes('/talk/student')) return 'talk_student';
    return initialChannel;
  };

  const channel = getActiveChannelFromPath();

  // Form states
  const [senderName, setSenderName] = useState(currentUser?.name || '');
  const [senderPhone, setSenderPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // In-site Reply Modal / Inline State (NO browser prompt!)
  const [replyingInquiryId, setReplyingInquiryId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // HTML Delete Confirmation Modal State (NO browser confirm!)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const isAdmin = currentUser?.role === 'admin';
  const isTeacher = currentUser?.role === 'teacher';

  const channelConfig: Record<
    CommunicationChannel,
    {
      titleEn: string;
      titleAr: string;
      subtitleEn: string;
      subtitleAr: string;
      icon: any;
      badgeColor: string;
      route: string;
    }
  > = {
    ask_admin: {
      titleEn: 'Ask Administration',
      titleAr: 'اسأل الإدارة الأكاديمية',
      subtitleEn: 'Inquiries regarding curriculum, registrations, schedules, fees & general support',
      subtitleAr: 'استفسارات المناهج والتسجيل، المواعيد، المصروفات والدعم الأكاديمي الشامل',
      icon: ShieldCheck,
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
      route: '/ask/admin'
    },
    ask_teacher: {
      titleEn: 'Ask Teacher',
      titleAr: 'اسأل المعلم',
      subtitleEn: 'Ask your subject teacher questions about lessons, homework & concepts',
      subtitleAr: 'اسأل معلم المادة عن الدروس، المفاهيم، حل الواجبات والمراجعات',
      icon: GraduationCap,
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      route: '/ask/teacher'
    },
    ask_student: {
      titleEn: 'Ask Student',
      titleAr: 'متابعة وأسئلة الطلاب',
      subtitleEn: 'Teachers & coordinators sending follow-up questions, assessments & surveys',
      subtitleAr: 'إرسال أسئلة متابعة، تدريبات وتقييمات دورية وملاحظات للطلاب',
      icon: UserCheck,
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
      route: '/ask/student'
    },
    talk_admin: {
      titleEn: 'Talk with Admin',
      titleAr: 'محادثة مباشرة مع الإدارة',
      subtitleEn: 'Direct live communication and WhatsApp connection with administrative supervisors',
      subtitleAr: 'محادثة حية وفورية وتواصل واتساب مباشر مع إدارة أكاديمية Learn',
      icon: MessageSquare,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      route: '/talk/admin'
    },
    talk_teacher: {
      titleEn: 'Talk with Teacher',
      titleAr: 'محادثة حية مع المعلم',
      subtitleEn: 'Live chat channel between students, parents and subject teachers',
      subtitleAr: 'قناة محادثة وتواصل مباشر مع معلم المادة لمتابعة الحصص',
      icon: MessageSquare,
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
      route: '/talk/teacher'
    },
    talk_student: {
      titleEn: 'Talk with Student',
      titleAr: 'محادثة وتواصل الطلاب',
      subtitleEn: 'Peer study communication and group discussion for enrolled students',
      subtitleAr: 'منتدى ومحادثة تفاعلية بين الطلاب في المجموعات الدراسية للتعاون',
      icon: Users,
      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      route: '/talk/student'
    }
  };

  const currentConfig = channelConfig[channel];

  const handleChannelSwitch = (ch: CommunicationChannel) => {
    navigate(channelConfig[ch].route);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      showToast('error', 'Please enter your message', 'يرجى كتابة رسالتك');
      return;
    }

    setSubmitting(true);
    try {
      const finalSenderName = senderName.trim() || currentUser?.name || (language === 'ar' ? 'زائر' : 'Guest');
      await submitInquiry({
        channel,
        senderId: currentUser?.id || 'guest_' + Date.now(),
        senderName: finalSenderName,
        senderRole: currentUser?.role || 'guest',
        senderPhone: senderPhone.trim() || undefined,
        subject: subject.trim() || undefined,
        content: content.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      setContent('');
      setSubject('');
      if (!currentUser) {
        setSenderName('');
        setSenderPhone('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async (inquiryId: string) => {
    if (!replyText.trim()) {
      showToast('error', 'Please write a reply', 'يرجى كتابة الرد');
      return;
    }

    try {
      const replier = currentUser?.name || (isAdmin ? 'Administration' : 'Teacher');
      await replyToInquiry(inquiryId, replyText.trim(), replier);
      setReplyingInquiryId(null);
      setReplyText('');
    } catch (err) {
      console.error(err);
    }
  };

  // Filter inquiries for the active channel
  const channelInquiries = (inquiries || []).filter((inq) => inq.channel === channel);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* TOP OFFICIAL CONTACT BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-indigo-500/20 glow-card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'مركز التواصل والاستفسارات المباشر' : 'Official Communication Hub'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {language === 'ar' ? 'تواصل مع إدارة ومعلمي أكاديمية Learn' : 'Connect with Learn Academy Admin & Teachers'}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200">
              {language === 'ar'
                ? 'متاحون دائماً للرد على أسئلتكم عبر الموقع أو مباشرة عبر الهاتف والواتساب'
                : 'Available 24/7 for student and parent inquiries in-site or directly via Phone & WhatsApp.'}
            </p>
          </div>

          {/* Quick External Contact Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={CONTACT_INFO.whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs shadow-lg flex items-center gap-2 transition-all glow-btn cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <div className="text-left rtl:text-right">
                <span className="block text-[10px] opacity-90">WhatsApp:</span>
                <span className="block font-black text-sm">{CONTACT_INFO.whatsappUsername}</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
            </a>

            <a
              href={CONTACT_INFO.telLink}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 transition-all glow-btn cursor-pointer"
            >
              <Phone className="w-4 h-4 text-slate-950" />
              <div className="text-left rtl:text-right">
                <span className="block text-[10px] text-slate-700">Phone Hotline:</span>
                <span className="block font-black text-sm">{CONTACT_INFO.phone}</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* CHANNEL NAVIGATION TABS (ALL 6 USER-REQUESTED ROUTES) */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-2 shadow-sm border border-slate-200/80">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {(Object.keys(channelConfig) as CommunicationChannel[]).map((key) => {
            const cfg = channelConfig[key];
            const Icon = cfg.icon;
            const isActive = channel === key;

            return (
              <button
                key={key}
                onClick={() => handleChannelSwitch(key)}
                className={`p-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                  <span className="whitespace-nowrap font-black">
                    {language === 'ar' ? cfg.titleAr : cfg.titleEn}
                  </span>
                </div>
                <span className={`text-[10px] ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                  {cfg.route}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE CHANNEL DETAILS & INTERACTION AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT / FORM PANEL (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 space-y-6 glow-card">
            
            {/* Header */}
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-black border ${currentConfig.badgeColor}`}>
                  {currentConfig.route}
                </span>
                {currentUser && (
                  <span className="text-xs text-slate-500 font-semibold">
                    ({currentUser.name} • {currentUser.role})
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black text-slate-900">
                {language === 'ar' ? currentConfig.titleAr : currentConfig.titleEn}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'ar' ? currentConfig.subtitleAr : currentConfig.subtitleEn}
              </p>
            </div>

            {/* In-Site Submission Form (NO email required!) */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  {language === 'ar' ? 'الاسم' : 'Your Name'}
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: أحمد محمود' : 'e.g. Adam Youssef'}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  {language === 'ar' ? 'رقم الهاتف / الواتساب (اختياري للرد السريع)' : 'Phone / WhatsApp (Optional for fast response)'}
                </label>
                <input
                  type="text"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: 01550128876' : 'e.g. +20 15 50128876'}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  {language === 'ar' ? 'الموضوع / العنوان' : 'Subject / Topic'}
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={
                    language === 'ar'
                      ? 'مثال: استفسار عن مواعيد مجموعات الرياضيات'
                      : 'e.g. Question regarding Math group schedule'
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  {language === 'ar' ? 'الرسالة / الاستفسار بالتفصيل *' : 'Message / Inquiry *'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    language === 'ar'
                      ? 'اكتب سؤالك أو رسالتك بالتفصيل هنا...'
                      : 'Write your question or message here...'
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-600 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all glow-btn cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>
                  {submitting
                    ? language === 'ar'
                      ? 'جاري الإرسال...'
                      : 'Sending...'
                    : language === 'ar'
                    ? 'إرسال الرسالة الآن'
                    : 'Send Message Now'}
                </span>
              </button>
            </form>

            {/* Direct Quick WhatsApp Banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-950 space-y-2">
              <div className="flex items-center gap-2 font-black text-xs text-emerald-800">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>{language === 'ar' ? 'محادثة فورية على الواتساب' : 'Instant WhatsApp Support'}</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed font-medium">
                {language === 'ar'
                  ? 'يمكنك أيضاً التحدث مباشرة مع الأستاذة إيمان عبر الواتساب على الرقم '
                  : 'You can also chat directly with coordinator Eman on WhatsApp: '}
                <strong className="font-extrabold text-emerald-900">{CONTACT_INFO.phone}</strong> (Username: <strong className="font-extrabold text-emerald-900">{CONTACT_INFO.whatsappUsername}</strong>)
              </p>
              <a
                href={CONTACT_INFO.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 hover:text-emerald-900 underline pt-1"
              >
                <span>{language === 'ar' ? 'فتح المحادثة في واتساب' : 'Open WhatsApp Chat'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>
        </div>

        {/* RIGHT / FEED & MESSAGES PANEL (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 space-y-6 glow-card">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {language === 'ar' ? 'سجل الاستفسارات والمحادثات الحية' : 'Live Inquiries & Conversation Stream'}
                </h3>
                <p className="text-xs text-slate-500">
                  {channelInquiries.length}{' '}
                  {language === 'ar' ? 'رسائل مسجلة في هذه القناة' : 'messages recorded in this channel'}
                </p>
              </div>

              {/* Status summary pill */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Real-time Sync</span>
              </div>
            </div>

            {/* Inquiries / Messages Stream */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {channelInquiries.length === 0 ? (
                <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center font-bold">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-extrabold text-slate-700">
                    {language === 'ar' ? 'لا توجد رسائل في هذه القناة حتى الآن' : 'No messages in this channel yet'}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {language === 'ar'
                      ? 'كن أول من يرسل استفساراً وسيقوم فريق الأكاديمية أو المعلم بالرد فوراً.'
                      : 'Be the first to submit a question or start a conversation. Our team responds promptly.'}
                  </p>
                </div>
              ) : (
                channelInquiries.map((inq) => {
                  const isAnswered = inq.status === 'answered' || Boolean(inq.reply);

                  return (
                    <div
                      key={inq.id}
                      className="bg-slate-50 hover:bg-slate-50/80 rounded-2xl p-5 border border-slate-200 transition-all space-y-3"
                    >
                      {/* Sender Info & Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-300 font-bold text-xs flex items-center justify-center">
                            {inq.senderName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-sm text-slate-900">{inq.senderName}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 uppercase">
                                {inq.senderRole}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2">
                              <span>{inq.timestamp}</span>
                              {inq.senderPhone && (
                                <>
                                  <span>•</span>
                                  <span className="text-emerald-700 font-semibold">{inq.senderPhone}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status Tag */}
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1 ${
                              isAnswered
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isAnswered ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{language === 'ar' ? 'تم الرد' : 'Answered'}</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3" />
                                <span>{language === 'ar' ? 'قيد المتابعة' : 'Pending'}</span>
                              </>
                            )}
                          </span>

                          {/* Admin Delete Action */}
                          {isAdmin && (
                            <button
                              onClick={() => setDeleteConfirmId(inq.id)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                              title="Delete inquiry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Subject if exists */}
                      {inq.subject && (
                        <h4 className="font-black text-sm text-indigo-950">{inq.subject}</h4>
                      )}

                      {/* Content */}
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-white p-3.5 rounded-xl border border-slate-100 font-medium">
                        {inq.content}
                      </p>

                      {/* Existing Reply */}
                      {inq.reply && (
                        <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-3.5 space-y-1 text-emerald-950">
                          <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 border-b border-emerald-200/60 pb-1">
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              <span>{inq.repliedBy || 'Administration / Teacher'}</span>
                            </span>
                            <span className="text-[10px] text-emerald-600">{inq.repliedAt}</span>
                          </div>
                          <p className="text-xs text-emerald-900 whitespace-pre-wrap leading-relaxed pt-1">
                            {inq.reply}
                          </p>
                        </div>
                      )}

                      {/* Admin / Teacher In-Site Inline Reply Form (NO browser prompt!) */}
                      {(isAdmin || isTeacher) && (
                        <div className="pt-1">
                          {replyingInquiryId === inq.id ? (
                            <div className="bg-white p-3.5 rounded-xl border border-indigo-200 space-y-2.5 animate-in fade-in">
                              <label className="block text-xs font-extrabold text-indigo-950">
                                {language === 'ar' ? 'اكتب ردك المعتمد للطالب / ولي الأمر:' : 'Enter official reply:'}
                              </label>
                              <textarea
                                rows={3}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder={language === 'ar' ? 'اكتب الرد هنا...' : 'Write your response here...'}
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-600 resize-none"
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReplyingInquiryId(null);
                                    setReplyText('');
                                  }}
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                                >
                                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSendReply(inq.id)}
                                  className="px-4 py-1.5 rounded-lg text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow cursor-pointer"
                                >
                                  {language === 'ar' ? 'إرسال الرد' : 'Send Reply'}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingInquiryId(inq.id);
                                setReplyText(inq.reply || '');
                              }}
                              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer pt-1"
                            >
                              <Reply className="w-3.5 h-3.5" />
                              <span>
                                {inq.reply
                                  ? language === 'ar'
                                    ? 'تعديل الرد'
                                    : 'Edit Reply'
                                  : language === 'ar'
                                  ? 'الرد على هذه الرسالة'
                                  : 'Reply to Message'}
                              </span>
                            </button>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>

      </div>

      {/* HTML IN-SITE DELETE CONFIRMATION MODAL (NO BROWSER CONFIRM!) */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-red-100 glow-card">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {language === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'هل أنت متأكد من رغبتك في حذف هذا الاستفسار نهائياً من قاعدة البيانات؟'
                : 'Are you sure you want to permanently delete this inquiry from Firestore?'}
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deleteInquiry(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-5 py-2 rounded-xl text-xs font-black bg-red-600 hover:bg-red-700 text-white shadow cursor-pointer"
              >
                {language === 'ar' ? 'حذف الآن' : 'Delete Now'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
