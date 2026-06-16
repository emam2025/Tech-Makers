'use client';

import { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function AiChat({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setError('');

    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: messages.slice(-10),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      } else {
        setError(data.error || 'حدث خطأ');
      }
    } catch {
      setError('خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-[var(--color-primary)] text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-110"
        title="مساعد الذكاء الاصطناعي"
      >
        <span className="material-symbols-outlined text-[28px]">smart_toy</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[520px] max-h-[calc(100vh-100px)] bg-[var(--color-surface)] rounded-[var(--radius-xl)] shadow-2xl border border-[var(--color-border)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-[var(--color-primary)] text-white flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">smart_toy</span>
          </div>
          <div>
            <h3 className="text-sm font-bold">مساعد TKA الذكي</h3>
            <p className="text-[10px] opacity-80">{user?.full_name || 'مرحباً'}</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[32px] text-[var(--color-primary)]">smart_toy</span>
            </div>
            <h4 className="text-sm font-bold text-[var(--color-text-primary)] mb-1">مرحباً {user?.full_name || ''}!</h4>
            <p className="text-xs text-[var(--color-text-tertiary)] leading-relaxed">
              أنا مساعدك التعليمي الذكي.<br />
              أساعدك في شرح المفاهيم والدروس.<br />
              اسألني عن أي شيء تتعلمه!
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-[var(--color-primary)] text-white rounded-br-md'
                : 'bg-[var(--color-surface-dim)] text-[var(--color-text-primary)] rounded-bl-md'
            }`}>
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="material-symbols-outlined text-[14px] text-[var(--color-primary)]">smart_toy</span>
                  <span className="text-[10px] font-bold text-[var(--color-primary)]">مساعد TKA</span>
                </div>
              )}
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[var(--color-surface-dim)] p-3 rounded-2xl rounded-bl-md">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--color-primary)] animate-spin text-[16px]">progress_activity</span>
                <span className="text-xs text-[var(--color-text-tertiary)]">يفكر...</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-[var(--color-danger-light)] rounded-xl text-xs text-[var(--color-danger)] text-center">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[var(--color-border)] flex-shrink-0">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="اكتب سؤالك هنا..."
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-primary)] disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center hover:bg-[var(--color-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </div>
        <p className="text-[9px] text-[var(--color-text-tertiary)] text-center mt-1.5">
          المساعد يشرح المفاهيم فقط — لا يحل التاسكات
        </p>
      </div>
    </div>
  );
}
