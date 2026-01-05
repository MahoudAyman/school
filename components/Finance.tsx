
import React, { useEffect, useState } from 'react';
import { Student, FinanceRecord } from '../types';
import { supabase } from '../supabaseClient';
import { CreditCard, Wallet, Calendar, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface FinanceProps {
  user: Student;
}

const Finance: React.FC<FinanceProps> = ({ user }) => {
  const [record, setRecord] = useState<FinanceRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinance = async () => {
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .eq('student_id', user.id)
        .single();
      
      if (!error && data) setRecord(data);
      setLoading(false);
    };
    fetchFinance();
  }, [user.id]);

  if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-slate-900">الشؤون المالية</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FinanceCard 
          icon={<Wallet className="text-blue-600" />} 
          label="إجمالي المصروفات" 
          value={`${record?.total_fees || 0} ج.م`} 
          color="blue"
        />
        <FinanceCard 
          icon={<CheckCircle2 className="text-emerald-600" />} 
          label="المبلغ المدفوع" 
          value={`${record?.paid_amount || 0} ج.م`} 
          color="emerald"
        />
        <FinanceCard 
          icon={<AlertCircle className="text-red-600" />} 
          label="المبلغ المتبقي" 
          value={`${(record?.total_fees || 0) - (record?.paid_amount || 0)} ج.م`} 
          color="red"
        />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-slate-900">تفاصيل السداد</h3>
          <div className={`px-4 py-1.5 rounded-full text-xs font-bold ${
            record?.status === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
          }`}>
            {record?.status === 'paid' ? 'تم السداد بالكامل' : record?.status === 'partial' ? 'سداد جزئي' : 'غير مسدد'}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
            <div className="flex items-center gap-4">
              <Calendar className="text-slate-400" />
              <div>
                <p className="text-sm font-bold text-slate-900">آخر موعد للسداد</p>
                <p className="text-xs text-slate-500">{record?.due_date ? new Date(record.due_date).toLocaleDateString('ar-EG') : 'غير محدد'}</p>
              </div>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
              <CreditCard size={18} />
              دفع الآن
            </button>
          </div>
          
          <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-2xl">
            <p className="text-sm text-blue-800 leading-relaxed font-medium">
              ملاحظة: يمكنك الدفع إلكترونياً عبر "فوري" باستخدام كود المعهد (12345) ورقمك القومي، أو من خلال خزينة المعهد مباشرة خلال ساعات العمل الرسمية.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FinanceCard = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className={`w-12 h-12 bg-${color}-50 rounded-xl flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <h4 className="text-2xl font-black text-slate-900 mt-1">{value}</h4>
  </div>
);

export default Finance;
