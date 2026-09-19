import React from 'react';
import { useApp } from '../context/AppContext';
import { Briefcase, ArrowLeft, MessageSquare } from 'lucide-react';

export const Careers: React.FC = () => {
  const { language, navigate } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-8 sm:p-14 shadow-xl border border-slate-200 text-center space-y-6 glow-card">
        
        {/* Icon & Status Badge */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 shadow-sm">
            <Briefcase className="w-8 h-8 text-slate-400" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>{language === 'ar' ? 'التوظيف مغلق حالياً' : 'Recruitment Closed'}</span>
          </span>
        </div>

        {/* Main Title Required by User */}
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {language === 'ar' ? 'لا توجد وظائف متاحة حالياً' : 'No careers available'}
        </h1>

        {/* Descriptive message */}
        <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
          {language === 'ar'
            ? 'لا توجد أي شواغر تدريسية أو وظائف أكاديمية معلنة في الوقت الحالي. نشكر اهتمامك بالانضمام إلى فريق عمل أكاديمية ليرن، ويرجى زيارتنا لاحقاً لمتابعة أي فرص جديدة.'
            : 'There are currently no open positions or vacancies available at Learn Academy. We appreciate your interest in joining our team. Please check back at a later date for future opportunities.'}
        </p>

        {/* Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-sm mx-auto">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </button>

          <button
            onClick={() => navigate('/ask/admin')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-slate-500" />
            <span>{language === 'ar' ? 'تواصل مع الإدارة' : 'Contact Admin'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
