
import React, { useEffect, useState } from 'react';
import { Student, ScheduleItem, ExamItem } from '../types';
import { supabase } from '../supabaseClient';
import { MapPin, Clock, Video, Loader2, BellRing, Info, Calendar, FileText } from 'lucide-react';

interface ScheduleProps {
  user: Student;
}

const Schedule: React.FC<ScheduleProps> = ({ user }) => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'lectures' | 'exams'>('lectures');
  const [reminders, setReminders] = useState<Set<string>>(new Set());
  
  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: scheduleData } = await supabase
        .from('schedule')
        .select('*')
        .eq('department', user.department)
        .eq('level', user.level);
      
      const { data: examsData } = await supabase
        .from('exams')
        .select('*')
        .eq('department', user.department)
        .eq('level', user.level);

      if (scheduleData) setSchedule(scheduleData);
      if (examsData) setExams(examsData);
      setLoading(false);
    };

    fetchData();
  }, [user.department, user.level]);

  const toggleReminder = (course: string) => {
    const newReminders = new Set(reminders);
    if (newReminders.has(course)) newReminders.delete(course);
    else newReminders.add(course);
    setReminders(newReminders);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900">المواعيد الدراسية</h2>
          <p className="text-slate-500 font-medium">شعبة {user.department} - الفرقة {user.level}</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-slate-200">
          <button 
            onClick={() => setView('lectures')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === 'lectures' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
          >
            جدول المحاضرات
          </button>
          <button 
            onClick={() => setView('exams')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === 'exams' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
          >
            جدول الامتحانات
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
      ) : view === 'lectures' ? (
        <div className="grid grid-cols-1 gap-6">
          {days.map((day) => {
            const items = schedule.filter(i => i.day === day);
            return (
              <div key={day} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">{day}</h3>
                </div>
                <div className="p-0">
                  {items.length > 0 ? items.map((item, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 group">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${reminders.has(item.course) ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-50 text-blue-600'}`}>
                          <Clock size={28} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-xl">{item.course}</p>
                          <p className="text-sm text-slate-500 font-medium">{item.time}</p>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-slate-700 text-sm font-bold border border-slate-200">
                          <MapPin size={18} className="text-blue-600" />
                          {item.room}
                        </div>
                        <button onClick={() => toggleReminder(item.course)} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${reminders.has(item.course) ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'}`}>
                          {reminders.has(item.course) ? 'تنبيه مفعل' : 'تذكير'}
                        </button>
                      </div>
                    </div>
                  )) : <div className="p-8 text-center text-slate-400 italic font-medium">لا توجد محاضرات</div>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-right border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-6 font-bold text-slate-700">المادة</th>
                <th className="p-6 font-bold text-slate-700">التاريخ</th>
                <th className="p-6 font-bold text-slate-700">الوقت</th>
                <th className="p-6 font-bold text-slate-700">المكان</th>
              </tr>
            </thead>
            <tbody>
              {exams.length > 0 ? exams.map((exam, idx) => (
                <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="p-6 font-bold text-slate-900">{exam.course_name}</td>
                  <td className="p-6 text-slate-600">{new Date(exam.exam_date).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}</td>
                  <td className="p-6 text-slate-600">{exam.exam_time}</td>
                  <td className="p-6">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-bold">{exam.room}</span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-slate-400">لا يوجد امتحانات معلنة حالياً</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Schedule;
