import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Globe2,
  Phone,
  Send,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const Ads: React.FC = () => {
  const { registerOrLoginUser, submitCareerApp, showToast, language, setLanguage, navigate } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentAge, setStudentAge] = useState('');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Egypt');
  const [school, setSchool] = useState('');
  const [contactMethod, setContactMethod] = useState('WhatsApp');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{ username: string; pass: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !studentName.trim() || !studentAge.trim() || !parentName.trim() || !phone.trim() || !message.trim()) {
      showToast('error', 'Please fill in all required fields (*)', 'يرجى ملء جميع الحقول المطلوبة (*)');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Generate clean student account credentials
      const cleanUsername = (studentName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'student') + Math.floor(100 + Math.random() * 900);
      const generatedPass = phone.slice(-6) || '123456';

      const newUser = {
        id: 'user_' + Date.now(),
        name: studentName,
        username: cleanUsername,
        password: generatedPass,
        role: 'student' as const,
        email: email || `${cleanUsername}@learnacademy.com`,
        groupName: 'Group A - Beginners',
        scoreMath: 0,
        scoreArabic: 0,
        scoreEnglish: 0,
        levelMath: 'Beginner',
        levelArabic: 'Beginner',
        levelEnglish: 'Beginner'
      };

      // 2. Register user account in Firestore
      await registerOrLoginUser(newUser);

      // 3. Submit registration record as lead/application for Admin review
      await submitCareerApp({
        positionId: 'free_session_registration',
        positionTitle: `Free Session Registration (${country})`,
        fullName: `${fullName} (Parent: ${parentName})`,
        email: email || 'N/A',
        phone: phone,
        yearsExperience: `Student Age: ${studentAge}`,
        coverLetter: `Student: ${studentName} | Age: ${studentAge} | School: ${school || 'N/A'} | Contact: ${contactMethod}\nMessage: ${message}`
      });

      setCreatedCredentials({ username: cleanUsername, pass: generatedPass });
      setShowSuccessModal(true);

      showToast(
        'success',
        'Registration submitted successfully! Free session booked.',
        'تم تقديم طلب التسجيل بنجاح! تم حجز الجلسة المجانية.'
      );
    } catch (err) {
      console.error('ADS Registration Error:', err);
      showToast('error', 'Failed to submit registration', 'حدث خطأ أثناء إرسال التسجيل');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    const text = encodeURIComponent(`Hello Learn Academy! I would like to inquire about registering for a free session for student: ${studentName || fullName}`);
    window.open(`https://wa.me/201000000000?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      
      {/* Header Banner - Matches user uploaded screenshot */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm font-extrabold tracking-wide text-amber-300 block">
                Learn Academy
              </span>
              <a
                href="https://learn-academy-platform.surge.sh"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-indigo-200 hover:text-amber-300 font-semibold underline block"
              >
                learn-academy-platform.surge.sh
              </a>
            </div>
          </div>

          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Globe2 className="w-4 h-4 text-amber-300" />
            <span>{language === 'en' ? 'العربية' : 'English'}</span>
          </button>
        </div>

        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            {language === 'ar' ? 'سجل الآن واحصل على جلسة مجانية' : 'Register now and get a free session'}
          </h1>
          <p className="text-sm sm:text-base text-purple-100 font-medium">
            {language === 'ar'
              ? 'اترك بياناتك وسنتواصل معك قريباً عبر واتساب أو البريد الإلكتروني.'
              : 'Leave your details and we will contact you shortly on WhatsApp or email.'}
          </p>
        </div>
      </div>

      {/* Main Registration Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-purple-100 space-y-6 glow-card">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-purple-600 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-purple-600 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Student Name */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Student Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Student full name"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-purple-600 transition-all"
              />
            </div>

            {/* Student Age */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Student Age <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="4"
                max="18"
                required
                value={studentAge}
                onChange={(e) => setStudentAge(e.target.value)}
                placeholder="e.g. 10"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-purple-600 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Parent Name */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Parent Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Parent / Guardian full name"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-purple-600 transition-all"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Phone <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+20 100 000 0000"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-purple-600 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Country */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Country <span className="text-rose-500">*</span>
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-purple-600 transition-all"
              >
                <option value="Egypt">Egypt (مصر)</option>
                <option value="Saudi Arabia">Saudi Arabia (المملكة العربية السعودية)</option>
                <option value="United Arab Emirates">UAE (الإمارات العربية المتحدة)</option>
                <option value="Qatar">Qatar (قطر)</option>
                <option value="Kuwait">Kuwait (الكويت)</option>
                <option value="Oman">Oman (عُمان)</option>
                <option value="Jordan">Jordan (الأردن)</option>
                <option value="United States">United States</option>
                <option value="Other">Other Country</option>
              </select>
            </div>

            {/* School */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">School</label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="School name"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-purple-600 transition-all"
              />
            </div>
          </div>

          {/* Preferred Contact Method */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Preferred Contact Method
            </label>
            <select
              value={contactMethod}
              onChange={(e) => setContactMethod(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-purple-600 transition-all"
            >
              <option value="WhatsApp">WhatsApp</option>
              <option value="Email">Email</option>
              <option value="Phone Call">Phone Call</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Message <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about the student's interest (e.g. Math, Robotics, Language practice)..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-purple-600 resize-none transition-all"
            />
          </div>

          {/* Bottom Actions - Contact us now & Submit */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-extrabold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <span>Contact us now</span>
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all glow-btn"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Submit'}</span>
            </button>
          </div>

        </form>
      </div>

      {/* Footer policy links */}
      <div className="text-center text-xs text-slate-300 space-x-4 pt-4">
        <a href="#privacy" className="hover:underline">Privacy Policy</a>
        <span>•</span>
        <a href="#terms" className="hover:underline">Terms of Service</a>
      </div>

      {/* SUCCESS MODAL (HTML Modal for iframe compatibility) */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center border border-purple-100">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-800">
                {language === 'ar' ? 'تم التسجيل بنجاح!' : 'Registration Successful!'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'ar'
                  ? 'تم حجز الجلسة المجانية وتجهيز حساب الطالب في النظام. سنقوم بالتواصل معك عبر واتساب.'
                  : 'Your free session has been booked and a student account was created in Firestore! Our team will contact you shortly on WhatsApp or email.'}
              </p>
            </div>

            {createdCredentials && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left rtl:text-right space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Student Login Credentials</div>
                <div className="text-xs font-mono">
                  <div>Username: <strong className="text-purple-700">{createdCredentials.username}</strong></div>
                  <div>Password: <strong className="text-purple-700">{createdCredentials.pass}</strong></div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/login/student');
                }}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow transition-all glow-btn"
              >
                Go to Student Login
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
