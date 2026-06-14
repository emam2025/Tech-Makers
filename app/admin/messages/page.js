'use client';

import { useEffect, useState, useCallback } from 'react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Input from '../../../components/ui/Input';

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [newMsg, setNewMsg] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/messages');
        if (res.ok) {
          const data = await res.json();
          setConversations(data.conversations || []);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const openConversation = async (conv) => {
    setActiveConv(conv);
    setMsgLoading(true);
    try {
      const res = await fetch(`/api/admin/messages?conversation_id=${conv.id}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } finally {
      setMsgLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMsg.trim() || !activeConv) return;
    const res = await fetch('/api/admin/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation_id: activeConv.id, content: newMsg }),
    });
    if (res.ok) {
      setNewMsg('');
      openConversation(activeConv);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1>الرسائل</h1><p>المحادثات مع الطلاب والمدربين</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
        {/* Conversations List */}
        <div className="card-admin overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[var(--color-border)]">
            <h2 className="text-sm font-bold text-[var(--color-text-primary)]">المحادثات</h2>
          </div>
          <div className="flex-1 overflow-auto">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => openConversation(conv)}
                className={`w-full text-right p-4 border-b border-[var(--color-border-light)] hover:bg-[var(--color-surface-dim)] transition-colors ${activeConv?.id === conv.id ? 'bg-[var(--color-primary-light)]' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px] text-[var(--color-primary)]">person</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[var(--color-text-primary)]">{conv.title || 'محادثة'}</div>
                    <div className="text-xs text-[var(--color-text-tertiary)] truncate">{conv.last_message || 'لا توجد رسائل'}</div>
                  </div>
                </div>
              </button>
            ))}
            {!loading && conversations.length === 0 && (
              <div className="p-8 text-center text-sm text-[var(--color-text-tertiary)]">لا توجد محادثات</div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="lg:col-span-2 card-admin overflow-hidden flex flex-col">
          {activeConv ? (
            <>
              <div className="p-4 border-b border-[var(--color-border)]">
                <h2 className="text-sm font-bold text-[var(--color-text-primary)]">{activeConv.title || 'محادثة'}</h2>
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-3">
                {msgLoading ? (
                  <div className="flex justify-center py-8"><span className="material-symbols-outlined text-[var(--color-primary)] animate-spin">progress_activity</span></div>
                ) : messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender_id === activeConv.created_by ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-3 rounded-[var(--radius-lg)] ${msg.sender_id === activeConv.created_by ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface-dim)] text-[var(--color-text-primary)]'}`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-[10px] mt-1 opacity-60">{msg.created_at ? new Date(msg.created_at).toLocaleTimeString('ar-EG') : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-[var(--color-border)]">
                <div className="flex gap-2">
                  <Input value={newMsg} onChange={(e) => setNewMsg(e.target.value)} placeholder="اكتب رسالة..." className="flex-1" onKeyDown={(e) => e.key === 'Enter' && sendMessage()} />
                  <Button icon="send" onClick={sendMessage}>إرسال</Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-[48px] text-[var(--color-text-tertiary)]">chat</span>
                <p className="text-sm text-[var(--color-text-tertiary)] mt-2">اختر محادثة للبدء</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
