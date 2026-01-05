
import React, { useState } from 'react';
import { Bell, Search, User, Menu, X } from 'lucide-react';
import { Student } from '../types';
import { Link } from 'react-router-dom';

interface HeaderProps {
  user: Student;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onToggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getDeptName = (dept: string) => {
    switch(dept) {
      case 'ACCOUNTING': return 'شعبة المحاسبة';
      case 'BIS': return 'شعبة نظم معلومات الأعمال';
      case 'MANAGEMENT': return 'شعبة الإدارة';
      default: return dept;
    }
  };

  const notifications = [
    { id: 1, text: 'تم تحديث جدول محاضرات شعبة BIS', time: 'منذ ساعة' },
    { id: 2, text: 'موعد امتحان الميد تيرم - محاسبة مالية', time: 'منذ 3 ساعات' },
    { id: 3, text: 'مرحبًا بك في منصة معهد العباسية الجديدة', time: 'أمس' },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-30 sticky top-0">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
        >
          <Menu size={24} />
        </button>
        
        <div className="relative hidden sm:block w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن المحاضرات، النتائج..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-full transition-colors relative ${showNotifications ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
              <div className="absolute left-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">الإشعارات</h4>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
                </div>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors">
                      <p className="text-sm text-slate-800 font-medium">{n.text}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center">
                  <button className="text-xs font-bold text-blue-600 hover:underline">عرض كل الإشعارات</button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="h-8 w-px bg-slate-200 mx-1"></div>

        <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
          <div className="text-left hidden lg:block text-right">
            <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{user.full_name}</p>
            <p className="text-xs text-blue-600 font-medium">{getDeptName(user.department)} - الفرقة {user.level}</p>
          </div>
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border-2 border-slate-50">
            <User size={24} />
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
