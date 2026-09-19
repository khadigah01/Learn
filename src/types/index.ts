export type Language = 'en' | 'ar';
export type Role = 'student' | 'teacher' | 'coordinator' | 'admin';

export interface User {
  id: string;
  name: string;
  role: Role;
  username: string;
  password?: string;
  avatar?: string;
  email?: string;
  groupName?: string;
  levelMath?: string;
  levelArabic?: string;
  levelEnglish?: string;
  scoreMath?: number;
  scoreArabic?: number;
  scoreEnglish?: number;
}

export interface StudentGroup {
  id: string;
  name: string;
  subject: 'Math' | 'Arabic' | 'English' | 'General';
  teacherId?: string;
  teacherName?: string;
  coordinatorId?: string;
  coordinatorName?: string;
  studentIds: string[];
  schedule: string;
  notes?: string;
}

export interface LiveMeeting {
  id: string;
  title: string;
  subject: 'Math' | 'Arabic' | 'English' | 'General';
  groupId?: string;
  groupName?: string;
  teacherId: string;
  teacherName: string;
  assignedStudentIds: string[];
  startTime: string; // e.g. "2026-09-19T10:00"
  durationMinutes: number;
  link: string;
  status: 'scheduled' | 'live' | 'ended';
  isTeacherInRoom?: boolean;
  isPublic?: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  titleAr?: string;
  message: string;
  messageAr?: string;
  timestamp: string;
  type: 'meeting' | 'group' | 'test' | 'career' | 'general';
  meetingId?: string;
  read: boolean;
}

export interface TestQuestion {
  id: number;
  questionEn: string;
  questionAr: string;
  optionsEn: string[];
  optionsAr: string[];
  correctIndex: number;
}

export type SubjectType = 'math' | 'arabic' | 'english';

export interface TestResult {
  subject: SubjectType;
  score: number;
  total: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  date: string;
}

export interface JobPosition {
  id: string;
  titleEn: string;
  titleAr: string;
  department: 'Math' | 'Arabic' | 'English' | 'Administration' | 'Coordination';
  type: 'Full-time' | 'Part-time' | 'Remote';
  descriptionEn: string;
  descriptionAr: string;
  requirementsEn: string[];
  requirementsAr: string[];
}

export interface CareerApplication {
  id: string;
  positionId: string;
  positionTitle: string;
  fullName: string;
  email: string;
  phone: string;
  yearsExperience: string;
  resumeUrl?: string;
  coverLetter: string;
  status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
  appliedAt: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  messageAr?: string;
}

export type CommunicationChannel =
  | 'ask_admin'
  | 'ask_teacher'
  | 'ask_student'
  | 'talk_admin'
  | 'talk_teacher'
  | 'talk_student';

export interface InquiryMessage {
  id: string;
  channel: CommunicationChannel;
  senderId: string;
  senderName: string;
  senderRole: Role | 'parent' | 'guest';
  senderPhone?: string;
  recipientId?: string; // 'admin' | teacherId | studentId
  recipientName?: string;
  subject?: string;
  content: string;
  status: 'pending' | 'answered' | 'closed';
  reply?: string;
  repliedBy?: string;
  repliedAt?: string;
  createdAt: number;
  timestamp: string;
}

export interface ProgramItem {
  id: string;
  titleEn: string;
  titleAr: string;
  subject: 'Math' | 'Arabic' | 'English';
  stage: string;
  stageAr: string;
  ageRange: string;
  schedule: string;
  sessionsCount: string;
  price: string;
  descriptionEn: string;
  descriptionAr: string;
  featuresEn: string[];
  featuresAr: string[];
}

