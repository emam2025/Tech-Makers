'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Input from '../../../components/ui/Input';
import Drawer from '../../../components/ui/Drawer';
import { useToast } from '../../../components/ui/Toast';

export default function MessagesPage() {
  const { success, error: toastError } = useToast();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [newMsg, setNewMsg] = useState('');
  const [search, setSearch] = useState('');
  const [newConvDrawer, setNewConvDrawer] = useState(false);
  const [newConv, setNewConv] = useState({ title: '', participant_id: '' });
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const loadConversations = useCallback(async () => {
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
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  const openConversation = async (conv) => {
    setActiveConv(conv);
    setMsgLoading(true);
    try {
      const res = await fetch(`/api/admin/messages?conversation_id=${conv.id}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } finally {
      setMsgLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMsg.trim() || !activeConv) return;
    setSending(true);
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: activeConv.id, content: newMsg }),
      });
      if (res.ok) {
        setNewMsg('');
        openConversation(activeConv);
        loadConversations();
      } else {
        toastError('فشل الإرسال');
      }
    } finally {
      setSending(false);
    }
  };

  const createConversation = async () => {
    if (!newConv.title.trim()) return;
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: 'new', title: newConv.title, participant_id: newConv.participant_id }),
      });
      if (res.ok) {
        setNewConvDrawer(false);
        setNewConv({ title: '', participant_id: '' });
        loadConversations();
        success('تم إنشاء المحادثة');
      } else {
        toastError('فشل الإنشاء');
      }
    } catch {
      toastError('خطأ في الاتصال');
    }
  };

  const filtered = conversations.filter((c) => {
    if (!search) return true;
    return (c.title || '').toLowerCase().includes(search.toLowerCase()) ||
           (c.last_message || '').toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1>الرسائل</h1><p>المحادثات مع الطلاب والمدربين</p></div>
        <Button icon="add_comment" onClick={() => setNewConvDrawer(true)}>محادثة جديدة</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
        {/* Conversations List */}
        <div className="card-admin overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[var(--color-border)]">
            <h2 className="text-sm font-bold text-[var(--color-text-primary)] mb-3">المحادثات ({filtered.length})</h2>
            <div className="relative">
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] text-[18px]">search</span>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث..." className="admin-input pr-9 text-sm py-2" />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {filtered.map((conv) => (
              <button
                key={conv.id}
                onClick={() => openConversation(conv)}
                className={`w-full text-right p-4 border-b border-[var(--color-border-light)] hover:bg-[var(--color-surface-dim)] transition-colors ${activeConv?.id === conv.id ? 'bg-[var(--color-primary-light)]' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[18px] text-[var(--color-primary)]">chat</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[var(--color-text-primary)]">{conv.title || 'محادثة'}</div>
                    <div className="text-xs text-[var(--color-text-tertiary)] truncate">{conv.last_message || 'لا توجد رسائل'}</div>
                  </div>
                  {conv.updated_at && (
                    <div className="text-[10px] text-[var(--color-text-tertiary)] flex-shrink-0">
                      {new Date(conv.updated_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
              </button>
            ))}
            {!loading && filtered.length === 0 && (
              <div className="p-8 text-center text-sm text-[var(--color-text-tertiary)]">
                <span className="material-symbols-outlined text-[40px] block mb-2">chat</span>
                {search ? 'لا توجد نتائج' : 'لا توجد محادثات'}
              </div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="lg:col-span-2 card-admin overflow-hidden flex flex-col">
          {activeConv ? (
            <>
              <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px] text-[var(--color-primary)]">chat</span>
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[var(--color-text-primary)]">{activeConv.title || 'محادثة'}</h2>
                    <p className="text-[10px] text-[var(--color-text-tertiary)]">{messages.length} رسالة</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-3">
                {msgLoading ? (
                  <div className="flex justify-center py-8">
                    <span className="material-symbols-outlined text-[var(--color-primary)] animate-spin">progress_activity</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-[var(--color-text-tertiary)]">
                    <span className="material-symbols-outlined text-[48px] mb-2">forum</span>
                    <p className="text-sm">ابدأ المحادثة</p>
                  </div>
                ) : messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender_id === activeConv.created_by ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-3 rounded-[var(--radius-lg)] ${msg.sender_id === activeConv.created_by ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface-dim)] text-[var(--color-text-primary)]'}`}>
                      {msg.sender?.full_name && msg.sender_id !== activeConv.created_by && (
                        <p className="text-[10px] font-bold mb-1 opacity-70">{msg.sender.full_name}</p>
                      )}
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-[10px] mt-1 opacity-60">{msg.created_at ? new Date(msg.created_at).toLocaleTimeString('ar-EG') : ''}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t border-[var(--color-border)]">
                <div className="flex gap-2">
                  <Input value={newMsg} onChange={(e) => setNewMsg(e.target.value)} placeholder="اكتب رسالة..." className="flex-1" onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()} />
                  <Button icon="send" onClick={sendMessage} loading={sending}>إرسال</Button>
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

      <Drawer isOpen={!!newConvDrawer} onClose={() => setNewConvDrawer(false)} title="محادثة جديدة"
        footer={<div className="flex gap-3"><Button onClick={createConversation}>إنشاء</Button><Button variant="outlined" onClick={() => setNewConvDrawer(false)}>إلغاء</Button></div>}>
        <div className="space-y-4">
          <Input label="عنوان المحادثة" value={newConv.title} onChange={(e) => setNewConv({ ...newConv, title: e.target.value })} required />
          <Input label="رقم هوية المشارك (اختياري)" value={newConv.participant_id} onChange={(e) => setNewConv({ ...newConv, participant_id: e.target.value })} />
        </div>
      </Drawer>
    </div>
  );
}
