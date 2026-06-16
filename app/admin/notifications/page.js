'use client';

import { useEffect, useState, useCallback } from 'react';
import Drawer from '../../../components/ui/Drawer';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { ConfirmModal } from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/Toast';

export default function NotificationsPage() {
  const { success, error: toastError } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterRead, setFilterRead] = useState('');
  const [drawer, setDrawer] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('notifications');

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadNotifications(); }, [loadNotifications]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setDrawer(null);
        loadNotifications();
        success('تم إرسال الإشعار');
      } else {
        const data = await res.json();
        toastError(data.error || 'حدث خطأ');
      }
    } finally { setSaving(false); }
  };

  const toggleRead = async (notification) => {
    const res = await fetch(`/api/admin/notifications/${notification.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_read: !notification.is_read }),
    });
    if (res.ok) loadNotifications();
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/admin/notifications/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setConfirmDelete(null);
      loadNotifications();
      success('تم حذف الإشعار');
    } else {
      toastError('فشل الحذف');
    }
  };

  const filtered = notifications.filter((n) => {
    const matchSearch = !search || (n.title || '').includes(search) || (n.body || '').includes(search);
    const matchType = !filterType || n.type === filterType;
    const matchRead = filterRead === '' ? true : (filterRead === 'read' ? n.is_read : !n.is_read);
    return matchSearch && matchType && matchRead;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const typeIcons = {
    info: { icon: 'event_available', bg: 'bg-primary-container', color: 'text-on-primary-container' },
    warning: { icon: 'payments', bg: 'bg-secondary-container', color: 'text-on-secondary-container' },
    success: { icon: 'grade', bg: 'bg-tertiary-container', color: 'text-tertiary-fixed' },
    error: { icon: 'group_add', bg: 'bg-surface-variant', color: 'text-on-surface-variant' },
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'الآن';
    if (mins < 60) return `منذ ${mins} دقيقة`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return days < 7 ? `منذ ${days} يوم` : new Date(dateStr).toLocaleDateString('ar-EG');
  };

  return (
    <div className="max-w-container-max mx-auto px-md py-lg mb-24">
      {/* Content Header / Tabs */}
      <div className="mb-md">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-sm">مركز التواصل</h2>
        <div className="flex items-center border-b border-outline-variant">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-md font-label-md text-label-md transition-colors relative ${
              activeTab === 'notifications' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            الإشعارات
            {activeTab === 'notifications' && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-secondary rounded-full" />}
          </button>
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex-1 py-md font-label-md text-label-md transition-colors relative ${
              activeTab === 'chats' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            المحادثات
            {activeTab === 'chats' && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-secondary rounded-full" />}
          </button>
        </div>
      </div>

      {/* Tab Content: Notifications */}
      {activeTab === 'notifications' && (
        <div className="space-y-sm">
          {/* Daily Summary Bento Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex items-center justify-between mb-md">
            <div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">ملخص اليوم</p>
              <p className="font-headline-md text-headline-md text-primary">{unreadCount} إشعارات جديدة</p>
            </div>
            <div className="w-12 h-12 bg-primary-fixed rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">trending_up</span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-md">
            <div className="relative flex-1 min-w-[200px]">
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
              <input
                type="text"
                placeholder="بحث في العنوان أو المحتوى..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pr-10 pl-4 py-3 bg-surface rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary outline-none text-sm"
              />
            </div>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="p-3 bg-surface rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="">جميع الأنواع</option>
              <option value="info">معلومات</option>
              <option value="warning">تنبيه</option>
              <option value="success">نجاح</option>
            </select>
            <select
              value={filterRead}
              onChange={e => setFilterRead(e.target.value)}
              className="p-3 bg-surface rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="">جميع الحالات</option>
              <option value="unread">غير مقروء</option>
              <option value="read">مقروء</option>
            </select>
            <Button icon="notifications" onClick={() => { setForm({}); setDrawer('edit'); }}>إرسال إشعار</Button>
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="space-y-base">
              {[1,2,3].map(i => (
                <div key={i} className="bg-surface-container-lowest rounded-lg p-md animate-pulse flex gap-md">
                  <div className="w-10 h-10 bg-surface-container rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-surface-container rounded w-1/3" />
                    <div className="h-3 bg-surface-container rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-surface-container-lowest rounded-xl border border-outline-variant">
              <span className="material-symbols-outlined text-[64px] text-outline mb-sm block">notifications_off</span>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">لا توجد إشعارات</h3>
              <p className="text-on-surface-variant">لم يتم العثور على إشعارات تطابق البحث</p>
            </div>
          ) : (
            <div className="space-y-base">
              {filtered.map(n => {
                const ti = typeIcons[n.type] || typeIcons.info;
                return (
                  <div
                    key={n.id}
                    className={`bg-surface-container-low hover:bg-surface-container transition-colors p-md rounded-lg flex gap-md items-start cursor-pointer ${
                      !n.is_read ? 'border-r-4 border-primary' : 'border border-outline-variant'
                    }`}
                  >
                    <div className={`w-10 h-10 ${ti.bg} ${ti.color} rounded-full flex items-center justify-center shrink-0`}>
                      <span className="material-symbols-outlined">{ti.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-xs">
                        <h4 className="font-label-md text-label-md text-primary">{n.title}</h4>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">{timeAgo(n.created_at)}</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{n.body}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleRead(n); }}
                        className="p-1 rounded-full hover:bg-surface-container-high transition-colors"
                        title={n.is_read ? 'تحديد كغير مقروء' : 'تحديد كمقروء'}
                      >
                        <span className="material-symbols-outlined text-lg">{n.is_read ? 'mark_email_unread' : 'mark_email_read'}</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDelete(n); }}
                        className="p-1 rounded-full hover:bg-error-container/30 transition-colors"
                        title="حذف"
                      >
                        <span className="material-symbols-outlined text-lg text-error">delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Chats */}
      {activeTab === 'chats' && (
        <div className="space-y-sm">
          {/* Search Bar */}
          <div className="relative mb-md">
            <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              type="text"
              placeholder="البحث في المحادثات..."
              className="w-full pr-12 py-3 bg-surface-container border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-body-sm"
            />
          </div>
          <div className="space-y-base">
            <div className="text-center py-16 bg-surface-container-lowest rounded-xl border border-outline-variant">
              <span className="material-symbols-outlined text-[64px] text-outline mb-sm block">chat</span>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">المحادثات</h3>
              <p className="text-on-surface-variant">إدارة محادثات المجموعات والأفراد</p>
              <a href="/admin/messages" className="mt-xs inline-block">
                <Button icon="open_in_new">فتح المحادثات</Button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Send Notification Drawer */}
      <Drawer isOpen={!!drawer} onClose={() => setDrawer(null)} title="إرسال إشعار"
        footer={<div className="flex gap-3"><Button onClick={handleSave} loading={saving}>إرسال</Button><Button variant="outlined" onClick={() => setDrawer(null)}>إلغاء</Button></div>}>
        <div className="space-y-4">
          <Input label="العنوان" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div>
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1">المحتوى</label>
            <textarea
              value={form.body || ''}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-surface rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary outline-none text-sm resize-none"
              required
            />
          </div>
          <Select label="النوع" options={[{ value: 'info', label: 'معلومات' }, { value: 'warning', label: 'تنبيه' }, { value: 'success', label: 'نجاح' }]} value={form.type || 'info'} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          <Input label="رقم الهوية (اتركه فارغاً للإشعارات العامة)" value={form.recipient_national_id || ''} onChange={(e) => setForm({ ...form, recipient_national_id: e.target.value })} />
        </div>
      </Drawer>

      <ConfirmModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => handleDelete(confirmDelete?.id)} title="حذف الإشعار" message="هل أنت متأكد من حذف هذا الإشعار؟" confirmText="حذف" confirmVariant="danger" />
    </div>
  );
}
