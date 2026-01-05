
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { Student, Message } from '../types';
import { getGeminiResponse } from '../services/gemini';

interface AIAssistantProps {
  user: Student;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `أهلاً بك يا ${user.full_name}! أنا عباس، مساعدك الذكي في معهد العباسية. كيف يمكنني مساعدتك في دراستك اليوم؟` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const response = await getGeminiResponse(messages, input);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  const clearChat = () => {
    setMessages([{ role: 'model', text: `تم بدء جلسة جديدة. كيف يمكنني مساعدتك؟` }]);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">عباس - المساعد الذكي</h3>
            <div className="flex items-center gap-1">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">متصل الآن</span>
            </div>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 text-slate-400 hover:text-red-600 transition-colors"
          title="مسح المحادثة"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 shadow-sm ${
                msg.role === 'user' ? 'bg-slate-100 text-slate-600' : 'bg-blue-600 text-white'
              }`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                ? 'bg-slate-100 text-slate-800 rounded-tr-none' 
                : 'bg-blue-600 text-white rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-end">
             <div className="flex flex-row-reverse gap-3 max-w-[70%] items-start">
               <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                 <Bot size={18} />
               </div>
               <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl rounded-tl-none flex items-center gap-2">
                 <Loader2 size={18} className="animate-spin" />
                 <span className="text-sm font-medium">عباس يفكر...</span>
               </div>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100">
        <form onSubmit={handleSend} className="relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اسأل عباس عن أي شيء في دراستك..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pr-6 pl-14 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium"
          />
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className={`absolute left-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all ${
              !input.trim() || loading 
              ? 'bg-slate-200 text-slate-400' 
              : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
            }`}
          >
            <Send size={20} />
          </button>
        </form>
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
          <Sparkles size={12} />
          <span>يعمل بواسطة تقنيات الذكاء الاصطناعي المتطورة Gemini 3</span>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
