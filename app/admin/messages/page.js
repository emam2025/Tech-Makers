'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Drawer from '../../../components/ui/Drawer';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { useToast } from '../../../components/ui/Toast';

export default function MessagesPage() {
  const { success, error: toastError } = useToast();
  const [conversations, setConversations] = useState([]);
  const [groups, setGroups] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [newMsg, setNewMsg] = useState('');
  const [search, setSearch] = useState('');
  const [newConvDrawer, setNewConvDrawer] = useState(false);
  const [newConv, setNewConv] = useState({ title: '', participant_id: '', group_id: '' });
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

  useEffect(() => {
    loadConversations();
    fetch('/api/admin/groups').then(r => r.ok ? r.json() : {}).then(d => setGroups(d.groups || []));
  }, [loadConversations]);

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
        body: JSON.stringify({
          conversation_id: 'new',
          title: newConv.title,
          participant_id: newConv.participant_id || undefined,
          group_id: newConv.group_id || undefined,
        }),
      });
      if (res.ok) {
        setNewConvDrawer(false);
        setNewConv({ title: '', participant_id: '', group_id: '' });
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

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'الآن';
    if (mins < 60) return `منذ ${mins} د`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `منذ ${hours} س`;
    const days = Math.floor(hours / 24);
    return days < 7 ? (days === 0 ? 'أمس' : `${days} أيام`) : new Date(dateStr).toLocaleDateString('ar-EG');
  };

  const isOnline = (conv) => {
    if (!conv.updated_at) return false;
    const diff = Date.now() - new Date(conv.updated_at).getTime();
    return diff < 5 * 60 * 1000;
  };

  return (
    <div className="max-w-container-max mx-auto px-md py-lg">
      {/* Page Header */}
      <div className="mb-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary mb-xs">المحادثات</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">المحادثات مع الطلاب والمدربين</p>
        </div>
        <button
          onClick={() => setNewConvDrawer(true)}
          className="admin-btn admin-btn-primary"
        >
          <span className="material-symbols-outlined text-lg">add_comment</span>
          <span>محادثة جديدة</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-md">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute right-md text-on-surface-variant">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث في المحادثات..."
            className="w-full pr-12 pl-4 py-3 bg-surface-container-low border border-outline-variant rounded-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-body-sm text-body-sm text-on-surface"
          />
        </div>
      </div>

      {/* Chat Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md" style={{ height: 'calc(100vh - 240px)', minHeight: '500px' }}>

        {/* Conversations List Panel */}
        <div className="bg-surface-container-lowest border border-outline-variant bg-surface-container-lowest rounded-xl overflow-hidden flex flex-col border border-outline-variant">
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="space-y-base p-md">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center gap-md p-sm rounded-lg animate-pulse">
                    <div className="w-14 h-14 bg-surface-container rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-surface-container rounded w-2/3" />
                      <div className="h-3 bg-surface-container rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 px-md">
                <span className="material-symbols-outlined text-[64px] text-outline mb-sm block">chat</span>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">
                  {search ? 'لا توجد نتائج' : 'لا توجد محادثات'}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {search ? 'جرّب البحث بكلمات مختلفة' : 'ابدأ محادثة جديدة'}
                </p>
              </div>
            ) : (
              <div>
                {filtered.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => openConversation(conv)}
                    className={`w-full text-right flex items-center gap-md p-md transition-colors cursor-pointer ${
                      activeConv?.id === conv.id
                        ? 'bg-primary-light'
                        : 'hover:bg-surface-container-low'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0 w-14 h-14">
                      <div className={`w-full h-full rounded-full flex items-center justify-center ${
                        conv.group_id ? 'bg-secondary-container' : 'bg-primary-container'
                      }`}>
                        <span className={`material-symbols-outlined text-2xl ${
                          conv.group_id ? 'text-on-secondary-container' : 'text-on-primary-container'
                        }`}>
                          {conv.group_id ? 'groups' : 'person'}
                        </span>
                      </div>
                      {isOnline(conv) && !conv.group_id && (
                        <div className="absolute bottom-0 left-0 w-4 h-4 bg-success border-2 border-white rounded-full" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-baseline mb-xs">
                        <h3 className="font-label-md text-label-md text-on-surface font-bold truncate">
                          {conv.title || 'محادثة'}
                        </h3>
                        <span className="text-xs text-on-surface-variant flex-shrink-0 mr-2">
                          {timeAgo(conv.updated_at)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center gap-xs">
                        <p className="font-body-sm text-body-sm text-on-surface-variant truncate flex-grow">
                          {conv.last_message || 'لا توجد رسائل'}
                        </p>
                        {conv.unread_count > 0 && (
                          <div className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0" />
                        )}
                        {conv.unread_count === 0 && conv.last_message && (
                          <span className="material-symbols-outlined text-sm text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Messages Panel */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant bg-surface-container-lowest rounded-xl overflow-hidden flex flex-col border border-outline-variant">
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="p-md border-b border-outline-variant flex items-center gap-md">
                <div className="relative flex-shrink-0 w-11 h-11">
                  <div className={`w-full h-full rounded-full flex items-center justify-center ${
                    activeConv.group_id ? 'bg-secondary-container' : 'bg-primary-container'
                  }`}>
                    <span className={`material-symbols-outlined ${
                      activeConv.group_id ? 'text-on-secondary-container' : 'text-on-primary-container'
                    }`}>
                      {activeConv.group_id ? 'groups' : 'person'}
                    </span>
                  </div>
                  {isOnline(activeConv) && !activeConv.group_id && (
                    <div className="absolute bottom-0 left-0 w-3 h-3 bg-success border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-label-md text-label-md text-on-surface font-bold truncate">
                    {activeConv.title || 'محادثة'}
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    {messages.length} رسالة
                    {activeConv.group?.name && ` — ${activeConv.group.name}`}
                    {activeConv.participants?.length && ` — ${activeConv.participants.length} مشارك`}
                  </p>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-md space-y-sm bg-surface-container-low">
                {msgLoading ? (
                  <div className="flex justify-center py-16">
                    <span className="material-symbols-outlined text-primary animate-spin text-4xl">progress_activity</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-on-surface-variant">
                    <span className="material-symbols-outlined text-[64px] mb-sm">forum</span>
                    <p className="font-body-sm text-body-sm">ابدأ المحادثة</p>
                  </div>
                ) : messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender_id === activeConv.created_by ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-sm rounded-xl ${
                      msg.sender_id === activeConv.created_by
                        ? 'bg-primary text-white'
                        : 'bg-surface-container-lowest border border-outline-variant text-on-surface'
                    }`}>
                      {msg.sender?.full_name && msg.sender_id !== activeConv.created_by && (
                        <p className="text-xs font-bold mb-xs opacity-70">{msg.sender.full_name}</p>
                      )}
                      <p className="font-body-sm text-body-sm">{msg.content}</p>
                      <p className="text-xs mt-xs opacity-60">
                        {msg.created_at ? new Date(msg.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : ''}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-md border-t border-outline-variant">
                <div className="flex gap-sm items-end">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMsg}
                      onChange={(e) => setNewMsg(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      placeholder="اكتب رسالة..."
                      className="w-full px-md py-3 bg-surface-container-low border border-outline-variant rounded-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-body-sm text-body-sm text-on-surface"
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!newMsg.trim() || sending}
                    className="w-11 h-11 bg-primary text-white rounded-full flex items-center justify-center shrink-0 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    ) : (
                      <span className="material-symbols-outlined">send</span>
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-[64px] text-outline mb-sm block">chat</span>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">اختر محادثة للبدء</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">اختر محادثة من القائمة أو أنشئ محادثة جديدة</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Conversation Drawer */}
      <Drawer
        isOpen={!!newConvDrawer}
        onClose={() => setNewConvDrawer(false)}
        title="محادثة جديدة"
        footer={
          <div className="flex gap-sm">
            <button onClick={createConversation} className="admin-btn admin-btn-primary">
              <span className="material-symbols-outlined text-lg">add</span>
              إنشاء
            </button>
            <button onClick={() => setNewConvDrawer(false)} className="admin-btn admin-btn-secondary">
              إلغاء
            </button>
          </div>
        }
      >
        <div className="space-y-md">
          <div>
            <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">عنوان المحادثة</label>
            <input
              type="text"
              value={newConv.title}
              onChange={(e) => setNewConv({ ...newConv, title: e.target.value })}
              placeholder="أدخل عنوان المحادثة"
              className="admin-input"
              required
            />
          </div>
          <div>
            <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">محادثة مجموعة (اختياري)</label>
            <select
              value={newConv.group_id}
              onChange={(e) => setNewConv({ ...newConv, group_id: e.target.value })}
              className="admin-input admin-select"
            >
              <option value="">محادثة عامة</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          {!newConv.group_id && (
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">رقم هوية المشارك (اختياري)</label>
              <input
                type="text"
                value={newConv.participant_id}
                onChange={(e) => setNewConv({ ...newConv, participant_id: e.target.value })}
                placeholder="اتركه فارغاً لمحادثة عامة"
                className="admin-input"
              />
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
}
