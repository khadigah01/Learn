import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, cleanFirestoreData } from '../lib/firebase';
import {
  User,
  StudentGroup,
  LiveMeeting,
  NotificationItem,
  CareerApplication,
  ToastMessage,
  Language,
  SubjectType,
  InquiryMessage,
  ProgramItem
} from '../types';
import { initialProgramsData } from '../data/programsData';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  groups: StudentGroup[];
  meetings: LiveMeeting[];
  notifications: NotificationItem[];
  careerApps: CareerApplication[];
  inquiries: InquiryMessage[];
  programs: ProgramItem[];
  toasts: ToastMessage[];
  showToast: (type: 'success' | 'error' | 'info', messageEn: string, messageAr?: string) => void;
  removeToast: (id: string) => void;
  
  // Account & User Actions
  registerOrLoginUser: (user: User) => Promise<User>;
  updateUser: (userId: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;

  // Meeting actions
  createMeeting: (newMeeting: Omit<LiveMeeting, 'id' | 'status'>) => Promise<string>;
  toggleMeetingLiveStatus: (meetingId: string) => Promise<void>;
  deleteMeeting: (meetingId: string) => Promise<void>;
  
  // Group actions
  createGroup: (group: Omit<StudentGroup, 'id'>) => Promise<void>;
  updateGroup: (group: StudentGroup) => Promise<void>;
  deleteGroup: (groupId: string) => Promise<void>;
  
  // Student & Test actions
  updateStudentLevel: (userId: string, subject: SubjectType, score: number, level: string) => Promise<void>;
  assignStudentToGroup: (studentId: string, groupId: string) => Promise<void>;
  
  // Career Apps Actions
  submitCareerApp: (app: Omit<CareerApplication, 'id' | 'appliedAt' | 'status'>) => Promise<void>;
  updateCareerAppStatus: (appId: string, status: CareerApplication['status']) => Promise<void>;
  deleteCareerApp: (appId: string) => Promise<void>;

  // Inquiries / Communication Hub Actions (/ask/* & /talk/*)
  submitInquiry: (data: Omit<InquiryMessage, 'id' | 'createdAt' | 'status'>) => Promise<string>;
  replyToInquiry: (id: string, replyText: string, replierName: string) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;

  // Programs / Curriculum CRUD (Admin)
  createProgram: (prog: Omit<ProgramItem, 'id'>) => Promise<void>;
  updateProgram: (prog: ProgramItem) => Promise<void>;
  deleteProgram: (id: string) => Promise<void>;

  // Notifications Actions
  markAllNotificationsRead: () => Promise<void>;
  deleteNotification: (notifId: string) => Promise<void>;
  sendBroadcastNotification: (titleEn: string, messageEn: string, titleAr?: string, messageAr?: string) => Promise<void>;

  // Navigation / Modal States
  activeTestSubject: SubjectType | null;
  setActiveTestSubject: (subj: SubjectType | null) => void;
  activeMeetingRoom: LiveMeeting | null;
  setActiveMeetingRoom: (meeting: LiveMeeting | null) => void;
  
  // Route Navigation Helper
  currentPath: string;
  navigate: (path: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('learn_lang') as Language) || 'en';
  });
  
  // By default, currentUser is null so user must log in explicitly
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<StudentGroup[]>([]);
  const [meetings, setMeetings] = useState<LiveMeeting[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [careerApps, setCareerApps] = useState<CareerApplication[]>([]);
  const [inquiries, setInquiries] = useState<InquiryMessage[]>([]);
  const [programs, setPrograms] = useState<ProgramItem[]>(initialProgramsData);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeTestSubject, setActiveTestSubject] = useState<SubjectType | null>(null);
  const [activeMeetingRoom, setActiveMeetingRoom] = useState<LiveMeeting | null>(null);

  // Client-side routing state supporting Hash routing, GitHub Pages subpaths, and direct paths
  const getNormalizedPath = () => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('p')) {
      const p = searchParams.get('p')!;
      return p.startsWith('/') ? p : '/' + p;
    }
    if (window.location.hash) {
      const hashPath = window.location.hash.replace(/^#/, '');
      if (hashPath) return hashPath.startsWith('/') ? hashPath : '/' + hashPath;
    }
    const rawPath = window.location.pathname || '/';
    const knownRoutes = [
      '/ask/admin',
      '/ask/teacher',
      '/ask/student',
      '/talk/admin',
      '/talk/teacher',
      '/talk/student',
      '/ads',
      '/register',
      '/login',
      '/login/student',
      '/login/teacher',
      '/login/coordinator',
      '/login/admin',
      '/dashboard',
      '/games',
      '/careers',
      '/notifications'
    ];
    for (const route of knownRoutes) {
      if (rawPath.endsWith(route)) {
        return route;
      }
    }
    if (rawPath.includes('/meeting/')) {
      const idx = rawPath.indexOf('/meeting/');
      return rawPath.substring(idx);
    }
    return rawPath;
  };

  const [currentPath, setCurrentPath] = useState<string>(getNormalizedPath);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getNormalizedPath());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (path: string) => {
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    if (window.location.hash) {
      window.location.hash = '#' + cleanPath;
    } else {
      window.history.pushState({}, '', cleanPath);
    }
    setCurrentPath(cleanPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('learn_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('learn_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('learn_user');
    }
  }, [currentUser]);

  // Real-time Firestore Listeners
  useEffect(() => {
    // 1. Users listener - Only admin account is real by default
    const unsubUsers = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const defaultAdmin: User = {
          id: 'admin',
          username: 'admin',
          password: 'admin',
          name: 'System Administrator',
          role: 'admin',
          groupName: '',
          scoreMath: 0,
          scoreArabic: 0,
          scoreEnglish: 0
        };

        if (snapshot.empty) {
          setDoc(doc(db, 'users', 'admin'), defaultAdmin);
          setUsers([defaultAdmin]);
        } else {
          const uList: User[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as User;
            // Purge legacy mock accounts if they match the old hardcoded demo credentials
            if (
              (docSnap.id === 'teacher' && data.name === 'Sarah Johnson' && data.password === 'teacher') ||
              (docSnap.id === 'coordinator' && data.name === 'Academic Coordinator' && data.password === 'coordinator') ||
              (docSnap.id === 'student' && data.name === 'Ahmed Hassan' && data.password === 'student')
            ) {
              deleteDoc(doc(db, 'users', docSnap.id)).catch(() => {});
              return;
            }
            uList.push({ ...data, id: docSnap.id });
          });

          // Ensure default system admin document is synced to Firestore
          const hasAdmin = uList.some((u) => u.username === 'admin' || u.role === 'admin' || u.id === 'admin');
          if (!hasAdmin) {
            setDoc(doc(db, 'users', 'admin'), defaultAdmin);
            uList.push(defaultAdmin);
          }
          setUsers(uList);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'users');
      }
    );

    // 2. Groups listener
    const unsubGroups = onSnapshot(
      collection(db, 'groups'),
      (snapshot) => {
        const gList: StudentGroup[] = [];
        snapshot.forEach((docSnap) => {
          gList.push({ id: docSnap.id, ...docSnap.data() } as StudentGroup);
        });
        setGroups(gList);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'groups');
      }
    );

    // 3. Meetings listener
    const unsubMeetings = onSnapshot(
      collection(db, 'meetings'),
      (snapshot) => {
        const mList: LiveMeeting[] = [];
        snapshot.forEach((docSnap) => {
          mList.push({ id: docSnap.id, ...docSnap.data() } as LiveMeeting);
        });
        setMeetings(mList);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'meetings');
      }
    );

    // 4. Notifications listener
    const unsubNotifs = onSnapshot(
      collection(db, 'notifications'),
      (snapshot) => {
        const nList: NotificationItem[] = [];
        snapshot.forEach((docSnap) => {
          nList.push({ id: docSnap.id, ...docSnap.data() } as NotificationItem);
        });
        setNotifications(nList);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'notifications');
      }
    );

    // 5. Career Applications listener
    const unsubCareer = onSnapshot(
      collection(db, 'careerApps'),
      (snapshot) => {
        const cList: CareerApplication[] = [];
        snapshot.forEach((docSnap) => {
          cList.push({ id: docSnap.id, ...docSnap.data() } as CareerApplication);
        });
        setCareerApps(cList);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'careerApps');
      }
    );

    // 6. Inquiries / Communication messages listener
    const unsubInquiries = onSnapshot(
      collection(db, 'inquiries'),
      (snapshot) => {
        const iList: InquiryMessage[] = [];
        snapshot.forEach((docSnap) => {
          iList.push({ id: docSnap.id, ...docSnap.data() } as InquiryMessage);
        });
        // Sort descending by createdAt
        iList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setInquiries(iList);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'inquiries');
      }
    );

    // 7. Programs listener
    const unsubPrograms = onSnapshot(
      collection(db, 'programs'),
      (snapshot) => {
        if (snapshot.empty) {
          initialProgramsData.forEach((p) => {
            setDoc(doc(db, 'programs', p.id), cleanFirestoreData(p));
          });
          setPrograms(initialProgramsData);
        } else {
          const pList: ProgramItem[] = [];
          snapshot.forEach((docSnap) => {
            pList.push({ id: docSnap.id, ...docSnap.data() } as ProgramItem);
          });
          setPrograms(pList);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'programs');
      }
    );

    return () => {
      unsubUsers();
      unsubGroups();
      unsubMeetings();
      unsubNotifs();
      unsubCareer();
      unsubInquiries();
      unsubPrograms();
    };
  }, []);

  const showToast = (type: 'success' | 'error' | 'info', messageEn: string, messageAr?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const msg = language === 'ar' && messageAr ? messageAr : messageEn;
    setToasts((prev) => [...prev, { id, type, message: msg, messageAr }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Register or Login user in Firestore - FULL SANITIZATION (NO undefined values)
  const registerOrLoginUser = async (userData: User): Promise<User> => {
    const userRef = doc(db, 'users', userData.id);
    const sanitizedUser: User = {
      ...userData,
      groupName: userData.groupName || '',
      email: userData.email || '',
      password: userData.password || '123456',
      scoreMath: userData.scoreMath ?? 0,
      scoreArabic: userData.scoreArabic ?? 0,
      scoreEnglish: userData.scoreEnglish ?? 0,
      levelMath: userData.levelMath || 'Beginner',
      levelArabic: userData.levelArabic || 'Beginner',
      levelEnglish: userData.levelEnglish || 'Beginner'
    };

    try {
      await setDoc(userRef, cleanFirestoreData(sanitizedUser), { merge: true });
      setCurrentUser(sanitizedUser);
      return sanitizedUser;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${userData.id}`);
      throw error;
    }
  };

  // Create meeting & notify assigned students via Firestore
  const createMeeting = async (newMeetingData: Omit<LiveMeeting, 'id' | 'status'>): Promise<string> => {
    const meetingId = 'meet_' + Date.now() + Math.random().toString(36).substring(2, 6);
    const newMeeting: LiveMeeting = {
      ...newMeetingData,
      id: meetingId,
      groupId: newMeetingData.groupId || '',
      groupName: newMeetingData.groupName || '',
      status: 'scheduled',
      isTeacherInRoom: true
    };

    try {
      // Write meeting to Firestore with clean data
      await setDoc(doc(db, 'meetings', meetingId), cleanFirestoreData(newMeeting));

      // Create notification documents in Firestore for assigned students
      for (const studentId of newMeeting.assignedStudentIds) {
        const notifId = 'notif_' + Date.now() + '_' + studentId;
        const notifData: NotificationItem = {
          id: notifId,
          userId: studentId,
          title: `New Live Meeting: ${newMeeting.title}`,
          titleAr: `اجتماع مباشر جديد: ${newMeeting.title}`,
          message: `You have been assigned to join ${newMeeting.title} scheduled for ${newMeeting.startTime}. Join on time!`,
          messageAr: `تم تكليفك بحضور اجتماع ${newMeeting.title} المجدول في ${newMeeting.startTime}. يرجى الانضمام في الوقت المحدد.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'meeting',
          meetingId: newMeeting.id,
          read: false
        };
        await setDoc(doc(db, 'notifications', notifId), cleanFirestoreData(notifData));
      }

      showToast(
        'success',
        'Meeting created! Assigned students have been notified in real time.',
        'تم إنشاء الاجتماع بنجاح! تم إشعار الطلاب المخصصين للانضمام.'
      );
      return meetingId;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `meetings/${meetingId}`);
      throw error;
    }
  };

  const toggleMeetingLiveStatus = async (meetingId: string) => {
    const meeting = meetings.find((m) => m.id === meetingId);
    if (!meeting) return;
    const nextStatus = meeting.status === 'scheduled' ? 'live' : meeting.status === 'live' ? 'ended' : 'scheduled';
    try {
      await updateDoc(doc(db, 'meetings', meetingId), cleanFirestoreData({
        status: nextStatus,
        isTeacherInRoom: nextStatus === 'live'
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `meetings/${meetingId}`);
    }
  };

  const deleteMeeting = async (meetingId: string) => {
    try {
      await deleteDoc(doc(db, 'meetings', meetingId));
      showToast('info', 'Meeting deleted from Firestore', 'تم حذف الاجتماع بنجاح');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `meetings/${meetingId}`);
    }
  };

  const createGroup = async (groupData: Omit<StudentGroup, 'id'>) => {
    const groupId = 'group_' + Date.now();
    const newGroup: StudentGroup = {
      ...groupData,
      id: groupId,
      teacherId: groupData.teacherId || '',
      teacherName: groupData.teacherName || '',
      coordinatorId: groupData.coordinatorId || '',
      coordinatorName: groupData.coordinatorName || '',
      notes: groupData.notes || ''
    };
    try {
      await setDoc(doc(db, 'groups', groupId), cleanFirestoreData(newGroup));
      showToast('success', `Group "${newGroup.name}" created!`, `تم إنشاء المجموعة "${newGroup.name}"!`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `groups/${groupId}`);
    }
  };

  const updateGroup = async (updatedGroup: StudentGroup) => {
    try {
      await setDoc(doc(db, 'groups', updatedGroup.id), cleanFirestoreData(updatedGroup), { merge: true });
      showToast('success', 'Group updated in Firestore', 'تم تحديث المجموعة بنجاح');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `groups/${updatedGroup.id}`);
    }
  };

  const deleteGroup = async (groupId: string) => {
    try {
      await deleteDoc(doc(db, 'groups', groupId));
      showToast('info', 'Group removed from Firestore', 'تم حذف المجموعة بنجاح');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `groups/${groupId}`);
    }
  };

  const updateStudentLevel = async (userId: string, subject: SubjectType, score: number, levelStr: string) => {
    const keyScore = subject === 'math' ? 'scoreMath' : subject === 'arabic' ? 'scoreArabic' : 'scoreEnglish';
    const keyLevel = subject === 'math' ? 'levelMath' : subject === 'arabic' ? 'levelArabic' : 'levelEnglish';

    const updates = {
      [keyScore]: score,
      [keyLevel]: `${levelStr} (${score}%)`
    };

    try {
      await updateDoc(doc(db, 'users', userId), cleanFirestoreData(updates));

      if (currentUser && currentUser.id === userId) {
        setCurrentUser({
          ...currentUser,
          ...updates
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const assignStudentToGroup = async (studentId: string, groupId: string) => {
    const targetGroup = groups.find((g) => g.id === groupId);
    if (!targetGroup) return;

    const updatedStudentIds = targetGroup.studentIds.includes(studentId)
      ? targetGroup.studentIds
      : [...targetGroup.studentIds, studentId];

    try {
      await updateDoc(doc(db, 'groups', groupId), cleanFirestoreData({ studentIds: updatedStudentIds }));
      await updateDoc(doc(db, 'users', studentId), cleanFirestoreData({ groupName: targetGroup.name }));

      if (currentUser && currentUser.id === studentId) {
        setCurrentUser({ ...currentUser, groupName: targetGroup.name });
      }

      showToast('success', 'Student assigned to group in Firestore', 'تم تعيين الطالب بالمجموعة بنجاح');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `groups/${groupId}`);
    }
  };

  const submitCareerApp = async (appData: Omit<CareerApplication, 'id' | 'appliedAt' | 'status'>) => {
    const appId = 'app_' + Date.now();
    const newApp: CareerApplication = {
      ...appData,
      id: appId,
      status: 'Pending',
      appliedAt: new Date().toLocaleDateString()
    };

    try {
      await setDoc(doc(db, 'careerApps', appId), cleanFirestoreData(newApp));
      showToast('success', 'Career Application submitted!', 'تم تقديم طلب الوظيفة بنجاح!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `careerApps/${appId}`);
    }
  };

  // Inquiries / Communication Hub Actions
  const submitInquiry = async (data: Omit<InquiryMessage, 'id' | 'createdAt' | 'status'>): Promise<string> => {
    const inqId = 'inq_' + Date.now() + Math.random().toString(36).substring(2, 6);
    const newInquiry: InquiryMessage = {
      ...data,
      id: inqId,
      status: 'pending',
      createdAt: Date.now()
    };

    try {
      await setDoc(doc(db, 'inquiries', inqId), cleanFirestoreData(newInquiry));
      showToast(
        'success',
        'Your message has been sent! Academic team has been notified.',
        'تم إرسال رسالتك بنجاح! تم إشعار فريق الأكاديمية للمتابعة.'
      );
      return inqId;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `inquiries/${inqId}`);
      throw error;
    }
  };

  const replyToInquiry = async (id: string, replyText: string, replierName: string) => {
    try {
      await updateDoc(doc(db, 'inquiries', id), cleanFirestoreData({
        reply: replyText,
        repliedBy: replierName,
        repliedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'answered'
      }));
      showToast('success', 'Reply saved and delivered!', 'تم حفظ وإرسال الرد بنجاح!');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `inquiries/${id}`);
    }
  };

  const deleteInquiry = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'inquiries', id));
      showToast('info', 'Inquiry deleted', 'تم حذف الرسالة بنجاح');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `inquiries/${id}`);
    }
  };

  // Program Management (Admin Full CRUD)
  const createProgram = async (prog: Omit<ProgramItem, 'id'>) => {
    const progId = 'prog_' + Date.now();
    const newProg: ProgramItem = { ...prog, id: progId };
    try {
      await setDoc(doc(db, 'programs', progId), cleanFirestoreData(newProg));
      showToast('success', `Program "${newProg.titleEn}" added!`, `تمت إضافة البرنامج بنجاح!`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `programs/${progId}`);
    }
  };

  const updateProgram = async (prog: ProgramItem) => {
    try {
      await setDoc(doc(db, 'programs', prog.id), cleanFirestoreData(prog), { merge: true });
      showToast('success', 'Program updated in Firestore', 'تم تحديث البرنامج بنجاح');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `programs/${prog.id}`);
    }
  };

  const deleteProgram = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'programs', id));
      showToast('info', 'Program removed from Firestore', 'تم حذف البرنامج بنجاح');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `programs/${id}`);
    }
  };

  const updateUser = async (userId: string, updates: Partial<User>) => {
    try {
      await updateDoc(doc(db, 'users', userId), cleanFirestoreData(updates));
      if (currentUser && currentUser.id === userId) {
        setCurrentUser({ ...currentUser, ...updates });
      }
      showToast('success', 'User updated in Firestore', 'تم تحديث بيانات المستخدم بنجاح');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      showToast('info', 'User document deleted from Firestore', 'تم حذف حساب المستخدم من الداتابيز بنجاح');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${userId}`);
    }
  };

  const updateCareerAppStatus = async (appId: string, status: CareerApplication['status']) => {
    try {
      await updateDoc(doc(db, 'careerApps', appId), cleanFirestoreData({ status }));
      showToast('success', `Application status updated to ${status}`, `تم تغيير حالة الطلب إلى ${status}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `careerApps/${appId}`);
    }
  };

  const deleteCareerApp = async (appId: string) => {
    try {
      await deleteDoc(doc(db, 'careerApps', appId));
      showToast('info', 'Application deleted from Firestore', 'تم حذف الطلب بنجاح');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `careerApps/${appId}`);
    }
  };

  const deleteNotification = async (notifId: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', notifId));
      showToast('info', 'Notification deleted', 'تم حذف الإشعار');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `notifications/${notifId}`);
    }
  };

  const sendBroadcastNotification = async (titleEn: string, messageEn: string, titleAr?: string, messageAr?: string) => {
    try {
      for (const u of users) {
        const notifId = 'notif_bcast_' + Date.now() + '_' + u.id;
        const notifData: NotificationItem = {
          id: notifId,
          userId: u.id,
          title: titleEn,
          titleAr: titleAr || titleEn,
          message: messageEn,
          messageAr: messageAr || messageEn,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'general',
          read: false
        };
        await setDoc(doc(db, 'notifications', notifId), cleanFirestoreData(notifData));
      }
      showToast('success', 'Broadcast announcement sent to all users!', 'تم إرسال الإعلان لجميع المستخدمين بنجاح!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'notifications');
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      for (const n of notifications) {
        if (!n.read) {
          await updateDoc(doc(db, 'notifications', n.id), cleanFirestoreData({ read: true }));
        }
      }
      showToast('success', 'All notifications marked as read', 'تم تحديث جميع الإشعارات كُمقروءة');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'notifications');
    }
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currentUser,
        setCurrentUser,
        users,
        groups,
        meetings,
        notifications,
        careerApps,
        inquiries,
        programs,
        toasts,
        showToast,
        removeToast,
        registerOrLoginUser,
        updateUser,
        deleteUser,
        createMeeting,
        toggleMeetingLiveStatus,
        deleteMeeting,
        createGroup,
        updateGroup,
        deleteGroup,
        updateStudentLevel,
        assignStudentToGroup,
        submitCareerApp,
        updateCareerAppStatus,
        deleteCareerApp,
        submitInquiry,
        replyToInquiry,
        deleteInquiry,
        createProgram,
        updateProgram,
        deleteProgram,
        markAllNotificationsRead,
        deleteNotification,
        sendBroadcastNotification,
        activeTestSubject,
        setActiveTestSubject,
        activeMeetingRoom,
        setActiveMeetingRoom,
        currentPath,
        navigate
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
