
import React, { useEffect, useState } from 'react';
import { Book, FileText, Download, Play, MoreHorizontal, Loader2, Search, Info, ExternalLink, Eye } from 'lucide-react';
import { Student, Material } from '../types';
import { supabase } from '../supabaseClient';

interface MaterialsProps {
  user: Student;
}

const Materials: React.FC<MaterialsProps> = ({ user }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const categories = ['الكل', 'المحاضرات', 'الكتب', 'التكليفات', 'فيديوهات'];
  
  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .or(`department.eq.${user.department},department.is.null`)
        .or(`level.eq.${user.level},level.is.null`);
      
      if (!error && data) {
        setMaterials(data);
        setFilteredMaterials(data);
      }
      setLoading(false);
    };

    fetchMaterials();
  }, [user.department, user.level]);

  useEffect(() => {
    let result = materials;
    if (activeCategory !== 'الكل') {
      const typeMap: Record<string, string> = {
        'المحاضرات': 'lecture',
        'الكتب': 'book',
        'التكليفات': 'assignment',
        'فيديوهات': 'video'
      };
      result = result.filter(m => m.type === typeMap[activeCategory]);
    }
    if (searchTerm) {
      result = result.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredMaterials(result);
  }, [activeCategory, searchTerm, materials]);

  const handleAction = (item: Material, action: 'download' | 'view') => {
    if (!item.url) {
      alert('عذراً، الرابط الخاص بهذا الملف غير متوفر حالياً.');
      return;
    }

    setActionLoading(item.id + action);
    
    // محاكاة تأخير بسيط لتجربة مستخدم أفضل
    setTimeout(() => {
      if (action === 'view') {
        window.open(item.url, '_blank');
      } else {
        // إنشاء عنصر <a> مؤقت للتحميل
        const link = document.createElement('a');
        link.href = item.url as string;
        link.setAttribute('download', item.title);
        link.setAttribute('target', '_blank'); // لضمان العمل في حالة منع التحميل المباشر
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setActionLoading(null);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900">المكتبة الرقمية</h2>
          <p className="text-slate-500 font-medium mt-1">المصادر العلمية المتاحة لشعبتك (الفرقة {user.level})</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="ابحث في المكتبة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl py-3 pr-12 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-[280px] shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-black whitespace-nowrap transition-all ${
                  activeCategory === cat 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/25 scale-105' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
             <Loader2 className="animate-spin text-blue-600" size={40} />
             <p className="text-slate-400 font-bold text-sm">جاري جلب الملفات من السيرفر...</p>
          </div>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="bg-white p-24 rounded-3xl border border-dashed border-slate-300 text-center space-y-6">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
             <Book size={40} />
           </div>
           <div className="max-w-xs mx-auto">
              <p className="text-slate-600 font-black text-xl">لا توجد نتائج!</p>
              <p className="text-slate-400 text-sm mt-2">لم نتمكن من العثور على أي ملفات تطابق بحثك حالياً.</p>
           </div>
           <button onClick={() => {setActiveCategory('الكل'); setSearchTerm('');}} className="px-6 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-black hover:bg-blue-100 transition-colors">إعادة ضبط البحث</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMaterials.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col gap-6 group hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 relative overflow-hidden">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:rotate-6 ${
                  item.format === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {item.format === 'PDF' ? <FileText size={32} /> : <Play size={32} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-slate-900 text-lg truncate group-hover:text-blue-600 transition-colors">{item.title}</h4>
                  <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">{item.format} • {item.size} • {item.date}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center justify-between pt-6 border-t border-slate-50 mt-auto gap-3">
                 <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-black text-slate-500">
                    <ExternalLink size={12} />
                    رابط المصدر
                 </div>
                 <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleAction(item, 'view')}
                      disabled={!!actionLoading}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
                      title="عرض مباشر"
                    >
                      {actionLoading === (item.id + 'view') ? <Loader2 size={18} className="animate-spin" /> : <Eye size={18} />}
                    </button>
                    <button 
                      onClick={() => handleAction(item, 'download')}
                      disabled={!!actionLoading}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm transition-all ${
                        actionLoading === (item.id + 'download') 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'
                      }`}
                    >
                        {actionLoading === (item.id + 'download') ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <>
                            <Download size={18} />
                            <span>تحميل</span>
                          </>
                        )}
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl">
        <div className="w-20 h-20 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center shrink-0 border border-blue-600/30">
          <Info size={40} />
        </div>
        <div className="text-center md:text-right flex-1">
          <h4 className="text-2xl font-black mb-2">هل تحتاج إلى مراجع إضافية؟</h4>
          <p className="text-slate-400 font-medium">يمكنك طلب أي كتاب أو ملف تعليمي غير موجود بالمكتبة عبر التواصل مع إدارة شؤون الطلاب أو المساعد "عباس".</p>
        </div>
        <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all hover:scale-105 shadow-xl shadow-blue-500/20">تواصل معنا الآن</button>
      </div>
    </div>
  );
};

export default Materials;
