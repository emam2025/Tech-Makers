'use client';

import { useEffect, useState, useCallback } from 'react';
import DataTable from '../../../components/ui/DataTable';
import Drawer from '../../../components/ui/Drawer';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';

const DAYS_AR = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterGroup, setFilterGroup] = useState('');
  const [viewMode, setViewMode] = useState('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [drawer, setDrawer] = useState(null);
  const [detailDrawer, setDetailDrawer] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterGroup) params.set('group_id', filterGroup);
      const res = await fetch(`/api/admin/sessions?${params}`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } finally {
      setLoading(false);
    }
  }, [filterGroup]);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/groups').then(r => r.ok ? r.json() : {}),
      fetch('/api/admin/trainers').then(r => r.ok ? r.json() : {}),
    ]).then(([g, t]) => {
      setGroups(g.groups || []);
      setTrainers(t.trainers || []);
    });
  }, []);

  useEffect(() => { loadSessions(); }, [loadSessions]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = form.id ? 'PUT' : 'POST';
      const url = form.id ? `/api/admin/sessions/${form.id}` : '/api/admin/sessions';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { setDrawer(null); loadSessions(); }
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذه الجلسة؟')) return;
    try {
      const res = await fetch(`/api/admin/sessions/${id}`, { method: 'DELETE' });
      if (res.ok) { setDetailDrawer(null); loadSessions(); }
    } catch (err) {
      console.error('Delete session error:', err);
    }
  };

  const handleStatus = async (id, status) => {
    await fetch('/api/admin/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    loadSessions();
  };

  // Calendar helpers
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const getSessionForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return sessions.filter(s => s.scheduled_date === dateStr);
  };

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const statusColor = (s) => s === 'completed' ? 'var(--color-success)' : s === 'cancelled' ? 'var(--color-danger)' : 'var(--color-warning)';

  const upcomingSessions = sessions
    .filter(s => s.scheduled_date && new Date(s.scheduled_date) >= today && s.status !== 'completed' && s.status !== 'cancelled')
    .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date))
    .slice(0, 5);

  const completedCount = sessions.filter(s => s.status === 'completed').length;
  const upcomingCount = sessions.filter(s => s.status === 'scheduled' || !s.status).length;
  const cancelledCount = sessions.filter(s => s.status === 'cancelled').length;

  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1>الجلسات</h1><p>إدارة جلسات التعلم</p></div>
        <div className="flex gap-2">
          <div className="flex bg-[var(--color-surface)] rounded-[var(--radius-md)] border border-[var(--color-border)] overflow-hidden">
            <button onClick={() => setViewMode('calendar')} className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${viewMode === 'calendar' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-dim)]'}`}>
              <span className="material-symbols-outlined text-[16px] align-middle ml-1">calendar_month</span>
              تقويم
            </button>
            <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-dim)]'}`}>
              <span className="material-symbols-outlined text-[16px] align-middle ml-1">view_list</span>
              قائمة
            </button>
          </div>
          <Button icon="add_circle" onClick={() => { setForm({}); setDrawer('edit'); }}>إضافة جلسة</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-xs">
        <div className="card-admin p-3 text-center">
          <div className="text-lg font-bold" style={{ color: 'var(--color-warning)' }}>{upcomingCount}</div>
          <div className="text-[11px] text-[var(--color-text-tertiary)]">مجدولة</div>
        </div>
        <div className="card-admin p-3 text-center">
          <div className="text-lg font-bold" style={{ color: 'var(--color-success)' }}>{completedCount}</div>
          <div className="text-[11px] text-[var(--color-text-tertiary)]">مكتملة</div>
        </div>
        <div className="card-admin p-3 text-center">
          <div className="text-lg font-bold" style={{ color: 'var(--color-danger)' }}>{cancelledCount}</div>
          <div className="text-[11px] text-[var(--color-text-tertiary)]">ملغية</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <Select options={[{ value: '', label: 'جميع المجموعات' }, ...groups.map(g => ({ value: g.id, label: g.name }))]} value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)} className="w-full sm:w-48" />
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="card-admin overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[var(--color-border-light)]">
            <button onClick={prevMonth} className="p-1.5 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-dim)] cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
            <h3 className="font-bold text-[var(--color-text-primary)]">{MONTHS_AR[month]} {year}</h3>
            <button onClick={nextMonth} className="p-1.5 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-dim)] cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
          </div>
          <div className="grid grid-cols-7">
            {DAYS_AR.map(d => (
              <div key={d} className="p-2 text-center text-[11px] font-medium text-[var(--color-text-tertiary)] border-b border-[var(--color-border-light)]">{d}</div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} className="min-h-[80px] border-b border-l border-[var(--color-border-light)] bg-[var(--color-surface-dim)]" />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const daySessions = getSessionForDay(day);
              const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
              return (
                <div key={day} className={`min-h-[80px] p-1.5 border-b border-l border-[var(--color-border-light)] ${isToday ? 'bg-[var(--color-primary-light)]' : ''}`}>
                  <div className={`text-xs font-medium mb-1 ${isToday ? 'text-[var(--color-primary)] font-bold' : 'text-[var(--color-text-secondary)]'}`}>{day}</div>
                  {daySessions.slice(0, 3).map(s => (
                    <button key={s.id} onClick={() => setDetailDrawer(s)} className="w-full text-right mb-0.5 px-1.5 py-0.5 rounded text-[10px] text-white truncate cursor-pointer hover:opacity-80 transition-opacity" style={{ background: statusColor(s.status) }}>
                      {s.title || s.scheduled_time || '?'}
                    </button>
                  ))}
                  {daySessions.length > 3 && <div className="text-[10px] text-[var(--color-text-tertiary)] text-center">+{daySessions.length - 3}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <>
          <DataTable
            columns={[
              { key: 'title', label: 'الجلسة', render: (r) => <span className="font-medium">{r.title}</span> },
              { key: 'group', label: 'المجموعة', render: (r) => r.group?.name || '-' },
              { key: 'trainer', label: 'المدرب', render: (r) => r.trainer?.full_name || '-' },
              { key: 'scheduled_date', label: 'التاريخ', render: (r) => r.scheduled_date ? new Date(r.scheduled_date).toLocaleDateString('ar-EG') : '-' },
              { key: 'scheduled_time', label: 'الوقت' },
              { key: 'status', label: 'الحالة', render: (r) => (
                <Badge variant={r.status === 'completed' ? 'success' : r.status === 'cancelled' ? 'danger' : 'warning'}>
                  {r.status === 'completed' ? 'مكتملة' : r.status === 'cancelled' ? 'ملغية' : 'مجدولة'}
                </Badge>
              )},
            ]}
            data={sessions}
            loading={loading}
            actions={[
              { icon: 'visibility', label: 'تفاصيل', onClick: (r) => setDetailDrawer(r) },
              { icon: 'edit', label: 'تعديل', onClick: (r) => { setForm(r); setDrawer('edit'); } },
              { icon: 'check_circle', label: 'إكمال', onClick: (r) => handleStatus(r.id, 'completed') },
              { icon: 'cancel', label: 'إلغاء', onClick: (r) => handleStatus(r.id, 'cancelled'), color: 'var(--color-danger)' },
              { icon: 'delete', label: 'حذف', onClick: (r) => handleDelete(r.id), danger: true },
            ]}
            emptyText="لا توجد جلسات"
          />
        </>
      )}

      {/* Upcoming Sessions Widget */}
      {viewMode === 'calendar' && upcomingSessions.length > 0 && (
        <div className="card-admin p-5 mt-4">
          <h2 className="text-sm font-bold text-[var(--color-text-primary)] mb-3">الجلسات القادمة</h2>
          <div className="space-y-2">
            {upcomingSessions.map(s => (
              <button key={s.id} onClick={() => setDetailDrawer(s)} className="w-full flex items-center gap-3 p-3 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-dim)] transition-colors text-right cursor-pointer">
                <div className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-warning-light)' }}>
                  <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--color-warning)' }}>event</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[var(--color-text-primary)] truncate">{s.title}</div>
                  <div className="text-xs text-[var(--color-text-tertiary)]">{s.group?.name || ''} — {s.scheduled_date} {s.scheduled_time || ''}</div>
                </div>
                <Badge variant="warning">{s.scheduled_time || '-'}</Badge>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Create Drawer */}
      <Drawer isOpen={!!drawer} onClose={() => setDrawer(null)} title="إضافة جلسة جديدة"
        footer={<div className="flex gap-3"><Button onClick={handleSave} loading={saving}>حفظ</Button><Button variant="outlined" onClick={() => setDrawer(null)}>إلغاء</Button></div>}>
        <div className="space-y-4">
          <Input label="عنوان الجلسة" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Select label="المجموعة" options={groups.map(g => ({ value: g.id, label: g.name }))} value={form.group_id || ''} onChange={(e) => setForm({ ...form, group_id: e.target.value })} />
          <Select label="المدرب" options={trainers.map(t => ({ value: t.id, label: t.full_name }))} value={form.trainer_id || ''} onChange={(e) => setForm({ ...form, trainer_id: e.target.value })} />
          <Input label="التاريخ" type="date" value={form.scheduled_date || ''} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} />
          <Input label="الوقت" type="time" value={form.scheduled_time || ''} onChange={(e) => setForm({ ...form, scheduled_time: e.target.value })} />
          <Input label="المدة (دقيقة)" type="number" value={form.duration_minutes || ''} onChange={(e) => setForm({ ...form, duration_minutes: parseInt(e.target.value) || 60 })} />
          <Input label="الصالة" value={form.room || ''} onChange={(e) => setForm({ ...form, room: e.target.value })} />
          <div className="border-t border-[var(--color-border-light)] pt-4">
            <label className="flex items-center gap-2 text-sm text-[var(--color-text-primary)] cursor-pointer">
              <input type="checkbox" checked={form.recurring || false} onChange={(e) => setForm({ ...form, recurring: e.target.checked })} className="rounded" />
              تكرار أسبوعي
            </label>
            {form.recurring && (
              <div className="mt-3 space-y-3">
                <Input label="عدد الأسابيع" type="number" value={form.recurring_weeks || ''} onChange={(e) => setForm({ ...form, recurring_weeks: parseInt(e.target.value) || 4 })} />
                <Select label="اليوم" options={DAYS_AR.map((d, i) => ({ value: i, label: d }))} value={form.recurring_day || ''} onChange={(e) => setForm({ ...form, recurring_day: parseInt(e.target.value) })} />
              </div>
            )}
          </div>
        </div>
      </Drawer>

      {/* Detail Drawer */}
      <Drawer isOpen={!!detailDrawer} onClose={() => setDetailDrawer(null)} title="تفاصيل الجلسة" size="lg"
        footer={
          detailDrawer ? (
            <div className="flex gap-3">
              <Button onClick={() => { setForm(detailDrawer); setDetailDrawer(null); setDrawer('edit'); }} icon="edit">تعديل</Button>
              {detailDrawer.status !== 'completed' && detailDrawer.status !== 'cancelled' && (
                <>
                  <Button onClick={() => { handleStatus(detailDrawer.id, 'completed'); setDetailDrawer(null); }}>إكمال</Button>
                  <Button variant="outlined" onClick={() => { handleStatus(detailDrawer.id, 'cancelled'); setDetailDrawer(null); }} className="text-[var(--color-danger)] border-[var(--color-danger)]">إلغاء الجلسة</Button>
                </>
              )}
              <Button variant="outlined" onClick={() => { handleDelete(detailDrawer.id); }} className="text-[var(--color-danger)] border-[var(--color-danger)]">حذف</Button>
            </div>
          ) : null
        }>
        {detailDrawer && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="card-admin p-3">
                <div className="text-[11px] text-[var(--color-text-tertiary)] mb-1">العنوان</div>
                <div className="text-sm font-medium">{detailDrawer.title}</div>
              </div>
              <div className="card-admin p-3">
                <div className="text-[11px] text-[var(--color-text-tertiary)] mb-1">الحالة</div>
                <Badge variant={detailDrawer.status === 'completed' ? 'success' : detailDrawer.status === 'cancelled' ? 'danger' : 'warning'}>
                  {detailDrawer.status === 'completed' ? 'مكتملة' : detailDrawer.status === 'cancelled' ? 'ملغية' : 'مجدولة'}
                </Badge>
              </div>
              <div className="card-admin p-3">
                <div className="text-[11px] text-[var(--color-text-tertiary)] mb-1">المجموعة</div>
                <div className="text-sm">{detailDrawer.group?.name || '-'}</div>
              </div>
              <div className="card-admin p-3">
                <div className="text-[11px] text-[var(--color-text-tertiary)] mb-1">المدرب</div>
                <div className="text-sm">{detailDrawer.trainer?.full_name || '-'}</div>
              </div>
              <div className="card-admin p-3">
                <div className="text-[11px] text-[var(--color-text-tertiary)] mb-1">التاريخ</div>
                <div className="text-sm">{detailDrawer.scheduled_date || '-'}</div>
              </div>
              <div className="card-admin p-3">
                <div className="text-[11px] text-[var(--color-text-tertiary)] mb-1">الوقت</div>
                <div className="text-sm">{detailDrawer.scheduled_time || '-'}</div>
              </div>
              <div className="card-admin p-3">
                <div className="text-[11px] text-[var(--color-text-tertiary)] mb-1">المدة</div>
                <div className="text-sm">{detailDrawer.duration_minutes || 60} دقيقة</div>
              </div>
              <div className="card-admin p-3">
                <div className="text-[11px] text-[var(--color-text-tertiary)] mb-1">الصالة</div>
                <div className="text-sm">{detailDrawer.room || '-'}</div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
