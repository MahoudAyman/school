
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  Bot, 
  LogOut,
  User,
  X,
  CreditCard
} from 'lucide-react';
import { Student } from '../types';

interface SidebarProps {
  user: Student;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'لوحة التحكم', path: '/', icon: LayoutDashboard },
    { name: 'النتائج الدراسية', path: '/grades', icon: GraduationCap },
    { name: 'الجدول الدراسي', path: '/schedule', icon: Calendar },
    { name: 'المواد العلمية', path: '/materials', icon: BookOpen },
    { name: 'الشؤون المالية', path: '/finance', icon: CreditCard },
    { name: 'المساعد الذكي', path: '/ai', icon: Bot },
    { name: 'الملف الشخصي', path: '/profile', icon: User },
  ];

  const sidebarClasses = `
    fixed inset-y-0 right-0 z-50 w-64 bg-white border-l border-slate-200 flex flex-col h-full transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block
    ${isOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full'}
  `;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
        ></div>
      )}

      <div className={sidebarClasses}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              ع
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-sm">معهد العباسية</h1>
              <p className="text-xs text-slate-500 font-medium tracking-tight">المنصة التعليمية</p>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => { if (window.innerWidth < 768) onClose(); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                  ? 'bg-blue-50 text-blue-600 font-semibold' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-semibold">تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
