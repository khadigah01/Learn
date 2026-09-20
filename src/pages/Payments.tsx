import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Sparkles,
  Phone,
  ArrowRight,
  FileText,
  Clock,
  HelpCircle,
  ExternalLink,
  Send,
  Zap,
  Lock
} from 'lucide-react';

interface PricingPlan {
  id: string;
  nameEn: string;
  nameAr: string;
  priceEn: string;
  priceAr: string;
  periodEn: string;
  periodAr: string;
  badgeEn?: string;
  badgeAr?: string;
  popular?: boolean;
  featuresEn: string[];
  featuresAr: string[];
}

export const Payments: React.FC = () => {
  const { language, currentUser, submitInquiry, showToast, navigate } = useApp();

  // Selected plan for checkout / receipt submission
  const [selectedPlanId, setSelectedPlanId] = useState<string>('dual');

  // Receipt submission form state
  const [studentName, setStudentName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'card' | 'apple_pay' | 'vodafone_cash'>('bank_transfer');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const plans: PricingPlan[] = [
    {
      id: 'single',
      nameEn: 'Single Subject Specialist',
      nameAr: 'باقة المادة الواحدة',
      priceEn: '$45',
      priceAr: '45 دولار / 1400 ج.م',
      periodEn: 'per month',
      periodAr: 'شهرياً',
      featuresEn: [
        '8 Live interactive classes per month',
        'Choose Math, Arabic, or English',
        'Adaptive Diagnostic Level Assessment',
        'Weekly homework & mentor feedback',
        'Official Verified Subject Badge'
      ],
      featuresAr: [
        '8 حصص تفاعلية مباشرة شهرياً',
        'اختيار مادة واحدة: رياضيات، عربية، أو إنجليزية',
        'اختبار تشخيصي متدرج لتحديد المستوى الأكاديمي',
        'متابعة أسبوعية للواجبات وملاحظات المعلم',
        'وسام التخصص الأكاديمي المعتمد في المنصة'
      ]
    },
    {
      id: 'dual',
      nameEn: 'Dual Academic Mastery',
      nameAr: 'باقة المادتين (الأكثر طلباً)',
      priceEn: '$79',
      priceAr: '79 دولار / 2500 ج.م',
      periodEn: 'per month',
      periodAr: 'شهرياً',
      popular: true,
      badgeEn: 'Most Popular',
      badgeAr: 'الأكثر طلباً',
      featuresEn: [
        '16 Live interactive classes per month',
        'Combine any 2 subjects (Math + English/Arabic)',
        'Bi-weekly progress diagnostic tests',
        'Direct WhatsApp parent advisory channel',
        'Two Subject Mastery Badges + 500 XP'
      ],
      featuresAr: [
        '16 حصة تفاعلية مباشرة شهرياً',
        'الجمع بين أي مادتين (مثلاً: رياضيات + إنجليزي أو عربي)',
        'اختبارات تقييمية نصف شهرية لقياس التطور',
        'قناة واتساب مباشرة لإرشاد وتحديث أولياء الأمور',
        'وسامين معتمدين و 500 نقطة خبرة إضافية'
      ]
    },
    {
      id: 'triple',
      nameEn: 'Triple Crown All-Inclusive',
      nameAr: 'باقة التاج الثلاثي الشاملة',
      priceEn: '$110',
      priceAr: '110 دولار / 3500 ج.م',
      periodEn: 'per month',
      periodAr: 'شهرياً',
      badgeEn: 'Complete Track',
      badgeAr: 'المسار الشامل',
      featuresEn: [
        '24 Live classes (Math, Arabic & English)',
        'All three core academy subjects covered',
        'Personalized 1-on-1 Academic Advisor',
        'Full access to all games, tests & honors',
        'Diamond Triple Crown Badge awarded'
      ],
      featuresAr: [
        '24 حصة تفاعلية (رياضيات + لغة عربية + لغة إنجليزية)',
        'تغطية المناهج التأسيسية الثلاثة كاملة',
        'مرشد أكاديمي مخصص لمتابعة الطالب',
        'وصول غير محدود لكافة الألعاب والاختبارات والأوسمة',
        'وسام التاج الثلاثي الماسي المعتمد'
      ]
    }
  ];

  const handleSubmitReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !phone.trim() || !referenceNumber.trim()) {
      showToast('error', 'Please fill in all required fields', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setIsSubmitting(true);
      const chosenPlan = plans.find((p) => p.id === selectedPlanId);
      const planName = chosenPlan ? (language === 'ar' ? chosenPlan.nameAr : chosenPlan.nameEn) : selectedPlanId;

      await submitInquiry({
        channel: 'ask_admin',
        senderId: currentUser?.id || 'guest_payment',
        senderName: studentName.trim(),
        senderRole: currentUser?.role || 'parent',
        senderPhone: phone.trim(),
        subject: `[Payment Receipt Confirmation] ${planName}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: `Payment Verification Details:
- Student Name: ${studentName.trim()}
- Phone/WhatsApp: ${phone.trim()}
- Program Package: ${planName}
- Payment Method: ${paymentMethod}
- Reference / Transaction Number: ${referenceNumber.trim()}
- Notes: ${notes.trim() || 'None'}`
      });

      setIsSubmitted(true);
      showToast(
        'success',
        'Payment confirmation submitted successfully! Administration will review and activate your plan.',
        'تم إرسال بيانات السداد بنجاح! ستقوم الإدارة بمراجعة التحويل وتفعيل الاشتراك فوراً.'
      );
    } catch (err) {
      showToast('error', 'Failed to submit payment receipt', 'تعذر إرسال إيصال السداد');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-300">
      
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-indigo-700/50 space-y-4 glow-card text-center sm:text-left rtl:sm:text-right">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
          <CreditCard className="w-4 h-4" />
          <span>{language === 'ar' ? 'بوابة الرسوم والاشتراكات المعتمدة' : 'Official Tuition & Enrollment Portal'}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          {language === 'ar' ? 'الاشتراك في برامج أكاديمية Learn' : 'Enrollment Plans & Tuition Payments'}
        </h1>

        <p className="text-sm sm:text-base text-indigo-100/90 max-w-2xl leading-relaxed">
          {language === 'ar'
            ? 'استثمر في تفوق طفلك التعليمي مع معلمين متخصصين في الرياضيات واللغة العربية والإنجليزية. طرق دفع مرنة وضمان كامل للرضا مع حصة تجريبية أولى.'
            : 'Invest in your student\'s educational foundation with specialized tutors in Math, Arabic, and English. Flexible payment methods and guaranteed first-class trial.'}
        </p>

        {/* Guarantee Pills */}
        <div className="pt-2 flex flex-wrap gap-3 justify-center sm:justify-start rtl:sm:justify-start">
          <div className="px-3.5 py-1.5 rounded-xl bg-white/10 text-xs font-bold border border-white/15 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{language === 'ar' ? 'حصة تجريبية مجانية أولى' : 'Free Trial First Class'}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-white/10 text-xs font-bold border border-white/15 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>{language === 'ar' ? 'سداد آمن ومعتمد 100%' : '100% Secure Processing'}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-white/10 text-xs font-bold border border-white/15 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{language === 'ar' ? 'تفعيل فوري للمجموعة' : 'Instant Cohort Placement'}</span>
          </div>
        </div>
      </div>

      {/* Pricing Plans Grid */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-slate-900">
            {language === 'ar' ? 'اختر الباقة التعليمية الأنسب لطفلك' : 'Select the Ideal Academic Package'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'ar'
              ? 'جميع الباقات تشمل التقييمات التشخيصية، التمارين، والمتابعة المباشرة مع المعلم.'
              : 'All plans include comprehensive diagnostic assessments, interactive exercises, and teacher office hours.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {plans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`rounded-3xl p-6 sm:p-7 border transition-all cursor-pointer relative flex flex-col justify-between glow-card ${
                  plan.popular
                    ? 'border-indigo-600 bg-white shadow-xl scale-[1.02]'
                    : 'border-slate-200 bg-white shadow-md hover:shadow-lg'
                } ${isSelected ? 'ring-4 ring-indigo-500/20' : ''}`}
              >
                {/* Popular Badge */}
                {plan.badgeEn && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-3.5 py-1 rounded-full text-xs font-black bg-indigo-600 text-white shadow-md uppercase tracking-wider">
                      {language === 'ar' ? plan.badgeAr : plan.badgeEn}
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900">
                      {language === 'ar' ? plan.nameAr : plan.nameEn}
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-indigo-950">
                        {language === 'ar' ? plan.priceAr : plan.priceEn}
                      </span>
                      <span className="text-xs text-slate-500 font-bold">
                        / {language === 'ar' ? plan.periodAr : plan.periodEn}
                      </span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100">
                    {(language === 'ar' ? plan.featuresAr : plan.featuresEn).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-snug">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    className={`w-full py-3 rounded-2xl text-xs font-black transition-all shadow ${
                      isSelected
                        ? 'bg-slate-950 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {isSelected
                      ? language === 'ar' ? 'الباقة المحددة ✓' : 'Selected Plan ✓'
                      : language === 'ar' ? 'اختيار هذه الباقة' : 'Select Plan'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Methods & Bank Transfer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Accepted Payment Methods */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md space-y-4 glow-card">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                {language === 'ar' ? 'طرق الدفع المعتمدة' : 'Accepted Payment Methods'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'ar' ? 'سداد فوري وآمن ومشفر' : 'Instant, encrypted checkout options'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                <span>Mada / Visa / Master</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {language === 'ar' ? 'بطاقات الدفع والائتمان المباشرة' : 'All debit and credit cards supported'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Apple Pay / KNET</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {language === 'ar' ? 'دفع إلكتروني سريع بنقرة واحدة' : 'One-touch mobile checkout'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>{language === 'ar' ? 'تحويل بنكي رسمي' : 'Bank Wire Transfer'}</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {language === 'ar' ? 'حساب بنكي معتمد بالآيبان' : 'Direct official IBAN bank deposit'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Instapay / Wallet</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {language === 'ar' ? 'إنستاباي ومحافظ الهاتف المحلية' : 'Instapay & local mobile wallets'}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="https://wa.me/201550128876"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>{language === 'ar' ? 'التحدث مع مسؤول الحسابات عبر واتساب' : 'Chat with Billing Concierge on WhatsApp'}</span>
            </a>
          </div>
        </div>

        {/* Bank Transfer Details Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md space-y-4 glow-card flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {language === 'ar' ? 'بيانات التحويل البنكي الرسمي' : 'Official Bank Transfer Coordinates'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'ar' ? 'للتحويل المباشر من حسابك البنكي أو تطبيق البنك' : 'Wire funds directly via your mobile banking app'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500 font-sans">{language === 'ar' ? 'اسم المستفيد:' : 'Beneficiary:'}</span>
                <span className="font-bold text-slate-900 font-sans">Learn Academy For Education</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500 font-sans">{language === 'ar' ? 'البنك:' : 'Bank:'}</span>
                <span className="font-bold text-slate-900 font-sans">Commercial International Bank (CIB)</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500 font-sans">IBAN:</span>
                <span className="font-bold text-indigo-700">EG4800100002000001234567890</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-slate-500 font-sans">Swift Code:</span>
                <span className="font-bold text-slate-900">CIBEEGCAXXX</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic">
            {language === 'ar'
              ? 'ملاحظة: بعد إتمام التحويل، يرجى إدخال رقم العملية في النموذج أدناه ليتم ربطه بملف الطالب وتفعيل الحصص فوراً.'
              : 'Note: After making the transfer, submit the transaction reference number below for instant activation.'}
          </p>
        </div>
      </div>

      {/* Payment Receipt / Confirmation Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl glow-card space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-xl font-black text-slate-900">
            {language === 'ar' ? 'تأكيد السداد وإرسال إشعار الدفع' : 'Submit Payment Verification / Receipt'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'ar'
              ? 'أدخل بيانات التحويل وسيقوم فريق التسجيل بتفعيل باقتك وإرسال رابط الحصص على واتساب.'
              : 'Provide your transfer reference number to link your payment to your student account.'}
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-emerald-950">
              {language === 'ar' ? 'تم استلام بيانات السداد بنجاح!' : 'Payment Confirmation Received!'}
            </h4>
            <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
              {language === 'ar'
                ? 'شكراً لك! يقوم فريق الحسابات حالياً بمطابقة المعاملة، وسيتم إرسال تأكيد التفعيل ورابط المجموعة الدراسية عبر رسالة واتساب.'
                : 'Thank you! The billing team is validating your transfer and will send confirmation along with class schedules via WhatsApp.'}
            </p>
            <div className="pt-3">
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow"
              >
                {language === 'ar' ? 'إرسال إشعار آخر' : 'Submit Another Confirmation'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitReceipt} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {language === 'ar' ? 'اسم الطالب بالكامل:' : 'Student Full Name:'}
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: أحمد محمد' : 'e.g. Adam Smith'}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {language === 'ar' ? 'رقم الهاتف / واتساب:' : 'Phone / WhatsApp Number:'}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+20 12 34567890"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {language === 'ar' ? 'طريقة السداد المستخدمة:' : 'Payment Method Used:'}
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="bank_transfer">{language === 'ar' ? 'تحويل بنكي رسمي (IBAN / Wire)' : 'Official Bank Transfer (IBAN)'}</option>
                  <option value="card">{language === 'ar' ? 'بطاقة بنكية (Mada / Visa / Master)' : 'Debit / Credit Card (Mada/Visa)'}</option>
                  <option value="apple_pay">Apple Pay / Mobile Wallet</option>
                  <option value="vodafone_cash">Instapay / Vodafone Cash</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {language === 'ar' ? 'رقم الحوالة أو العملية (Transaction ID):' : 'Transaction / Reference ID:'}
                </label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="e.g. TXN-9847291"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {language === 'ar' ? 'ملاحظات إضافية (المواد المختارة، التوقيت المفضل):' : 'Additional Notes (Subject preference, preferred timings):'}
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={language === 'ar' ? 'أي تفاصيل أخرى ترغب في مشاركتها مع إدارة التسجيل...' : 'Any details you would like to share with the admissions team...'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-black shadow transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? (language === 'ar' ? 'جار الإرسال...' : 'Submitting...') : (language === 'ar' ? 'إرسال تأكيد السداد' : 'Submit Confirmation')}</span>
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
};
