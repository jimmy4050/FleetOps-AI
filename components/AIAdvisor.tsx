
import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Send, Sparkles, AlertCircle, RefreshCw, Bot } from 'lucide-react';
import { getFleetInsights, chatWithAdvisor } from '../services/geminiService';
import { mockVehicles, mockMaintenance } from '../mockData';

const AIAdvisor: React.FC = () => {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [chatInput, setChatInput] = useState<string>('');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    generateInitialInsights();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const generateInitialInsights = async () => {
    setLoading(true);
    const result = await getFleetInsights(mockVehicles, mockMaintenance);
    setInsights(result || '');
    setLoading(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput('');

    const response = await chatWithAdvisor(userMessage, { vehicles: mockVehicles, maintenance: mockMaintenance });
    setMessages(prev => [...prev, { role: 'assistant', content: response || 'No response' }]);
  };

  return (
    <div className="h-full flex flex-col gap-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            FleetOps AI Advisor <Sparkles className="text-indigo-600" />
          </h2>
          <p className="text-slate-500 mt-1">Generative AI insights powered by Gemini.</p>
        </div>
        <button 
          onClick={generateInitialInsights}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh Strategy
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        {/* Intelligence Report */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-center gap-3">
              <Cpu className="text-indigo-600" />
              <h3 className="font-bold text-slate-900">Current Intelligence Report</h3>
            </div>
            <div className="p-8 overflow-y-auto prose prose-slate max-w-none">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-4 bg-slate-100 rounded w-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                  ))}
                </div>
              ) : (
                <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {insights}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-4">
            <AlertCircle className="text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-900">AI Risk Assessment</p>
              <p className="text-xs text-amber-700 mt-1">
                Vehicle T680 (Kenworth) shows a high probability of brake system wear based on mileage and historical service data. Recommend inspection within 48 hours.
              </p>
            </div>
          </div>
        </div>

        {/* AI Chat Interface */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col h-[600px] lg:h-auto">
          <div className="p-6 border-b border-slate-200 flex items-center gap-3">
            <Bot className="text-indigo-600" />
            <h3 className="font-bold text-slate-900">Expert Advisor Chat</h3>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.length === 0 && (
              <div className="text-center py-10 px-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Sparkles size={20} className="text-indigo-400" />
                </div>
                <p className="text-slate-500 text-sm">Ask anything about your fleet. "Which trucks need fuel?" or "Compare driver ratings."</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-4 text-sm ${
                  msg.role === 'user' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200">
            <div className="relative">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Talk to FleetOps AI..." 
                className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm transition-all"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1.5 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;
