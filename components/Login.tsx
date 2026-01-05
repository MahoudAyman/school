
import React, { useState } from 'react';
import { Fingerprint, Lock, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Student } from '../types';
import { supabase } from '../supabaseClient';

interface LoginProps {
  onLogin: (student: Student) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [nationalId, setNationalId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nationalId.length !== 14) {
      setError('يرجى إدخال رقم قومي صحيح مكون من 14 رقم');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: sbError } = await supabase
        .from('students')
        .select('*')
        .eq('national_id', nationalId)
        .single();

      if (sbError || !data) {
        setError('بيانات الدخول غير صحيحة، يرجى مراجعة شؤون الطلاب');
      } else {
        onLogin(data as Student);
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال بالسيرفر');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center text-white font-bold text-4xl shadow-xl shadow-blue-500/20 mb-6">
            ع
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">بوابة الطالب الذكية</h1>
          <p className="text-slate-500 mt-2 font-medium">سجل دخولك باستخدام الرقم القومي</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 mr-1">الرقم القومي</label>
            <div className="relative group">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Fingerprint size={20} />
              </div>
              <input 
                type="text" 
                maxLength={14}
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                placeholder="29000000000000"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pr-12 pl-4 text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-right"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 mr-1">كلمة المرور (نفس الرقم القومي)</label>
            <div className="relative group">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Lock size={20} />
              </div>
              <input 
                type="password" 
                value={nationalId}
                readOnly
                className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-4 pr-12 pl-4 text-lg font-mono cursor-not-allowed opacity-60"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium animate-bounce">
              <ShieldCheck size={18} />
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <ArrowLeft size={20} />
                <span>دخول المنصة</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
