import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { SubjectType, LiveMeeting, StudentGroup, User, CareerApplication, ProgramItem, InquiryMessage } from '../types';
import {
  Calendar,
  Clock,
  Video,
  Plus,
  Users,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Edit3,
  Bell,
  Calculator,
  BookOpen,
  Languages,
  Sparkles,
  Search,
  UserPlus,
  ArrowRight,
  GraduationCap,
  Briefcase,
  X,
  Lock,
  UserCheck,
  MessageSquare,
  HelpCircle,
  Send,
  Check,
  Layers,
  FileText
} from 'lucide-react';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const Dashboard: React.FC = () => {
  const {
    language,
    currentUser,
    meetings,
    groups,
    users,
    careerApps,
    programs,
    inquiries,
    createMeeting,
    toggleMeetingLiveStatus,
    deleteMeeting,
    createGroup,
    updateGroup,
    deleteGroup,
    assignStudentToGroup,
    registerOrLoginUser,
    updateUser,
    deleteUser,
    updateCareerAppStatus,
    deleteCareerApp,
    createProgram,
    updateProgram,
    deleteProgram,
    replyToInquiry,
    deleteInquiry,
    sendBroadcastNotification,
    setActiveTestSubject,
    setActiveMeetingRoom,
    showToast,
    navigate
  } = useApp();

  const t = translations[language];

  const isAdmin = currentUser?.role === 'admin';
  const isTeacher = currentUser?.role === 'teacher';
  const isCoordinator = currentUser?.role === 'coordinator';
  const isStudent = currentUser?.role === 'student';

  const [activeTab, setActiveTab] = useState<'meetings' | 'groups' | 'students' | 'users' | 'programs' | 'inquiries' | 'careers'>(
    'meetings'
  );
  const [searchTerm, setSearchTerm] = useState('');

  // HTML Delete Confirmation Modal State
  const [confirmDeleteAction, setConfirmDeleteAction] = useState<{
    type: 'user' | 'meeting' | 'group' | 'careerApp' | 'program' | 'inquiry';
    id: string;
    title: string;
  } | null>(null);

  // Broadcast Announcement Modal State
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // Program CRUD Modal State
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [editProgramData, setEditProgramData] = useState<ProgramItem | null>(null);
  const [programForm, setProgramForm] = useState<Omit<ProgramItem, 'id'>>({
    titleEn: '',
    titleAr: '',
    subject: 'Math',
    stage: 'Foundations & Primary',
    stageAr: 'المرحلة التأسيسية والابتدائية',
    ageRange: '5 - 12 Years',
    schedule: '2 Sessions / Week',
    sessionsCount: '16 Live Sessions',
    price: 'Free Trial Available',
    descriptionEn: '',
    descriptionAr: '',
    featuresEn: ['Interactive visual tools', 'Diagnostic quizzes', 'Small group breakout'],
    featuresAr: ['أدوات تفاعلية مرئية', 'اختبارات تشخيصية مستمرة', 'مجموعات صغيرة تفاعلية']
  });

  // Inquiry Reply & Filter Modal State
  const [replyInquiryModalData, setReplyInquiryModalData] = useState<InquiryMessage | null>(null);
  const [inquiryReplyText, setInquiryReplyText] = useState('');
  const [inquiryFilterStatus, setInquiryFilterStatus] = useState<'all' | 'pending' | 'answered'>('all');

  // Create Meeting State
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingSubject, setMeetingSubject] = useState<'Math' | 'Arabic' | 'English'>('Math');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [meetingTime, setMeetingTime] = useState('Today, 4:00 PM');
  const [meetingDuration, setMeetingDuration] = useState(45);

  // Edit Meeting State
  const [editMeeting, setEditMeeting] = useState<LiveMeeting | null>(null);

  // Create / Edit Group State
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupSubject, setGroupSubject] = useState<'Math' | 'Arabic' | 'English'>('Math');
  const [groupSchedule, setGroupSchedule] = useState('Mon & Wed 4:00 PM');
  const [groupStudentIds, setGroupStudentIds] = useState<string[]>([]);
  const [editGroup, setEditGroup] = useState<StudentGroup | null>(null);

  // Admin Account Creation State
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('123456');
  const [newUserRole, setNewUserRole] = useState<User['role']>('student');
  const [newUserGroup, setNewUserGroup] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  // Admin Account Full Edit Modal State
  const [editUserModalData, setEditUserModalData] = useState<User | null>(null);

  // Helper student list
  const allStudentsList = users.filter((u) => u.role === 'student');

  // Filtered meetings & groups for student view (ONLY assigned to student or student's group!)
  const studentMeetings = meetings.filter((m) => {
    if (!currentUser) return false;
    const directAssigned = m.assignedStudentIds && m.assignedStudentIds.includes(currentUser.id);
    const groupMatch = m.groupId && groups.find((g) => g.id === m.groupId)?.studentIds.includes(currentUser.id);
    const nameMatch = m.groupName && currentUser.groupName && m.groupName === currentUser.groupName;
    const isPublic = m.isPublic === true;
    return directAssigned || groupMatch || nameMatch || isPublic;
  });

  const studentGroups = groups.filter((g) => {
    if (!currentUser) return false;
    return g.studentIds.includes(currentUser.id) || g.name === currentUser.groupName;
  });

  // Handle student joining live meeting
  const handleJoinMeeting = (meeting: LiveMeeting) => {
    if (isStudent && !meeting.isTeacherInRoom) {
      showToast('info', 'Wait for the teacher to start the meeting.', 'انتظر المعلم ليبدأ الاجتماع.');
      return;
    }
    setActiveMeetingRoom(meeting);
  };

  // Create Meeting Submit
  const handleCreateMeetingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTitle.trim()) {
      showToast('error', 'Please enter a meeting title', 'يرجى إدخال عنوان الاجتماع');
      return;
    }

    let assignedStudents = [...selectedStudentIds];
    // If group is selected, also add all students in that group
    if (selectedGroupId) {
      const g = groups.find((grp) => grp.id === selectedGroupId);
      if (g) {
        g.studentIds.forEach((sId) => {
          if (!assignedStudents.includes(sId)) assignedStudents.push(sId);
        });
      }
    }

    // Fallback if none selected
    if (assignedStudents.length === 0) {
      assignedStudents = allStudentsList.map((s) => s.id);
    }

    const selGroup = groups.find((g) => g.id === selectedGroupId);

    await createMeeting({
      title: meetingTitle,
      subject: meetingSubject,
      groupId: selectedGroupId || undefined,
      groupName: selGroup?.name,
      teacherId: currentUser?.id || 'teacher-1',
      teacherName: currentUser?.name || 'Ms. Sarah Mansour',
      assignedStudentIds: assignedStudents,
      startTime: meetingTime,
      durationMinutes: Number(meetingDuration),
      link: `https://learn.edu/live/${Date.now()}`
    });

    setShowMeetingModal(false);
    setMeetingTitle('');
    setSelectedStudentIds([]);
    setSelectedGroupId('');
  };

  // Edit Meeting Save
  const handleSaveEditMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMeeting) return;

    try {
      await updateDoc(doc(db, 'meetings', editMeeting.id), {
        title: editMeeting.title,
        subject: editMeeting.subject,
        startTime: editMeeting.startTime,
        durationMinutes: editMeeting.durationMinutes,
        assignedStudentIds: editMeeting.assignedStudentIds
      });
      showToast('success', 'Meeting updated in Firestore', 'تم تحديث البيانات بنجاح');
      setEditMeeting(null);
    } catch (err) {
      showToast('error', 'Failed to update meeting', 'حدث خطأ أثناء تحديث الاجتماع');
    }
  };

  // Create Group Submit
  const handleCreateGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      showToast('error', 'Please enter a group name', 'يرجى إدخال اسم المجموعة');
      return;
    }

    await createGroup({
      name: groupName,
      subject: groupSubject,
      teacherName: currentUser?.name || 'Ms. Sarah Mansour',
      studentIds: groupStudentIds,
      schedule: groupSchedule
    });

    // Also update assigned groupName on selected students
    for (const sId of groupStudentIds) {
      await assignStudentToGroup(sId, 'group_' + Date.now());
    }

    setShowGroupModal(false);
    setGroupName('');
    setGroupStudentIds([]);
  };

  // Edit Group Save
  const handleSaveEditGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editGroup) return;

    await updateGroup(editGroup);
    setEditGroup(null);
  };

  // Admin Create New User Submit (NO MANDATORY EMAIL, completely safe from undefined)
  const handleAdminCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserUsername.trim()) {
      showToast('error', 'Please enter display name and username', 'يرجى إدخال الاسم واسم المستخدم');
      return;
    }

    const newId = 'user_' + Date.now();
    const cleanUsername = newUserUsername.toLowerCase().trim();
    const newUser: User = {
      id: newId,
      name: newUserName.trim(),
      username: cleanUsername,
      password: newUserPassword || '123456',
      role: newUserRole,
      groupName: newUserGroup.trim() || '',
      email: newUserEmail.trim() || `${cleanUsername}@learn.academy`,
      scoreMath: 0,
      scoreArabic: 0,
      scoreEnglish: 0,
      levelMath: 'Beginner',
      levelArabic: 'Beginner',
      levelEnglish: 'Beginner'
    };

    await registerOrLoginUser(newUser);

    // If assigned to a group, update group document
    if (newUserGroup.trim()) {
      const g = groups.find((grp) => grp.name === newUserGroup.trim());
      if (g) {
        await assignStudentToGroup(newId, g.id);
      }
    }

    showToast('success', `New user "${newUserName}" created!`, `تم إنشاء حساب "${newUserName}" بنجاح!`);
    setShowCreateUserModal(false);
    setNewUserName('');
    setNewUserUsername('');
    setNewUserPassword('123456');
    setNewUserEmail('');
    setNewUserGroup('');
  };

  // Admin Full Edit User Submit
  const handleAdminSaveUserEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUserModalData) return;

    await updateUser(editUserModalData.id, editUserModalData);
    setEditUserModalData(null);
  };

  // Program Handlers
  const handleOpenCreateProgram = () => {
    setEditProgramData(null);
    setProgramForm({
      titleEn: '',
      titleAr: '',
      subject: 'Math',
      stage: 'Foundations & Primary',
      stageAr: 'المرحلة التأسيسية والابتدائية',
      ageRange: '5 - 12 Years',
      schedule: '2 Sessions / Week',
      sessionsCount: '16 Live Sessions',
      price: 'Free Trial Available',
      descriptionEn: '',
      descriptionAr: '',
      featuresEn: ['Interactive visual tools', 'Continuous diagnostic quizzes', 'Small group breakout sessions'],
      featuresAr: ['أدوات تفاعلية مرئية', 'اختبارات تشخيصية مستمرة', 'مجموعات صغيرة تفاعلية']
    });
    setShowProgramModal(true);
  };

  const handleOpenEditProgram = (prog: ProgramItem) => {
    setEditProgramData(prog);
    setProgramForm({
      titleEn: prog.titleEn,
      titleAr: prog.titleAr,
      subject: prog.subject,
      stage: prog.stage,
      stageAr: prog.stageAr,
      ageRange: prog.ageRange,
      schedule: prog.schedule,
      sessionsCount: prog.sessionsCount,
      price: prog.price,
      descriptionEn: prog.descriptionEn,
      descriptionAr: prog.descriptionAr,
      featuresEn: prog.featuresEn || [],
      featuresAr: prog.featuresAr || []
    });
    setShowProgramModal(true);
  };

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!programForm.titleEn.trim() || !programForm.titleAr.trim()) {
      showToast('error', 'Please enter program title in English and Arabic', 'يرجى كتابة عنوان البرنامج باللغتين');
      return;
    }

    if (editProgramData) {
      await updateProgram({
        ...programForm,
        id: editProgramData.id
      });
      showToast('success', 'Program updated successfully!', 'تم تحديث البرنامج بنجاح!');
    } else {
      await createProgram(programForm);
      showToast('success', 'New program created successfully!', 'تمت إضافة البرنامج بنجاح!');
    }

    setShowProgramModal(false);
    setEditProgramData(null);
  };

  // Inquiry Reply Handler
  const handleSendInquiryReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInquiryModalData || !inquiryReplyText.trim()) return;

    await replyToInquiry(
      replyInquiryModalData.id,
      inquiryReplyText.trim(),
      currentUser?.name || 'Learn Academy Admin'
    );
    showToast('success', 'Reply submitted to inquiry!', 'تم إرسال الرد على الاستفسار!');
    setReplyInquiryModalData(null);
    setInquiryReplyText('');
  };

  // Execute Deletion from HTML Confirm Modal
  const handleConfirmDeleteExecute = async () => {
    if (!confirmDeleteAction) return;
    const { type, id } = confirmDeleteAction;

    if (type === 'user') await deleteUser(id);
    if (type === 'meeting') await deleteMeeting(id);
    if (type === 'group') await deleteGroup(id);
    if (type === 'careerApp') await deleteCareerApp(id);
    if (type === 'program') await deleteProgram(id);
    if (type === 'inquiry') await deleteInquiry(id);

    setConfirmDeleteAction(null);
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      showToast('error', 'Please enter title and message', 'يرجى كتابة العنوان والرسالة');
      return;
    }
    await sendBroadcastNotification(broadcastTitle, broadcastMessage);
    setShowBroadcastModal(false);
    setBroadcastTitle('');
    setBroadcastMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden glow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-amber-300 text-xs font-black">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{currentUser ? `${currentUser.name} (${currentUser.role.toUpperCase()})` : 'Guest'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black">
              {language === 'ar' ? 'لوحة التحكم والمتابعة الأكاديمية' : 'Academic Dashboard'}
            </h1>

            <p className="text-sm text-indigo-100 max-w-xl">
              {isAdmin
                ? t.editEverythingAdmin
                : isStudent
                ? 'View your assigned student groups, live sessions, and test your subject levels'
                : 'Manage student learning groups, meetings, and academic progress'}
            </p>
          </div>

          {/* Role specific CTA */}
          {(isAdmin || isTeacher || isCoordinator) && (
            <div className="flex flex-wrap gap-3">
              {isAdmin && (
                <button
                  onClick={() => setShowBroadcastModal(true)}
                  className="px-5 py-3 rounded-2xl bg-purple-900/80 hover:bg-purple-900 border border-purple-400/30 text-amber-300 font-black text-sm shadow-xl flex items-center gap-2 transition-all glow-btn"
                >
                  <Bell className="w-5 h-5 text-amber-300" />
                  <span>Send Announcement</span>
                </button>
              )}

              <button
                onClick={() => setShowMeetingModal(true)}
                className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-xl flex items-center gap-2 transition-all glow-btn"
              >
                <Plus className="w-5 h-5" />
                <span>{t.createMeeting}</span>
              </button>

              <button
                onClick={() => setShowGroupModal(true)}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm shadow flex items-center gap-2 backdrop-blur-md transition-all glow-btn"
              >
                <Users className="w-5 h-5" />
                <span>Create Group</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* STUDENT SPECIFIC DASHBOARD VIEW */}
      {isStudent && (
        <div className="space-y-8">
          
          {/* Level Tests Section on Student Dashboard */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-purple-100 space-y-6 glow-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">{t.myResults}</h3>
                  <p className="text-xs text-slate-500">Subject Level Assessment Scores</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Math Level Status */}
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-amber-600" />
                    <span className="font-extrabold text-slate-800">{t.mathTest}</span>
                  </div>
                  <span className="text-xs font-black text-amber-700 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                    {currentUser.levelMath || 'Not Taken'}
                  </span>
                </div>
                <button
                  onClick={() => setActiveTestSubject('math')}
                  className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow transition-all glow-btn"
                >
                  {t.takeTestNow}
                </button>
              </div>

              {/* Arabic Level Status */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                    <span className="font-extrabold text-slate-800">{t.arabicTest}</span>
                  </div>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-200/80 px-2.5 py-0.5 rounded-full">
                    {currentUser.levelArabic || 'Not Taken'}
                  </span>
                </div>
                <button
                  onClick={() => setActiveTestSubject('arabic')}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs shadow transition-all glow-btn"
                >
                  {t.takeTestNow}
                </button>
              </div>

              {/* English Level Status */}
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Languages className="w-5 h-5 text-indigo-600" />
                    <span className="font-extrabold text-slate-800">{t.englishTest}</span>
                  </div>
                  <span className="text-xs font-black text-indigo-700 bg-indigo-200/80 px-2.5 py-0.5 rounded-full">
                    {currentUser.levelEnglish || 'Not Taken'}
                  </span>
                </div>
                <button
                  onClick={() => setActiveTestSubject('english')}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow transition-all glow-btn"
                >
                  {t.takeTestNow}
                </button>
              </div>
            </div>
          </div>

          {/* Assigned Student Groups */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-purple-100 space-y-6 glow-card">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Users className="w-6 h-6 text-indigo-600" />
                <span>My Assigned Groups</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentGroups.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 col-span-2">You are currently not assigned to any specific student group.</p>
              ) : (
                studentGroups.map((g) => (
                  <div key={g.id} className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-900 bg-indigo-200 px-2.5 py-0.5 rounded-full">{g.subject}</span>
                      <span className="text-xs text-slate-500">{g.schedule}</span>
                    </div>
                    <h4 className="text-base font-extrabold text-slate-800">{g.name}</h4>
                    <p className="text-xs text-slate-500">Instructor: {g.teacherName || 'Ms. Sarah Mansour'}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Student Assigned Live Meetings List */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-purple-100 space-y-6 glow-card">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Video className="w-6 h-6 text-purple-600" />
                <span>{t.upcomingMeetings} (Assigned to Me)</span>
              </h3>
            </div>

            <div className="space-y-4">
              {studentMeetings.length === 0 ? (
                <p className="text-sm text-slate-500 py-4 text-center">No assigned meetings scheduled for you right now.</p>
              ) : (
                studentMeetings.map((m) => (
                  <div
                    key={m.id}
                    className="p-6 rounded-2xl bg-purple-50/50 border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-purple-50 transition-all glow-card"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-200 text-purple-900">
                          {m.subject}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {m.startTime}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-800">{m.title}</h4>
                      <p className="text-xs text-slate-500">Teacher: {m.teacherName}</p>
                    </div>

                    <button
                      onClick={() => handleJoinMeeting(m)}
                      className={`px-6 py-3 rounded-2xl font-black text-sm shadow flex items-center gap-2 transition-all glow-btn ${
                        m.isTeacherInRoom
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-white animate-pulse'
                          : 'bg-purple-600 hover:bg-purple-500 text-white'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      <span>{t.joinMeeting}</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* ADMIN / TEACHER / COORDINATOR MANAGEMENT DASHBOARD */}
      {!isStudent && (
        <div className="space-y-6">
          
          {/* Navigation Sub-Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
            <div className="flex items-center gap-1 flex-wrap">
              <button
                onClick={() => setActiveTab('meetings')}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all glow-btn ${
                  activeTab === 'meetings'
                    ? 'bg-amber-400 text-slate-950 shadow'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {t.allMeetings} ({meetings.length})
              </button>

              <button
                onClick={() => setActiveTab('groups')}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all glow-btn ${
                  activeTab === 'groups'
                    ? 'bg-amber-400 text-slate-950 shadow'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {t.allGroups} ({groups.length})
              </button>

              <button
                onClick={() => setActiveTab('students')}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all glow-btn ${
                  activeTab === 'students'
                    ? 'bg-amber-400 text-slate-950 shadow'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {t.allStudents} ({allStudentsList.length})
              </button>

              {isAdmin && (
                <>
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all glow-btn ${
                      activeTab === 'users'
                        ? 'bg-amber-400 text-slate-950 shadow'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    User Accounts & Roles ({users.length})
                  </button>

                  <button
                    onClick={() => setActiveTab('programs')}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all glow-btn ${
                      activeTab === 'programs'
                        ? 'bg-amber-400 text-slate-950 shadow'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Programs & Curricula ({programs.length})
                  </button>

                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all glow-btn ${
                      activeTab === 'inquiries'
                        ? 'bg-amber-400 text-slate-950 shadow'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Inquiries & Hub ({inquiries.length})
                  </button>

                  <button
                    onClick={() => setActiveTab('careers')}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all glow-btn ${
                      activeTab === 'careers'
                        ? 'bg-amber-400 text-slate-950 shadow'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Job Applicants ({careerApps.length})
                  </button>
                </>
              )}
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:right-3 rtl:left-auto top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search items..."
                className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2 bg-white rounded-xl text-xs text-slate-800 font-semibold focus:outline-none shadow-sm"
              />
            </div>
          </div>

          {/* MEETINGS TAB */}
          {activeTab === 'meetings' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-100 space-y-4 glow-card">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-xl font-black text-slate-800">{t.allMeetings}</h3>
                <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  Admin & Teacher Meeting Controls
                </span>
              </div>

              <div className="space-y-4">
                {meetings
                  .filter((m) => m.title.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((m) => (
                    <div
                      key={m.id}
                      className="p-6 rounded-2xl bg-purple-50/40 border border-purple-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-purple-50 transition-all glow-card"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-900">
                            {m.subject}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              m.status === 'live'
                                ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {m.status.toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {m.startTime} ({m.durationMinutes} mins)
                          </span>
                        </div>
                        <h4 className="text-lg font-black text-slate-800">{m.title}</h4>
                        <p className="text-xs text-slate-500 font-medium">
                          Teacher: <strong className="text-slate-700">{m.teacherName}</strong> • Target Group: {m.groupName || 'Direct Students'} • Assigned Students: {m.assignedStudentIds?.length || 0}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleJoinMeeting(m)}
                          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow flex items-center gap-1.5 transition-all glow-btn"
                        >
                          <Video className="w-4 h-4" />
                          <span>Join / Preview</span>
                        </button>

                        {(isAdmin || isTeacher) && (
                          <button
                            onClick={() => toggleMeetingLiveStatus(m.id)}
                            className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all glow-btn ${
                              m.status === 'scheduled'
                                ? 'bg-emerald-500 hover:bg-emerald-400 text-white'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {m.status === 'scheduled' ? 'Start Live' : 'End Meeting'}
                          </button>
                        )}

                        {isAdmin && (
                          <>
                            <button
                              onClick={() => setEditMeeting(m)}
                              className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors"
                              title="Edit Meeting"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setConfirmDeleteAction({ type: 'meeting', id: m.id, title: m.title })}
                              className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                              title="Delete Meeting"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* GROUPS TAB */}
          {activeTab === 'groups' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-100 space-y-4 glow-card">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-xl font-black text-slate-800">{t.allGroups}</h3>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  Group & Student Allocations
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groups
                  .filter((g) => g.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((g) => (
                    <div
                      key={g.id}
                      className="p-6 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-3 hover:bg-indigo-50 transition-all glow-card"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-200 text-indigo-900">
                          {g.subject}
                        </span>
                        {isAdmin && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditGroup(g)}
                              className="text-indigo-600 hover:text-indigo-800 p-1"
                              title="Edit Group"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteAction({ type: 'group', id: g.id, title: g.name })}
                              className="text-rose-500 hover:text-rose-700 p-1"
                              title="Delete Group"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      <h4 className="text-lg font-extrabold text-slate-800">{g.name}</h4>
                      <p className="text-xs text-slate-500">
                        Schedule: <strong className="text-slate-700">{g.schedule}</strong>
                      </p>
                      <p className="text-xs text-slate-500">
                        Teacher: <strong className="text-slate-700">{g.teacherName}</strong>
                      </p>

                      <div className="pt-2 border-t border-indigo-100/80">
                        <span className="text-xs font-bold text-slate-600 block mb-1">
                          Enrolled Students ({g.studentIds?.length || 0}):
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {g.studentIds?.map((sId) => {
                            const studentObj = users.find((u) => u.id === sId);
                            return (
                              <span key={sId} className="px-2 py-0.5 rounded-md bg-white border border-indigo-100 text-[11px] font-semibold text-slate-700">
                                {studentObj ? studentObj.name : sId}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* STUDENTS TAB */}
          {activeTab === 'students' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-100 space-y-4 glow-card">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-xl font-black text-slate-800">{t.allStudents}</h3>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  Student Levels & Group Assignment
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left rtl:text-right text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                      <th className="py-3 px-3">Student Name</th>
                      <th className="py-3 px-3">Math Level</th>
                      <th className="py-3 px-3">Arabic Level</th>
                      <th className="py-3 px-3">English Level</th>
                      <th className="py-3 px-3">Assigned Group</th>
                      {isAdmin && <th className="py-3 px-3">Quick Assign</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {allStudentsList
                      .filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-3 font-bold text-slate-900">{s.name}</td>
                          <td className="py-3.5 px-3 text-amber-700">{s.levelMath || 'Not Taken'}</td>
                          <td className="py-3.5 px-3 text-emerald-700">{s.levelArabic || 'Not Taken'}</td>
                          <td className="py-3.5 px-3 text-indigo-700">{s.levelEnglish || 'Not Taken'}</td>
                          <td className="py-3.5 px-3">{s.groupName || 'Unassigned'}</td>
                          {isAdmin && (
                            <td className="py-3.5 px-3">
                              <select
                                onChange={(e) => assignStudentToGroup(s.id, e.target.value)}
                                defaultValue=""
                                className="bg-slate-100 border border-slate-200 rounded-lg text-xs py-1 px-2 font-bold focus:outline-none"
                              >
                                <option value="" disabled>
                                  Assign to Group...
                                </option>
                                {groups.map((g) => (
                                  <option key={g.id} value={g.id}>
                                    {g.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* USER ACCOUNTS & ROLES TAB (Admin only) */}
          {activeTab === 'users' && isAdmin && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-100 space-y-6 glow-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-800">System User Accounts Directory</h3>
                  <p className="text-xs text-slate-500">Create, Edit, or Delete any user account document in Firestore</p>
                </div>

                <button
                  onClick={() => setShowCreateUserModal(true)}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow flex items-center gap-2 transition-all glow-btn"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Create New Account</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left rtl:text-right text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                      <th className="py-3 px-3">Username</th>
                      <th className="py-3 px-3">Display Name</th>
                      <th className="py-3 px-3">Role</th>
                      <th className="py-3 px-3">Assigned Group</th>
                      <th className="py-3 px-3">Password</th>
                      <th className="py-3 px-3 text-right rtl:text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {users
                      .filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.username?.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-3 font-mono font-bold text-slate-800">{u.username || u.id}</td>
                          <td className="py-3.5 px-3 font-extrabold text-slate-900">{u.name}</td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                              u.role === 'admin'
                                ? 'bg-purple-100 text-purple-900'
                                : u.role === 'teacher'
                                ? 'bg-indigo-100 text-indigo-900'
                                : u.role === 'coordinator'
                                ? 'bg-sky-100 text-sky-900'
                                : 'bg-amber-100 text-amber-900'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-3">{u.groupName || 'None'}</td>
                          <td className="py-3.5 px-3 font-mono text-xs text-slate-500">{u.password || '••••••'}</td>
                          <td className="py-3.5 px-3 text-right rtl:text-left flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditUserModalData({ ...u })}
                              className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors"
                              title="Edit User Full Details"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setConfirmDeleteAction({ type: 'user', id: u.id, title: u.name })}
                              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                              title="Delete Account Document"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CAREER APPLICANTS TAB (Admin only) */}
          {activeTab === 'careers' && isAdmin && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-100 space-y-4 glow-card">
              <h3 className="text-xl font-black text-slate-800">Submitted Applications & /ads Registrations</h3>
              {careerApps.length === 0 ? (
                <p className="text-sm text-slate-500 py-4">No applications submitted yet.</p>
              ) : (
                <div className="space-y-3">
                  {careerApps.map((app) => (
                    <div key={app.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-800 text-base">{app.fullName}</span>
                          <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2.5 py-0.5 rounded-full">
                            {app.positionTitle}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={app.status}
                            onChange={(e) => updateCareerAppStatus(app.id, e.target.value as any)}
                            className="bg-white border border-slate-200 rounded-xl text-xs py-1.5 px-3 font-bold text-slate-700"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                          </select>

                          <button
                            onClick={() => setConfirmDeleteAction({ type: 'careerApp', id: app.id, title: app.fullName })}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                            title="Delete Application"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600">
                        Email: <strong>{app.email}</strong> • Phone: <strong>{app.phone}</strong> • Info: <strong>{app.yearsExperience}</strong>
                      </p>

                      <p className="text-xs text-slate-600 italic bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                        "{app.coverLetter}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROGRAMS & CURRICULA TAB (Admin only: Edit, Add, Delete Everything) */}
          {activeTab === 'programs' && isAdmin && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-100 space-y-6 glow-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <Layers className="w-6 h-6 text-purple-600" />
                    <span>Academic Programs & Curricula Management</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage, edit, add, or delete programs live on the home page and across the entire platform.
                  </p>
                </div>
                <button
                  onClick={handleOpenCreateProgram}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-md hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center gap-2 glow-btn"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Program</span>
                </button>
              </div>

              {programs.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                  <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-600">No programs registered in Firestore yet.</p>
                  <button
                    onClick={handleOpenCreateProgram}
                    className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold"
                  >
                    Create First Program
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {programs
                    .filter((p) =>
                      searchTerm
                        ? p.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.titleAr.includes(searchTerm) ||
                          p.subject.toLowerCase().includes(searchTerm.toLowerCase())
                        : true
                    )
                    .map((prog) => {
                      const subjectBadge =
                        prog.subject === 'Math'
                          ? { bg: 'bg-amber-100 text-amber-800 border-amber-200', icon: Calculator }
                          : prog.subject === 'Arabic'
                          ? { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: BookOpen }
                          : { bg: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: Languages };
                      const IconComp = subjectBadge.icon;

                      return (
                        <div
                          key={prog.id}
                          className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-all space-y-4"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${subjectBadge.bg}`}
                              >
                                <IconComp className="w-3.5 h-3.5" />
                                <span>{prog.subject}</span>
                              </span>
                              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                                {prog.price || 'Free Trial'}
                              </span>
                            </div>

                            <div>
                              <h4 className="text-base font-black text-slate-900 leading-snug">{prog.titleEn}</h4>
                              <p className="text-xs font-bold text-purple-600 font-cairo mt-0.5">{prog.titleAr}</p>
                            </div>

                            <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                              <span className="bg-white px-2 py-1 rounded-md border border-slate-200 font-semibold">
                                Stage: {prog.stage}
                              </span>
                              <span className="bg-white px-2 py-1 rounded-md border border-slate-200 font-semibold">
                                Ages: {prog.ageRange}
                              </span>
                              <span className="bg-white px-2 py-1 rounded-md border border-slate-200 font-semibold">
                                {prog.schedule}
                              </span>
                              <span className="bg-white px-2 py-1 rounded-md border border-slate-200 font-semibold">
                                {prog.sessionsCount}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                              {prog.descriptionEn}
                            </p>

                            {prog.featuresEn && prog.featuresEn.length > 0 && (
                              <div className="space-y-1 pt-1 border-t border-slate-200/60">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                  Features ({prog.featuresEn.length})
                                </span>
                                <ul className="text-xs text-slate-600 space-y-0.5 list-disc list-inside">
                                  {prog.featuresEn.slice(0, 3).map((f, i) => (
                                    <li key={i} className="truncate">{f}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                            <button
                              onClick={() => handleOpenEditProgram(prog)}
                              className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() =>
                                setConfirmDeleteAction({
                                  type: 'program',
                                  id: prog.id,
                                  title: `${prog.titleEn} (${prog.subject})`
                                })
                              }
                              className="p-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors"
                              title="Delete Program"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* INQUIRIES & COMMUNICATION HUB TAB (Admin only) */}
          {activeTab === 'inquiries' && isAdmin && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-100 space-y-6 glow-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                    <span>Inquiries & Communication Hub Center</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage and respond directly to messages sent via /ask/* and /talk/* channels.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => navigate('/ask/admin')}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200"
                  >
                    View /ask/admin
                  </button>
                  <button
                    onClick={() => navigate('/talk/student')}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200"
                  >
                    View /talk/student
                  </button>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInquiryFilterStatus('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    inquiryFilterStatus === 'all'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({inquiries.length})
                </button>
                <button
                  onClick={() => setInquiryFilterStatus('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    inquiryFilterStatus === 'pending'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Pending ({inquiries.filter((i) => i.status === 'pending').length})
                </button>
                <button
                  onClick={() => setInquiryFilterStatus('answered')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    inquiryFilterStatus === 'answered'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Answered ({inquiries.filter((i) => i.status === 'answered').length})
                </button>
              </div>

              {/* Inquiries List */}
              {inquiries.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                  <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-600">No inquiries received yet.</p>
                  <p className="text-xs text-slate-400">Inquiries submitted on /ask/* and /talk/* routes appear here in real time.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries
                    .filter((inq) => {
                      if (inquiryFilterStatus === 'pending') return inq.status === 'pending';
                      if (inquiryFilterStatus === 'answered') return inq.status === 'answered';
                      return true;
                    })
                    .filter((inq) => {
                      if (!searchTerm) return true;
                      const s = searchTerm.toLowerCase();
                      return (
                        inq.senderName.toLowerCase().includes(s) ||
                        (inq.subject && inq.subject.toLowerCase().includes(s)) ||
                        inq.content.toLowerCase().includes(s) ||
                        inq.channel.toLowerCase().includes(s)
                      );
                    })
                    .map((inq) => (
                      <div
                        key={inq.id}
                        className={`p-5 rounded-2xl border transition-all space-y-3 ${
                          inq.status === 'answered'
                            ? 'bg-slate-50/70 border-slate-200'
                            : 'bg-amber-50/40 border-amber-200/80 shadow-sm'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-slate-900 text-base">{inq.senderName}</span>
                            <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2.5 py-0.5 rounded-full">
                              /{inq.channel}
                            </span>
                            <span className="text-xs bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded-md capitalize">
                              {inq.senderRole}
                            </span>
                            <span
                              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                inq.status === 'answered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-900 animate-pulse'
                              }`}
                            >
                              {inq.status === 'answered' ? '✓ Answered' : '● Pending Response'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setReplyInquiryModalData(inq);
                                setInquiryReplyText(inq.reply || '');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all glow-btn"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>{inq.status === 'answered' ? 'Edit Reply' : 'Reply'}</span>
                            </button>

                            <button
                              onClick={() =>
                                setConfirmDeleteAction({
                                  type: 'inquiry',
                                  id: inq.id,
                                  title: `${inq.senderName} - ${inq.subject || 'Inquiry'}`
                                })
                              }
                              className="p-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors"
                              title="Delete Inquiry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-semibold">
                          {inq.senderPhone && <span>Phone: <strong className="text-slate-700">{inq.senderPhone}</strong></span>}
                          <span>Submitted: <strong className="text-slate-700">{inq.timestamp || new Date(inq.createdAt).toLocaleString()}</strong></span>
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                          {inq.subject && <p className="text-xs font-bold text-purple-900">{inq.subject}</p>}
                          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{inq.content}</p>
                        </div>

                        {inq.status === 'answered' && inq.reply && (
                          <div className="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200 space-y-1">
                            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800">
                              <span>Official Response (by {inq.repliedBy || 'Admin'})</span>
                              {inq.repliedAt && (
                                <span className="font-normal text-emerald-700">
                                  {inq.repliedAt}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-emerald-950 font-medium leading-relaxed whitespace-pre-wrap">
                              {inq.reply}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* ADMIN CREATE USER MODAL */}
      {showCreateUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 border border-purple-100 glow-card">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-2xl font-black text-slate-800">Create New Account</h3>
              <button onClick={() => setShowCreateUserModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdminCreateUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Display Name *</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Adam Youssef"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    value={newUserUsername}
                    onChange={(e) => setNewUserUsername(e.target.value)}
                    placeholder="e.g. adam123"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Password *</label>
                  <input
                    type="text"
                    required
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="e.g. 123456"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none capitalize"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="coordinator">Coordinator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Assigned Group</label>
                  <select
                    value={newUserGroup}
                    onChange={(e) => setNewUserGroup(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                  >
                    <option value="">None / Unassigned</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.name}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Email (Optional - No Email Required)</label>
                <input
                  type="text"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="Optional: leave empty if user has no email"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow transition-all glow-btn"
                >
                  Save New Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN EDIT USER FULL MODAL */}
      {editUserModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 border border-purple-100 glow-card max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-2xl font-black text-slate-800">Edit User Profile ({editUserModalData.name})</h3>
              <button onClick={() => setEditUserModalData(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdminSaveUserEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editUserModalData.name}
                  onChange={(e) => setEditUserModalData({ ...editUserModalData, name: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Username</label>
                  <input
                    type="text"
                    value={editUserModalData.username}
                    onChange={(e) => setEditUserModalData({ ...editUserModalData, username: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Password</label>
                  <input
                    type="text"
                    value={editUserModalData.password || ''}
                    onChange={(e) => setEditUserModalData({ ...editUserModalData, password: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Role</label>
                  <select
                    value={editUserModalData.role}
                    onChange={(e) => setEditUserModalData({ ...editUserModalData, role: e.target.value as any })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold capitalize"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="coordinator">Coordinator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Assigned Group</label>
                  <input
                    type="text"
                    value={editUserModalData.groupName || ''}
                    onChange={(e) => setEditUserModalData({ ...editUserModalData, groupName: e.target.value })}
                    placeholder="e.g. Group A - Beginners"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Subject Levels & Scores</span>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-amber-700 mb-1">Math Level</label>
                    <input
                      type="text"
                      value={editUserModalData.levelMath || ''}
                      onChange={(e) => setEditUserModalData({ ...editUserModalData, levelMath: e.target.value })}
                      placeholder="e.g. Advanced"
                      className="w-full p-2 bg-amber-50/50 border border-amber-200 rounded-lg text-xs font-bold text-amber-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-emerald-700 mb-1">Arabic Level</label>
                    <input
                      type="text"
                      value={editUserModalData.levelArabic || ''}
                      onChange={(e) => setEditUserModalData({ ...editUserModalData, levelArabic: e.target.value })}
                      placeholder="e.g. Intermediate"
                      className="w-full p-2 bg-emerald-50/50 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-indigo-700 mb-1">English Level</label>
                    <input
                      type="text"
                      value={editUserModalData.levelEnglish || ''}
                      onChange={(e) => setEditUserModalData({ ...editUserModalData, levelEnglish: e.target.value })}
                      placeholder="e.g. Beginner"
                      className="w-full p-2 bg-indigo-50/50 border border-indigo-200 rounded-lg text-xs font-bold text-indigo-900"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditUserModalData(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow transition-all glow-btn"
                >
                  Save User Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE MEETING MODAL */}
      {showMeetingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 border border-purple-100 glow-card max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-black text-slate-800">{t.createMeeting}</h3>

            <form onSubmit={handleCreateMeetingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{t.meetingTitle}</label>
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="e.g. Geometry Essentials & Algebra Practice"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{t.subject}</label>
                  <select
                    value={meetingSubject}
                    onChange={(e) => setMeetingSubject(e.target.value as any)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                  >
                    <option value="Math">Math (الرياضيات)</option>
                    <option value="Arabic">Arabic (اللغة العربية)</option>
                    <option value="English">English (اللغة الإنجليزية)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Target Group</label>
                  <select
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                  >
                    <option value="">All / Select Group...</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} ({g.subject})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Assign Specific Students</label>
                <div className="max-h-32 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  {allStudentsList.map((s) => (
                    <label key={s.id} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.includes(s.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedStudentIds([...selectedStudentIds, s.id]);
                          else setSelectedStudentIds(selectedStudentIds.filter((id) => id !== s.id));
                        }}
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                      <span>{s.name} ({s.groupName || 'Unassigned'})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{t.time}</label>
                <input
                  type="text"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  placeholder="e.g. Today, 4:00 PM"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowMeetingModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow transition-all glow-btn"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEETING MODAL */}
      {editMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 border border-purple-100 glow-card">
            <h3 className="text-2xl font-black text-slate-800">Edit Meeting Details</h3>

            <form onSubmit={handleSaveEditMeeting} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Title</label>
                <input
                  type="text"
                  value={editMeeting.title}
                  onChange={(e) => setEditMeeting({ ...editMeeting, title: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Subject</label>
                  <select
                    value={editMeeting.subject}
                    onChange={(e) => setEditMeeting({ ...editMeeting, subject: e.target.value as any })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                  >
                    <option value="Math">Math</option>
                    <option value="Arabic">Arabic</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={editMeeting.startTime}
                    onChange={(e) => setEditMeeting({ ...editMeeting, startTime: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditMeeting(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow transition-all glow-btn"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE GROUP MODAL */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 border border-purple-100 glow-card max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-black text-slate-800">Create New Student Group</h3>

            <form onSubmit={handleCreateGroupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Group Name</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Group C - English Champions"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Subject</label>
                <select
                  value={groupSubject}
                  onChange={(e) => setGroupSubject(e.target.value as any)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                >
                  <option value="Math">Math</option>
                  <option value="Arabic">Arabic</option>
                  <option value="English">English</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Assign Students to Group</label>
                <div className="max-h-36 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  {allStudentsList.map((s) => (
                    <label key={s.id} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={groupStudentIds.includes(s.id)}
                        onChange={(e) => {
                          if (e.target.checked) setGroupStudentIds([...groupStudentIds, s.id]);
                          else setGroupStudentIds(groupStudentIds.filter((id) => id !== s.id));
                        }}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{s.name} ({s.groupName || 'Unassigned'})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Schedule</label>
                <input
                  type="text"
                  value={groupSchedule}
                  onChange={(e) => setGroupSchedule(e.target.value)}
                  placeholder="e.g. Mon & Wed 4:00 PM"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowGroupModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow transition-all glow-btn"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT GROUP MODAL */}
      {editGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 border border-purple-100 glow-card max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-black text-slate-800">Edit Group ({editGroup.name})</h3>

            <form onSubmit={handleSaveEditGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Group Name</label>
                <input
                  type="text"
                  value={editGroup.name}
                  onChange={(e) => setEditGroup({ ...editGroup, name: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Schedule</label>
                <input
                  type="text"
                  value={editGroup.schedule}
                  onChange={(e) => setEditGroup({ ...editGroup, schedule: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Enrolled Students</label>
                <div className="max-h-36 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  {allStudentsList.map((s) => (
                    <label key={s.id} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editGroup.studentIds.includes(s.id)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...editGroup.studentIds, s.id]
                            : editGroup.studentIds.filter((id) => id !== s.id);
                          setEditGroup({ ...editGroup, studentIds: updated });
                        }}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{s.name} ({s.groupName || 'Unassigned'})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditGroup(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow transition-all glow-btn"
                >
                  Save Group Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BROADCAST ANNOUNCEMENT MODAL */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 border border-purple-100 glow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-black text-slate-800">Send Global Announcement</h3>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Announcement Title</label>
                <input
                  type="text"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. Midterm Schedule Announcement"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Announcement Message</label>
                <textarea
                  rows={4}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="e.g. Please check your assigned groups for updated live sessions starting this Sunday."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-purple-600 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow transition-all glow-btn"
                >
                  Broadcast Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROGRAM CREATE / EDIT MODAL (Admin only: Edit everything) */}
      {showProgramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 border border-purple-100 glow-card max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                <h3 className="text-xl font-black text-slate-800">
                  {editProgramData ? 'Edit Academic Program' : 'Create New Academic Program'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowProgramModal(false);
                  setEditProgramData(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={programForm.titleEn}
                    onChange={(e) => setProgramForm({ ...programForm, titleEn: e.target.value })}
                    placeholder="e.g. Mental Math & Problem Solving"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Title (Arabic) *</label>
                  <input
                    type="text"
                    required
                    value={programForm.titleAr}
                    onChange={(e) => setProgramForm({ ...programForm, titleAr: e.target.value })}
                    placeholder="مثال: برنامج الحساب الذهني وحل المشكلات"
                    dir="rtl"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Subject *</label>
                  <select
                    value={programForm.subject}
                    onChange={(e) => setProgramForm({ ...programForm, subject: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                  >
                    <option value="Math">Math (الرياضيات)</option>
                    <option value="Arabic">Arabic (اللغة العربية)</option>
                    <option value="English">English (اللغة الإنجليزية)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Target Ages</label>
                  <input
                    type="text"
                    value={programForm.ageRange}
                    onChange={(e) => setProgramForm({ ...programForm, ageRange: e.target.value })}
                    placeholder="e.g. 5 - 12 Years"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Price Tag</label>
                  <input
                    type="text"
                    value={programForm.price}
                    onChange={(e) => setProgramForm({ ...programForm, price: e.target.value })}
                    placeholder="e.g. Free Trial Available"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Stage (English)</label>
                  <input
                    type="text"
                    value={programForm.stage}
                    onChange={(e) => setProgramForm({ ...programForm, stage: e.target.value })}
                    placeholder="e.g. Primary & Preparatory"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Stage (Arabic)</label>
                  <input
                    type="text"
                    value={programForm.stageAr}
                    onChange={(e) => setProgramForm({ ...programForm, stageAr: e.target.value })}
                    placeholder="مثال: المرحلة الابتدائية والإعدادية"
                    dir="rtl"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Schedule</label>
                  <input
                    type="text"
                    value={programForm.schedule}
                    onChange={(e) => setProgramForm({ ...programForm, schedule: e.target.value })}
                    placeholder="e.g. 2 Sessions / Week"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Total Sessions</label>
                  <input
                    type="text"
                    value={programForm.sessionsCount}
                    onChange={(e) => setProgramForm({ ...programForm, sessionsCount: e.target.value })}
                    placeholder="e.g. 16 Live Sessions"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Description (English)</label>
                  <textarea
                    rows={3}
                    value={programForm.descriptionEn}
                    onChange={(e) => setProgramForm({ ...programForm, descriptionEn: e.target.value })}
                    placeholder="Detailed overview in English..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-600 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Description (Arabic)</label>
                  <textarea
                    rows={3}
                    value={programForm.descriptionAr}
                    onChange={(e) => setProgramForm({ ...programForm, descriptionAr: e.target.value })}
                    placeholder="وصف تفصيلي باللغة العربية..."
                    dir="rtl"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-600 resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Features (English - one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={(programForm.featuresEn || []).join('\n')}
                    onChange={(e) =>
                      setProgramForm({
                        ...programForm,
                        featuresEn: e.target.value.split('\n').filter((x) => x.trim())
                      })
                    }
                    placeholder="Interactive live whiteboard&#10;Weekly homework follow-up&#10;Monthly diagnostic exam"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Features (Arabic - one per line)
                  </label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    value={(programForm.featuresAr || []).join('\n')}
                    onChange={(e) =>
                      setProgramForm({
                        ...programForm,
                        featuresAr: e.target.value.split('\n').filter((x) => x.trim())
                      })
                    }
                    placeholder="سبورة تفاعلية ذكية&#10;متابعة الواجبات أسبوعياً&#10;اختبارات تشخيص دورية"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowProgramModal(false);
                    setEditProgramData(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow transition-all glow-btn"
                >
                  {editProgramData ? 'Update Program' : 'Publish Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INQUIRY OFFICIAL REPLY MODAL */}
      {replyInquiryModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 border border-purple-100 glow-card">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <h3 className="text-xl font-black text-slate-800">Reply to Inquiry</h3>
              </div>
              <button
                onClick={() => setReplyInquiryModalData(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-800">{replyInquiryModalData.senderName}</span>
                <span className="bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-md">
                  /{replyInquiryModalData.channel}
                </span>
              </div>
              <p className="font-bold text-purple-900">{replyInquiryModalData.subject}</p>
              <p className="text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-200/80">
                "{replyInquiryModalData.content}"
              </p>
            </div>

            <form onSubmit={handleSendInquiryReply} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Official Response (Will be recorded in Firestore)
                </label>
                <textarea
                  rows={4}
                  required
                  value={inquiryReplyText}
                  onChange={(e) => setInquiryReplyText(e.target.value)}
                  placeholder="Type your official answer/response here..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-600 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyInquiryModalData(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow transition-all flex items-center gap-2 glow-btn"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Reply</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HTML PURE CONFIRMATION MODAL (No browser confirm/prompt) */}
      {confirmDeleteAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-center border border-rose-100">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">Confirm Firestore Deletion</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to permanently delete <strong>"{confirmDeleteAction.title}"</strong> from the Firestore database?
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setConfirmDeleteAction(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteExecute}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow transition-all glow-btn"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
