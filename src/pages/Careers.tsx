import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { JobPosition } from '../types';
import { Briefcase, Send, CheckCircle2, Clock, Sparkles } from 'lucide-react';

const JOBS: JobPosition[] = [
  {
    id: 'job-1',
    titleEn: 'Math Specialist & Educator',
    titleAr: 'معلم متخصص في الرياضيات',
    department: 'Math',
    type: 'Full-time',
    descriptionEn: 'Lead interactive live group classes in mental math, algebra, geometry, and problem-solving strategies.',
    descriptionAr: 'قيادة الحصص المباشرة والتفاعلية في الحساب، الجبر، الهندسة ومهارات التفكير الرياضي.',
    requirementsEn: ['Bachelor in Mathematics or Education', '2+ years experience in teaching kids/teens', 'Passionate about interactive education'],
    requirementsAr: ['بكالوريوس في الرياضيات أو التربية', 'خبرة سنتين على الأقل في التدريس', 'الشغف بأساليب التعلم التفاعلي']
  },
  {
    id: 'job-2',
    titleEn: 'Arabic Language & Nahu Instructor',
    titleAr: 'معلم اللغة العربية والنحو',
    department: 'Arabic',
    type: 'Full-time',
    descriptionEn: 'Teach Arabic grammar, reading comprehension, literature, and correct pronunciation.',
    descriptionAr: 'تدريس قواعد النحو والإعراب، القراءة، البلاغة، والأدب العربي بأسلوب ممتع.',
    requirementsEn: ['Degree in Arabic Literature or Linguistics', 'Excellent communication skills', 'Ability to simplify complex grammar rules'],
    requirementsAr: ['شهادة في اللغة العربية أو اللغويات', 'مهارات تواصل ممتازة مع الطلاب', 'القدرة على تبسيط القواعد النحوية']
  },
  {
    id: 'job-3',
    titleEn: 'English Communication Specialist',
    titleAr: 'معلم اللغة الإنجليزية والمحادثة',
    department: 'English',
    type: 'Remote',
    descriptionEn: 'Deliver engaging English grammar, vocabulary, and conversational fluency sessions.',
    descriptionAr: 'تقديم حصص تفاعلية لتعزيز مهارات المحادثة، المفردات، وقواعد اللغة الإنجليزية.',
    requirementsEn: ['TESOL / TEFL certification or equivalent', 'Fluent native-level English', 'Experience with online classroom tools'],
    requirementsAr: ['شهادة TESOL أو TEFL أو ما يعادلها', 'طلاقة ممتازة في اللغة الإنجليزية', 'خبرة في أدوات التعليم الإلكتروني']
  },
  {
    id: 'job-4',
    titleEn: 'Academic Student Coordinator',
    titleAr: 'منسق أكاديمي ومتابع للطلاب',
    department: 'Coordination',
    type: 'Part-time',
    descriptionEn: 'Coordinate group schedules, monitor student test progress, and manage live meeting calendars.',
    descriptionAr: 'تنسيق جداول المجموعات، متابعة نتائج اختبارات الطلاب، وإدارة جداول الاجتماعات الحية.',
    requirementsEn: ['Strong organizational skills', 'Proficiency with administrative portals', 'Friendly customer service attitude'],
    requirementsAr: ['مهارات تنظيمية عالية', 'إتقان بوابات الإدارة المدرسية', 'أسلوب تواصل ودود مع الأهالي والطلاب']
  }
];

export const Careers: React.FC = () => {
  const { language, submitCareerApp, showToast } = useApp();
  const t = translations[language];

  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [yearsExperience, setYearsExperience] = useState('2');
  const [coverLetter, setCoverLetter] = useState('');

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !coverLetter.trim()) {
      showToast('error', 'Please complete all required fields', 'يرجى إكمال كافة الحقول المطلوبة');
      return;
    }

    await submitCareerApp({
      positionId: selectedJob ? selectedJob.id : 'general',
      positionTitle: selectedJob ? selectedJob.titleEn : 'General Educator Application',
      fullName,
      email,
      phone,
      yearsExperience,
      coverLetter
    });

    setFullName('');
    setEmail('');
    setPhone('');
    setCoverLetter('');
    setSelectedJob(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-4 glow-card">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow">
          <Briefcase className="w-4 h-4" />
          <span>{t.careers}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black">{t.openPositions}</h1>
        <p className="text-sm text-indigo-100 max-w-2xl mx-auto font-medium leading-relaxed">
          {t.careersHeroDesc}
        </p>
      </div>

      {/* Positions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {JOBS.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-100 flex flex-col justify-between space-y-4 glow-card"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-purple-100 text-purple-900 font-extrabold text-xs rounded-full">
                  {job.department}
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {job.type}
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-800">
                {language === 'ar' ? job.titleAr : job.titleEn}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {language === 'ar' ? job.descriptionAr : job.descriptionEn}
              </p>

              <div className="pt-2">
                <span className="text-xs font-bold text-slate-700 block mb-1.5">
                  {language === 'ar' ? 'المتطلبات الأساسية:' : 'Requirements:'}
                </span>
                <ul className="space-y-1 text-xs text-slate-500 font-medium">
                  {(language === 'ar' ? job.requirementsAr : job.requirementsEn).map((req, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  setSelectedJob(job);
                  window.scrollTo({ top: 800, behavior: 'smooth' });
                }}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow transition-all glow-btn"
              >
                {t.applyNow}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Application Form */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-purple-100 space-y-6 glow-card">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-2xl font-black text-slate-800">
            {language === 'ar' ? 'تقديم طلب الانضمام إلى الأكاديمية' : 'Submit Job Application'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {selectedJob
              ? `Applying for: ${language === 'ar' ? selectedJob.titleAr : selectedJob.titleEn}`
              : 'Select a position above or submit a general application'}
          </p>
        </div>

        <form onSubmit={handleSubmitApplication} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">{t.fullName} *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Dr. Sarah Mansour"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:border-purple-600 glow-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">{t.email} *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@example.com"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:border-purple-600 glow-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">{t.phone}</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+966 50 123 4567"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:border-purple-600 glow-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">{t.yearsExp}</label>
              <input
                type="number"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:border-purple-600 glow-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">{t.coverLetter} *</label>
            <textarea
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell us about your teaching philosophy and experience in Math, Arabic, or English..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:border-purple-600 glow-input"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-base shadow-xl flex items-center justify-center gap-2 transition-all glow-btn"
          >
            <Send className="w-5 h-5" />
            <span>{t.submitApplication}</span>
          </button>
        </form>
      </div>

    </div>
  );
};
