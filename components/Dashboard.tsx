
import React, { useEffect, useState } from 'react';
import { 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis
} from 'recharts';
import { 
  BookCheck, 
  Clock, 
  Trophy, 
  AlertCircle,
  Megaphone,
  Loader2,
  TrendingUp
} from 'lucide-react';
import { Student, Announcement } from '../types';
import { supabase } from '../supabaseClient';

interface DashboardProps {
  user: Student;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([
    { name: 'تيرم 1', grade: 70 },
    { name: 'تيرم 2', grade: 75 },
    { name: 'تيرم 3', grade: 80 },
    { name: 'تيرم 4', grade: 85 },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      // Fetch News
      const { data: newsData } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (newsData) setAnnouncements(newsData);
      
      // Simulate real progress data based on user GPA
      const progress = [
        { name: 'البداية', grade: 60 },
        { name: 'الفرقة 1', grade: Math.min(100, (user.gpa / 4) * 100 - 10) },
        { name: 'الفرقة 2', grade: Math.min(100, (user.gpa / 4) * 100 - 5) },
        { name: 'الحالي', grade: (user.gpa / 4) * 100 },
      ];
      setChartData(progress);
      
      setLoading(false);
    };
    fetchDashboardData();
  }, [user.gpa]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900">مرحباً بك، {user.full_name.split(' ')[0]} 👋</h2>
          <p className="text-slate-500 font-medium">إليك نظرة سريعة على أدائك الأكاديمي اليوم</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<BookCheck className="text-blue-600" />} label="المعدل التراكمي" value={user.gpa.toString()} sub="من أصل 4.0" />
        <StatCard icon={<Clock className="text-amber-600" />} label="نسبة الحضور" value={`${user.attendance_rate}%`} sub="مرتفع" />
        <StatCard icon={<Trophy className="text-emerald-600" />} label="الساعات المجتازة" value={user.total_credits.toString()} sub="ساعة معتمدة" />
        <StatCard icon={<TrendingUp className="text-purple-600" />} label="المستوى الحالي" value={user.level.toString()} sub={`الفرقة ${user.level}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-xl text-slate-900">منحنى التطور الدراسي</h3>
            <span className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-bold">مستوى مستقر</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorGrade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="grade" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorGrade)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-8">
            <Megaphone size={22} className="text-blue-600" />
            <h3 className="font-black text-xl text-slate-900">أخبار المعهد</h3>
          </div>
          <div className="space-y-4 flex-1">
            {loading ? (
              <div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-600" /></div>
            ) : announcements.length > 0 ? (
              announcements.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-blue-200 hover:bg-white transition-all cursor-pointer group shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      item.type === 'deadline' ? 'bg-red-100 text-red-600' : 
                      item.type === 'event' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {item.type === 'news' ? 'خبر' : item.type === 'event' ? 'فعالية' : 'هام'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">{new Date(item.created_at).toLocaleDateString('ar-EG')}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">{item.title}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto text-slate-300 mb-2" />
                <p className="text-slate-400 text-sm font-medium">لا توجد إعلانات اليوم</p>
              </div>
            )}
          </div>
          <button className="w-full mt-6 py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-black hover:bg-slate-100 transition-colors">عرض كافة الإعلانات</button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub }: { icon: React.ReactNode, label: string, value: string, sub: string }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
    <div className="relative z-10">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-blue-50 transition-all">
        {icon}
      </div>
      <p className="text-sm font-bold text-slate-500 mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h4>
        <span className="text-xs font-bold text-slate-400">{sub}</span>
      </div>
    </div>
    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full opacity-50 group-hover:bg-blue-50 transition-colors"></div>
  </div>
);

export default Dashboard;
