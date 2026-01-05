
import React, { useEffect, useState } from 'react';
import { Student, Grade } from '../types';
import { supabase } from '../supabaseClient';
import { 
  CheckCircle2, 
  ChevronRight, 
  Award, 
  Loader2
} from 'lucide-react';

interface GradesProps {
  user: Student;
}

const Grades: React.FC<GradesProps> = ({ user }) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      const { data, error } = await supabase
        .from('grades')
        .select('*')
        .eq('student_id', user.id);
      
      if (!error && data) {
        setGrades(data);
      }
      setLoading(false);
    };

    fetchGrades();
  }, [user.id]);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">النتائج الدراسية</h2>
          <p className="text-slate-500 text-sm mt-1">نتائج الفصل الدراسي الحالي - الفرقة {user.level}</p>
        </div>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
          <Award size={20} />
          <span className="font-bold text-lg">{user.gpa} GPA</span>
        </div>
      </div>

      {grades.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
          لم يتم رصد درجات حتى الآن
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {grades.map((grade, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-slate-800 leading-tight">{grade.course_name}</h3>
                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                  grade.score >= 90 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {grade.grade_letter}
                </div>
              </div>
              
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-black text-slate-900">{grade.score}<span className="text-sm text-slate-400 font-medium mr-1">/ {grade.max_score}</span></p>
                </div>
                <div className="w-12 h-12">
                   <div className="relative w-full h-full flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" 
                          strokeDasharray={2 * Math.PI * 20} 
                          strokeDashoffset={2 * Math.PI * 20 * (1 - grade.score/grade.max_score)} 
                          className="text-blue-600" />
                      </svg>
                      <span className="absolute text-[10px] font-bold text-blue-600">{Math.round((grade.score/grade.max_score)*100)}%</span>
                   </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500" /> تم الاعتماد</span>
                <button className="text-blue-600 font-semibold flex items-center gap-0.5">التفاصيل <ChevronRight size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Grades;
