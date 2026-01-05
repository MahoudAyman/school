
import React, { useState } from 'react';
import { User, Mail, Smartphone, MapPin, Save, Shield, BadgeCheck, Loader2 } from 'lucide-react';
import { Student } from '../types';
import { supabase } from '../supabaseClient';

interface ProfileProps {
  user: Student;
  onUpdate: (user: Student) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user.full_name,
    email: user.email || '',
  });

  const getDeptName = (dept: string) => {
    switch(dept) {
      case 'ACCOUNTING': return 'شعبة المحاسبة';
      case 'BIS': return 'شعبة نظم معلومات الأعمال';
      case 'MANAGEMENT': return 'شعبة الإدارة';
      default: return dept;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .update({ full_name: formData.full_name })
        .eq('id', user.id)
        .select()
        .single();
      
      if (!error && data) {
        onUpdate(data as Student);
        setIsEditing(false);
        alert('تم تحديث البيانات بنجاح');
      }
    } catch (err) {
      alert('فشل تحديث البيانات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900">الملف الشخصي</h2>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : isEditing ? <Save size={20} /> : <User size={20} />}
          <span>{isEditing ? 'حفظ التغييرات' : 'تعديل البيانات'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center">
            <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl">
              <User size={64} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">{user.full_name}</h3>
            <p className="text-sm text-blue-600 font-bold mt-1">{getDeptName(user.department)}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
              <BadgeCheck size={14} />
              طالب مفعل
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl text-white">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Shield size={18} className="text-blue-400" />
              أمن الحساب
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-60">الرقم القومي</span>
                <span className="font-mono">************{user.national_id.slice(-2)}</span>
              </div>
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-colors">تغيير كلمة المرور</button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h4 className="text-lg font-bold text-slate-900 mb-6">المعلومات الشخصية</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">الاسم بالكامل</label>
                <input 
                  type="text" 
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  disabled={!isEditing}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  value={formData.email}
                  placeholder="example@abbasia.edu.eg"
                  disabled={!isEditing}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h4 className="text-lg font-bold text-slate-900 mb-6">المعلومات الأكاديمية</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <AcademicStat label="الفرقة" value={user.level.toString()} />
              <AcademicStat label="المعدل (GPA)" value={user.gpa.toString()} />
              <AcademicStat label="الحضور" value={`${user.attendance_rate}%`} />
              <AcademicStat label="الساعات" value={user.total_credits.toString()} />
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0"><MapPin size={24}/></div>
            <div>
              <h5 className="font-bold text-amber-900 text-sm">تنبيه هام</h5>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">يرجى التأكد من صحة بياناتك الشخصية حيث سيتم استخدامها في طباعة الشهادات والوثائق الرسمية للمعهد. في حالة وجود خطأ في الرقم القومي يرجى التوجه لمكتب شؤون الطلاب.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AcademicStat = ({ label, value }: { label: string, value: string }) => (
  <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
    <p className="text-[10px] uppercase font-black text-slate-400 mb-1">{label}</p>
    <p className="text-xl font-black text-blue-600">{value}</p>
  </div>
);

export default Profile;
