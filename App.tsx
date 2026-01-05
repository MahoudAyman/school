
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Grades from './components/Grades';
import Schedule from './components/Schedule';
import Materials from './components/Materials';
import AIAssistant from './components/AIAssistant';
import Profile from './components/Profile';
import Finance from './components/Finance';
import { Student } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('abbasia_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (student: Student) => {
    setUser(student);
    localStorage.setItem('abbasia_user', JSON.stringify(student));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('abbasia_user');
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      {!user ? (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <div className="flex min-h-screen bg-slate-50 text-slate-800">
          <Sidebar user={user} onLogout={handleLogout} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Header user={user} onToggleSidebar={toggleSidebar} />
            <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
              <Routes>
                <Route path="/" element={<Dashboard user={user} />} />
                <Route path="/grades" element={<Grades user={user} />} />
                <Route path="/schedule" element={<Schedule user={user} />} />
                <Route path="/materials" element={<Materials user={user} />} />
                <Route path="/ai" element={<AIAssistant user={user} />} />
                <Route path="/profile" element={<Profile user={user} onUpdate={setUser} />} />
                <Route path="/finance" element={<Finance user={user} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      )}
    </Router>
  );
};

export default App;
